import Joi from 'joi';
import { Types } from 'mongoose';

export const featuredPromotionSchema = Joi.object({
  titulo: Joi.string().default('Ofertas imperdibles'),
  descripcion: Joi.string().allow('', null),
  packages: Joi.array()
    .items(
      Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
          return helpers.message('"packages" debe contener ObjectIds válidos');
        }
        return value;
      })
    )
    .length(2)
    .required()
    .messages({
      'array.length': 'Deben seleccionarse exactamente 2 paquetes.',
      'any.required': '"packages" es obligatorio',
    }),
  activo: Joi.boolean().default(true),
});
