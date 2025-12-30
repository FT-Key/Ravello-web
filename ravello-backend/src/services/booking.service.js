// services/booking.service.js
import mongoose from 'mongoose';
import { Booking, Package, PackageDate, AuditLog, User } from '../models/index.js';
import { sendEmail } from './email.service.js';
import { analizarRiesgo, extraerInfoDispositivo } from '../utils/security.utils.js';


// ============================================
// VERIFICAR RESERVA EXISTENTE
// ============================================
export async function verificarReservaExistente(userId, paqueteId) {
  try {
    // Buscar reserva activa del usuario para este paquete
    const reserva = await Booking.findOne({
      usuario: userId,
      paquete: paqueteId,
      estado: {
        $in: ['pendiente', 'confirmada', 'en_proceso_pago', 'pagada']
      }
    })
      .populate('paquete', 'nombre imagenPrincipal')
      .populate('fechaSalida', 'salida regreso')
      .sort({ createdAt: -1 })
      .lean();

    return reserva;

  } catch (error) {
    console.error('Error verificando reserva existente:', error);
    throw error;
  }
}

// ============================================
// CREAR RESERVA CON TRANSACCIÓN
// ============================================
export async function crearReserva(data, usuario, metadata = {}) {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const {
      paqueteId,
      fechaSalidaId,
      cantidadPasajeros,
      pasajeros = [],
      planCuotas,
      notasCliente,
      paymentMethod // 'checkout' o 'brick'
    } = data;

    console.log('📦 Datos recibidos:', {
      paqueteId,
      fechaSalidaId,
      cantidadPasajeros,
      usuarioId: usuario._id,
      paymentMethod
    });

    // ============================================
    // VALIDACIONES DE USUARIO
    // ============================================

    if (!usuario.perfilCompleto) {
      throw new Error('Debe completar su perfil antes de hacer una reserva');
    }

    if (!usuario.activo) {
      throw new Error('Usuario deshabilitado. Contacte al administrador.');
    }

    if (!usuario.puedeReservar()) {
      throw new Error('No puede realizar reservas en este momento');
    }

    // ============================================
    // VALIDAR QUE NO TENGA RESERVA ACTIVA PARA ESTE PAQUETE
    // ============================================
    const reservaExistente = await Booking.findOne({
      usuario: usuario._id,
      paquete: paqueteId,
      estado: {
        $in: ['pendiente', 'confirmada', 'en_proceso_pago', 'pagada']
      }
    }).session(session);

    if (reservaExistente) {
      throw new Error(`Ya tienes una reserva activa para este paquete (${reservaExistente.numeroReserva}). No puedes crear otra hasta que completes o canceles la anterior.`);
    }

    // ============================================
    // VALIDACIONES DE PAQUETE Y FECHA
    // ============================================

    // Validar paquete
    const paquete = await Package.findById(paqueteId).session(session);
    if (!paquete) {
      throw new Error('Paquete no encontrado');
    }

    if (!paquete.activo || !paquete.visibleEnWeb) {
      throw new Error('Este paquete no está disponible');
    }

    // Validar fecha de salida CON BLOQUEO (evitar race conditions)
    const fechaSalida = await PackageDate.findById(fechaSalidaId).session(session);
    if (!fechaSalida) {
      throw new Error('Fecha de salida no encontrada');
    }

    if (fechaSalida.estado !== 'disponible') {
      throw new Error('Esta fecha ya no está disponible');
    }

    // Validar cupos
    const totalPasajeros = cantidadPasajeros.adultos + (cantidadPasajeros.ninos || 0);

    if (fechaSalida.cuposDisponibles < totalPasajeros) {
      throw new Error(`Solo quedan ${fechaSalida.cuposDisponibles} cupos disponibles`);
    }

    if (paquete.capacidadMaxima && totalPasajeros > paquete.capacidadMaxima) {
      throw new Error(`El paquete permite máximo ${paquete.capacidadMaxima} pasajeros`);
    }

    // ============================================
    // CONSTRUIR DATOS DE CONTACTO DESDE USUARIO AUTENTICADO
    // ============================================
    const datosContacto = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      documento: usuario.documento?.numero || '',
      tipoDocumento: usuario.documento?.tipo || 'DNI'
    };

    console.log('📋 Datos de contacto del usuario:', datosContacto);

    // ============================================
    // CALCULAR PRECIOS
    // ============================================
    const {
      precioAdulto,
      precioNino,
      precioTotal,
      descuentoAplicado,
      montoTotal,
      montoPendiente
    } = calcularMontoTotal({
      paquete,
      fechaSalida,
      cantidadPasajeros,
      descuentoAplicado: data.descuentoAplicado || 0
    });

    console.log('💰 Cálculo de precios:', {
      precioAdulto,
      precioNino,
      precioTotal,
      descuentoAplicado,
      montoTotal
    });

    // ============================================
    // ANÁLISIS DE RIESGO
    // ============================================
    const riesgo = analizarRiesgo({
      usuario,
      email: datosContacto.email,
      ip: metadata.ip,
      userAgent: metadata.userAgent,
      monto: montoTotal
    });

    console.log('🔍 Análisis de riesgo:', riesgo);

    // Si es muy riesgoso, rechazar
    if (riesgo.score > 80) {
      await AuditLog.create([{
        usuario: usuario._id,
        accion: 'reserva_rechazada_riesgo',
        entidad: { tipo: 'Booking' },
        descripcion: `Reserva rechazada por alto riesgo: ${riesgo.motivo}`,
        nivel: 'critical',
        metadata: { riesgo, ...metadata }
      }], { session });

      throw new Error('No se pudo procesar su reserva. Por favor contacte al servicio al cliente.');
    }

    // ============================================
    // CALCULAR FECHA LÍMITE DE PAGO
    // ============================================
    const diasLimite = paquete.plazoPagoTotalDias || 7;
    const fechaLimitePagoTotal = new Date(fechaSalida.salida);
    fechaLimitePagoTotal.setDate(fechaLimitePagoTotal.getDate() - diasLimite);

    // ============================================
    // CREAR PLAN DE CUOTAS
    // ============================================
    let planCuotasData = {
      tipo: 'contado',
      cantidadCuotas: 1,
      montoPorCuota: montoTotal,
      cuotas: []
    };

    if (planCuotas && planCuotas.tipo !== 'contado') {
      planCuotasData = generarPlanCuotas(montoTotal, planCuotas, fechaSalida.salida);
    }

    // ============================================
    // EXTRAER INFO DEL DISPOSITIVO
    // ============================================
    const infoDispositivo = extraerInfoDispositivo(metadata.userAgent);

    // ============================================
    // CREAR RESERVA
    // ============================================
    const reserva = new Booking({
      usuario: usuario._id,
      paquete: paqueteId,
      fechaSalida: fechaSalidaId,
      cantidadPasajeros,
      precioTotal,
      descuentoAplicado,
      montoTotal,
      montoPagado: 0,
      montoPendiente,
      moneda: fechaSalida.moneda || paquete.moneda,
      planCuotas: planCuotasData,
      estado: 'pendiente',
      fechaLimitePagoTotal,
      datosContacto,
      pasajeros: pasajeros || [],
      notasCliente,
      usuarioCreador: usuario._id,

      // SEGURIDAD
      seguridad: {
        ip: metadata.ip,
        userAgent: metadata.userAgent,
        navegador: infoDispositivo.navegador,
        sistemaOperativo: infoDispositivo.sistemaOperativo,
        dispositivo: infoDispositivo.dispositivo,
        geolocalizacion: metadata.geolocalizacion || {},
        intentosPrevios: 0,
        esRiesgoso: riesgo.score > 50,
        motivoRiesgo: riesgo.score > 50 ? riesgo.motivo : null,
        emailVerificado: usuario.emailVerificado || false
      }
    });

    await reserva.save({ session });

    console.log('✅ Reserva creada:', reserva.numeroReserva);

    // ============================================
    // ACTUALIZAR CUPOS (DENTRO DE LA TRANSACCIÓN)
    // ============================================
    fechaSalida.cuposDisponibles -= totalPasajeros;
    if (fechaSalida.cuposDisponibles <= 0) {
      fechaSalida.estado = 'agotado';
    }
    await fechaSalida.save({ session });

    console.log('✅ Cupos actualizados:', {
      cuposDisponibles: fechaSalida.cuposDisponibles,
      estado: fechaSalida.estado
    });

    // ============================================
    // LOG DE AUDITORÍA
    // ============================================
    await AuditLog.create([{
      usuario: usuario._id,
      usuarioEmail: datosContacto.email,
      accion: 'reserva_creada',
      entidad: { tipo: 'Booking', id: reserva._id },
      descripcion: `Reserva creada: ${reserva.numeroReserva} - Paquete: ${paquete.nombre} - Monto: ${montoTotal} ${reserva.moneda}`,
      nivel: riesgo.score > 50 ? 'warning' : 'info',
      metadata: { riesgo, paymentMethod, ...metadata }
    }], { session });

    // ============================================
    // COMMIT DE LA TRANSACCIÓN
    // ============================================
    await session.commitTransaction();

    console.log('✅ Transacción confirmada');

    // ============================================
    // ENVIAR EMAIL (FUERA DE LA TRANSACCIÓN)
    // ============================================
    await sendEmail({
      to: datosContacto.email,
      subject: `Reserva creada - ${reserva.numeroReserva}`,
      template: 'reserva-creada',
      data: {
        nombreCliente: `${datosContacto.nombre} ${datosContacto.apellido}`,
        numeroReserva: reserva.numeroReserva,
        paquete: paquete.nombre,
        fechaSalida: fechaSalida.salida.toLocaleDateString('es-AR'),
        fechaRegreso: fechaSalida.regreso.toLocaleDateString('es-AR'),
        cantidadPasajeros: totalPasajeros,
        montoTotal: montoTotal,
        moneda: reserva.moneda,
        planCuotas: planCuotasData,
        paymentMethod
      }
    }).catch(err => {
      console.error('⚠️ Error enviando email de confirmación:', err);
      // No fallar la reserva si el email falla
    });

    // ============================================
    // ACTUALIZAR ESTADÍSTICAS DEL USUARIO
    // ============================================
    usuario.estadisticas.totalReservas += 1;
    usuario.estadisticas.ultimaReserva = new Date();
    await usuario.save();

    // Poblar datos para respuesta
    await reserva.populate([
      {
        path: 'paquete',
        select: 'nombre imagenPrincipal destinos precioBase moneda duracionTotal'
      },
      {
        path: 'fechaSalida',
        select: 'salida regreso precio precioFinal cuposDisponibles'
      }
    ]);

    return reserva;

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error('❌ Error creando reserva:', error);
    throw error;
  } finally {
    session.endSession();
  }

}

// ===================================================================
// FUNCIÓN AUXILIAR: Generar plan de cuotas
// ===================================================================
function generarPlanCuotas(montoTotal, planCuotas, fechaSalida) {
  const { tipo, cantidadCuotas } = planCuotas;

  if (tipo === 'contado') {
    return {
      tipo: 'contado',
      cantidadCuotas: 1,
      montoPorCuota: montoTotal,
      cuotas: []
    };
  }

  const montoPorCuota = Math.ceil(montoTotal / cantidadCuotas);
  const cuotas = [];
  const fechaBase = new Date();

  for (let i = 0; i < cantidadCuotas; i++) {
    const fechaVencimiento = new Date(fechaBase);
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + i);

    // La última cuota no puede ser después de la fecha de salida
    if (fechaVencimiento > new Date(fechaSalida)) {
      fechaVencimiento.setTime(new Date(fechaSalida).getTime() - (7 * 24 * 60 * 60 * 1000));
    }

    cuotas.push({
      numeroCuota: i + 1,
      monto: i === cantidadCuotas - 1
        ? montoTotal - (montoPorCuota * (cantidadCuotas - 1)) // Ajustar última cuota
        : montoPorCuota,
      fechaVencimiento,
      estado: 'pendiente',
      pagos: [],
      montoPagado: 0,
      montoPendiente: i === cantidadCuotas - 1
        ? montoTotal - (montoPorCuota * (cantidadCuotas - 1))
        : montoPorCuota
    });
  }

  return {
    tipo,
    cantidadCuotas,
    montoPorCuota,
    cuotas
  };
}

// ============================================
// CALCULAR MONTO TOTAL (helper)
// ============================================
function calcularMontoTotal({
  paquete,
  fechaSalida,
  cantidadPasajeros,
  descuentoAplicado = 0
}) {
  const precioAdulto =
    fechaSalida.precioFinal ||
    fechaSalida.precio ||
    paquete.precioBase;

  const precioNino =
    fechaSalida.precioNino ||
    (precioAdulto * (1 - ((paquete.descuentoNinos || 30) / 100)));

  const precioTotal =
    (cantidadPasajeros.adultos * precioAdulto) +
    ((cantidadPasajeros.ninos || 0) * precioNino);

  const montoTotal = precioTotal - descuentoAplicado;

  return {
    precioAdulto,
    precioNino,
    precioTotal,
    descuentoAplicado,
    montoTotal,
    montoPendiente: montoTotal
  };
}

// ============================================
// OBTENER RESERVAS POR USUARIO
// ============================================
export async function obtenerReservasPorUsuario(userId) {
  try {
    const reservas = await Booking.find({ usuario: userId })
      .populate('paquete', 'nombre imagenPrincipal destinos')
      .populate('fechaSalida', 'salida regreso')
      .sort({ createdAt: -1 });

    return reservas;

  } catch (error) {
    console.error('Error obteniendo reservas por usuario:', error);
    throw error;
  }
}

// ... (resto de funciones igual: obtenerReservaPorId, actualizarReserva, etc.)

// ============================================
// OBTENER RESERVA POR ID
// ============================================
export async function obtenerReservaPorId(reservaId) {
  try {
    const reserva = await Booking.findById(reservaId)
      .populate('paquete')
      .populate('fechaSalida')
      .populate('usuario', 'nombre email');

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    return reserva;

  } catch (error) {
    console.error('Error obteniendo reserva por ID:', error);
    throw error;
  }
}

// ============================================
// ACTUALIZAR RESERVA
// ============================================
export async function actualizarReserva(reservaId, data, userId) {
  try {
    const reserva = await Booking.findById(reservaId);

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    // No permitir actualizar reservas canceladas o completadas
    if (['cancelada', 'completada'].includes(reserva.estado)) {
      throw new Error('No se puede actualizar una reserva cancelada o completada');
    }

    // Campos permitidos para actualizar
    const camposPermitidos = [
      'datosContacto',
      'pasajeros',
      'notasCliente',
      'notasInternas',
      'requisitosEspeciales'
    ];

    const datosAnteriores = {};
    const datosNuevos = {};

    camposPermitidos.forEach(campo => {
      if (data[campo] !== undefined) {
        datosAnteriores[campo] = reserva[campo];
        datosNuevos[campo] = data[campo];
        reserva[campo] = data[campo];
      }
    });

    reserva.ultimaModificacion = {
      fecha: new Date(),
      usuario: userId,
      motivo: data.motivoModificacion || 'Actualización de datos'
    };

    await reserva.save();

    // Log de auditoría
    await AuditLog.create({
      usuario: userId,
      accion: 'reserva_modificada',
      entidad: { tipo: 'Booking', id: reserva._id },
      descripcion: `Reserva modificada: ${reserva.numeroReserva}`,
      datosAnteriores,
      datosNuevos,
      nivel: 'info'
    });

    return reserva;

  } catch (error) {
    console.error('Error actualizando reserva:', error);
    throw error;
  }
}

// ============================================
// CONFIRMAR RESERVA
// ============================================
export async function confirmarReserva(reservaId, userId) {
  try {
    const reserva = await Booking.findById(reservaId)
      .populate('paquete', 'nombre')
      .populate('fechaSalida', 'salida');

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    if (reserva.estado !== 'pendiente') {
      throw new Error('Solo se pueden confirmar reservas pendientes');
    }

    reserva.estado = 'confirmada';
    reserva.fechaConfirmacion = new Date();
    await reserva.save();

    // Enviar email de confirmación
    await sendEmail({
      to: reserva.datosContacto.email,
      subject: `Reserva confirmada - ${reserva.numeroReserva}`,
      template: 'reserva-confirmada',
      data: {
        nombreCliente: reserva.datosContacto.nombre,
        numeroReserva: reserva.numeroReserva,
        paquete: reserva.paquete.nombre,
        fechaSalida: reserva.fechaSalida.salida.toLocaleDateString('es-AR')
      }
    });

    // Log de auditoría
    await AuditLog.create({
      usuario: userId,
      accion: 'reserva_confirmada',
      entidad: { tipo: 'Booking', id: reserva._id },
      descripcion: `Reserva confirmada: ${reserva.numeroReserva}`,
      nivel: 'info'
    });

    return reserva;

  } catch (error) {
    console.error('Error confirmando reserva:', error);
    throw error;
  }
}

// ============================================
// CANCELAR RESERVA
// ============================================
export async function cancelarReserva(reservaId, motivo, userId) {
  try {
    // Obtener la reserva SIN populate primero
    const reserva = await Booking.findById(reservaId);

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    if (reserva.estado === 'cancelada') {
      throw new Error('La reserva ya está cancelada');
    }

    if (reserva.estado === 'completada') {
      throw new Error('No se puede cancelar una reserva completada');
    }

    // Liberar cupos
    const totalPasajeros = reserva.cantidadPasajeros.adultos + (reserva.cantidadPasajeros.ninos || 0);

    // reserva.fechaSalida es un ObjectId, usarlo directamente
    if (reserva.fechaSalida) {
      const fechaSalida = await PackageDate.findById(reserva.fechaSalida);
      if (fechaSalida) {
        fechaSalida.cuposDisponibles += totalPasajeros;
        if (fechaSalida.estado === 'agotado' && fechaSalida.cuposDisponibles > 0) {
          fechaSalida.estado = 'disponible';
        }
        await fechaSalida.save();
      }
    }

    // Obtener el paquete para el email
    const paquete = await Package.findById(reserva.paquete);

    // Actualizar reserva
    reserva.estado = 'cancelada';
    reserva.cancelacion.realizada = true;
    reserva.cancelacion.fecha = new Date();
    reserva.cancelacion.motivo = motivo;
    await reserva.save();

    // Enviar email de cancelación
    await sendEmail({
      to: reserva.datosContacto.email,
      subject: `Reserva cancelada - ${reserva.numeroReserva}`,
      template: 'reserva-cancelada',
      data: {
        nombreCliente: reserva.datosContacto.nombre,
        numeroReserva: reserva.numeroReserva,
        paquete: paquete?.nombre || 'Paquete',
        motivo
      }
    }).catch(err => {
      console.error('⚠️ Error enviando email:', err);
    });

    // Log de auditoría
    await AuditLog.create({
      usuario: userId,
      accion: 'reserva_cancelada',
      entidad: { tipo: 'Booking', id: reserva._id },
      descripcion: `Reserva cancelada: ${reserva.numeroReserva} - Motivo: ${motivo}`,
      nivel: 'warning'
    });

    // Poblar para la respuesta
    await reserva.populate([
      { path: 'paquete', select: 'nombre imagenPrincipal destinos' },
      { path: 'fechaSalida', select: 'salida regreso' }
    ]);

    return reserva;

  } catch (error) {
    console.error('Error cancelando reserva:', error);
    throw error;
  }
}

// ============================================
// ELIMINAR RESERVA
// ============================================
export async function eliminarReserva(reservaId, userId) {
  try {
    const reserva = await Booking.findById(reservaId);

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    // Solo permitir eliminar si está cancelada y sin pagos
    if (reserva.estado !== 'cancelada') {
      throw new Error('Solo se pueden eliminar reservas canceladas');
    }

    if (reserva.montoPagado > 0) {
      throw new Error('No se puede eliminar una reserva con pagos realizados');
    }

    // Log de auditoría antes de eliminar
    await AuditLog.create({
      usuario: userId,
      accion: 'reserva_eliminada',
      entidad: { tipo: 'Booking', id: reserva._id },
      descripcion: `Reserva eliminada: ${reserva.numeroReserva}`,
      datosAnteriores: reserva.toObject(),
      nivel: 'warning'
    });

    await reserva.deleteOne();

  } catch (error) {
    console.error('Error eliminando reserva:', error);
    throw error;
  }
}

// ============================================
// VERIFICAR CUOTAS VENCIDAS (Cron Job)
// ============================================
export async function verificarCuotasVencidas() {
  try {
    const reservas = await Booking.find({
      estado: { $in: ['confirmada', 'en_proceso_pago'] },
      'planCuotas.cuotas': {
        $elemMatch: {
          estado: 'pendiente',
          fechaVencimiento: { $lt: new Date() }
        }
      }
    }).populate('paquete', 'nombre');

    for (const reserva of reservas) {
      let tieneCuotasVencidas = false;

      reserva.planCuotas.cuotas.forEach(cuota => {
        if (cuota.estado === 'pendiente' && new Date(cuota.fechaVencimiento) < new Date()) {
          cuota.estado = 'vencida';
          tieneCuotasVencidas = true;
        }
      });

      if (tieneCuotasVencidas) {
        reserva.estado = 'vencida';
        await reserva.save();

        // Enviar notificación
        await sendEmail({
          to: reserva.datosContacto.email,
          subject: `Cuota vencida - Reserva ${reserva.numeroReserva}`,
          template: 'cuota-vencida',
          data: {
            nombreCliente: reserva.datosContacto.nombre,
            numeroReserva: reserva.numeroReserva,
            paquete: reserva.paquete.nombre
          }
        });

        console.log(`⚠️ Reserva ${reserva.numeroReserva} marcada como vencida`);
      }
    }

    console.log(`✅ Verificación de cuotas vencidas completada. ${reservas.length} reservas procesadas.`);

  } catch (error) {
    console.error('Error verificando cuotas vencidas:', error);
  }
}