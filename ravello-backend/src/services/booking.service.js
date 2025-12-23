// services/booking.service.js
import { Booking, Package, PackageDate, AuditLog, User } from '../models/index.js';
import { sendEmail } from './email.service.js';

// ============================================
// CREAR RESERVA
// ============================================
export async function crearReserva(data, userId = null) {
  try {
    const {
      paqueteId,
      fechaSalidaId,
      cantidadPasajeros,
      datosContacto,
      pasajeros,
      planCuotas,
      notasCliente
    } = data;

    // Validar paquete
    const paquete = await Package.findById(paqueteId);
    if (!paquete) {
      throw new Error('Paquete no encontrado');
    }

    if (!paquete.activo || !paquete.visibleEnWeb) {
      throw new Error('Este paquete no está disponible');
    }

    // Validar fecha de salida
    const fechaSalida = await PackageDate.findById(fechaSalidaId);
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

    // Calcular precios
    const precioAdulto = paquete.precioBase;
    const precioNino = paquete.precioBase * (1 - paquete.descuentoNinos / 100);
    
    const precioTotal = 
      (cantidadPasajeros.adultos * precioAdulto) + 
      ((cantidadPasajeros.ninos || 0) * precioNino);

    const descuentoAplicado = data.descuentoAplicado || 0;
    const montoTotal = precioTotal - descuentoAplicado;
    const montoPendiente = montoTotal;

    // Calcular fecha límite de pago
    const diasLimite = paquete.plazoPagoTotalDias || 7;
    const fechaLimitePagoTotal = new Date(fechaSalida.salida);
    fechaLimitePagoTotal.setDate(fechaLimitePagoTotal.getDate() - diasLimite);

    // Crear plan de cuotas si se especifica
    let planCuotasData = {
      tipo: 'contado',
      cantidadCuotas: 1,
      montoPorCuota: montoTotal,
      cuotas: []
    };

    if (planCuotas && planCuotas.tipo !== 'contado') {
      planCuotasData = generarPlanCuotas(montoTotal, planCuotas, fechaSalida.salida);
    }

    // Crear reserva
    const reserva = new Booking({
      usuario: userId,
      paquete: paqueteId,
      fechaSalida: fechaSalidaId,
      cantidadPasajeros,
      precioTotal,
      descuentoAplicado,
      montoTotal,
      montoPagado: 0,
      montoPendiente,
      moneda: paquete.moneda,
      planCuotas: planCuotasData,
      estado: 'pendiente',
      fechaLimitePagoTotal,
      datosContacto,
      pasajeros: pasajeros || [],
      notasCliente,
      usuarioCreador: userId
    });

    await reserva.save();

    // Actualizar cupos
    fechaSalida.cuposDisponibles -= totalPasajeros;
    if (fechaSalida.cuposDisponibles <= 0) {
      fechaSalida.estado = 'agotado';
    }
    await fechaSalida.save();

    // Enviar email de confirmación
    await sendEmail({
      to: datosContacto.email,
      subject: `Reserva creada - ${reserva.numeroReserva}`,
      template: 'reserva-creada',
      data: {
        nombreCliente: datosContacto.nombre,
        numeroReserva: reserva.numeroReserva,
        paquete: paquete.nombre,
        fechaSalida: fechaSalida.salida.toLocaleDateString('es-AR'),
        cantidadPasajeros: totalPasajeros,
        montoTotal: montoTotal,
        moneda: paquete.moneda,
        planCuotas: planCuotasData
      }
    });

    // Log de auditoría
    await AuditLog.create({
      usuario: userId,
      usuarioEmail: datosContacto.email,
      accion: 'reserva_creada',
      entidad: { tipo: 'Booking', id: reserva._id },
      descripcion: `Reserva creada: ${reserva.numeroReserva} - Paquete: ${paquete.nombre} - Monto: ${montoTotal} ${paquete.moneda}`,
      nivel: 'info'
    });

    // Poblar datos para respuesta
    await reserva.populate([
      { path: 'paquete', select: 'nombre imagenPrincipal destinos' },
      { path: 'fechaSalida', select: 'salida regreso' }
    ]);

    return reserva;

  } catch (error) {
    console.error('Error creando reserva:', error);
    throw error;
  }
}

// ============================================
// GENERAR PLAN DE CUOTAS
// ============================================
function generarPlanCuotas(montoTotal, planConfig, fechaSalida) {
  const { tipo, cantidadCuotas, cuotasPersonalizadas } = planConfig;

  let cuotas = [];

  if (tipo === 'cuotas_fijas' && cantidadCuotas) {
    const montoPorCuota = Math.round((montoTotal / cantidadCuotas) * 100) / 100;
    const fechaActual = new Date();

    for (let i = 1; i <= cantidadCuotas; i++) {
      const fechaVencimiento = new Date(fechaActual);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + i);

      // No permitir cuotas después de la fecha de salida
      if (fechaVencimiento > new Date(fechaSalida)) {
        fechaVencimiento.setTime(new Date(fechaSalida).getTime() - (7 * 24 * 60 * 60 * 1000));
      }

      cuotas.push({
        numeroCuota: i,
        monto: i === cantidadCuotas 
          ? montoTotal - (montoPorCuota * (cantidadCuotas - 1)) // Ajustar última cuota
          : montoPorCuota,
        fechaVencimiento,
        estado: 'pendiente',
        montoPagado: 0,
        montoPendiente: i === cantidadCuotas 
          ? montoTotal - (montoPorCuota * (cantidadCuotas - 1))
          : montoPorCuota
      });
    }

    return {
      tipo: 'cuotas_fijas',
      cantidadCuotas,
      montoPorCuota,
      cuotas
    };
  }

  if (tipo === 'personalizado' && cuotasPersonalizadas) {
    let totalAsignado = 0;

    cuotas = cuotasPersonalizadas.map((cuota, index) => {
      totalAsignado += cuota.monto;
      return {
        numeroCuota: index + 1,
        monto: cuota.monto,
        fechaVencimiento: new Date(cuota.fechaVencimiento),
        estado: 'pendiente',
        montoPagado: 0,
        montoPendiente: cuota.monto,
        notas: cuota.notas
      };
    });

    // Validar que el total de cuotas coincida con el monto total
    if (Math.abs(totalAsignado - montoTotal) > 0.01) {
      throw new Error('El total de las cuotas no coincide con el monto total de la reserva');
    }

    return {
      tipo: 'personalizado',
      cantidadCuotas: cuotas.length,
      montoPorCuota: null,
      cuotas
    };
  }

  // Por defecto: pago único
  return {
    tipo: 'contado',
    cantidadCuotas: 1,
    montoPorCuota: montoTotal,
    cuotas: [{
      numeroCuota: 1,
      monto: montoTotal,
      fechaVencimiento: new Date(fechaSalida),
      estado: 'pendiente',
      montoPagado: 0,
      montoPendiente: montoTotal
    }]
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
    const reserva = await Booking.findById(reservaId)
      .populate('paquete', 'nombre')
      .populate('fechaSalida');

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
    
    const fechaSalida = await PackageDate.findById(reserva.fechaSalida._id);
    if (fechaSalida) {
      fechaSalida.cuposDisponibles += totalPasajeros;
      if (fechaSalida.estado === 'agotado' && fechaSalida.cuposDisponibles > 0) {
        fechaSalida.estado = 'disponible';
      }
      await fechaSalida.save();
    }

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
        paquete: reserva.paquete.nombre,
        motivo
      }
    });

    // Log de auditoría
    await AuditLog.create({
      usuario: userId,
      accion: 'reserva_cancelada',
      entidad: { tipo: 'Booking', id: reserva._id },
      descripcion: `Reserva cancelada: ${reserva.numeroReserva} - Motivo: ${motivo}`,
      nivel: 'warning'
    });

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