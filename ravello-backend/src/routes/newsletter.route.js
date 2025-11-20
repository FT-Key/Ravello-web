import express from "express";
import { newsletterController } from "../controllers/index.js";
import { validateRequest } from "../middlewares/index.js";
import { newsletterSchema } from "../validations/index.js";

const router = express.Router();

// GET /api/newsletter → todos los suscriptores
router.get("/", newsletterController.getAll);

// POST /api/newsletter → crear suscriptor
router.post("/", validateRequest(newsletterSchema), newsletterController.create);

// POST /api/newsletter/unsubscribe → desuscribirse
router.post("/unsubscribe", newsletterController.unsubscribe);

// PATCH /api/newsletter/:id/status → activar/desactivar
router.patch("/:id/status", newsletterController.toggleStatus);

// DELETE /api/newsletter/:id → eliminar suscriptor
router.delete("/:id", newsletterController.remove);

export default router;
