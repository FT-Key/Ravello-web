import express from 'express';
import { offerController } from '../controllers/index.js';

const router = express.Router();

// Obtener todas las ofertas
router.get('/', offerController.getAll);

// Obtener ofertas activas (vigentes)
router.get('/activas', offerController.getActive);

// Obtener una oferta por ID
router.get('/:id', offerController.getById);

// Crear nueva oferta
router.post('/', offerController.create);

// Actualizar oferta
router.put('/:id', offerController.update);

// Eliminar oferta
router.delete('/:id', offerController.remove);

export default router;
