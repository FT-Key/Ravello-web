import express from "express";
import { createQuote, getQuotes, updateQuoteStatus } from "../controllers/quoteController.js";

const router = express.Router();

router.get("/", getQuotes);
router.post("/", createQuote);
router.put("/:id/status", updateQuoteStatus);

export default router;
