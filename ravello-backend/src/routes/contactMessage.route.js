import express from "express";
import { contactController } from "../controllers/index.js";
import {
  validateRequest,
  paginationMiddleware,
  queryMiddleware,
  searchMiddleware,
  errorHandler,
} from "../middlewares/index.js";
import {
  createContactValidation,
  updateReadValidation,
} from "../validations/index.js";

const router = express.Router();

/** 📬 Obtener mensajes con paginación, filtros y búsqueda */
router.get(
  "/",
  paginationMiddleware,
  queryMiddleware,
  searchMiddleware,
  contactController.getMessages
);

/** 📨 Crear mensaje de contacto (envía correos) */
router.post(
  "/",
  validateRequest(createContactValidation),
  contactController.createMessage
);

/** ✅ Marcar mensaje como leído */
router.patch(
  "/:id/read",
  validateRequest(updateReadValidation),
  contactController.markAsRead
);

/** 🗑️ Eliminar mensaje */
router.delete("/:id", contactController.deleteMessage);

/** 🧱 Manejo centralizado de errores */
router.use(errorHandler);

export default router;
