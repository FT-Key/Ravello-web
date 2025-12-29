// models/User.js
import mongoose from 'mongoose';
import argon2 from 'argon2';

const userSchema = new mongoose.Schema(
  {
    // ============================================
    // 🔐 AUTENTICACIÓN
    // ============================================
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      required: true 
    },
    
    rol: { 
      type: String, 
      enum: ['admin', 'editor', 'cliente'], 
      default: 'cliente' 
    },
    
    activo: { 
      type: Boolean, 
      default: true 
    },
    
    esPrincipal: { 
      type: Boolean, 
      default: false 
    },

    // ============================================
    // 👤 DATOS PERSONALES (REQUERIDOS PARA RESERVAS)
    // ============================================
    nombre: { 
      type: String,
      trim: true
    },
    
    apellido: { 
      type: String,
      trim: true
    },
    
    telefono: { 
      type: String,
      trim: true
    },
    
    documento: {
      tipo: {
        type: String,
        enum: ['DNI', 'CUIL', 'Pasaporte', 'Otro']
      },
      numero: {
        type: String,
        trim: true
      }
    },

    fechaNacimiento: Date,

    // ============================================
    // 📍 DIRECCIÓN
    // ============================================
    direccion: {
      calle: String,
      numero: String,
      piso: String,
      departamento: String,
      ciudad: String,
      provincia: String,
      codigoPostal: String,
      pais: { type: String, default: 'Argentina' }
    },

    // ============================================
    // 📊 ESTADO DE PERFIL
    // ============================================
    perfilCompleto: {
      type: Boolean,
      default: false
    },

    // Campos requeridos para considerar el perfil completo
    camposRequeridos: {
      nombre: { type: Boolean, default: false },
      apellido: { type: Boolean, default: false },
      telefono: { type: Boolean, default: false },
      documento: { type: Boolean, default: false }
    },

    // ============================================
    // 🔔 PREFERENCIAS Y NOTIFICACIONES
    // ============================================
    preferencias: {
      newsletter: { type: Boolean, default: true },
      notificacionesEmail: { type: Boolean, default: true },
      notificacionesSMS: { type: Boolean, default: false },
      idioma: { type: String, default: 'es' },
      monedaPreferida: { 
        type: String, 
        enum: ['ARS', 'USD', 'EUR'], 
        default: 'ARS' 
      }
    },

    // ============================================
    // 📧 VERIFICACIÓN
    // ============================================
    emailVerificado: {
      type: Boolean,
      default: false
    },

    tokenVerificacion: String,
    
    fechaVerificacion: Date,

    // ============================================
    // 🔄 RECUPERACIÓN DE CONTRASEÑA
    // ============================================
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // ============================================
    // 📈 ESTADÍSTICAS DEL CLIENTE
    // ============================================
    estadisticas: {
      totalReservas: { type: Number, default: 0 },
      reservasCompletadas: { type: Number, default: 0 },
      reservasCanceladas: { type: Number, default: 0 },
      totalGastado: { type: Number, default: 0 },
      ultimaReserva: Date,
      clienteDesde: { type: Date, default: Date.now }
    },

    // ============================================
    // 🔐 SEGURIDAD
    // ============================================
    ultimoAcceso: Date,
    
    intentosLoginFallidos: { 
      type: Number, 
      default: 0 
    },
    
    bloqueadoHasta: Date,

    // IPs desde donde se ha conectado
    ipsConocidas: [{
      ip: String,
      fecha: Date,
      userAgent: String
    }],

    // ============================================
    // 💳 DATOS DE FACTURACIÓN (OPCIONAL)
    // ============================================
    facturacion: {
      razonSocial: String,
      cuit: String,
      condicionIVA: {
        type: String,
        enum: ['Responsable Inscripto', 'Monotributo', 'Exento', 'Consumidor Final']
      }
    },

    // ============================================
    // 📝 NOTAS INTERNAS (SOLO ADMIN)
    // ============================================
    notasInternas: String,

    // ============================================
    // 🗑️ SOFT DELETE
    // ============================================
    eliminado: {
      type: Boolean,
      default: false
    },
    
    fechaEliminacion: Date,
    
    motivoEliminacion: String
  },
  { 
    timestamps: true 
  }
);

// ============================================
// MIDDLEWARE: Hash de contraseña
// ============================================
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await argon2.hash(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

// ============================================
// MIDDLEWARE: Verificar si el perfil está completo
// ============================================
userSchema.pre('save', function (next) {
  // Actualizar estado de campos requeridos
  this.camposRequeridos = {
    nombre: !!this.nombre,
    apellido: !!this.apellido,
    telefono: !!this.telefono,
    documento: !!(this.documento?.tipo && this.documento?.numero)
  };

  // Verificar si el perfil está completo
  const todosCompletos = Object.values(this.camposRequeridos).every(campo => campo === true);
  this.perfilCompleto = todosCompletos;

  next();
});

// ============================================
// MÉTODOS
// ============================================
userSchema.methods.compararPassword = async function (passwordIngresada) {
  try {
    return await argon2.verify(this.password, passwordIngresada);
  } catch (err) {
    return false;
  }
};

// Método para obtener datos públicos del usuario
userSchema.methods.datosPublicos = function () {
  return {
    _id: this._id,
    nombre: this.nombre,
    apellido: this.apellido,
    email: this.email,
    emailVerificado: this.emailVerificado,
    perfilCompleto: this.perfilCompleto,
    camposRequeridos: this.camposRequeridos
  };
};

// Método para obtener datos completos (sin contraseña)
userSchema.methods.datosSinPassword = function () {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  delete user.tokenVerificacion;
  return user;
};

// Método para verificar si puede hacer reservas
userSchema.methods.puedeReservar = function () {
  return this.perfilCompleto && this.activo && !this.eliminado;
};

// Método para obtener campos faltantes
userSchema.methods.camposFaltantes = function () {
  const faltantes = [];
  
  if (!this.nombre) faltantes.push('nombre');
  if (!this.apellido) faltantes.push('apellido');
  if (!this.telefono) faltantes.push('telefono');
  if (!this.documento?.tipo || !this.documento?.numero) faltantes.push('documento');
  
  return faltantes;
};

// ============================================
// ÍNDICES
// ============================================
userSchema.index({ email: 1 });
userSchema.index({ rol: 1, activo: 1 });
userSchema.index({ eliminado: 1 });
userSchema.index({ 'documento.numero': 1 });

export default mongoose.model('User', userSchema);