import { Router } from "express";

// Importar controladores desde el index centralizado
import { authController } from "../controllers/index.js";

// Importar validaciones
import {
  loginSchema,
  registerSchema,
} from "../validations/auth.validation.js";

// Middlewares
import { validateRequest } from "../middlewares/validateRequest.js";
import { parseJSONBody } from "../middlewares/parseJSONBody.js";

const router = Router();

const {
  loginController,
  registerController,
  meController
} = authController;

// ----------------------------------------------------
// LOGIN
// ----------------------------------------------------
router.post(
  "/login",
  parseJSONBody,
  validateRequest(loginSchema),
  loginController
);

// ----------------------------------------------------
// REGISTRO
// ----------------------------------------------------
router.post(
  "/register",
  parseJSONBody,
  validateRequest(registerSchema),
  registerController
);

// ----------------------------------------------------
// PERSISTENCIA: OBTENER USER POR TOKEN
// ----------------------------------------------------
router.get("/me", meController);

export default router;
