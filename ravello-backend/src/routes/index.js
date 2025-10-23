import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import packageRoutes from "./packageRoutes.js";
import orderRoutes from "./orderRoutes.js";
import quoteRoutes from "./quoteRoutes.js";
import favoriteRoutes from "./favoriteRoutes.js";
import cartRoutes from "./cartRoutes.js";
import paymentRoutes from "./paymentRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/packages", packageRoutes);
router.use("/orders", orderRoutes);
router.use("/quotes", quoteRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/cart", cartRoutes);
router.use("/payments", paymentRoutes);

export default router;
