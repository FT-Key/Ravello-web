import express from 'express';

import packageRoutes from './package.route.js';
import packageDateRoutes from './packageDate.routes.js';
import reviewRoutes from './review.route.js';
import contactMessageRoutes from './contactMessage.route.js';
import userRoutes from './user.route.js';
import featuredRoutes from './featured.route.js';
import offerRoutes from './offer.route.js';
import featuredPromotionsRoutes from './featuredPromotions.route.js';
import newsletterRoutes from './newsletter.route.js';

const router = express.Router();

router.use('/packages', packageRoutes);
router.use('/package-dates', packageDateRoutes);
router.use('/reviews', reviewRoutes);
router.use('/contacts', contactMessageRoutes);
router.use('/users', userRoutes);
router.use('/featured-promotions', featuredPromotionsRoutes);
router.use('/featured', featuredRoutes);
router.use('/offers', offerRoutes);
router.use('/newsletter', newsletterRoutes);

export default router;
