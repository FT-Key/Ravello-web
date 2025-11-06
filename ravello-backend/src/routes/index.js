import express from 'express';

import packageRoutes from './package.route.js';
import reviewRoutes from './review.route.js';
import contactMessageRoutes from './contactMessage.route.js';
import userRoutes from './user.route.js';
import featuredRoutes from './featured.route.js';
import offerRoutes from './offer.route.js';

const router = express.Router();

router.use('/packages', packageRoutes);
router.use('/reviews', reviewRoutes);
router.use('/contacts', contactMessageRoutes);
router.use('/users', userRoutes);
router.use('/featured', featuredRoutes);
router.use('/offers', offerRoutes);

export default router;
