// validations/packageDate.validations.js
import Joi from "joi";

export const packageDateSchema = Joi.object({
  // Campo obligatorio
  package: Joi.string().required().messages({
    'string.empty': 'El paquete es obligatorio',
    'any.required': 'El paquete es obligatorio'
  }),

  // Fecha de salida obligatoria
  salida: Joi.date().required().messages({
    'date.base': 'La fecha de salida debe ser válida',
    'any.required': 'La fecha de salida es obligatoria'
  }),

  // Campos calculados automáticamente - OPCIONALES
  regreso: Joi.date().optional(),
  totalDias: Joi.number().min(0).optional(),

  // Campos de precio
  precioFinal: Joi.number().min(0).optional().allow(null, ''),
  moneda: Joi.string().valid('ARS', 'USD').default('ARS'),

  // Campos de cupos
  cuposTotales: Joi.number().min(0).optional().default(0),
  cuposDisponibles: Joi.number().min(0).optional().default(0),

  // Estado
  estado: Joi.string()
    .valid('disponible', 'agotado', 'cancelado')
    .default('disponible'),

  // Notas
  notas: Joi.string().allow('', null).optional(),

  // Campos de validación - OPCIONALES
  validadoFechas: Joi.boolean().default(false),
  validadoDestinos: Joi.boolean().default(false),

  inconsistencias: Joi.array()
    .items(Joi.string())
    .default([]),

  // Campos de auditoría (Mongoose)
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
  __v: Joi.number().optional(),
  _id: Joi.string().optional()
})
  .required()
  .unknown(true); // Permite otros campos que puedan existir