// ============================================
// 2. services/payment/validators/payment.validator.js
// ============================================
import { User, Booking } from '../../../models/index.js';

export class PaymentValidator {
  static async validateUser(userId, session) {
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    const usuario = await User.findById(userId).session(session);
    if (!usuario || !usuario.activo) {
      throw new Error('Usuario no válido o deshabilitado');
    }

    return usuario;
  }

  static async validateBooking(reservaId, session) {
    const reserva = await Booking.findById(reservaId)
      .populate('paquete')
      .populate('fechaSalida')
      .session(session);

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    if (reserva.estado === 'cancelada') {
      throw new Error('No se pueden hacer pagos en reservas canceladas');
    }

    return reserva;
  }

  static validatePermissions(reserva, userId, userRole) {
    if (reserva.usuario.toString() !== userId && userRole !== 'admin') {
      throw new Error('No tiene permisos para realizar pagos en esta reserva');
    }
  }

  static validateAmount(montoPago, montoPendiente) {
    if (montoPago > montoPendiente) {
      throw new Error('El monto del pago excede el saldo pendiente');
    }
  }
}