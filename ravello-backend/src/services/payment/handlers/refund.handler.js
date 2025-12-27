// services/payment/handlers/refund.handler.js
import { Payment as MPPayment } from 'mercadopago';
import { Payment, Booking, AuditLog, User } from '../../../models/index.js';
import { mpClient } from '../mercadopago/client.js';
import { PaymentNotifications } from '../notifications/payment.notifications.js';

/**
 * Handler para procesamiento de reembolsos
 */
export class RefundHandler {

  /**
   * Procesa un reembolso completo o parcial
   * @param {string} pagoId - ID del pago a reembolsar
   * @param {number} montoReembolso - Monto a reembolsar
   * @param {string} motivo - Motivo del reembolso
   * @param {string} userId - ID del usuario que autoriza
   * @returns {Promise<Payment>}
   */
  static async process(pagoId, montoReembolso, motivo, userId) {
    try {
      // Obtener pago con reserva
      const pago = await Payment.findById(pagoId).populate('reserva');

      if (!pago) {
        throw new Error('Pago no encontrado');
      }

      // Validar que el pago pueda ser reembolsado
      this.validateRefundable(pago, montoReembolso);

      // Si es pago de MercadoPago, procesar reembolso en MP
      if (pago.metodoPago === 'mercadopago' && pago.mercadopago.paymentId) {
        await this.processMercadoPagoRefund(pago, montoReembolso);
      }

      // Actualizar estado del pago
      this.updatePaymentWithRefund(pago, montoReembolso, motivo, userId);
      await pago.save();

      // Actualizar reserva
      await this.updateBookingWithRefund(pago.reserva, montoReembolso);

      // Obtener usuario para el log
      const usuario = await User.findById(userId);

      // Notificar cliente
      await PaymentNotifications.sendRefundConfirmation(
        pago.reserva,
        pago,
        montoReembolso,
        motivo
      );

      // Log de auditoría
      await AuditLog.create({
        usuario: userId,
        usuarioEmail: usuario?.email,
        accion: 'pago_reembolsado',
        entidad: { tipo: 'Payment', id: pago._id },
        descripcion: `Reembolso procesado - ${pago.numeroPago} - Monto: ${montoReembolso} ${pago.moneda} - Motivo: ${motivo}`,
        nivel: 'warning',
        metadata: {
          pagoId,
          montoOriginal: pago.monto,
          montoReembolso,
          motivo,
          metodoPago: pago.metodoPago
        }
      });

      console.log(`✅ Reembolso de ${montoReembolso} ${pago.moneda} procesado para pago ${pago.numeroPago}`);

      return pago;

    } catch (error) {
      console.error('Error procesando reembolso:', error);
      throw error;
    }
  }

  /**
   * Valida que un pago pueda ser reembolsado
   * @param {Payment} pago - Pago a validar
   * @param {number} montoReembolso - Monto del reembolso
   * @throws {Error} Si el pago no puede ser reembolsado
   */
  static validateRefundable(pago, montoReembolso) {
    if (pago.estado !== 'aprobado') {
      throw new Error('Solo se pueden reembolsar pagos aprobados');
    }

    if (pago.reembolso.realizado) {
      throw new Error('Este pago ya fue reembolsado');
    }

    if (montoReembolso <= 0) {
      throw new Error('El monto del reembolso debe ser mayor a 0');
    }

    if (montoReembolso > pago.monto) {
      throw new Error('El monto del reembolso no puede ser mayor al monto del pago');
    }

    // Validar que no hayan pasado demasiados días (según política de MP)
    const diasDesdeAprobacion = Math.floor(
      (Date.now() - new Date(pago.fechaRegistro).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (pago.metodoPago === 'mercadopago' && diasDesdeAprobacion > 180) {
      throw new Error('No se pueden procesar reembolsos de pagos con más de 180 días');
    }
  }

  /**
   * Procesa el reembolso en MercadoPago
   * @param {Payment} pago - Pago a reembolsar
   * @param {number} montoReembolso - Monto a reembolsar
   * @returns {Promise<Object>}
   */
  static async processMercadoPagoRefund(pago, montoReembolso) {
    try {
      const mpPayment = new MPPayment(mpClient);

      const refund = await mpPayment.refund({
        id: pago.mercadopago.paymentId,
        body: {
          amount: montoReembolso
        }
      });

      console.log(`✅ Reembolso procesado en MercadoPago - ID: ${refund.id}`);

      return refund;

    } catch (error) {
      console.error('Error procesando reembolso en MercadoPago:', error);

      // Si falla el reembolso en MP, lanzar error específico
      if (error.status === 400) {
        throw new Error('No se pudo procesar el reembolso en MercadoPago. Verifique el estado del pago.');
      } else if (error.status === 404) {
        throw new Error('Pago no encontrado en MercadoPago');
      }

      throw new Error(`Error en MercadoPago: ${error.message}`);
    }
  }

  /**
   * Actualiza el pago con la información del reembolso
   * @param {Payment} pago - Pago a actualizar
   * @param {number} montoReembolso - Monto reembolsado
   * @param {string} motivo - Motivo del reembolso
   * @param {string} userId - ID del usuario que autorizó
   */
  static updatePaymentWithRefund(pago, montoReembolso, motivo, userId) {
    pago.estado = 'reembolsado';
    pago.reembolso.realizado = true;
    pago.reembolso.monto = montoReembolso;
    pago.reembolso.fecha = new Date();
    pago.reembolso.motivo = motivo;
    pago.reembolso.usuarioAutorizo = userId;

    // Si el reembolso es parcial, agregar nota
    if (montoReembolso < pago.monto) {
      pago.reembolso.parcial = true;
      pago.notas = `${pago.notas || ''}\nReembolso parcial: ${montoReembolso} ${pago.moneda} de ${pago.monto} ${pago.moneda}`;
    }
  }

  /**
   * Actualiza la reserva restando el monto reembolsado
   * @param {Booking} reserva - Reserva a actualizar
   * @param {number} montoReembolso - Monto reembolsado
   */
  static async updateBookingWithRefund(reserva, montoReembolso) {
    reserva.montoPagado -= montoReembolso;
    reserva.montoPendiente = reserva.montoTotal - reserva.montoPagado;

    // Si el monto pagado queda negativo, ajustar a 0
    if (reserva.montoPagado < 0) {
      reserva.montoPagado = 0;
      reserva.montoPendiente = reserva.montoTotal;
    }

    await reserva.save();
  }

  /**
   * Procesa múltiples reembolsos (para cancelación de reserva)
   * @param {string} reservaId - ID de la reserva
   * @param {string} motivo - Motivo del reembolso
   * @param {string} userId - ID del usuario que autoriza
   * @returns {Promise<Array>}
   */
  static async processMultipleRefunds(reservaId, motivo, userId) {
    try {
      // Obtener todos los pagos aprobados de la reserva
      const pagos = await Payment.find({
        reserva: reservaId,
        estado: 'aprobado',
        'reembolso.realizado': false
      });

      if (pagos.length === 0) {
        throw new Error('No hay pagos aprobados para reembolsar en esta reserva');
      }

      const resultados = [];
      const errores = [];

      // Procesar cada pago
      for (const pago of pagos) {
        try {
          const resultado = await this.process(
            pago._id.toString(),
            pago.monto, // Reembolso total
            motivo,
            userId
          );
          resultados.push(resultado);
        } catch (error) {
          errores.push({
            pagoId: pago._id,
            numeroPago: pago.numeroPago,
            error: error.message
          });
        }
      }

      return {
        exitosos: resultados,
        fallidos: errores,
        total: pagos.length
      };

    } catch (error) {
      console.error('Error procesando reembolsos múltiples:', error);
      throw error;
    }
  }

  /**
   * Verifica el estado de un reembolso en MercadoPago
   * @param {string} pagoId - ID del pago
   * @returns {Promise<Object>}
   */
  static async verificarEstadoReembolsoMP(pagoId) {
    try {
      const pago = await Payment.findById(pagoId);

      if (!pago) {
        throw new Error('Pago no encontrado');
      }

      if (!pago.mercadopago.paymentId) {
        throw new Error('Pago no tiene ID de MercadoPago asociado');
      }

      if (!pago.reembolso.mercadopagoRefundId) {
        throw new Error('No hay reembolso asociado a este pago');
      }

      const mpPayment = new MPPayment(mpClient);
      const paymentInfo = await mpPayment.get({
        id: pago.mercadopago.paymentId
      });

      // Buscar el reembolso en la respuesta de MP
      const refundInfo = paymentInfo.refunds?.find(
        r => r.id === pago.reembolso.mercadopagoRefundId
      );

      return {
        pagoId: pago._id,
        numeroPago: pago.numeroPago,
        estadoLocal: pago.estado,
        reembolso: {
          realizado: pago.reembolso.realizado,
          monto: pago.reembolso.monto,
          fecha: pago.reembolso.fecha,
          estadoMP: refundInfo?.status,
          montoMP: refundInfo?.amount
        }
      };

    } catch (error) {
      console.error('Error verificando estado de reembolso en MP:', error);
      throw error;
    }
  }

  /**
   * Lista reembolsos con filtros
   * @param {Object} filtros - Filtros de búsqueda
   * @returns {Promise<Array>}
   */
  static async listar(filtros = {}) {
    try {
      const query = {
        estado: 'reembolsado',
        'reembolso.realizado': true
      };

      if (filtros.fechaDesde) {
        query['reembolso.fecha'] = { $gte: new Date(filtros.fechaDesde) };
      }

      if (filtros.fechaHasta) {
        query['reembolso.fecha'] = {
          ...query['reembolso.fecha'],
          $lte: new Date(filtros.fechaHasta)
        };
      }

      if (filtros.usuarioAutorizo) {
        query['reembolso.usuarioAutorizo'] = filtros.usuarioAutorizo;
      }

      if (filtros.metodoPago) {
        query.metodoPago = filtros.metodoPago;
      }

      const reembolsos = await Payment.find(query)
        .populate('reserva', 'numeroReserva datosContacto')
        .populate('reembolso.usuarioAutorizo', 'nombre email')
        .sort({ 'reembolso.fecha': -1 })
        .limit(filtros.limit || 100);

      return reembolsos;

    } catch (error) {
      console.error('Error listando reembolsos:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de reembolsos
   * @param {Object} filtros - Filtros temporales
   * @returns {Promise<Object>}
   */
  static async obtenerEstadisticas(filtros = {}) {
    try {
      const query = {
        estado: 'reembolsado',
        'reembolso.realizado': true
      };

      if (filtros.fechaDesde) {
        query['reembolso.fecha'] = { $gte: new Date(filtros.fechaDesde) };
      }

      if (filtros.fechaHasta) {
        query['reembolso.fecha'] = {
          ...query['reembolso.fecha'],
          $lte: new Date(filtros.fechaHasta)
        };
      }

      const reembolsos = await Payment.find(query);

      const estadisticas = {
        total: reembolsos.length,
        montoTotal: reembolsos.reduce((sum, p) => sum + p.reembolso.monto, 0),
        porMetodo: {},
        parciales: 0,
        totales: 0
      };

      reembolsos.forEach(pago => {
        // Por método de pago
        estadisticas.porMetodo[pago.metodoPago] =
          (estadisticas.porMetodo[pago.metodoPago] || 0) + pago.reembolso.monto;

        // Parciales vs totales
        if (pago.reembolso.parcial) {
          estadisticas.parciales++;
        } else {
          estadisticas.totales++;
        }
      });

      return estadisticas;

    } catch (error) {
      console.error('Error obteniendo estadísticas de reembolsos:', error);
      throw error;
    }
  }

  /**
   * Cancela un reembolso (solo si no se procesó en MP aún)
   * @param {string} pagoId - ID del pago
   * @param {string} motivo - Motivo de la cancelación
   * @param {string} userId - ID del usuario que cancela
   * @returns {Promise<Payment>}
   */
  static async cancelar(pagoId, motivo, userId) {
    try {
      const pago = await Payment.findById(pagoId);

      if (!pago) {
        throw new Error('Pago no encontrado');
      }

      if (!pago.reembolso.realizado) {
        throw new Error('Este pago no tiene un reembolso procesado');
      }

      if (pago.reembolso.mercadopagoRefundId) {
        throw new Error('No se puede cancelar un reembolso ya procesado en MercadoPago');
      }

      // Revertir estado
      pago.estado = 'aprobado';
      pago.reembolso.realizado = false;
      pago.reembolso.cancelado = true;
      pago.reembolso.motivoCancelacion = motivo;
      pago.notas = `${pago.notas || ''}\nReembolso cancelado: ${motivo}`;

      await pago.save();

      // Actualizar reserva
      const reserva = await Booking.findById(pago.reserva);
      reserva.montoPagado += pago.reembolso.monto;
      reserva.montoPendiente = reserva.montoTotal - reserva.montoPagado;
      await reserva.save();

      // Log de auditoría
      await AuditLog.create({
        usuario: userId,
        accion: 'reembolso_cancelado',
        entidad: { tipo: 'Payment', id: pago._id },
        descripcion: `Reembolso cancelado - ${pago.numeroPago} - Motivo: ${motivo}`,
        nivel: 'warning'
      });

      return pago;

    } catch (error) {
      console.error('Error cancelando reembolso:', error);
      throw error;
    }
  }
}