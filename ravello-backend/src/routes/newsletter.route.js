import express from "express";
import { newsletterController } from "../controllers/index.js";
import {
  queryMiddleware,
  searchMiddleware,
  paginationMiddleware,
  validateRequest
} from "../middlewares/index.js";
import { newsletterSchema } from "../validations/index.js";

const router = express.Router();

/** ===========================
 *   LISTAR SUSCRIPTORES
 * =========================== */

// GET /api/newsletter → listado con paginación y filtros
router.get(
  "/",
  queryMiddleware,
  searchMiddleware,
  paginationMiddleware,
  newsletterController.getAll
);

/** ===========================
 *   CREAR SUSCRIPTOR
 * =========================== */

router.post(
  "/",
  validateRequest(newsletterSchema),
  newsletterController.create
);

/** ===========================
 *   DESUSCRIBIR POR EMAIL
 * =========================== */

router.post("/unsubscribe", newsletterController.unsubscribe);

/** ===========================
 *   ACTIVAR / DESACTIVAR
 * =========================== */

router.patch("/:id/status", newsletterController.toggleStatus);

/** ===========================
 *   ELIMINAR SUSCRIPTOR
 * =========================== */

router.delete("/:id", newsletterController.remove);

export default router;
