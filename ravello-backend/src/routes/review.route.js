import express from "express";
import { reviewController } from "../controllers/index.js";

const router = express.Router();

router.get("/", reviewController.getReviews);
router.get("/:id", reviewController.getReviewById);
router.post("/", reviewController.createReview);
router.put("/:id", reviewController.updateReview);
router.put("/:id/moderar", reviewController.moderarReview);
router.delete("/:id", reviewController.deleteReview);

export default router;
