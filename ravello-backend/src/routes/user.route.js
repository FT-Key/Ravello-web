// routes/user.route.js
import express from "express";
import { userController } from "../controllers/index.js";
import {
  validateRequest,
  paginationMiddleware,
  queryMiddleware,
  searchMiddleware,
  errorHandler,
  authMiddleware, // ⬅️ AGREGAR
} from "../middlewares/index.js";
import {
  createUserValidation,
  updateUserValidation,
  updatePerfilValidation, // ⬅️ AGREGAR
} from "../validations/index.js";

const router = express.Router();

// ============================================
// RUTAS DE PERFIL (DEBEN IR PRIMERO)
// ============================================

// 👤 Obtener MI perfil
router.get(
  "/me/perfil",
  authMiddleware,
  userController.obtenerPerfilController
);

// ✏️ Actualizar MI perfil
router.put(
  "/me/perfil",
  authMiddleware,
  validateRequest(updatePerfilValidation),
  userController.actualizarPerfilController
);

// ✅ Verificar si puedo hacer reservas
router.get(
  "/me/puede-reservar",
  authMiddleware,
  userController.verificarPuedeReservarController
);

// ============================================
// RUTAS CRUD (ADMIN)
// ============================================

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
router.post(
  "/",
  validateRequest(createUserValidation),
  userController.createUser
);

// ✏️ Actualizar usuario
router.put(
  "/:id",
  validateRequest(updateUserValidation),
  userController.updateUser
);

// ❌ Eliminar usuario
router.delete("/:id", userController.deleteUser);

// 🧱 Middleware global de errores
router.use(errorHandler);

export default router;