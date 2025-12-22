// validations/payment.validation.js
import Joi from 'joi';

// Crear preferencia de MercadoPago
export const crearPreferenciaValidation = Joi.object({
  reservaId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.empty': 'El ID de reserva es obligatorio',
      'string.pattern.base': 'ID de reserva inválido'
    }),

  monto: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'El monto debe ser un número',
      'number.positive': 'El monto debe ser mayor a 0',
      'any.required': 'El monto es obligatorio'
    }),

  tipoPago: Joi.string()
    .valid('senia', 'cuota', 'saldo', 'total')
    .required()
    .messages({
      'any.only': 'Tipo de pago inválido',
      'any.required': 'El tipo de pago es obligatorio'
    }),

  numeroCuota: Joi.number()
    .positive()
    .when('tipoPago', {
      is: 'cuota',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'number.positive': 'El número de cuota debe ser mayor a 0',
      'any.required': 'El número de cuota es obligatorio cuando el tipo de pago es "cuota"'
    })
});

// Registrar pago presencial
export const registrarPagoPresencialValidation = Joi.object({
  reservaId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.empty': 'El ID de reserva es obligatorio',
      'string.pattern.base': 'ID de reserva inválido'
    }),

  monto: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'El monto debe ser un número',
      'number.positive': 'El monto debe ser mayor a 0',
      'any.required': 'El monto es obligatorio'
    }),

  tipoPago: Joi.string()
    .valid('senia', 'cuota', 'saldo', 'total')
    .required(),

  numeroCuota: Joi.number()
    .positive()
    .optional(),

  metodoPago: Joi.string()
    .valid('efectivo', 'tarjeta_presencial', 'transferencia', 'cheque')
    .required()
    .messages({
      'any.only': 'Método de pago inválido',
      'any.required': 'El método de pago es obligatorio'
    }),

  detallePresencial: Joi.object({
    metodo: Joi.string()
      .valid('efectivo', 'tarjeta_debito', 'tarjeta_credito', 'mixto')
      .required(),

    tarjeta: Joi.when('metodo', {
      is: Joi.string().regex(/tarjeta/),
      then: Joi.object({
        tipo: Joi.string().valid('debito', 'credito'),
        marca: Joi.string(),
        ultimos4Digitos: Joi.string().length(4),
        cuotas: Joi.number().positive(),
        numeroAutorizacion: Joi.string(),
        numeroTerminal: Joi.string(),
        numeroLote: Joi.string()
      }),
      otherwise: Joi.optional()
    }),

    detalleMixto: Joi.when('metodo', {
      is: 'mixto',
      then: Joi.array().items(
        Joi.object({
          metodo: Joi.string().required(),
          monto: Joi.number().positive().required()
        })
      ),
      otherwise: Joi.optional()
    }),

    numeroRecibo: Joi.string(),
    fechaRecibo: Joi.date()
  }).required(),

  notas: Joi.string().max(500).allow('', null)
});

// Cancelar pago
export const cancelarPagoValidation = Joi.object({
  motivo: Joi.string()
    .required()
    .min(10)
    .max(500)
    .messages({
      'string.empty': 'El motivo es obligatorio',
      'string.min': 'El motivo debe tener al menos 10 caracteres',
      'string.max': 'El motivo no puede superar 500 caracteres'
    })
});

// Procesar reembolso
export const reembolsoValidation = Joi.object({
  montoReembolso: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'El monto debe ser un número',
      'number.positive': 'El monto debe ser mayor a 0',
      'any.required': 'El monto del reembolso es obligatorio'
    }),

  motivo: Joi.string()
    .required()
    .min(10)
    .max(500)
    .messages({
      'string.empty': 'El motivo es obligatorio',
      'string.min': 'El motivo debe tener al menos 10 caracteres',
      'string.max': 'El motivo no puede superar 500 caracteres'
    })
});