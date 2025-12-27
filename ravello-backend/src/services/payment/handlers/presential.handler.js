// services/payment/handlers/presential.handler.js
import { Payment, Booking, AuditLog, User } from '../../../models/index.js';
import { PaymentNotifications } from '../notifications/payment.notifications.js';

/**
 * Handler para pagos presenciales (efectivo, tarjeta en local, transferencia)
 */
export class PresentialHandler {

  /**
   * Registra un pago presencial
   * @param {Object} data - Datos del pago
   * @param {string} userId - ID del usuario que registra el pago
   * @returns {Promise<Payment>}
   */
  static async register(data, userId) {
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

      // Validar reserva
      const reserva = await Booking.findById(reservaId);

      if (!reserva) {
        throw new Error('Reserva no encontrada');
      }

      // Validar que el monto no exceda lo pendiente
      if (monto > reserva.montoPendiente) {
        throw new Error('El monto del pago excede el saldo pendiente');
      }

      // Validar método de pago presencial
      const metodosValidos = ['efectivo', 'tarjeta_presencial', 'transferencia'];
      if (!metodosValidos.includes(metodoPago)) {
        throw new Error(`Método de pago inválido. Debe ser: ${metodosValidos.join(', ')}`);
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
          metodo: detallePresencial.metodo || metodoPago,
          usuarioRecibio: userId,
          ...detallePresencial
        },
        notas,
        fechaRegistro: new Date()
      });

      await pago.save();

      // Aplicar pago a la reserva
      await reserva.registrarPago(monto, pago._id);

      // Obtener usuario para el log
      const usuario = await User.findById(userId);

      // Enviar email de confirmación
      await PaymentNotifications.sendPaymentConfirmation(reserva, pago);

      // Log de auditoría
      await AuditLog.create({
        usuario: userId,
        usuarioEmail: usuario?.email,
        accion: 'pago_aprobado',
        entidad: { tipo: 'Payment', id: pago._id },
        descripcion: `Pago presencial registrado - Reserva: ${reserva.numeroReserva} - Monto: ${monto} ${reserva.moneda} - Método: ${metodoPago}`,
        nivel: 'info',
        metadata: {
          metodoPago,
          detallePresencial
        }
      });

      console.log(`✅ Pago presencial ${pago.numeroPago} registrado para reserva ${reserva.numeroReserva}`);

      return pago;

    } catch (error) {
      console.error('Error registrando pago presencial:', error);
      throw error;
    }
  }

  /**
   * Valida los datos del pago presencial
   * @param {Object} data - Datos a validar
   * @throws {Error} Si los datos son inválidos
   */
  static validatePresentialData(data) {
    const required = ['reservaId', 'monto', 'tipoPago', 'metodoPago'];

    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Campo requerido faltante: ${field}`);
      }
    }

    if (data.monto <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }

    const tiposPagoValidos = ['senia', 'cuota', 'saldo', 'total'];
    if (!tiposPagoValidos.includes(data.tipoPago)) {
      throw new Error(`Tipo de pago inválido. Debe ser: ${tiposPagoValidos.join(', ')}`);
    }

    if (data.tipoPago === 'cuota' && !data.numeroCuota) {
      throw new Error('Para pagos de cuota debe especificar el número de cuota');
    }
  }

  /**
   * Obtiene el nombre descriptivo del método de pago
   * @param {string} metodoPago - Código del método de pago
   * @returns {string}
   */
  static getMetodoPagoNombre(metodoPago) {
    const nombres = {
      'efectivo': 'Efectivo',
      'tarjeta_presencial': 'Tarjeta de Crédito/Débito',
      'transferencia': 'Transferencia Bancaria'
    };

    return nombres[metodoPago] || metodoPago;
  }

  /**
   * Genera un comprobante de pago presencial
   * @param {string} pagoId - ID del pago
   * @returns {Promise<Object>} Datos del comprobante
   */
  static async generarComprobante(pagoId) {
    try {
      const pago = await Payment.findById(pagoId)
        .populate('reserva')
        .populate('usuarioRegistro', 'nombre email');

      if (!pago) {
        throw new Error('Pago no encontrado');
      }

      if (!pago.presencial) {
        throw new Error('Este no es un pago presencial');
      }

      const reserva = pago.reserva;

      const comprobante = {
        numeroPago: pago.numeroPago,
        numeroReserva: reserva.numeroReserva,
        fecha: pago.fechaRegistro,
        cliente: {
          nombre: reserva.datosContacto.nombre,
          apellido: reserva.datosContacto.apellido,
          documento: reserva.datosContacto.documento
        },
        monto: pago.monto,
        moneda: pago.moneda,
        metodoPago: this.getMetodoPagoNombre(pago.metodoPago),
        tipoPago: pago.tipoPago,
        numeroCuota: pago.numeroCuota,
        usuarioRecibio: pago.usuarioRegistro?.nombre,
        detalles: pago.presencial,
        notas: pago.notas
      };

      // TODO: Aquí podrías generar un PDF usando una librería como pdfkit
      // import PDFDocument from 'pdfkit';
      // const doc = new PDFDocument();
      // ...

      return comprobante;

    } catch (error) {
      console.error('Error generando comprobante:', error);
      throw error;
    }
  }

  /**
   * Lista pagos presenciales con filtros
   * @param {Object} filtros - Filtros de búsqueda
   * @returns {Promise<Array>}
   */
  static async listar(filtros = {}) {
    try {
      const query = {
        metodoPago: { $in: ['efectivo', 'tarjeta_presencial', 'transferencia'] }
      };

      if (filtros.fechaDesde) {
        query.fechaRegistro = { $gte: new Date(filtros.fechaDesde) };
      }

      if (filtros.fechaHasta) {
        query.fechaRegistro = {
          ...query.fechaRegistro,
          $lte: new Date(filtros.fechaHasta)
        };
      }

      if (filtros.metodoPago) {
        query.metodoPago = filtros.metodoPago;
      }

      if (filtros.usuarioRecibio) {
        query['presencial.usuarioRecibio'] = filtros.usuarioRecibio;
      }

      const pagos = await Payment.find(query)
        .populate('reserva', 'numeroReserva datosContacto')
        .populate('usuarioRegistro', 'nombre email')
        .sort({ fechaRegistro: -1 })
        .limit(filtros.limit || 100);

      return pagos;

    } catch (error) {
      console.error('Error listando pagos presenciales:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de pagos presenciales
   * @param {Object} filtros - Filtros temporales
   * @returns {Promise<Object>}
   */
  static async obtenerEstadisticas(filtros = {}) {
    try {
      const query = {
        metodoPago: { $in: ['efectivo', 'tarjeta_presencial', 'transferencia'] },
        estado: 'aprobado'
      };

      if (filtros.fechaDesde) {
        query.fechaRegistro = { $gte: new Date(filtros.fechaDesde) };
      }

      if (filtros.fechaHasta) {
        query.fechaRegistro = {
          ...query.fechaRegistro,
          $lte: new Date(filtros.fechaHasta)
        };
      }

      const pagos = await Payment.find(query);

      const estadisticas = {
        total: pagos.length,
        montoTotal: pagos.reduce((sum, p) => sum + p.monto, 0),
        porMetodo: {},
        porUsuario: {}
      };

      pagos.forEach(pago => {
        // Por método
        estadisticas.porMetodo[pago.metodoPago] =
          (estadisticas.porMetodo[pago.metodoPago] || 0) + pago.monto;

        // Por usuario que recibió
        const usuarioId = pago.presencial?.usuarioRecibio?.toString();
        if (usuarioId) {
          if (!estadisticas.porUsuario[usuarioId]) {
            estadisticas.porUsuario[usuarioId] = {
              cantidad: 0,
              monto: 0
            };
          }
          estadisticas.porUsuario[usuarioId].cantidad++;
          estadisticas.porUsuario[usuarioId].monto += pago.monto;
        }
      });

      return estadisticas;

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
}