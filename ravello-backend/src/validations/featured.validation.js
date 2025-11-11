import Joi from 'joi';
import { Types } from 'mongoose';

const itemSchema = Joi.object({
  package: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message('"package" debe ser un ObjectId válido');
      }
      return value;
    })
    .required(),
  orden: Joi.number().default(0),
  etiqueta: Joi.string().allow('', null),
});

export const featuredSchema = Joi.object({
  tituloSeccion: Joi.string().default('Destinos destacados'),
  descripcion: Joi.string().allow('', null),
  items: Joi.array().items(itemSchema).default([]),
  activo: Joi.boolean().default(true),
});
