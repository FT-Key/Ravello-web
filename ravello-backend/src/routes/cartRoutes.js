import express from "express";
import * as cartController from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", cartController.getCart);
router.post("/:userId", cartController.addItem);
router.delete("/:userId/:productId", cartController.removeItem);
router.delete("/:userId", cartController.clearCart);

export default router;
