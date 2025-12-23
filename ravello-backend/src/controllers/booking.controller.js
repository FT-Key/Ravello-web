// controllers/booking.controller.js
import { bookingService } from '../services/index.js';
import { Booking } from '../models/index.js';

// ============================================
// CREAR RESERVA
// ============================================
export const crearReserva = async (req, res) => {
  try {
    const userId = req.user?._id;
    const reserva = await bookingService.crearReserva(req.body, userId);

    res.status(201).json({
      success: true,
      message: 'Reserva creada exitosamente',
      data: reserva
    });

  } catch (error) {
    console.error('Error en crearReserva:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// OBTENER TODAS LAS RESERVAS (con filtros)
// ============================================
export const obtenerTodasReservas = async (req, res) => {
  try {
    const { queryOptions, searchFilter, pagination } = req;
    
    const allowedFilters = ['estado', 'paquete', 'fechaSalida'];
    const filters = Object.fromEntries(
      Object.entries(queryOptions.raw).filter(([key]) => allowedFilters.includes(key))
    );

    const query = {
      ...queryOptions.filters,
      ...filters,
      ...searchFilter
    };

    const total = await Booking.countDocuments(query);

    let mongoQuery = Booking.find(query)
      .populate('paquete', 'nombre imagenPrincipal')
      .populate('fechaSalida', 'salida regreso')
      .populate('usuario', 'nombre email')
      .sort(queryOptions.sort);

    if (pagination) {
      mongoQuery = mongoQuery
        .skip(pagination.skip)
        .limit(pagination.limit);
    }

    const items = await mongoQuery;

    res.json({
      success: true,
      total,
      page: pagination?.page || null,
      limit: pagination?.limit || null,
      items
    });

  } catch (error) {
    console.error('Error en obtenerTodasReservas:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// OBTENER MIS RESERVAS (usuario actual)
// ============================================
export const obtenerMisReservas = async (req, res) => {
  try {
    const userId = req.user._id;
    const reservas = await bookingService.obtenerReservasPorUsuario(userId);

    res.json({
      success: true,
      data: reservas
    });

  } catch (error) {
    console.error('Error en obtenerMisReservas:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// OBTENER RESERVA POR ID
// ============================================
export const obtenerReservaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await bookingService.obtenerReservaPorId(id);

    // Verificar permisos: solo el dueño o admin/editor pueden ver
    const esAdmin = ['admin', 'editor'].includes(req.user.rol);
    const esDueno = reserva.usuario?.toString() === req.user._id.toString();

    if (!esAdmin && !esDueno) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver esta reserva'
      });
    }

    res.json({
      success: true,
      data: reserva
    });

  } catch (error) {
    console.error('Error en obtenerReservaPorId:', error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// OBTENER POR NÚMERO DE RESERVA (público)
// ============================================
export const obtenerPorNumero = async (req, res) => {
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

    // Devolver solo información pública
    const reservaPublica = {
      numeroReserva: reserva.numeroReserva,
      estado: reserva.estado,
      paquete: reserva.paquete,
      fechaSalida: reserva.fechaSalida,
      cantidadPasajeros: reserva.cantidadPasajeros,
      montoTotal: reserva.montoTotal,
      montoPagado: reserva.montoPagado,
      montoPendiente: reserva.montoPendiente,
      moneda: reserva.moneda,
      planCuotas: {
        tipo: reserva.planCuotas.tipo,
        cantidadCuotas: reserva.planCuotas.cantidadCuotas,
        cuotas: reserva.planCuotas.cuotas.map(c => ({
          numeroCuota: c.numeroCuota,
          monto: c.monto,
          fechaVencimiento: c.fechaVencimiento,
          estado: c.estado,
          montoPagado: c.montoPagado,
          montoPendiente: c.montoPendiente
        }))
      }
    };

    res.json({
      success: true,
      data: reservaPublica
    });

  } catch (error) {
    console.error('Error obteniendo reserva por número:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// ACTUALIZAR RESERVA
// ============================================
export const actualizarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const reserva = await bookingService.actualizarReserva(id, req.body, userId);

    res.json({
      success: true,
      message: 'Reserva actualizada exitosamente',
      data: reserva
    });

  } catch (error) {
    console.error('Error en actualizarReserva:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// CANCELAR RESERVA
// ============================================
export const cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    const userId = req.user._id;

    const reserva = await bookingService.cancelarReserva(id, motivo, userId);

    res.json({
      success: true,
      message: 'Reserva cancelada exitosamente',
      data: reserva
    });

  } catch (error) {
    console.error('Error en cancelarReserva:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// CONFIRMAR RESERVA
// ============================================
export const confirmarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const reserva = await bookingService.confirmarReserva(id, userId);

    res.json({
      success: true,
      message: 'Reserva confirmada exitosamente',
      data: reserva
    });

  } catch (error) {
    console.error('Error en confirmarReserva:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// ELIMINAR RESERVA
// ============================================
export const eliminarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    await bookingService.eliminarReserva(id, userId);

    res.json({
      success: true,
      message: 'Reserva eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error en eliminarReserva:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};