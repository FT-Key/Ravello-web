import express from 'express';
import { featuredPromotionsController } from '../controllers/index.js';

const router = express.Router();

router.get('/', featuredPromotionsController.getActive);
router.post('/', featuredPromotionsController.createOrReplace);
router.delete('/:id', featuredPromotionsController.deleteById);

export default router;
