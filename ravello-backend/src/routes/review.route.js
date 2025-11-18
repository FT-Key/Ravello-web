// routes/reviewRoutes.js
import express from "express";
import { reviewController } from "../controllers/index.js";
import { validateRequest } from "../middlewares/index.js";
import { createReviewSchema, updateReviewSchema } from "../validations/index.js"; // ⚠️ Asegúrate de que esta línea esté
import { paginationMiddleware } from "../middlewares/pagination.js";
import { queryMiddleware } from "../middlewares/query.js";
import { searchMiddleware } from "../middlewares/search.js";

const router = express.Router();

// GET /api/review → con filtros, búsqueda y paginación
router.get("/", queryMiddleware, searchMiddleware, paginationMiddleware, reviewController.getReviews);

// GET /api/review/:id
router.get("/:id", reviewController.getReviewById);

// POST /api/review → validar ⚠️ Aquí debe estar el middleware
router.post("/", validateRequest(createReviewSchema), reviewController.createReview);

// PUT /api/review/:id → validar
router.put("/:id", validateRequest(updateReviewSchema), reviewController.updateReview);

// PUT /api/review/:id/moderar → moderar estado
router.put("/:id/moderar", reviewController.moderarReview);

// DELETE /api/review/:id
router.delete("/:id", reviewController.deleteReview);

export default router;