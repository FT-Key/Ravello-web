import express from 'express';
import { featuredPromotionsController } from '../controllers/index.js';
import { validateRequest, paginationMiddleware, queryMiddleware, searchMiddleware } from '../middlewares/index.js';
import { featuredPromotionSchema } from '../validations/index.js';

const router = express.Router();

// GET /api/featured-promotions → promoción activa (opcional: filtros, búsqueda y paginación)
router.get(
  '/',
  queryMiddleware,
  searchMiddleware,
  paginationMiddleware,
  featuredPromotionsController.getActive
);

// POST /api/featured-promotions → crear o reemplazar promoción
router.post('/', validateRequest(featuredPromotionSchema), featuredPromotionsController.createOrReplace);

// DELETE /api/featured-promotions/:id → eliminar
router.delete('/:id', featuredPromotionsController.deleteById);

export default router;
