// validations/packageDate.validations.js
import Joi from "joi";

export const packageDateSchema = Joi.object({
  package: Joi.string().required(), // ID del paquete

  salida: Joi.date().required(),
  regreso: Joi.date().required(),

  totalDias: Joi.number().min(1).required(),

  validadoFechas: Joi.boolean().default(false),
  validadoDestinos: Joi.boolean().default(false),

  inconsistencias: Joi.array()
    .items(Joi.string())
    .default([]),
})
.required()
.unknown(true); // permite _id, __v, etc.
