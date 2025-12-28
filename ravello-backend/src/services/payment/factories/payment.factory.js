// ============================================
// 4. services/payment/factories/payment.factory.js
// ============================================
import { Payment } from '../../../models/index.js';

export class PaymentFactory {
  static createPaymentData(reserva, montoPago, tipoPago, numeroCuota, userId, riesgo, infoDispositivo, metadata) {
    return {
      reserva: reserva._id,
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
    };
  }

  static async createPayment(data, session) {
    const pago = new Payment(data);
    await pago.save({ session });
    return pago;
  }
}