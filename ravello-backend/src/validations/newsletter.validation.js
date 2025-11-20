import Joi from 'joi';

export const newsletterSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Email inválido',
      'any.required': 'El email es obligatorio'
    }),
  active: Joi.boolean().default(true),
});
