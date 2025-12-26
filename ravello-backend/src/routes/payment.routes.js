// routes/payment.routes.js
import express from 'express';
import { paymentController } from '../controllers/index.js';
import {
  authenticate,
  requireRole,
  paginationMiddleware,
  queryMiddleware,
  searchMiddleware,
  // validateRequest // TODO: Agregar cuando estén las validaciones
} from '../middlewares/index.js';

// TODO: Descomentar cuando estén listas las validaciones
// import {
//   crearPreferenciaValidation,
//   registrarPagoPresencialValidation,
//   cancelarPagoValidation,
//   reembolsoValidation
// } from '../validations/index.js';

const router = express.Router();

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================

// Webhook de MercadoPago (NO requiere autenticación)
router.post('/webhook/mercadopago', paymentController.webhookMercadoPago);

// Verificar estado de pago (para frontend después de pago)
router.get('/verificar/:numeroPago', paymentController.verificarEstadoPago);

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================

// Crear pago con Bricks (inline payment)
router.post(
  '/mercadopago/brick',
  authenticate,
  paymentController.crearPagoBrick
);

// Crear preferencia de MercadoPago
router.post(
  '/mercadopago/preference',
  authenticate,
  // validateRequest(crearPreferenciaValidation), // TODO: Agregar validación
  paymentController.crearPreferenciaMercadoPago
);

// Registrar pago presencial (solo admin/editor)
router.post(
  '/presencial',
  authenticate,
  requireRole('admin', 'editor'),
  // validateRequest(registrarPagoPresencialValidation), // TODO: Agregar validación
  paymentController.registrarPagoPresencial
);

// Obtener pagos de una reserva
router.get(
  '/reserva/:reservaId',
  authenticate,
  paymentController.obtenerPagosPorReserva
);

// Obtener todos los pagos con filtros (solo admin)
router.get(
  '/',
  authenticate,
  requireRole('admin'),
  queryMiddleware,
  searchMiddleware,
  paginationMiddleware,
  paymentController.obtenerTodosPagos
);

// Obtener un pago por ID
router.get(
  '/:id',
  authenticate,
  paymentController.obtenerPagoPorId
);

// Cancelar pago (solo admin)
router.patch(
  '/:id/cancelar',
  authenticate,
  requireRole('admin'),
  // validateRequest(cancelarPagoValidation), // TODO: Agregar validación
  paymentController.cancelarPago
);

// Procesar reembolso (solo admin)
router.post(
  '/:id/reembolso',
  authenticate,
  requireRole('admin'),
  // validateRequest(reembolsoValidation), // TODO: Agregar validación
  paymentController.procesarReembolso
);

export default router;