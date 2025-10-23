import express from "express";
import { updatePaymentStatus } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/update-status", updatePaymentStatus);

export default router;
