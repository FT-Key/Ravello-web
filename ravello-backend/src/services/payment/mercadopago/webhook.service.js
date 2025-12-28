// services/payment/mercadopago/webhook.service.js
import { Payment as MPPayment } from 'mercadopago';
import { Payment, AuditLog } from '../../../models/index.js';
import { mpClient } from './client.js';
import { PaymentApplicationHandler } from '../handlers/payment-application.handler.js';
import { PaymentNotifications } from '../notifications/payment.notifications.js';

/**
 * Servicio para procesar webhooks de MercadoPago
 */
export class WebhookService {
  
  /**
   * Procesa un webhook recibido de MercadoPago
   * @param {Object} webhookData - Datos del webhook
   * @param {Object} session - Sesión de MongoDB
   * @returns {Promise<Object>}
   */
  static async process(webhookData, session) {
    try {
      const { type, data } = webhookData;

      // Solo procesamos webhooks de tipo payment
      if (type !== 'payment') {
        console.log(`Webhook tipo ${type} ignorado`);
        return { success: true, message: 'Tipo de webhook no procesado' };
      }

      const paymentId = data.id;

      // Obtener información completa del pago desde MercadoPago
      const paymentInfo = await this.getPaymentInfo(paymentId);

      // Buscar el pago en nuestra base de datos
      const externalReference = paymentInfo.external_reference;
      const pago = await Payment.findOne({ numeroPago: externalReference }).session(session);

      if (!pago) {
        console.error(`Pago no encontrado: ${externalReference}`);
        return { success: false, message: 'Pago no encontrado' };
      }

      // Evitar procesar duplicados
      if (this.isAlreadyProcessed(pago, paymentId)) {
        console.log(`Pago ${externalReference} ya fue procesado`);
        return { success: true, message: 'Pago ya procesado' };
      }

      // Actualizar datos del pago
      this.updatePaymentData(pago, paymentInfo);

      // Procesar según el estado
      await this.handlePaymentStatus(pago, paymentInfo, session);

      // Log de auditoría
      await AuditLog.create([{
        accion: 'pago_webhook_recibido',
        entidad: { tipo: 'Payment', id: pago._id },
        descripcion: `Webhook MP procesado - Estado: ${paymentInfo.status} - Payment ID: ${paymentId}`,
        nivel: paymentInfo.status === 'approved' ? 'info' : 'warning',
        metadata: { paymentId, status: paymentInfo.status }
      }], { session });

      return { success: true, message: 'Webhook procesado correctamente' };

    } catch (error) {
      console.error('Error procesando webhook:', error);
      throw error;
    }
  }

  /**
   * Obtiene información del pago desde MercadoPago
   * @param {string} paymentId - ID del pago en MercadoPago
   * @returns {Promise<Object>}
   */
  static async getPaymentInfo(paymentId) {
    try {
      const mpPayment = new MPPayment(mpClient);
      return await mpPayment.get({ id: paymentId });
    } catch (error) {
      console.error('Error obteniendo información del pago de MP:', error);
      throw new Error(`No se pudo obtener información del pago: ${error.message}`);
    }
  }

  /**
   * Verifica si un webhook ya fue procesado
   * @param {Payment} pago - Pago en base de datos
   * @param {string} paymentId - ID del pago de MercadoPago
   * @returns {boolean}
   */
  static isAlreadyProcessed(pago, paymentId) {
    return pago.mercadopago.paymentId === paymentId && pago.estado !== 'pendiente';
  }

  /**
   * Actualiza los datos del pago con la información de MercadoPago
   * @param {Payment} pago - Pago a actualizar
   * @param {Object} paymentInfo - Información del pago de MP
   */
  static updatePaymentData(pago, paymentInfo) {
    pago.mercadopago.paymentId = paymentInfo.id;
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

    // Actualizar información del pagador
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

    // Guardar datos completos del webhook
    pago.mercadopago.webhookData = paymentInfo;
  }

  /**
   * Maneja el estado del pago según la respuesta de MercadoPago
   * @param {Payment} pago - Pago a procesar
   * @param {Object} paymentInfo - Información del pago de MP
   * @param {Object} session - Sesión de MongoDB
   */
  static async handlePaymentStatus(pago, paymentInfo, session) {
    switch (paymentInfo.status) {
      case 'approved':
        await this.handleApproved(pago, session);
        break;

      case 'rejected':
        await this.handleRejected(pago, session);
        break;

      case 'pending':
      case 'in_process':
        await this.handlePending(pago, session);
        break;

      case 'cancelled':
        await this.handleCancelled(pago, session);
        break;

      case 'refunded':
        await this.handleRefunded(pago, paymentInfo, session);
        break;

      default:
        console.log(`Estado desconocido: ${paymentInfo.status}`);
        await pago.save({ session });
    }
  }

  /**
   * Maneja un pago aprobado
   * @param {Payment} pago - Pago aprobado
   * @param {Object} session - Sesión de MongoDB
   */
  static async handleApproved(pago, session) {
    pago.estado = 'aprobado';
    await pago.save({ session });
    await PaymentApplicationHandler.apply(pago, session);
  }

  /**
   * Maneja un pago rechazado
   * @param {Payment} pago - Pago rechazado
   * @param {Object} session - Sesión de MongoDB
   */
  static async handleRejected(pago, session) {
    pago.estado = 'rechazado';
    await pago.save({ session });
    
    // Notificar de forma asíncrona
    setImmediate(async () => {
      try {
        await this.notifyRejection(pago);
      } catch (err) {
        console.error('Error enviando notificación de rechazo:', err);
      }
    });
  }

  /**
   * Maneja un pago pendiente o en proceso
   * @param {Payment} pago - Pago pendiente
   * @param {Object} session - Sesión de MongoDB
   */
  static async handlePending(pago, session) {
    pago.estado = 'en_revision';
    await pago.save({ session });
  }

  /**
   * Maneja un pago cancelado
   * @param {Payment} pago - Pago cancelado
   * @param {Object} session - Sesión de MongoDB
   */
  static async handleCancelled(pago, session) {
    pago.estado = 'cancelado';
    await pago.save({ session });
  }

  /**
   * Maneja un pago reembolsado
   * @param {Payment} pago - Pago reembolsado
   * @param {Object} paymentInfo - Información del pago de MP
   * @param {Object} session - Sesión de MongoDB
   */
  static async handleRefunded(pago, paymentInfo, session) {
    pago.estado = 'reembolsado';
    pago.reembolso.realizado = true;
    pago.reembolso.fecha = new Date();
    pago.reembolso.mercadopagoRefundId = paymentInfo.refunds?.[0]?.id;
    await pago.save({ session });
  }

  /**
   * Notifica al cliente sobre un pago rechazado
   * @param {Payment} pago - Pago rechazado
   */
  static async notifyRejection(pago) {
    try {
      const pagoCompleto = await Payment.findById(pago._id).populate('reserva');
      if (pagoCompleto && pagoCompleto.reserva) {
        await PaymentNotifications.sendPaymentRejection(
          pagoCompleto.reserva, 
          pagoCompleto
        );
      }
    } catch (error) {
      console.error('Error notificando rechazo de pago:', error);
    }
  }

  /**
   * Valida la autenticidad de un webhook de MercadoPago
   * @param {Object} headers - Headers de la petición
   * @param {Object} body - Cuerpo de la petición
   * @returns {boolean}
   */
  static validateWebhook(headers, body) {
    // MercadoPago envía un header x-signature para validar
    // Implementar según documentación de MP si es necesario
    // https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
    
    const signature = headers['x-signature'];
    const requestId = headers['x-request-id'];
    
    if (!signature || !requestId) {
      console.warn('Webhook sin firma de seguridad');
      return false;
    }

    // TODO: Implementar validación real de firma si es crítico
    // Por ahora aceptamos todos los webhooks
    return true;
  }

  /**
   * Obtiene estadísticas de webhooks procesados
   * @param {Object} filtros - Filtros de búsqueda
   * @returns {Promise<Object>}
   */
  static async obtenerEstadisticas(filtros = {}) {
    try {
      const query = {
        'mercadopago.paymentId': { $exists: true }
      };

      if (filtros.fechaDesde) {
        query.createdAt = { $gte: new Date(filtros.fechaDesde) };
      }

      if (filtros.fechaHasta) {
        query.createdAt = { 
          ...query.createdAt, 
          $lte: new Date(filtros.fechaHasta) 
        };
      }

      const pagos = await Payment.find(query);

      const estadisticas = {
        total: pagos.length,
        porEstado: {},
        porMetodoPago: {},
        tiempoPromedioProcesamiento: 0
      };

      let totalTiempo = 0;
      let contadorTiempo = 0;

      pagos.forEach(pago => {
        // Por estado
        estadisticas.porEstado[pago.estado] = 
          (estadisticas.porEstado[pago.estado] || 0) + 1;

        // Por método de pago MP
        const metodo = pago.mercadopago.paymentMethodId;
        if (metodo) {
          estadisticas.porMetodoPago[metodo] = 
            (estadisticas.porMetodoPago[metodo] || 0) + 1;
        }

        // Tiempo de procesamiento
        if (pago.mercadopago.dateApproved && pago.mercadopago.dateCreated) {
          const tiempo = new Date(pago.mercadopago.dateApproved) - 
                        new Date(pago.mercadopago.dateCreated);
          totalTiempo += tiempo;
          contadorTiempo++;
        }
      });

      if (contadorTiempo > 0) {
        estadisticas.tiempoPromedioProcesamiento = 
          Math.round(totalTiempo / contadorTiempo / 1000); // en segundos
      }

      return estadisticas;

    } catch (error) {
      console.error('Error obteniendo estadísticas de webhooks:', error);
      throw error;
    }
  }

  /**
   * Reintenta procesar un webhook fallido
   * @param {string} pagoId - ID del pago
   * @param {Object} session - Sesión de MongoDB
   * @returns {Promise<Object>}
   */
  static async retry(pagoId, session) {
    try {
      const pago = await Payment.findById(pagoId).session(session);

      if (!pago) {
        throw new Error('Pago no encontrado');
      }

      if (!pago.mercadopago.paymentId) {
        throw new Error('Pago no tiene ID de MercadoPago asociado');
      }

      // Obtener información actualizada de MP
      const paymentInfo = await this.getPaymentInfo(pago.mercadopago.paymentId);

      // Actualizar y procesar
      this.updatePaymentData(pago, paymentInfo);
      await this.handlePaymentStatus(pago, paymentInfo, session);

      console.log(`✅ Webhook reprocesado correctamente para pago ${pago.numeroPago}`);

      return { success: true, message: 'Webhook reprocesado correctamente' };

    } catch (error) {
      console.error('Error reintentando webhook:', error);
      throw error;
    }
  }
}