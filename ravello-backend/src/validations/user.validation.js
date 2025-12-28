// validations/user.validation.js
import Joi from "joi";

// ============================================
// VALIDACIÓN: CREAR USUARIO (ADMIN)
// ============================================
export const createUserValidation = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).optional(),
  apellido: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
  telefono: Joi.string().trim().optional(),
  
  documento: Joi.object({
    tipo: Joi.string().valid("DNI", "CUIL", "Pasaporte", "Otro").optional(),
    numero: Joi.string().trim().optional()
  }).optional(),
  
  rol: Joi.string().valid("admin", "editor", "cliente").default("cliente"),
  activo: Joi.boolean().default(true),
  esPrincipal: Joi.boolean().default(false),
});

// ============================================
// VALIDACIÓN: ACTUALIZAR USUARIO (ADMIN)
// ============================================
export const updateUserValidation = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).optional(),
  apellido: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().trim().email().optional(),
  password: Joi.string().min(6).optional(),
  telefono: Joi.string().trim().optional(),
  
  documento: Joi.object({
    tipo: Joi.string().valid("DNI", "CUIL", "Pasaporte", "Otro").optional(),
    numero: Joi.string().trim().optional()
  }).optional(),
  
  fechaNacimiento: Joi.date().optional(),
  
  direccion: Joi.object({
    calle: Joi.string().trim().optional(),
    numero: Joi.string().trim().optional(),
    piso: Joi.string().trim().optional(),
    departamento: Joi.string().trim().optional(),
    ciudad: Joi.string().trim().optional(),
    provincia: Joi.string().trim().optional(),
    codigoPostal: Joi.string().trim().optional(),
    pais: Joi.string().trim().optional()
  }).optional(),
  
  preferencias: Joi.object({
    newsletter: Joi.boolean().optional(),
    notificacionesEmail: Joi.boolean().optional(),
    notificacionesSMS: Joi.boolean().optional(),
    idioma: Joi.string().optional(),
    monedaPreferida: Joi.string().valid("ARS", "USD", "EUR").optional()
  }).optional(),
  
  rol: Joi.string().valid("admin", "editor", "cliente").optional(),
  activo: Joi.boolean().optional(),
  
  notasInternas: Joi.string().trim().optional(),
}).min(1);

// ============================================
// VALIDACIÓN: ACTUALIZAR PERFIL (USUARIO)
// ============================================
export const updatePerfilValidation = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).optional().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres'
  }),
  
  apellido: Joi.string().trim().min(2).max(100).optional().messages({
    'string.min': 'El apellido debe tener al menos 2 caracteres',
    'string.max': 'El apellido no puede exceder 100 caracteres'
  }),
  
  telefono: Joi.string()
    .trim()
    .pattern(/^[0-9\s\-\+\(\)]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'El teléfono debe contener solo números y caracteres válidos (+, -, espacios, paréntesis)'
    }),
  
  documento: Joi.object({
    tipo: Joi.string()
      .valid("DNI", "CUIL", "Pasaporte", "Otro")
      .required()
      .messages({
        'any.only': 'El tipo de documento debe ser DNI, CUIL, Pasaporte u Otro',
        'any.required': 'El tipo de documento es requerido'
      }),
    
    numero: Joi.string()
      .trim()
      .required()
      .messages({
        'any.required': 'El número de documento es requerido',
        'string.empty': 'El número de documento no puede estar vacío'
      })
  })
    .optional()
    .messages({
      'object.base': 'El documento debe ser un objeto válido con tipo y número'
    }),
  
  fechaNacimiento: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.base': 'La fecha de nacimiento debe ser una fecha válida',
      'date.max': 'La fecha de nacimiento no puede ser futura'
    }),
  
  direccion: Joi.object({
    calle: Joi.string().trim().optional(),
    numero: Joi.string().trim().optional(),
    piso: Joi.string().trim().optional(),
    departamento: Joi.string().trim().optional(),
    ciudad: Joi.string().trim().optional(),
    provincia: Joi.string().trim().optional(),
    codigoPostal: Joi.string().trim().optional(),
    pais: Joi.string().trim().default('Argentina')
  }).optional(),
  
  preferencias: Joi.object({
    newsletter: Joi.boolean().optional(),
    notificacionesEmail: Joi.boolean().optional(),
    notificacionesSMS: Joi.boolean().optional(),
    idioma: Joi.string().optional(),
    monedaPreferida: Joi.string().valid("ARS", "USD", "EUR").optional()
  }).optional(),
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

// ============================================
// VALIDACIÓN: CAMBIAR CONTRASEÑA
// ============================================
export const cambiarPasswordValidation = Joi.object({
  passwordActual: Joi.string().required().messages({
    'any.required': 'La contraseña actual es requerida',
    'string.empty': 'La contraseña actual no puede estar vacía'
  }),
  
  passwordNueva: Joi.string()
    .min(6)
    .required()
    .messages({
      'any.required': 'La nueva contraseña es requerida',
      'string.min': 'La nueva contraseña debe tener al menos 6 caracteres',
      'string.empty': 'La nueva contraseña no puede estar vacía'
    }),
  
  confirmarPassword: Joi.string()
    .valid(Joi.ref('passwordNueva'))
    .required()
    .messages({
      'any.only': 'Las contraseñas no coinciden',
      'any.required': 'Debe confirmar la nueva contraseña'
    })
});

// ============================================
// VALIDACIÓN: COMPLETAR PERFIL (CAMPOS MÍNIMOS PARA RESERVAR)
// ============================================
export const completarPerfilValidation = Joi.object({
  nombre: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'any.required': 'El nombre es requerido para hacer reservas',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.empty': 'El nombre no puede estar vacío'
    }),
  
  apellido: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'any.required': 'El apellido es requerido para hacer reservas',
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.empty': 'El apellido no puede estar vacío'
    }),
  
  telefono: Joi.string()
    .trim()
    .pattern(/^[0-9\s\-\+\(\)]+$/)
    .required()
    .messages({
      'any.required': 'El teléfono es requerido para hacer reservas',
      'string.pattern.base': 'El teléfono debe contener solo números y caracteres válidos',
      'string.empty': 'El teléfono no puede estar vacío'
    }),
  
  documento: Joi.object({
    tipo: Joi.string()
      .valid("DNI", "CUIL", "Pasaporte", "Otro")
      .required()
      .messages({
        'any.only': 'El tipo de documento debe ser DNI, CUIL, Pasaporte u Otro',
        'any.required': 'El tipo de documento es requerido para hacer reservas'
      }),
    
    numero: Joi.string()
      .trim()
      .required()
      .messages({
        'any.required': 'El número de documento es requerido para hacer reservas',
        'string.empty': 'El número de documento no puede estar vacío'
      })
  })
    .required()
    .messages({
      'any.required': 'El documento es requerido para hacer reservas'
    })
});

// ============================================
// VALIDACIÓN: ACTUALIZAR PREFERENCIAS
// ============================================
export const updatePreferenciasValidation = Joi.object({
  newsletter: Joi.boolean().optional(),
  notificacionesEmail: Joi.boolean().optional(),
  notificacionesSMS: Joi.boolean().optional(),
  idioma: Joi.string().valid('es', 'en', 'pt').optional(),
  monedaPreferida: Joi.string().valid("ARS", "USD", "EUR").optional()
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos una preferencia para actualizar'
});