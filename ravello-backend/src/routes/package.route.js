import express from 'express';
import { packageController } from '../controllers/index.js';
import { paginationMiddleware, searchMiddleware, queryMiddleware, validateRequest, } from '../middlewares/index.js';
import { packageSchema } from '../validations/index.js';

const router = express.Router();

// GET /packages → lista todos los paquetes con query, search y pagination
router.get(
  '/',
  queryMiddleware,
  searchMiddleware,
  paginationMiddleware,
  packageController.getPackages
);

// GET /packages/promotions → promociones activas con filtros, búsqueda y paginación
router.get(
  '/promotions',
  queryMiddleware,
  searchMiddleware,
  paginationMiddleware,
  packageController.getPromotions
);

router.get("/destinos/list", packageController.getDestinosUnicos);

// GET /packages/:id → obtener un paquete por ID
router.get('/:id', packageController.getPackage);


// POST /packages → crear paquete (valida request)
router.post(
  '/',
  validateRequest(packageSchema),
  packageController.createPackage
);

// PUT /packages/:id → actualizar paquete (valida request)
router.put(
  '/:id',
  validateRequest(packageSchema),
  packageController.updatePackage
);

// DELETE /packages/:id → eliminar paquete
router.delete('/:id', packageController.deletePackage);

export default router;
