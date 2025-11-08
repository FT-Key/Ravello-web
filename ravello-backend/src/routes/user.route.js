import express from "express";
import { userController } from "../controllers/index.js";

const router = express.Router();

// === RUTAS CRUD DE USUARIOS ===
router.get("/", userController.getUsers);       // Obtener todos los usuarios
router.get("/:id", userController.getUserById); // Obtener un usuario por ID
router.post("/", userController.createUser);    // Crear usuario
router.put("/:id", userController.updateUser);  // Actualizar usuario
router.delete("/:id", userController.deleteUser); // Eliminar usuario

export default router;
