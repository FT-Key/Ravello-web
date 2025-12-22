// routes/payment.routes.js
import express from 'express';
import { paymentController } from '../controllers/index.js';
import {
  authenticate,
  authorize,
  paginationMiddleware,
  queryMiddleware,
  searchMiddleware,
  validateRequest
} from '../middlewares/index.js';
import {
  crearPreferenciaValidation,
  registrarPagoPresencialValidation,
  cancelarPagoValidation,
  reembolsoValidation
} from '../validations/index.js';

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

// Crear preferencia de MercadoPago
router.post(
  '/mercadopago/preference',
  authenticate,
  validateRequest(crearPreferenciaValidation),
  paymentController.crearPreferenciaMercadoPago
);

// Registrar pago presencial (solo admin/editor)
router.post(
  '/presencial',
  authenticate,
  authorize(['admin', 'editor']),
  validateRequest(registrarPagoPresencialValidation),
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
  authorize(['admin']),
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
  authorize(['admin']),
  validateRequest(cancelarPagoValidation),
  paymentController.cancelarPago
);

// Procesar reembolso (solo admin)
router.post(
  '/:id/reembolso',
  authenticate,
  authorize(['admin']),
  validateRequest(reembolsoValidation),
  paymentController.procesarReembolso
);

export default router;