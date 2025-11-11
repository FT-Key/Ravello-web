import Joi from 'joi';
import mongoose from 'mongoose';

export const createReviewSchema = Joi.object({
  nombre: Joi.string().trim().required(),
  comentario: Joi.string().trim().max(500).allow(''),
  calificacion: Joi.number().min(0).max(5).required(),
  paquete: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation")
    .allow(null),
  tipo: Joi.string().valid("empresa", "paquete").default("empresa"),
});

export const updateReviewSchema = Joi.object({
  nombre: Joi.string().trim(),
  comentario: Joi.string().trim().max(500),
  calificacion: Joi.number().min(0).max(5),
  paquete: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) return helpers.error("any.invalid");
      return value;
    }, "ObjectId validation")
    .allow(null),
  tipo: Joi.string().valid("empresa", "paquete"),
  estadoModeracion: Joi.string().valid("pendiente", "aprobada", "rechazada"),
});
