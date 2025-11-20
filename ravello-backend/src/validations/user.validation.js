import Joi from "joi";

export const createUserValidation = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
  rol: Joi.string().valid("admin", "editor", "cliente").default("cliente"),
  activo: Joi.boolean().default(true),
  esPrincipal: Joi.boolean().default(false),
});

export const updateUserValidation = Joi.object({
  nombre: Joi.string().trim().min(2).max(100),
  email: Joi.string().trim().email(),
  password: Joi.string().min(6),
  rol: Joi.string().valid("admin", "editor", "cliente"),
  activo: Joi.boolean(),
}).min(1);
