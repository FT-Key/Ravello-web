// routes/auth.routes.js
import { Router } from "express";

// Importar controladores desde el index centralizado
import { authController } from "../controllers/index.js";

// Importar validaciones
import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../validations/auth.validation.js";

// Middlewares
import {
  validateRequest,
  parseJSONBody,
  authMiddleware
} from "../middlewares/index.js";

const router = Router();

const {
  loginController,
  registerController,
  meController,
  changePasswordController,
  forgotPasswordController,
  resetPasswordController
} = authController;

// ============================================
// 🔓 RUTAS PÚBLICAS (Sin autenticación)
// ============================================

/**
 * POST /api/auth/login
 * Login de usuario
 */
router.post(
  "/login",
  parseJSONBody,
  validateRequest(loginSchema),
  loginController
);

/**
 * POST /api/auth/register
 * Registro de nuevo usuario
 */
router.post(
  "/register",
  parseJSONBody,
  validateRequest(registerSchema),
  registerController
);

/**
 * POST /api/auth/forgot-password
 * Solicitar token de recuperación de contraseña
 */
router.post(
  "/forgot-password",
  parseJSONBody,
  validateRequest(forgotPasswordSchema),
  forgotPasswordController
);

/**
 * POST /api/auth/reset-password
 * Resetear contraseña con token
 */
router.post(
  "/reset-password",
  parseJSONBody,
  validateRequest(resetPasswordSchema),
  resetPasswordController
);

// ============================================
// 🔒 RUTAS PROTEGIDAS (Requieren autenticación)
// ============================================

/**
 * GET /api/auth/me
 * Obtener datos del usuario autenticado (persistencia)
 * Retorna solo datos básicos de autenticación
 */
router.get(
  "/me",
  authMiddleware,
  meController
);

/**
 * PUT /api/auth/change-password
 * Cambiar contraseña del usuario autenticado
 */
router.put(
  "/change-password",
  authMiddleware,
  parseJSONBody,
  validateRequest(changePasswordSchema),
  changePasswordController
);

// ============================================
// 📝 NOTAS IMPORTANTES
// ============================================
// 
// Las rutas de PERFIL están en /api/users:
// - GET    /api/users/me/perfil          → Obtener perfil completo
// - PUT    /api/users/me/perfil          → Actualizar perfil
// - GET    /api/users/me/puede-reservar  → Verificar si puede reservar
//
// Separación de responsabilidades:
// - /api/auth/*  → Autenticación y gestión de cuenta
// - /api/users/* → Gestión de perfil y datos de usuario
//
// ============================================

export default router;