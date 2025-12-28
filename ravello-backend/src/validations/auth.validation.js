// src/validations/auth.validation.js
import Joi from "joi";

// ============================================
// LOGIN
// ============================================
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .trim()
    .lowercase()
    .messages({
      "string.email": "El correo debe ser válido",
      "string.empty": "El correo no puede estar vacío",
      "any.required": "El correo es obligatorio"
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "La contraseña debe tener al menos 6 caracteres",
      "string.empty": "La contraseña no puede estar vacía",
      "any.required": "La contraseña es obligatoria"
    })
});

// ============================================
// REGISTRO
// ============================================
export const registerSchema = Joi.object({
  // Email (requerido)
  email: Joi.string()
    .email()
    .required()
    .trim()
    .lowercase()
    .messages({
      "string.email": "El email debe ser válido",
      "string.empty": "El email no puede estar vacío",
      "any.required": "El email es obligatorio"
    }),
  
  // Password (requerido)
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "La contraseña debe tener al menos 6 caracteres",
      "string.empty": "La contraseña no puede estar vacía",
      "any.required": "La contraseña es obligatoria"
    }),
  
  // Rol (opcional, por defecto 'cliente')
  rol: Joi.string()
    .valid("admin", "editor", "cliente")
    .default("cliente")
    .messages({
      "any.only": "El rol debe ser: admin, editor o cliente"
    }),

  // ============================================
  // DATOS PERSONALES (OPCIONALES EN REGISTRO)
  // ============================================
  nombre: Joi.string()
    .trim()
    .allow("", null)
    .messages({
      "string.base": "El nombre debe ser texto"
    }),
  
  apellido: Joi.string()
    .trim()
    .allow("", null)
    .messages({
      "string.base": "El apellido debe ser texto"
    }),
  
  telefono: Joi.string()
    .trim()
    .allow("", null)
    .pattern(/^[0-9\s\-\+\(\)]*$/)
    .messages({
      "string.pattern.base": "El teléfono contiene caracteres inválidos"
    }),
  
  // Documento
  documento: Joi.object({
    tipo: Joi.string()
      .valid("DNI", "CUIL", "Pasaporte", "Otro")
      .messages({
        "any.only": "El tipo de documento debe ser: DNI, CUIL, Pasaporte u Otro"
      }),
    numero: Joi.string()
      .trim()
      .messages({
        "string.base": "El número de documento debe ser texto"
      })
  }).allow(null),

  fechaNacimiento: Joi.date()
    .max("now")
    .allow(null)
    .messages({
      "date.max": "La fecha de nacimiento no puede ser futura",
      "date.base": "La fecha de nacimiento no es válida"
    }),

  // ============================================
  // DIRECCIÓN (OPCIONAL)
  // ============================================
  direccion: Joi.object({
    calle: Joi.string().trim().allow("", null),
    numero: Joi.string().trim().allow("", null),
    piso: Joi.string().trim().allow("", null),
    departamento: Joi.string().trim().allow("", null),
    ciudad: Joi.string().trim().allow("", null),
    provincia: Joi.string().trim().allow("", null),
    codigoPostal: Joi.string().trim().allow("", null),
    pais: Joi.string().trim().default("Argentina")
  }).allow(null),

  // ============================================
  // PREFERENCIAS (OPCIONAL)
  // ============================================
  preferencias: Joi.object({
    newsletter: Joi.boolean().default(true),
    notificacionesEmail: Joi.boolean().default(true),
    notificacionesSMS: Joi.boolean().default(false),
    idioma: Joi.string().default("es"),
    monedaPreferida: Joi.string()
      .valid("ARS", "USD", "EUR")
      .default("ARS")
      .messages({
        "any.only": "La moneda debe ser: ARS, USD o EUR"
      })
  }).allow(null),

  // ============================================
  // FACTURACIÓN (OPCIONAL)
  // ============================================
  facturacion: Joi.object({
    razonSocial: Joi.string().trim().allow("", null),
    cuit: Joi.string()
      .trim()
      .pattern(/^[0-9\-]*$/)
      .allow("", null)
      .messages({
        "string.pattern.base": "El CUIT solo puede contener números y guiones"
      }),
    condicionIVA: Joi.string()
      .valid("Responsable Inscripto", "Monotributo", "Exento", "Consumidor Final")
      .allow(null)
      .messages({
        "any.only": "La condición de IVA no es válida"
      })
  }).allow(null)
});

// ============================================
// ACTUALIZAR PERFIL
// ============================================
export const updateProfileSchema = Joi.object({
  nombre: Joi.string()
    .trim()
    .messages({
      "string.base": "El nombre debe ser texto",
      "string.empty": "El nombre no puede estar vacío"
    }),
  
  apellido: Joi.string()
    .trim()
    .messages({
      "string.base": "El apellido debe ser texto",
      "string.empty": "El apellido no puede estar vacío"
    }),
  
  telefono: Joi.string()
    .trim()
    .pattern(/^[0-9\s\-\+\(\)]*$/)
    .messages({
      "string.pattern.base": "El teléfono contiene caracteres inválidos"
    }),
  
  documento: Joi.object({
    tipo: Joi.string()
      .valid("DNI", "CUIL", "Pasaporte", "Otro")
      .required()
      .messages({
        "any.only": "El tipo de documento debe ser: DNI, CUIL, Pasaporte u Otro",
        "any.required": "El tipo de documento es requerido"
      }),
    numero: Joi.string()
      .trim()
      .required()
      .messages({
        "string.empty": "El número de documento no puede estar vacío",
        "any.required": "El número de documento es requerido"
      })
  }),

  fechaNacimiento: Joi.date()
    .max("now")
    .messages({
      "date.max": "La fecha de nacimiento no puede ser futura",
      "date.base": "La fecha de nacimiento no es válida"
    }),

  direccion: Joi.object({
    calle: Joi.string().trim().allow("", null),
    numero: Joi.string().trim().allow("", null),
    piso: Joi.string().trim().allow("", null),
    departamento: Joi.string().trim().allow("", null),
    ciudad: Joi.string().trim().allow("", null),
    provincia: Joi.string().trim().allow("", null),
    codigoPostal: Joi.string().trim().allow("", null),
    pais: Joi.string().trim()
  }),

  preferencias: Joi.object({
    newsletter: Joi.boolean(),
    notificacionesEmail: Joi.boolean(),
    notificacionesSMS: Joi.boolean(),
    idioma: Joi.string(),
    monedaPreferida: Joi.string()
      .valid("ARS", "USD", "EUR")
      .messages({
        "any.only": "La moneda debe ser: ARS, USD o EUR"
      })
  }),

  facturacion: Joi.object({
    razonSocial: Joi.string().trim().allow("", null),
    cuit: Joi.string()
      .trim()
      .pattern(/^[0-9\-]*$/)
      .allow("", null)
      .messages({
        "string.pattern.base": "El CUIT solo puede contener números y guiones"
      }),
    condicionIVA: Joi.string()
      .valid("Responsable Inscripto", "Monotributo", "Exento", "Consumidor Final")
      .messages({
        "any.only": "La condición de IVA no es válida"
      })
  })
}).min(1).messages({
  "object.min": "Debe proporcionar al menos un campo para actualizar"
});

// ============================================
// CAMBIAR CONTRASEÑA
// ============================================
export const changePasswordSchema = Joi.object({
  passwordActual: Joi.string()
    .required()
    .messages({
      "string.empty": "La contraseña actual es requerida",
      "any.required": "La contraseña actual es requerida"
    }),
  
  passwordNueva: Joi.string()
    .min(6)
    .required()
    .invalid(Joi.ref("passwordActual"))
    .messages({
      "string.min": "La nueva contraseña debe tener al menos 6 caracteres",
      "any.invalid": "La nueva contraseña debe ser diferente a la actual",
      "any.required": "La nueva contraseña es requerida"
    }),
  
  passwordConfirmacion: Joi.string()
    .valid(Joi.ref("passwordNueva"))
    .required()
    .messages({
      "any.only": "Las contraseñas no coinciden",
      "any.required": "La confirmación de contraseña es requerida"
    })
});

// ============================================
// REFRESH TOKEN
// ============================================
export const refreshSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      "string.empty": "El refresh token es requerido",
      "any.required": "El refresh token es requerido"
    })
});

// ============================================
// RECUPERAR CONTRASEÑA
// ============================================
export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .trim()
    .lowercase()
    .messages({
      "string.email": "El correo debe ser válido",
      "string.empty": "El correo no puede estar vacío",
      "any.required": "El correo es obligatorio"
    })
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      "string.empty": "El token es requerido",
      "any.required": "El token es requerido"
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "La contraseña debe tener al menos 6 caracteres",
      "string.empty": "La contraseña no puede estar vacía",
      "any.required": "La contraseña es obligatoria"
    }),
  
  passwordConfirmacion: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Las contraseñas no coinciden",
      "any.required": "La confirmación de contraseña es requerida"
    })
});