import express from 'express';
import { packageController } from '../controllers/index.js';

const router = express.Router();

router.get('/', packageController.getPackages);
router.get('/promotions', packageController.getPromotions);
router.get('/:id', packageController.getPackage);
router.post('/', packageController.createPackage);
router.put('/:id', packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);

export default router;
