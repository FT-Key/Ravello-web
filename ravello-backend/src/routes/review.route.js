import express from 'express';
import { reviewController } from '../controllers/index.js';

const router = express.Router();

router.get('/', reviewController.getReviews);
router.post('/', reviewController.createReview);
router.put('/:id/hide', reviewController.hideReview);
router.delete('/:id', reviewController.deleteReview);

export default router;
