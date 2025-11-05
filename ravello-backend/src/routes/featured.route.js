// routes/featuredRoutes.js
import express from 'express';
import { featuredController } from '../controllers/index.js';

const router = express.Router();

// 👇 Ruta pública (para la homepage)
router.get('/active', featuredController.getActiveFeatured);

// 👇 Rutas administrativas
router.get('/', featuredController.getAllFeatured);
router.post('/', featuredController.createFeatured);
router.put('/:id', featuredController.updateFeatured);
router.delete('/:id', featuredController.deleteFeatured);

export default router;
