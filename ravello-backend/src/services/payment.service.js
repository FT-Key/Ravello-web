// services/payment/payment.service.js
import mongoose from 'mongoose';
import { Payment, Booking, AuditLog } from '../models/index.js';
import { PaymentValidator } from './payment/validators/payment.validator.js';
import { RiskValidator } from './payment/validators/risk.validator.js';
import { PaymentFactory } from './payment/factories/payment.factory.js';
import { PreferenceService } from './payment/mercadopago/preference.service.js';
import { BrickService } from './payment/mercadopago/brick.service.js';
import { WebhookService } from './payment/mercadopago/webhook.service.js';
import { PaymentApplicationHandler } from './payment/handlers/payment-application.handler.js';
import { RefundHandler } from './payment/handlers/refund.handler.js';
import { PresentialHandler } from './payment/handlers/presential.handler.js';
import { PaymentNotifications } from './payment/notifications/payment.notifications.js';

// ============================================
// SERVICIO PRINCIPAL DE PAGOS
// ============================================
export default class PaymentService {

  // ============================================
  // CREAR PREFERENCIA DE MERCADOPAGO
  // ============================================
  static async crearPreferenciaMercadoPago(reservaId, montoPago, tipoPago, numeroCuota, userId, metadata = {}) {
    const session = await mongoose.startSession();

    try {
      await session.startTransaction();

      // Validar usuario
      const usuario = await PaymentValidator.validateUser(userId, session);

      // Validar reserva
      const reserva = await PaymentValidator.validateBooking(reservaId, session);

      // Validar permisos
      PaymentValidator.validatePermissions(reserva, userId, usuario.rol);

      // Validar monto
      PaymentValidator.validateAmount(montoPago, reserva.montoPendiente);

      // Analizar riesgo
      const { riesgo, infoDispositivo } = await RiskValidator.analyze({
        usuario, reserva, metadata, monto: montoPago, tipoPago
      });

      await RiskValidator.checkRiskLevel(riesgo, userId, reservaId, montoPago, session);

      // Crear el objeto de datos (sin guardar aún)
      const paymentDataObject = PaymentFactory.createPaymentData(
        reserva, montoPago, tipoPago, numeroCuota, userId, riesgo, infoDispositivo, metadata
      );

      // Generar numeroPago manualmente
      const count = await Payment.countDocuments();
      const fecha = new Date();
      const year = fecha.getFullYear().toString().slice(-2);
      const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const numero = (count + 1).toString().padStart(5, '0');
      const numeroPago = `PAG-${year}${month}-${numero}`;

      console.log('✅ Número de pago generado:', numeroPago);

      // Crear preferencia en MercadoPago PRIMERO
      const body = PreferenceService.buildPreferenceBody(reserva, montoPago, tipoPago, numeroCuota, numeroPago);
      const result = await PreferenceService.create(body);

      // Construir objeto mercadopago con los datos de la preferencia
      const mercadopagoData = {
        preferenceId: result.id,
        externalReference: numeroPago,
        status: 'pending',
        backUrls: {
          success: body.back_urls?.success,
          failure: body.back_urls?.failure,
          pending: body.back_urls?.pending
        }
      };

      // Crear el documento CON mercadopago ya incluido
      const pago = new Payment({
        ...paymentDataObject,
        numeroPago: numeroPago,
        estado: 'pendiente',
        mercadopago: mercadopagoData
      });

      // Guardar UNA SOLA VEZ
      await pago.save({ session });

      console.log('✅ Pago con preferencia guardado correctamente en la BD');

      // Auditoría
      await AuditLog.create([{
        usuario: userId,
        accion: 'pago_checkout_iniciado',
        entidad: { tipo: 'Payment', id: pago._id },
        descripcion: `Preferencia MP creada para reserva ${reserva.numeroReserva} - Monto: ${montoPago} ${reserva.moneda}`,
        nivel: riesgo.score > 50 ? 'warning' : 'info',
        metadata: { riesgo, preferenceId: result.id, ...metadata }
      }], { session });

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
  static async crearPagoBrick(reservaId, montoPago, tipoPago, numeroCuota, paymentData, userId, metadata = {}) {
    const session = await mongoose.startSession();

    try {
      await session.startTransaction();

      // Validar usuario
      const usuario = await PaymentValidator.validateUser(userId, session);

      // Validar reserva
      const reserva = await PaymentValidator.validateBooking(reservaId, session);

      // Validar permisos
      PaymentValidator.validatePermissions(reserva, userId, usuario.rol);

      // Validar monto
      PaymentValidator.validateAmount(montoPago, reserva.montoPendiente);

      // Analizar riesgo
      const { riesgo, infoDispositivo } = await RiskValidator.analyze({
        usuario, reserva, metadata, monto: montoPago, tipoPago
      });

      await RiskValidator.checkRiskLevel(riesgo, userId, reservaId, montoPago, session);

      // ⬅️ CAMBIO 1: Crear el OBJETO de datos del pago (sin guardar aún)
      const paymentDataObject = PaymentFactory.createPaymentData(
        reserva, montoPago, tipoPago, numeroCuota, userId, riesgo, infoDispositivo, metadata
      );

      // ⬅️ CAMBIO 2: Generar el numeroPago ANTES de crear el documento
      const count = await Payment.countDocuments();
      const fecha = new Date();
      const year = fecha.getFullYear().toString().slice(-2);
      const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const numero = (count + 1).toString().padStart(5, '0');
      const numeroPago = `PAG-${year}${month}-${numero}`;

      console.log('✅ Número de pago generado:', numeroPago);

      // Procesar pago con MercadoPago Brick PRIMERO
      const body = BrickService.buildPaymentBody(reserva, montoPago, paymentData, numeroPago);
      const payment = await BrickService.processPayment(body);

      // Determinar estado del pago
      const estadoPago = BrickService.determinePaymentState(payment.status);

      // Si fue rechazado, abortar
      if (payment.status === 'rejected') {
        await session.abortTransaction();
        throw new Error(`Pago rechazado: ${payment.status_detail}`);
      }

      // ⬅️ CAMBIO 3: Construir el objeto mercadopago ANTES de crear el documento
      const mercadopagoData = {
        paymentId: payment.id?.toString(),
        status: payment.status,
        statusDetail: payment.status_detail,
        paymentTypeId: payment.payment_type_id,
        paymentMethodId: payment.payment_method_id,
        installments: payment.installments,
        installmentAmount: payment.transaction_details?.installment_amount,
        transactionAmount: payment.transaction_amount,
        netReceivedAmount: payment.transaction_details?.net_received_amount,
        totalPaidAmount: payment.transaction_details?.total_paid_amount,
        externalReference: numeroPago,
        dateCreated: payment.date_created ? new Date(payment.date_created) : undefined,
        dateApproved: payment.date_approved ? new Date(payment.date_approved) : undefined,
        dateLastUpdated: payment.date_last_updated ? new Date(payment.date_last_updated) : undefined,
      };

      // Agregar payer si existe
      if (payment.payer) {
        mercadopagoData.payer = {
          id: payment.payer.id?.toString(),
          email: payment.payer.email,
          firstName: payment.payer.first_name,
          lastName: payment.payer.last_name
        };

        if (payment.payer.identification) {
          mercadopagoData.payer.identification = {
            type: payment.payer.identification.type,
            number: payment.payer.identification.number
          };
        }

        if (payment.payer.phone) {
          mercadopagoData.payer.phone = {
            areaCode: payment.payer.phone.area_code,
            number: payment.payer.phone.number
          };
        }
      }

      // Agregar feeDetails si existe
      if (payment.fee_details && Array.isArray(payment.fee_details)) {
        mercadopagoData.feeDetails = payment.fee_details.map(fee => ({
          type: fee.type,
          amount: fee.amount,
          feePayer: fee.fee_payer
        }));
      }

      // Agregar card si existe
      if (payment.card) {
        mercadopagoData.card = {
          firstSixDigits: payment.card.first_six_digits,
          lastFourDigits: payment.card.last_four_digits
        };
      }

      // Guardar respuesta completa
      mercadopagoData.webhookData = payment;

      // ⬅️ CAMBIO 4: Crear el documento CON todos los datos ya listos
      const pago = new Payment({
        ...paymentDataObject,
        numeroPago: numeroPago,
        estado: estadoPago,
        mercadopago: mercadopagoData  // ⬅️ INCLUIR mercadopago desde el inicio
      });

      // ⬅️ CAMBIO 5: Guardar UNA SOLA VEZ
      await pago.save({ session });

      console.log('✅ Pago guardado correctamente en la BD');

      // Si fue aprobado, aplicar a la reserva
      if (payment.status === 'approved') {
        await PaymentApplicationHandler.apply(pago, session);
      }

      // Auditoría
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
  // PROCESAR WEBHOOK DE MERCADOPAGO
  // ============================================
  static async procesarWebhookMercadoPago(webhookData) {
    const session = await mongoose.startSession();

    try {
      await session.startTransaction();

      const result = await WebhookService.process(webhookData, session);

      await session.commitTransaction();
      return result;

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
  // VALIDAR WEBHOOK DE MERCADOPAGO
  // ============================================
  static validarWebhook(headers, body) {
    return WebhookService.validateWebhook(headers, body);
  }

  // ============================================
  // REGISTRAR PAGO PRESENCIAL
  // ============================================
  static async registrarPagoPresencial(data, userId) {
    try {
      // Validar datos antes de procesar
      PresentialHandler.validatePresentialData(data);

      return await PresentialHandler.register(data, userId);
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
  static async obtenerPagosPorReserva(reservaId) {
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
  static async obtenerPagoPorId(pagoId) {
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
  // OBTENER PAGO POR NÚMERO
  // ============================================
  static async obtenerPagoPorNumero(numeroPago) {
    try {
      const pago = await Payment.findOne({ numeroPago })
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
  static async cancelarPago(pagoId, motivo, userId) {
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

      // Auditoría
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
  static async procesarReembolso(pagoId, montoReembolso, motivo, userId) {
    try {
      return await RefundHandler.process(pagoId, montoReembolso, motivo, userId);
    } catch (error) {
      console.error('Error procesando reembolso:', error);
      throw error;
    }
  }

  // ============================================
  // PROCESAR REEMBOLSOS MÚLTIPLES
  // ============================================
  static async procesarReembolsosMultiples(reservaId, motivo, userId) {
    try {
      return await RefundHandler.processMultipleRefunds(reservaId, motivo, userId);
    } catch (error) {
      console.error('Error procesando reembolsos múltiples:', error);
      throw error;
    }
  }

  // ============================================
  // OBTENER ESTADÍSTICAS DE PAGOS
  // ============================================
  static async obtenerEstadisticas(filtros = {}) {
    try {
      const query = {};

      if (filtros.fechaDesde) {
        query.createdAt = { $gte: new Date(filtros.fechaDesde) };
      }

      if (filtros.fechaHasta) {
        query.createdAt = { ...query.createdAt, $lte: new Date(filtros.fechaHasta) };
      }

      if (filtros.estado) {
        query.estado = filtros.estado;
      }

      if (filtros.metodoPago) {
        query.metodoPago = filtros.metodoPago;
      }

      const pagos = await Payment.find(query);

      const estadisticas = {
        total: pagos.length,
        montoTotal: pagos.reduce((sum, p) => sum + p.monto, 0),
        porEstado: {},
        porMetodo: {},
        porTipoPago: {}
      };

      pagos.forEach(pago => {
        // Por estado
        estadisticas.porEstado[pago.estado] = (estadisticas.porEstado[pago.estado] || 0) + 1;

        // Por método
        estadisticas.porMetodo[pago.metodoPago] = (estadisticas.porMetodo[pago.metodoPago] || 0) + 1;

        // Por tipo de pago
        estadisticas.porTipoPago[pago.tipoPago] = (estadisticas.porTipoPago[pago.tipoPago] || 0) + 1;
      });

      return estadisticas;

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  // ============================================
  // VERIFICAR ESTADO DE PAGO EN MERCADOPAGO
  // ============================================
  static async verificarEstadoPagoMP(pagoId) {
    try {
      const pago = await Payment.findById(pagoId);

      if (!pago) {
        throw new Error('Pago no encontrado');
      }

      if (!pago.mercadopago.paymentId) {
        throw new Error('Pago no tiene ID de MercadoPago asociado');
      }

      const paymentInfo = await WebhookService.getPaymentInfo(pago.mercadopago.paymentId);

      return {
        pagoId: pago._id,
        numeroPago: pago.numeroPago,
        estadoLocal: pago.estado,
        estadoMP: paymentInfo.status,
        detalleMP: paymentInfo.status_detail,
        sincronizado: pago.mercadopago.status === paymentInfo.status
      };

    } catch (error) {
      console.error('Error verificando estado en MP:', error);
      throw error;
    }
  }

  // ============================================
  // REENVIAR NOTIFICACIÓN DE PAGO
  // ============================================
  static async reenviarNotificacion(pagoId) {
    try {
      const pago = await Payment.findById(pagoId).populate('reserva');

      if (!pago) {
        throw new Error('Pago no encontrado');
      }

      const reserva = pago.reserva;

      if (pago.estado === 'aprobado') {
        await PaymentNotifications.sendPaymentConfirmation(reserva, pago);
      } else if (pago.estado === 'rechazado') {
        await PaymentNotifications.sendPaymentRejection(reserva, pago);
      } else {
        throw new Error('Solo se pueden reenviar notificaciones de pagos aprobados o rechazados');
      }

      return { success: true, message: 'Notificación reenviada correctamente' };

    } catch (error) {
      console.error('Error reenviando notificación:', error);
      throw error;
    }
  }

  // ============================================
  // GENERAR COMPROBANTE PRESENCIAL
  // ============================================
  static async generarComprobante(pagoId) {
    try {
      return await PresentialHandler.generarComprobante(pagoId);
    } catch (error) {
      console.error('Error generando comprobante:', error);
      throw error;
    }
  }

  // ============================================
  // LISTAR PAGOS PRESENCIALES
  // ============================================
  static async listarPagosPresenciales(filtros = {}) {
    try {
      return await PresentialHandler.listar(filtros);
    } catch (error) {
      console.error('Error listando pagos presenciales:', error);
      throw error;
    }
  }

  // ============================================
  // LISTAR REEMBOLSOS
  // ============================================
  static async listarReembolsos(filtros = {}) {
    try {
      return await RefundHandler.listar(filtros);
    } catch (error) {
      console.error('Error listando reembolsos:', error);
      throw error;
    }
  }

  // ============================================
  // ESTADÍSTICAS DE WEBHOOKS
  // ============================================
  static async obtenerEstadisticasWebhooks(filtros = {}) {
    try {
      return await WebhookService.obtenerEstadisticas(filtros);
    } catch (error) {
      console.error('Error obteniendo estadísticas de webhooks:', error);
      throw error;
    }
  }

  // ============================================
  // REINTENTAR WEBHOOK
  // ============================================
  static async reintentarWebhook(pagoId) {
    const session = await mongoose.startSession();

    try {
      await session.startTransaction();

      const result = await WebhookService.retry(pagoId, session);

      await session.commitTransaction();
      return result;

    } catch (error) {
      await session.abortTransaction();
      console.error('Error reintentando webhook:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }
}