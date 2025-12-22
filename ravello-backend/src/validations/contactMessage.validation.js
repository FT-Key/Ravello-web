// validations/contactValidation.js
import Joi from "joi";

export const createContactValidation = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .required()
    .messages({
      "string.empty": "El nombre es obligatorio",
      "string.min": "Debe tener al menos 2 caracteres",
      "string.max": "Máximo 100 caracteres"
    }),

  email: Joi.string()
    .email()
    .trim()
    .required()
    .messages({
      "string.empty": "El email es obligatorio",
      "string.email": "Email inválido"
    }),

  telefono: Joi.string()
    .pattern(/^\+?[0-9\s\-]{7,15}$/)
    .allow("", null)
    .messages({
      "string.pattern.base": "Teléfono inválido (7-15 dígitos)"
    }),

  asunto: Joi.string()
    .max(200)
    .default("Consulta general")
    .messages({
      "string.max": "Máximo 200 caracteres"
    }),

  mensaje: Joi.string()
    .min(10)
    .max(2000)
    .trim()
    .required()
    .messages({
      "string.empty": "El mensaje es obligatorio",
      "string.min": "Debe tener al menos 10 caracteres",
      "string.max": "Máximo 2000 caracteres"
    })
});

export const updateReadValidation = Joi.object({
  leido: Joi.boolean()
});