// controllers/booking.controller.js
import { bookingService } from '../services/index.js';

const {
  crearReserva,
  obtenerReservasPorUsuario,
  obtenerReservaPorId,
  actualizarReserva,
  confirmarReserva,
  cancelarReserva,
  eliminarReserva
} = bookingService;

// ============================================
// HELPER: EXTRAER METADATA DE SEGURIDAD
// ============================================
function extraerMetadata(req) {
  return {
    ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    origin: req.headers.origin,
    referer: req.headers.referer,
    acceptLanguage: req.headers['accept-language']
  };
}

// ============================================
// CREAR RESERVA
// ============================================
export async function crearReservaController(req, res) {
  try {
    const userId = req.user?._id;

    // Verificar autenticación
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Debe iniciar sesión para crear una reserva'
      });
    }

    // Verificar perfil completo
    if (!req.user.perfilCompleto) {
      return res.status(400).json({
        success: false,
        message: 'Debe completar su perfil antes de hacer una reserva',
        camposFaltantes: req.user.camposFaltantes(),
        perfilCompleto: false
      });
    }

    // Verificar que puede reservar
    if (!req.user.puedeReservar()) {
      return res.status(403).json({
        success: false,
        message: 'No puede realizar reservas en este momento. Contacte al administrador.',
        activo: req.user.activo
      });
    }

    // Extraer metadata del request
    const metadata = extraerMetadata(req);

    // Crear reserva
    const reserva = await crearReserva(req.body, req.user, metadata);

    return res.status(201).json({
      success: true,
      message: 'Reserva creada exitosamente',
      data: reserva
    });

  } catch (error) {
    console.error('❌ Error en crearReservaController:', error);

    // Errores específicos
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('no está disponible') ||
      error.message.includes('cupos disponibles')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    // Error genérico
    return res.status(400).json({
      success: false,
      message: error.message || 'Error al crear la reserva'
    });
  }
}

// ============================================
// OBTENER MIS RESERVAS
// ============================================
export async function obtenerMisReservasController(req, res) {
  try {
    const userId = req.user._id;

    const reservas = await obtenerReservasPorUsuario(userId);

    return res.json({
      success: true,
      data: reservas
    });

  } catch (error) {
    console.error('Error en obtenerMisReservasController:', error);

    return res.status(500).json({
      success: false,
      message: 'Error al obtener las reservas'
    });
  }
}

// ============================================
// OBTENER RESERVA POR ID
// ============================================
export async function obtenerReservaPorIdController(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.rol;

    const reserva = await obtenerReservaPorId(id);

    // Verificar permisos: solo el dueño o admin puede ver la reserva
    if (reserva.usuario.toString() !== userId.toString() && userRole !== 'admin' && userRole !== 'editor') {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para ver esta reserva'
      });
    }

    return res.json({
      success: true,
      data: reserva
    });

  } catch (error) {
    console.error('Error en obtenerReservaPorIdController:', error);

    return res.status(404).json({
      success: false,
      message: error.message || 'Reserva no encontrada'
    });
  }
}

// ============================================
// OBTENER TODAS LAS RESERVAS (ADMIN)
// ============================================
export async function obtenerTodasReservasController(req, res) {
  try {
    const { filters, pagination } = req;

    // Aquí implementarías la lógica de filtrado y paginación
    // Por ahora retornamos todas
    const reservas = await Booking.find(filters || {})
      .populate('paquete', 'nombre imagenPrincipal')
      .populate('fechaSalida', 'salida regreso')
      .populate('usuario', 'nombre email')
      .limit(pagination?.limit || 50)
      .skip(pagination?.skip || 0)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(filters || {});

    return res.json({
      success: true,
      data: reservas,
      pagination: {
        total,
        page: pagination?.page || 1,
        limit: pagination?.limit || 50,
        totalPages: Math.ceil(total / (pagination?.limit || 50))
      }
    });

  } catch (error) {
    console.error('Error en obtenerTodasReservasController:', error);

    return res.status(500).json({
      success: false,
      message: 'Error al obtener las reservas'
    });
  }
}

// ============================================
// OBTENER POR NÚMERO DE RESERVA (PÚBLICO)
// ============================================
export async function obtenerPorNumeroController(req, res) {
  try {
    const { numeroReserva } = req.params;

    const reserva = await Booking.findOne({ numeroReserva })
      .populate('paquete', 'nombre imagenPrincipal destinos')
      .populate('fechaSalida', 'salida regreso');

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    // Retornar solo info básica (sin datos sensibles)
    return res.json({
      success: true,
      data: {
        numeroReserva: reserva.numeroReserva,
        estado: reserva.estado,
        paquete: reserva.paquete,
        fechaSalida: reserva.fechaSalida,
        montoTotal: reserva.montoTotal,
        montoPagado: reserva.montoPagado,
        montoPendiente: reserva.montoPendiente,
        moneda: reserva.moneda
      }
    });

  } catch (error) {
    console.error('Error en obtenerPorNumeroController:', error);

    return res.status(500).json({
      success: false,
      message: 'Error al buscar la reserva'
    });
  }
}

// ============================================
// ACTUALIZAR RESERVA
// ============================================
export async function actualizarReservaController(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const reserva = await actualizarReserva(id, req.body, userId);

    return res.json({
      success: true,
      message: 'Reserva actualizada exitosamente',
      data: reserva
    });

  } catch (error) {
    console.error('Error en actualizarReservaController:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Error al actualizar la reserva'
    });
  }
}

// ============================================
// CONFIRMAR RESERVA (ADMIN)
// ============================================
export async function confirmarReservaController(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const reserva = await confirmarReserva(id, userId);

    return res.json({
      success: true,
      message: 'Reserva confirmada exitosamente',
      data: reserva
    });

  } catch (error) {
    console.error('Error en confirmarReservaController:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Error al confirmar la reserva'
    });
  }
}

// ============================================
// CANCELAR RESERVA
// ============================================
export async function cancelarReservaController(req, res) {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    const userId = req.user._id;

    const reserva = await cancelarReserva(id, motivo, userId);

    return res.json({
      success: true,
      message: 'Reserva cancelada exitosamente',
      data: reserva
    });

  } catch (error) {
    console.error('Error en cancelarReservaController:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Error al cancelar la reserva'
    });
  }
}

// ============================================
// ELIMINAR RESERVA (SOLO ADMIN)
// ============================================
export async function eliminarReservaController(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    await eliminarReserva(id, userId);

    return res.json({
      success: true,
      message: 'Reserva eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error en eliminarReservaController:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Error al eliminar la reserva'
    });
  }
}

// Exportar todo junto
export default {
  crearReserva: crearReservaController,
  obtenerMisReservas: obtenerMisReservasController,
  obtenerReservaPorId: obtenerReservaPorIdController,
  obtenerTodasReservas: obtenerTodasReservasController,
  obtenerPorNumero: obtenerPorNumeroController,
  actualizarReserva: actualizarReservaController,
  confirmarReserva: confirmarReservaController,
  cancelarReserva: cancelarReservaController,
  eliminarReserva: eliminarReservaController
};