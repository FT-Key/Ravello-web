import express from "express";
import { contactController } from "../controllers/index.js";

const router = express.Router();

// Crear nuevo mensaje
router.post("/", contactController.createMessage);

// Obtener todos los mensajes
router.get("/", contactController.getMessages);

// Obtener uno por ID
router.get("/:id", contactController.getMessage);

// Marcar como leído
router.patch("/:id/read", contactController.markAsRead);

// Eliminar mensaje
router.delete("/:id", contactController.deleteMessage);

export default router;
