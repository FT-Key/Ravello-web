// ============================================
// 7. services/payment/handlers/payment-application.handler.js
// ============================================
import { Booking, AuditLog } from '../../../models/index.js';
import { PaymentNotifications } from '../notifications/payment.notifications.js';

export class PaymentApplicationHandler {
  static async apply(pago, session) {
    const reserva = await Booking.findById(pago.reserva).session(session);

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    await reserva.registrarPago(pago.monto, pago._id);
    await reserva.save({ session });

    // Notificar de forma asíncrona
    setImmediate(() => {
      PaymentNotifications.sendPaymentConfirmation(reserva, pago)
        .catch(err => console.error('Error enviando email:', err));
    });

    await AuditLog.create([{
      accion: 'pago_aprobado',
      entidad: { tipo: 'Payment', id: pago._id },
      descripcion: `Pago aprobado y aplicado a reserva ${reserva.numeroReserva} - Monto: ${pago.monto} ${pago.moneda}`,
      nivel: 'info'
    }], { session });

    console.log(`✅ Pago ${pago.numeroPago} aplicado a reserva ${reserva.numeroReserva}`);
  }
}
