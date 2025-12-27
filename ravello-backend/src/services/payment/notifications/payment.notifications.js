// ============================================
// 8. services/payment/notifications/payment.notifications.js
// ============================================
import { sendEmail } from '../../email.service.js';

export class PaymentNotifications {
  static async sendPaymentConfirmation(reserva, pago) {
    return sendEmail({
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
  }

  static async sendPaymentRejection(reserva, pago) {
    return sendEmail({
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
  }

  static async sendRefundConfirmation(reserva, pago, montoReembolsado, motivo) {
    return sendEmail({
      to: reserva.datosContacto.email,
      subject: `Reembolso procesado - Reserva ${reserva.numeroReserva}`,
      template: 'reembolso-confirmado',
      data: {
        nombreCliente: reserva.datosContacto.nombre,
        numeroReserva: reserva.numeroReserva,
        montoReembolsado,
        moneda: pago.moneda,
        motivo,
        numeroPago: pago.numeroPago
      }
    });
  }
}