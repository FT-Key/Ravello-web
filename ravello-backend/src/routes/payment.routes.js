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
// RUTAS PROTEGIDAS - USUARIOS AUTENTICADOS
// ============================================

// Crear preferencia de MercadoPago
router.post(
  '/mercadopago/preference',
  authenticate,
  // validateRequest(crearPreferenciaValidation), // TODO: Agregar validación
  paymentController.crearPreferenciaMercadoPago
);

// Crear pago con Bricks (inline payment)
router.post(
  '/mercadopago/brick',
  authenticate,
  paymentController.crearPagoBrick
);

// Obtener pagos de una reserva (usuario dueño o admin)
router.get(
  '/reserva/:reservaId',
  authenticate,
  paymentController.obtenerPagosPorReserva
);

// Obtener un pago por ID (usuario dueño o admin)
router.get(
  '/:id',
  authenticate,
  paymentController.obtenerPagoPorId
);

// ============================================
// RUTAS PROTEGIDAS - ADMIN/EDITOR
// ============================================

// Registrar pago presencial
router.post(
  '/presencial',
  authenticate,
  requireRole('admin', 'editor'),
  // validateRequest(registrarPagoPresencialValidation), // TODO: Agregar validación
  paymentController.registrarPagoPresencial
);

// Generar comprobante de pago presencial
router.get(
  '/:id/comprobante',
  authenticate,
  requireRole('admin', 'editor'),
  paymentController.generarComprobante
);

// Listar pagos presenciales con filtros
router.get(
  '/presenciales/listar',
  authenticate,
  requireRole('admin', 'editor'),
  paymentController.listarPagosPresenciales
);

// Cancelar pago
router.patch(
  '/:id/cancelar',
  authenticate,
  requireRole('admin'),
  // validateRequest(cancelarPagoValidation), // TODO: Agregar validación
  paymentController.cancelarPago
);

// ============================================
// RUTAS PROTEGIDAS - SOLO ADMIN
// ============================================

// Obtener todos los pagos con filtros
router.get(
  '/admin/todos',
  authenticate,
  requireRole('admin'),
  queryMiddleware,
  searchMiddleware,
  paginationMiddleware,
  paymentController.obtenerTodosPagos
);

// Procesar reembolso
router.post(
  '/:id/reembolso',
  authenticate,
  requireRole('admin'),
  // validateRequest(reembolsoValidation), // TODO: Agregar validación
  paymentController.procesarReembolso
);

// Listar reembolsos con filtros
router.get(
  '/admin/reembolsos',
  authenticate,
  requireRole('admin'),
  paymentController.listarReembolsos
);

// Verificar estado de pago en MercadoPago
router.get(
  '/:id/verificar-mp',
  authenticate,
  requireRole('admin'),
  paymentController.verificarEstadoMP
);

// Reenviar notificación de pago
router.post(
  '/:id/reenviar-notificacion',
  authenticate,
  requireRole('admin'),
  paymentController.reenviarNotificacion
);

// Obtener estadísticas de pagos
router.get(
  '/admin/estadisticas',
  authenticate,
  requireRole('admin'),
  paymentController.obtenerEstadisticas
);

// Reintentar procesamiento de webhook
router.post(
  '/:id/reintentar-webhook',
  authenticate,
  requireRole('admin'),
  paymentController.reintentarWebhook
);

export default router;