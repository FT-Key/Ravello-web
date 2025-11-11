import express from "express";
import { offerController } from "../controllers/index.js";
import {
  paginationMiddleware,
  queryMiddleware,
  searchMiddleware,
  validateRequest
} from "../middlewares/index.js";
import { createOfferSchema, updateOfferSchema } from "../validations/index.js";

const router = express.Router();

// 📦 Obtener todas las ofertas con búsqueda, filtros y paginación
router.get(
  "/",
  queryMiddleware,
  searchMiddleware,
  paginationMiddleware,
  offerController.getAll
);

// 🌟 Obtener ofertas activas
router.get("/activas", offerController.getActive);

// 🔍 Obtener oferta por ID
router.get("/:id", offerController.getById);

// ➕ Crear nueva oferta
router.post(
  "/",
  validateRequest(createOfferSchema),
  offerController.create
);

// ✏️ Actualizar oferta
router.put(
  "/:id",
  validateRequest(updateOfferSchema),
  offerController.update
);

// 🗑️ Eliminar oferta
router.delete("/:id", offerController.remove);

export default router;
