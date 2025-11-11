import Joi from 'joi';

export const createOfferSchema = Joi.object({
  titulo: Joi.string().required(),
  descripcion: Joi.string().allow(''),
  package: Joi.string().optional(),
  tipoDescuento: Joi.string().valid('porcentaje', 'monto').default('porcentaje'),
  valorDescuento: Joi.number().required(),
  fechaInicio: Joi.date().required(),
  fechaFin: Joi.date().required(),
  destacada: Joi.boolean().default(false),
  imagen: Joi.string().uri().allow(''),
  activo: Joi.boolean().default(true),
});

export const updateOfferSchema = Joi.object({
  titulo: Joi.string(),
  descripcion: Joi.string().allow(''),
  package: Joi.string().optional(),
  tipoDescuento: Joi.string().valid('porcentaje', 'monto'),
  valorDescuento: Joi.number(),
  fechaInicio: Joi.date(),
  fechaFin: Joi.date(),
  destacada: Joi.boolean(),
  imagen: Joi.string().uri().allow(''),
  activo: Joi.boolean(),
});
