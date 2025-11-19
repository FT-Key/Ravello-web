import express from 'express';
import { packageController } from '../controllers/index.js';
import {
  paginationMiddleware,
  searchMiddleware,
  queryMiddleware,
  validateRequest,
} from '../middlewares/index.js';
import { packageSchema } from '../validations/index.js';
import { uploadPackageImages, parseJSONBody } from "../middlewares/index.js";

const router = express.Router();

// LISTADOS
router.get('/', queryMiddleware, searchMiddleware, paginationMiddleware, packageController.getPackages);

router.get('/promotions', queryMiddleware, searchMiddleware, paginationMiddleware, packageController.getPromotions);

router.get("/destinos/list", packageController.getDestinosUnicos);

router.get('/:id', packageController.getPackage);

// CREAR
router.post(
  '/',
  uploadPackageImages,
  parseJSONBody,
  validateRequest(packageSchema),
  packageController.createPackage
);

// EDITAR
router.put(
  '/:id',
  uploadPackageImages,
  parseJSONBody,
  validateRequest(packageSchema),
  packageController.updatePackage
);

// ELIMINAR
router.delete('/:id', packageController.deletePackage);

export default router;
