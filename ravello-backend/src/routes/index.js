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
import paymentRoutes from './payment.routes.js';
import bookingRoutes from './booking.route.js';

// 🔹 IMPORTANTE: rutas de autenticación
import authRoutes from './auth.route.js';

const router = express.Router();

// --------------------------------------------------
// 🟢 HEALTH CHECK
// --------------------------------------------------
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// --------------------------------------------------
// 🟢 PUBLIC ROUTES (sin autenticación)
// --------------------------------------------------
const publicRouter = express.Router();

publicRouter.get("/info", (req, res) => {
  res.json({ message: "API pública funcionando" });
});

// Montar public
router.use("/public", publicRouter);

// --------------------------------------------------
// 🟢 AUTH ROUTES (login, registro, perfil, etc.)
// --------------------------------------------------
router.use("/auth", authRoutes);

// --------------------------------------------------
// 🟢 API ROUTES
// --------------------------------------------------
router.use('/packages', packageRoutes);
router.use('/package-dates', packageDateRoutes);
router.use('/reviews', reviewRoutes);
router.use('/contacts', contactMessageRoutes);
router.use('/users', userRoutes);
router.use('/featured-promotions', featuredPromotionsRoutes);
router.use('/featured', featuredRoutes);
router.use('/offers', offerRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/payments', paymentRoutes);
router.use('/bookings', bookingRoutes);

export default router;
