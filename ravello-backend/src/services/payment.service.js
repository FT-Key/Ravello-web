// services/payment.service.js
import mongoose from 'mongoose';
import { MercadoPagoConfig, Preference, Payment as MPPayment } from 'mercadopago';
import { Payment, Booking, AuditLog, User } from '../models/index.js';
import { sendEmail } from './email.service.js';
import { analizarRiesgo, extraerInfoDispositivo } from '../utils/security.utils.js';
import dotenv from "dotenv";

dotenv.config();

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// ============================================
// CREAR PREFERENCIA DE MERCADOPAGO CON TRANSACCIÓN
// ============================================
export async function crearPreferenciaMercadoPago(reservaId, montoPago, tipoPago, numeroCuota = null, userId = null, metadata = {}) {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    // ============================================
    // VALIDACIONES
    // ============================================
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    const usuario = await User.findById(userId).session(session);
    if (!usuario || !usuario.activo) {
      throw new Error('Usuario no válido o deshabilitado');
    }

    const reserva = await Booking.findById(reservaId)
      .populate('paquete')
      .populate('fechaSalida')
      .session(session);

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    // Verificar que el usuario sea dueño de la reserva (o admin)
    if (reserva.usuario.toString() !== userId && usuario.rol !== 'admin') {
      throw new Error('No tiene permisos para realizar pagos en esta reserva');
    }

    if (montoPago > reserva.montoPendiente) {
      throw new Error('El monto del pago excede el saldo pendiente');
    }

    if (reserva.estado === 'cancelada') {
      throw new Error('No se pueden hacer pagos en reservas canceladas');
    }

    // ============================================
    // ANÁLISIS DE RIESGO
    // ============================================
    const riesgo = analizarRiesgo({
      usuario,
      reserva,
      ip: metadata.ip,
      userAgent: metadata.userAgent,
      monto: montoPago,
      tipoPago
    });

    // Si es muy riesgoso, rechazar
    if (riesgo.score > 85) {
      await AuditLog.create([{
        usuario: userId,
        accion: 'pago_rechazado_riesgo',
        entidad: { tipo: 'Payment' },
        descripcion: `Pago rechazado por alto riesgo: ${riesgo.motivo}`,
        nivel: 'critical',
        metadata: { riesgo, reservaId, montoPago }
      }], { session });

      await session.abortTransaction();
      throw new Error('No se pudo procesar el pago. Por favor contacte al servicio al cliente.');
    }

    // ============================================
    // EXTRAER INFO DEL DISPOSITIVO
    // ============================================
    const infoDispositivo = extraerInfoDispositivo(metadata.userAgent);

    // ============================================
    // CREAR REGISTRO DE PAGO PENDIENTE
    // ============================================
    const pago = new Payment({
      reserva: reservaId,
      monto: montoPago,
      moneda: reserva.moneda,
      tipoPago,
      numeroCuota,
      metodoPago: 'mercadopago',
      estado: 'pendiente',
      usuarioRegistro: userId,
      usuarioInicio: userId,

      // SEGURIDAD
      seguridad: {
        ip: metadata.ip,
        userAgent: metadata.userAgent,
        navegador: infoDispositivo.navegador,
        dispositivo: infoDispositivo.dispositivo,
        esRiesgoso: riesgo.score > 50,
        motivoRiesgo: riesgo.score > 50 ? riesgo.motivo : null,
        scoreRiesgo: riesgo.score,
        verificaciones: []
      }
    });

    await pago.save({ session });

    // ============================================
    // CREAR PREFERENCIA DE MERCADOPAGO
    // ============================================
    const preference = new Preference(mpClient);

    const cuotaText = numeroCuota ? ` - Cuota ${numeroCuota}/${reserva.planCuotas.cantidadCuotas}` : '';
    const tipoText = tipoPago === 'senia' ? 'Seña' :
      tipoPago === 'cuota' ? 'Cuota' :
        tipoPago === 'saldo' ? 'Saldo' : 'Pago';

    const body = {
      items: [
        {
          id: reserva.paquete._id.toString(),
          title: `${reserva.paquete.nombre}${cuotaText}`,
          description: `${tipoText} - Reserva ${reserva.numeroReserva}`,
          quantity: 1,
          unit_price: montoPago,
          currency_id: reserva.moneda
        }
      ],
      payer: {
        name: reserva.datosContacto.nombre,
        surname: reserva.datosContacto.apellido,
        email: reserva.datosContacto.email,
        phone: {
          number: reserva.datosContacto.telefono
        },
        identification: {
          type: reserva.datosContacto.tipoDocumento === 'DNI' ? 'DNI' : 'PASSPORT',
          number: reserva.datosContacto.documento
        }
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/reservas/${reserva.numeroReserva}/pago-exitoso`,
        failure: `${process.env.FRONTEND_URL}/reservas/${reserva.numeroReserva}/pago-fallido`,
        pending: `${process.env.FRONTEND_URL}/reservas/${reserva.numeroReserva}/pago-pendiente`
      },
      external_reference: pago.numeroPago,
      notification_url: `${process.env.BACKEND_URL}/api/webhooks/mercadopago`,
      statement_descriptor: 'RAVELLO VIAJES',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
    };

    const result = await preference.create({ body });

    // Actualizar pago con datos de MP
    pago.mercadopago.preferenceId = result.id;
    pago.mercadopago.externalReference = pago.numeroPago;
    pago.mercadopago.backUrls = body.back_urls;
    await pago.save({ session });

    // Log de auditoría
    await AuditLog.create([{
      usuario: userId,
      accion: 'pago_iniciado',
      entidad: { tipo: 'Payment', id: pago._id },
      descripcion: `Preferencia MP creada para reserva ${reserva.numeroReserva} - Monto: ${montoPago} ${reserva.moneda}`,
      nivel: riesgo.score > 50 ? 'warning' : 'info',
      metadata: { riesgo, ...metadata }
    }], { session });

    // COMMIT
    await session.commitTransaction();

    return {
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
      pagoId: pago._id,
      numeroPago: pago.numeroPago,
      reserva: {
        numero: reserva.numeroReserva,
        paquete: reserva.paquete.nombre
      }
    };

  } catch (error) {
    await session.abortTransaction();
    console.error('Error creando preferencia MP:', error);
    throw error;
  } finally {
    session.endSession();
  }
}

// ============================================
// CREAR PAGO CON BRICKS (INLINE PAYMENT)
// ============================================
export async function crearPagoBrick(reservaId, montoPago, tipoPago, numeroCuota, paymentData, userId, metadata = {}) {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    // ============================================
    // VALIDACIONES (igual que en preferencia)
    // ============================================
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    const usuario = await User.findById(userId).session(session);
    if (!usuario || !usuario.activo) {
      throw new Error('Usuario no válido o deshabilitado');
    }

    const reserva = await Booking.findById(reservaId)
      .populate('paquete')
      .populate('fechaSalida')
      .session(session);

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    if (reserva.usuario.toString() !== userId && usuario.rol !== 'admin') {
      throw new Error('No tiene permisos para realizar pagos en esta reserva');
    }

    if (montoPago > reserva.montoPendiente) {
      throw new Error('El monto del pago excede el saldo pendiente');
    }

    if (reserva.estado === 'cancelada') {
      throw new Error('No se pueden hacer pagos en reservas canceladas');
    }

    // ============================================
    // ANÁLISIS DE RIESGO
    // ============================================
    const riesgo = analizarRiesgo({
      usuario,
      reserva,
      ip: metadata.ip,
      userAgent: metadata.userAgent,
      monto: montoPago,
      tipoPago
    });

    if (riesgo.score > 85) {
      await AuditLog.create([{
        usuario: userId,
        accion: 'pago_rechazado_riesgo',
        entidad: { tipo: 'Payment' },
        descripcion: `Pago Brick rechazado por alto riesgo: ${riesgo.motivo}`,
        nivel: 'critical',
        metadata: { riesgo, reservaId, montoPago }
      }], { session });

      await session.abortTransaction();
      throw new Error('No se pudo procesar el pago. Por favor contacte al servicio al cliente.');
    }

    const infoDispositivo = extraerInfoDispositivo(metadata.userAgent);

    // ============================================
    // CREAR REGISTRO DE PAGO
    // ============================================
    const pago = new Payment({
      reserva: reservaId,
      monto: montoPago,
      moneda: reserva.moneda,
      tipoPago,
      numeroCuota,
      metodoPago: 'mercadopago',
      estado: 'pendiente',
      usuarioRegistro: userId,
      usuarioInicio: userId,
      seguridad: {
        ip: metadata.ip,
        userAgent: metadata.userAgent,
        navegador: infoDispositivo.navegador,
        dispositivo: infoDispositivo.dispositivo,
        esRiesgoso: riesgo.score > 50,
        motivoRiesgo: riesgo.score > 50 ? riesgo.motivo : null,
        scoreRiesgo: riesgo.score,
        verificaciones: []
      }
    });

    await pago.save({ session });

    // ============================================
    // PROCESAR PAGO CON MERCADOPAGO
    // ============================================
    const mpPayment = new MPPayment(mpClient);

    const payment = await mpPayment.create({
      body: {
        transaction_amount: montoPago,
        token: paymentData.token,
        description: `${reserva.paquete.nombre} - Reserva ${reserva.numeroReserva}`,
        installments: paymentData.installments,
        payment_method_id: paymentData.payment_method_id,
        issuer_id: paymentData.issuer_id,
        payer: {
          email: paymentData.payer.email,
          identification: {
            type: paymentData.payer.identification.type,
            number: paymentData.payer.identification.number
          }
        },
        statement_descriptor: 'RAVELLO VIAJES',
        external_reference: pago.numeroPago,
        notification_url: `${process.env.BACKEND_URL}/api/payments/webhook/mercadopago`,
        metadata: {
          reserva_id: reservaId,
          user_id: userId,
          tipo_pago: tipoPago
        }
      }
    });

    // ============================================
    // ACTUALIZAR PAGO CON RESPUESTA DE MP
    // ============================================
    pago.mercadopago.paymentId = payment.id;
    pago.mercadopago.status = payment.status;
    pago.mercadopago.statusDetail = payment.status_detail;
    pago.mercadopago.paymentTypeId = payment.payment_type_id;
    pago.mercadopago.paymentMethodId = payment.payment_method_id;
    pago.mercadopago.installments = payment.installments;
    pago.mercadopago.transactionAmount = payment.transaction_amount;
    pago.mercadopago.netReceivedAmount = payment.transaction_details?.net_received_amount;
    pago.mercadopago.totalPaidAmount = payment.transaction_details?.total_paid_amount;
    pago.mercadopago.dateCreated = payment.date_created;
    pago.mercadopago.dateApproved = payment.date_approved;
    pago.mercadopago.externalReference = pago.numeroPago;

    if (payment.payer) {
      pago.mercadopago.payer = {
        id: payment.payer.id,
        email: payment.payer.email,
        identification: payment.payer.identification
      };
    }

    // ============================================
    // ACTUALIZAR ESTADO SEGÚN RESPUESTA
    // ============================================
    if (payment.status === 'approved') {
      pago.estado = 'aprobado';
      await pago.save({ session });
      await aplicarPagoAReserva(pago, session);

    } else if (payment.status === 'pending' || payment.status === 'in_process') {
      pago.estado = 'en_revision';
      await pago.save({ session });

    } else if (payment.status === 'rejected') {
      pago.estado = 'rechazado';
      await pago.save({ session });
      await session.abortTransaction();
      throw new Error(`Pago rechazado: ${payment.status_detail}`);
    }

    // Log de auditoría
    await AuditLog.create([{
      usuario: userId,
      accion: 'pago_brick_procesado',
      entidad: { tipo: 'Payment', id: pago._id },
      descripcion: `Pago Brick ${payment.status} - Reserva ${reserva.numeroReserva} - Monto: ${montoPago}`,
      nivel: payment.status === 'approved' ? 'info' : 'warning',
      metadata: { paymentId: payment.id, status: payment.status }
    }], { session });

    await session.commitTransaction();

    return {
      pagoId: pago._id,
      numeroPago: pago.numeroPago,
      paymentId: payment.id,
      status: payment.status,
      statusDetail: payment.status_detail,
      reserva: {
        numero: reserva.numeroReserva,
        paquete: reserva.paquete.nombre
      }
    };

  } catch (error) {
    await session.abortTransaction();
    console.error('Error creando pago Brick:', error);
    throw error;
  } finally {
    session.endSession();
  }
}

// ============================================
// PROCESAR WEBHOOK DE MERCADOPAGO CON TRANSACCIÓN
// ============================================
export async function procesarWebhookMercadoPago(webhookData) {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const { type, data } = webhookData;

    if (type !== 'payment') {
      console.log(`Webhook tipo ${type} ignorado`);
      await session.commitTransaction();
      return { success: true, message: 'Tipo de webhook no procesado' };
    }

    const paymentId = data.id;

    const mpPayment = new MPPayment(mpClient);
    const paymentInfo = await mpPayment.get({ id: paymentId });

    const externalReference = paymentInfo.external_reference;

    const pago = await Payment.findOne({ numeroPago: externalReference }).session(session);

    if (!pago) {
      console.error(`Pago no encontrado: ${externalReference}`);
      await session.abortTransaction();
      return { success: false, message: 'Pago no encontrado' };
    }

    // Evitar procesar duplicados
    if (pago.mercadopago.paymentId === paymentId && pago.estado !== 'pendiente') {
      console.log(`Pago ${externalReference} ya fue procesado`);
      await session.commitTransaction();
      return { success: true, message: 'Pago ya procesado' };
    }

    // Actualizar datos de MercadoPago
    pago.mercadopago.paymentId = paymentId;
    pago.mercadopago.status = paymentInfo.status;
    pago.mercadopago.statusDetail = paymentInfo.status_detail;
    pago.mercadopago.paymentTypeId = paymentInfo.payment_type_id;
    pago.mercadopago.paymentMethodId = paymentInfo.payment_method_id;
    pago.mercadopago.installments = paymentInfo.installments;
    pago.mercadopago.transactionAmount = paymentInfo.transaction_amount;
    pago.mercadopago.netReceivedAmount = paymentInfo.transaction_details?.net_received_amount;
    pago.mercadopago.totalPaidAmount = paymentInfo.transaction_details?.total_paid_amount;
    pago.mercadopago.feeDetails = paymentInfo.fee_details;
    pago.mercadopago.dateCreated = paymentInfo.date_created;
    pago.mercadopago.dateApproved = paymentInfo.date_approved;
    pago.mercadopago.dateLastUpdated = paymentInfo.date_last_updated;
    pago.mercadopago.merchantOrderId = paymentInfo.order?.id;

    if (paymentInfo.payer) {
      pago.mercadopago.payer = {
        id: paymentInfo.payer.id,
        email: paymentInfo.payer.email,
        firstName: paymentInfo.payer.first_name,
        lastName: paymentInfo.payer.last_name,
        identification: paymentInfo.payer.identification,
        phone: paymentInfo.payer.phone
      };
    }

    pago.mercadopago.webhookData = paymentInfo;

    // Actualizar estado según MP
    switch (paymentInfo.status) {
      case 'approved':
        pago.estado = 'aprobado';
        await pago.save({ session });
        await aplicarPagoAReserva(pago, session);
        break;

      case 'rejected':
        pago.estado = 'rechazado';
        await pago.save({ session });
        await notificarPagoRechazado(pago);
        break;

      case 'pending':
      case 'in_process':
        pago.estado = 'en_revision';
        await pago.save({ session });
        break;

      case 'cancelled':
        pago.estado = 'cancelado';
        await pago.save({ session });
        break;

      case 'refunded':
        pago.estado = 'reembolsado';
        pago.reembolso.realizado = true;
        pago.reembolso.fecha = new Date();
        pago.reembolso.mercadopagoRefundId = paymentInfo.refunds?.[0]?.id;
        await pago.save({ session });
        break;

      default:
        console.log(`Estado desconocido: ${paymentInfo.status}`);
        await pago.save({ session });
    }

    // Log de auditoría
    await AuditLog.create([{
      accion: 'pago_webhook_recibido',
      entidad: { tipo: 'Payment', id: pago._id },
      descripcion: `Webhook MP procesado - Estado: ${paymentInfo.status} - Payment ID: ${paymentId}`,
      nivel: paymentInfo.status === 'approved' ? 'info' : 'warning',
      metadata: { paymentId, status: paymentInfo.status }
    }], { session });

    await session.commitTransaction();
    return { success: true, message: 'Webhook procesado correctamente' };

  } catch (error) {
    await session.abortTransaction();
    console.error('Error procesando webhook MP:', error);

    await AuditLog.create({
      accion: 'error_sistema',
      entidad: { tipo: 'Sistema' },
      descripcion: `Error procesando webhook MP: ${error.message}`,
      nivel: 'error',
      metadata: { error: error.stack }
    });

    throw error;
  } finally {
    session.endSession();
  }
}

// ============================================
// APLICAR PAGO A RESERVA (DENTRO DE TRANSACCIÓN)
// ============================================
async function aplicarPagoAReserva(pago, session) {
  try {
    const reserva = await Booking.findById(pago.reserva).session(session);

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    await reserva.registrarPago(pago.monto, pago._id);
    await reserva.save({ session });

    // Enviar email FUERA de la transacción
    setImmediate(async () => {
      try {
        await sendEmail({
          to: reserva.datosContacto.email,
          subject: `Pago recibido - Reserva ${reserva.numeroReserva}`,
          template: 'pago-confirmado',
          data: {
            nombreCliente: reserva.datosContacto.nombre,
            numeroReserva: reserva.numeroReserva,
            montoPagado: pago.monto,
            moneda: pago.moneda,
            montoPendiente: reserva.montoPendiente,
            numeroPago: pago.numeroPago,
            fechaPago: new Date().toLocaleDateString('es-AR')
          }
        });
      } catch (err) {
        console.error('Error enviando email de confirmación:', err);
      }
    });

    // Log de auditoría
    await AuditLog.create([{
      accion: 'pago_aprobado',
      entidad: { tipo: 'Payment', id: pago._id },
      descripcion: `Pago aprobado y aplicado a reserva ${reserva.numeroReserva} - Monto: ${pago.monto} ${pago.moneda}`,
      nivel: 'info'
    }], { session });

    console.log(`✅ Pago ${pago.numeroPago} aplicado a reserva ${reserva.numeroReserva}`);

  } catch (error) {
    console.error('Error aplicando pago a reserva:', error);
    throw error;
  }
}

// ... (resto de funciones: notificarPagoRechazado, registrarPagoPresencial, etc.)

// ============================================
// NOTIFICAR PAGO RECHAZADO
// ============================================
async function notificarPagoRechazado(pago) {
  try {
    const reserva = await Booking.findById(pago.reserva);

    if (!reserva) return;

    await sendEmail({
      to: reserva.datosContacto.email,
      subject: `Pago rechazado - Reserva ${reserva.numeroReserva}`,
      template: 'pago-rechazado',
      data: {
        nombreCliente: reserva.datosContacto.nombre,
        numeroReserva: reserva.numeroReserva,
        montoPago: pago.monto,
        motivo: pago.mercadopago.statusDetail
      }
    });

    console.log(`⚠️ Notificación de pago rechazado enviada para reserva ${reserva.numeroReserva}`);

  } catch (error) {
    console.error('Error notificando pago rechazado:', error);
  }
}

// ============================================
// REGISTRAR PAGO PRESENCIAL
// ============================================
export async function registrarPagoPresencial(data, userId) {
  try {
    const {
      reservaId,
      monto,
      tipoPago,
      numeroCuota,
      metodoPago,
      detallePresencial,
      notas
    } = data;

    const reserva = await Booking.findById(reservaId);

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    // Validar que el monto no exceda lo pendiente
    if (monto > reserva.montoPendiente) {
      throw new Error('El monto del pago excede el saldo pendiente');
    }

    // Crear pago
    const pago = new Payment({
      reserva: reservaId,
      monto,
      moneda: reserva.moneda,
      tipoPago,
      numeroCuota,
      metodoPago,
      estado: 'aprobado', // Los pagos presenciales se aprueban inmediatamente
      usuarioRegistro: userId,
      presencial: {
        metodo: detallePresencial.metodo,
        usuarioRecibio: userId,
        ...detallePresencial
      },
      notas,
      fechaRegistro: new Date()
    });

    await pago.save();

    // Aplicar pago a la reserva
    await reserva.registrarPago(monto, pago._id);

    // Generar comprobante (esto puede ser un PDF generado)
    // TODO: Implementar generación de comprobante PDF

    // Enviar email de confirmación
    await sendEmail({
      to: reserva.datosContacto.email,
      subject: `Pago recibido - Reserva ${reserva.numeroReserva}`,
      template: 'pago-confirmado',
      data: {
        nombreCliente: reserva.datosContacto.nombre,
        numeroReserva: reserva.numeroReserva,
        montoPagado: monto,
        moneda: reserva.moneda,
        montoPendiente: reserva.montoPendiente,
        numeroPago: pago.numeroPago,
        metodoPago: metodoPago === 'efectivo' ? 'Efectivo' :
          metodoPago === 'tarjeta_presencial' ? 'Tarjeta' :
            'Transferencia',
        fechaPago: new Date().toLocaleDateString('es-AR')
      }
    });

    // Log de auditoría
    await AuditLog.create({
      usuario: userId,
      usuarioEmail: (await User.findById(userId))?.email,
      accion: 'pago_aprobado',
      entidad: { tipo: 'Payment', id: pago._id },
      descripcion: `Pago presencial registrado - Reserva: ${reserva.numeroReserva} - Monto: ${monto} ${reserva.moneda} - Método: ${metodoPago}`,
      nivel: 'info'
    });

    return pago;

  } catch (error) {
    console.error('Error registrando pago presencial:', error);

    await AuditLog.create({
      usuario: userId,
      accion: 'error_sistema',
      entidad: { tipo: 'Payment' },
      descripcion: `Error registrando pago presencial: ${error.message}`,
      nivel: 'error',
      metadata: { error: error.stack }
    });

    throw error;
  }
}

// ============================================
// OBTENER PAGOS DE UNA RESERVA
// ============================================
export async function obtenerPagosPorReserva(reservaId) {
  try {
    const pagos = await Payment.find({ reserva: reservaId })
      .populate('usuarioRegistro', 'nombre email')
      .sort({ createdAt: -1 });

    return pagos;

  } catch (error) {
    console.error('Error obteniendo pagos:', error);
    throw error;
  }
}

// ============================================
// OBTENER PAGO POR ID
// ============================================
export async function obtenerPagoPorId(pagoId) {
  try {
    const pago = await Payment.findById(pagoId)
      .populate('reserva')
      .populate('usuarioRegistro', 'nombre email');

    if (!pago) {
      throw new Error('Pago no encontrado');
    }

    return pago;

  } catch (error) {
    console.error('Error obteniendo pago:', error);
    throw error;
  }
}

// ============================================
// CANCELAR PAGO
// ============================================
export async function cancelarPago(pagoId, motivo, userId) {
  try {
    const pago = await Payment.findById(pagoId);

    if (!pago) {
      throw new Error('Pago no encontrado');
    }

    if (pago.estado === 'aprobado') {
      throw new Error('No se puede cancelar un pago aprobado. Debe realizar un reembolso.');
    }

    pago.estado = 'cancelado';
    pago.notas = `${pago.notas || ''}\nCancelado: ${motivo}`;
    await pago.save();

    // Log de auditoría
    await AuditLog.create({
      usuario: userId,
      accion: 'pago_cancelado',
      entidad: { tipo: 'Payment', id: pago._id },
      descripcion: `Pago cancelado - ${pago.numeroPago} - Motivo: ${motivo}`,
      nivel: 'warning'
    });

    return pago;

  } catch (error) {
    console.error('Error cancelando pago:', error);
    throw error;
  }
}

// ============================================
// PROCESAR REEMBOLSO
// ============================================
export async function procesarReembolso(pagoId, montoReembolso, motivo, userId) {
  try {
    const pago = await Payment.findById(pagoId).populate('reserva');

    if (!pago) {
      throw new Error('Pago no encontrado');
    }

    if (pago.estado !== 'aprobado') {
      throw new Error('Solo se pueden reembolsar pagos aprobados');
    }

    if (montoReembolso > pago.monto) {
      throw new Error('El monto del reembolso no puede ser mayor al monto del pago');
    }

    // Si es pago de MercadoPago, procesar reembolso en MP
    if (pago.metodoPago === 'mercadopago' && pago.mercadopago.paymentId) {
      const mpPayment = new MPPayment(mpClient);
      const refund = await mpPayment.refund({
        id: pago.mercadopago.paymentId,
        body: { amount: montoReembolso }
      });

      pago.reembolso.mercadopagoRefundId = refund.id;
    }

    // Actualizar pago
    pago.estado = 'reembolsado';
    pago.reembolso.realizado = true;
    pago.reembolso.monto = montoReembolso;
    pago.reembolso.fecha = new Date();
    pago.reembolso.motivo = motivo;
    pago.reembolso.usuarioAutorizo = userId;
    await pago.save();

    // Actualizar reserva
    const reserva = pago.reserva;
    reserva.montoPagado -= montoReembolso;
    reserva.montoPendiente = reserva.montoTotal - reserva.montoPagado;
    await reserva.save();

    // Notificar cliente
    await sendEmail({
      to: reserva.datosContacto.email,
      subject: `Reembolso procesado - Reserva ${reserva.numeroReserva}`,
      template: 'reembolso-confirmado',
      data: {
        nombreCliente: reserva.datosContacto.nombre,
        numeroReserva: reserva.numeroReserva,
        montoReembolsado: montoReembolso,
        moneda: pago.moneda,
        motivo,
        numeroPago: pago.numeroPago
      }
    });

    // Log de auditoría
    await AuditLog.create({
      usuario: userId,
      accion: 'pago_reembolsado',
      entidad: { tipo: 'Payment', id: pago._id },
      descripcion: `Reembolso procesado - ${pago.numeroPago} - Monto: ${montoReembolso} ${pago.moneda} - Motivo: ${motivo}`,
      nivel: 'warning'
    });

    return pago;

  } catch (error) {
    console.error('Error procesando reembolso:', error);
    throw error;
  }
}