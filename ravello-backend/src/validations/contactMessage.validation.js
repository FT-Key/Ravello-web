import Joi from "joi";

export const createContactValidation = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().required(),
  telefono: Joi.string()
    .pattern(/^\+?[0-9\s\-]{7,15}$/)
    .allow(null, ""),
  mensaje: Joi.string().trim().max(2000).required(),
  asunto: Joi.string().trim().max(200).default("General"),
});

export const updateReadValidation = Joi.object({
  leido: Joi.boolean().required(),
});
