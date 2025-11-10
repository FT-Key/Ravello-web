// routes/newsletter.routes.js
import express from "express";
import { newsletterController } from "../controllers/index.js";

const router = express.Router();

router.get("/", newsletterController.getAll);
router.post("/", newsletterController.create);
router.post("/unsubscribe", newsletterController.unsubscribe); // 👈 cambia de GET a POST
router.patch("/:id/status", newsletterController.toggleStatus);
router.delete("/:id", newsletterController.remove);

export default router;
