// routes/booking.route.js
import express from 'express';
import { bookingController } from '../controllers/index.js';
import { 
  authenticate, 
  authorize,
  paginationMiddleware,
  queryMiddleware,
  searchMiddleware
} from '../middlewares/index.js';

const router = express.Router();

// ============================================
// RUTAS PÚBLICAS
// ============================================

// Obtener reserva por número (para que el cliente pueda ver su reserva)
router.get('/numero/:numeroReserva', bookingController.obtenerPorNumero);

// ============================================
// RUTAS PROTEGIDAS
// ============================================

// Crear nueva reserva
router.post(
  '/',
  authenticate,
  bookingController.crearReserva
);

// Obtener todas las reservas (admin)
router.get(
  '/',
  authenticate,
  authorize(['admin', 'editor']),
  queryMiddleware,
  searchMiddleware,
  paginationMiddleware,
  bookingController.obtenerTodasReservas
);

// Obtener reservas del usuario actual
router.get(
  '/mis-reservas',
  authenticate,
  bookingController.obtenerMisReservas
);

// Obtener una reserva por ID
router.get(
  '/:id',
  authenticate,
  bookingController.obtenerReservaPorId
);

// Actualizar reserva
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'editor']),
  bookingController.actualizarReserva
);

// Cancelar reserva
router.patch(
  '/:id/cancelar',
  authenticate,
  bookingController.cancelarReserva
);

// Confirmar reserva (admin)
router.patch(
  '/:id/confirmar',
  authenticate,
  authorize(['admin', 'editor']),
  bookingController.confirmarReserva
);

// Eliminar reserva (solo admin)
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  bookingController.eliminarReserva
);

export default router;