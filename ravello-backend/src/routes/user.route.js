import express from "express";
import { userController } from "../controllers/index.js";
import {
  validateRequest,
  paginationMiddleware,
  queryMiddleware,
  searchMiddleware,
  errorHandler,
} from "../middlewares/index.js";
import {
  createUserValidation,
  updateUserValidation,
} from "../validations/index.js";

const router = express.Router();

// 🧍‍♂️ Obtener todos los usuarios con filtros, paginación y búsqueda
router.get(
  "/",
  paginationMiddleware,
  queryMiddleware,
  searchMiddleware,
  userController.getUsers
);

// 🔍 Obtener usuario por ID
router.get("/:id", userController.getUserById);

// ➕ Crear usuario con validación
router.post("/", validateRequest(createUserValidation), userController.createUser);

// ✏️ Actualizar usuario
router.put("/:id", validateRequest(updateUserValidation), userController.updateUser);

// ❌ Eliminar usuario
router.delete("/:id", userController.deleteUser);

// 🧱 Middleware global de errores
router.use(errorHandler);

export default router;
