import express from 'express';
import { featuredController } from '../controllers/index.js';
import { validateRequest, paginationMiddleware, queryMiddleware, searchMiddleware } from '../middlewares/index.js';
import { featuredSchema } from '../validations/index.js';

const router = express.Router();

// 👇 Ruta pública (homepage) con opcional paginación, query y search
router.get(
  '/active',
  queryMiddleware,
  searchMiddleware,
  paginationMiddleware,
  featuredController.getActiveFeatured
);

// 👇 Rutas administrativas
router.get('/', queryMiddleware, searchMiddleware, paginationMiddleware, featuredController.getAllFeatured);
router.post('/', validateRequest(featuredSchema), featuredController.createFeatured);
router.put('/:id', validateRequest(featuredSchema), featuredController.updateFeatured);
router.delete('/:id', featuredController.deleteFeatured);

export default router;
