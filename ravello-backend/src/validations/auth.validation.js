// src/validations/auth.validation.js
import Joi from "joi";

// LOGIN
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "El correo debe ser válido",
      "any.required": "El correo es obligatorio"
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "La contraseña debe tener al menos 6 caracteres",
      "any.required": "La contraseña es obligatoria"
    })
});

// REGISTRO
export const registerSchema = Joi.object({
  nombre: Joi.string()
    .allow("", null)
    .messages({ "string.base": "Nombre inválido" }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "El email debe ser válido",
      "any.required": "El email es obligatorio"
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "La contraseña debe tener al menos 6 caracteres",
      "any.required": "La contraseña es obligatoria"
    }),

  rol: Joi.string()
    .valid("admin", "editor", "cliente")
    .default("cliente")
    .messages({
      "any.only": "El rol no es válido"
    })
});

// (Opcional) REFRESH TOKEN
export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});
