import Joi from 'joi';
import mongoose from 'mongoose';

export const createReviewSchema = Joi.object({
  nombre: Joi.string().trim().required().messages({
    'string.empty': 'El nombre es obligatorio',
    'any.required': 'El nombre es obligatorio'
  }),

  comentario: Joi.string().trim().max(500).allow('').optional().messages({
    'string.max': 'El comentario no puede superar los 500 caracteres'
  }),

  calificacion: Joi.number().min(0).max(5).required().messages({
    'number.min': 'La calificación debe ser al menos 0',
    'number.max': 'La calificación no puede ser mayor a 5',
    'any.required': 'La calificación es obligatoria'
  }),

  paquete: Joi.alternatives()
    .try(
      Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      }),
      Joi.allow(null)
    )
    .optional(),

  tipo: Joi.string().valid("empresa", "paquete").default("empresa"),

  estadoModeracion: Joi.string()
    .valid("pendiente", "aprobada", "rechazada")
    .default("pendiente")
});

export const updateReviewSchema = Joi.object({
  nombre: Joi.string().trim().optional(),
  comentario: Joi.string().trim().max(500).optional(),
  calificacion: Joi.number().min(0).max(5).optional(),
  paquete: Joi.string()
    .custom((value, helpers) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation")
    .allow(null, ''),
  tipo: Joi.string().valid("empresa", "paquete").optional(),
  estadoModeracion: Joi.string().valid("pendiente", "aprobada", "rechazada").optional(),
});