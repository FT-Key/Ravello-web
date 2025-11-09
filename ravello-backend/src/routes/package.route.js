import express from 'express';
import { packageController } from '../controllers/index.js';
import { paginationMiddleware } from "../middlewares/pagination.js";
import { searchMiddleware } from "../middlewares/search.js";
import { queryMiddleware } from "../middlewares/query.js";

const router = express.Router();

router.get('/', packageController.getPackages);
router.get('/promotions', queryMiddleware, searchMiddleware, paginationMiddleware, packageController.getPromotions);
router.get('/:id', packageController.getPackage);
router.post('/', packageController.createPackage);
router.put('/:id', packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);

export default router;
