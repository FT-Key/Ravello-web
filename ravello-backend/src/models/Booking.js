// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // Número de reserva único
  numeroReserva: {
    type: String,
    unique: true,  // ✅ Esto ya crea el índice automáticamente
    required: true
  },

  // Relaciones
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  paquete: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  fechaSalida: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PackageDate',
    required: true
  },

  // Datos del viaje
  cantidadPasajeros: {
    adultos: { type: Number, required: true, min: 1 },
    ninos: { type: Number, default: 0, min: 0 }
  },

  // 💰 SISTEMA DE PRECIOS Y PAGOS
  precioTotal: { type: Number, required: true },
  descuentoAplicado: { type: Number, default: 0 },
  montoTotal: { type: Number, required: true }, // Precio final después de descuentos
  montoPagado: { type: Number, default: 0 },
  montoPendiente: { type: Number, required: true },
  moneda: { type: String, enum: ['ARS', 'USD', 'EUR'], default: 'ARS' },

  // 📅 PLAN DE CUOTAS
  planCuotas: {
    tipo: {
      type: String,
      enum: ['contado', 'cuotas_fijas', 'personalizado'],
      default: 'contado'
    },
    cantidadCuotas: { type: Number, default: 1 },
    montoPorCuota: Number,

    // Cuotas individuales
    cuotas: [{
      numeroCuota: { type: Number, required: true },
      monto: { type: Number, required: true },
      fechaVencimiento: { type: Date, required: true },

      estado: {
        type: String,
        enum: ['pendiente', 'pagada', 'vencida', 'cancelada'],
        default: 'pendiente'
      },

      // Referencia al pago que la cubrió
      pagos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
      }],

      montoPagado: { type: Number, default: 0 },
      montoPendiente: { type: Number, required: true },

      notas: String
    }]
  },

  // Estado de la reserva
  estado: {
    type: String,
    enum: [
      'pendiente',           // Recién creada
      'confirmada',          // Confirmada pero con saldo pendiente
      'pagada_completa',     // Totalmente pagada
      'en_proceso_pago',     // Pagando cuotas
      'vencida',             // Cuotas vencidas
      'cancelada',           // Cancelada por el cliente o sistema
      'completada'           // Viaje realizado
    ],
    default: 'pendiente'
  },

  // Fechas importantes
  fechaCreacion: { type: Date, default: Date.now },
  fechaConfirmacion: Date,
  fechaLimitePagoTotal: Date, // Fecha límite para completar el pago

  // Datos de contacto
  datosContacto: {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true },
    documento: { type: String, required: true },
    tipoDocumento: {
      type: String,
      enum: ['DNI', 'CUIL', 'Pasaporte', 'Otro'],
      default: 'DNI'
    }
  },

  // Pasajeros adicionales
  pasajeros: [{
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    tipoDocumento: { type: String, enum: ['DNI', 'Pasaporte', 'Otro'] },
    numeroDocumento: String,
    fechaNacimiento: Date,
    esMenor: { type: Boolean, default: false },
    relacionConTitular: String // ej: "cónyuge", "hijo", etc.
  }],

  // Observaciones
  notasCliente: String,
  notasInternas: String,
  requisitosEspeciales: String, // alergias, dietas, etc.

  // Cancelación
  cancelacion: {
    realizada: { type: Boolean, default: false },
    fecha: Date,
    motivo: String,
    reembolso: {
      realizado: { type: Boolean, default: false },
      monto: Number,
      fecha: Date,
      metodo: String
    }
  },

  // Auditoría
  usuarioCreador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ultimaModificacion: {
    fecha: Date,
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    motivo: String
  }
},
  { timestamps: true });

// ============================================
// MIDDLEWARE: Generar número de reserva
// ============================================
bookingSchema.pre('save', async function (next) {
  if (!this.numeroReserva) {
    const count = await mongoose.model('Booking').countDocuments();
    const fecha = new Date();
    const year = fecha.getFullYear().toString().slice(-2);
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const numero = (count + 1).toString().padStart(4, '0');

    this.numeroReserva = `RES-${year}${month}-${numero}`;
  }
  next();
});

// ============================================
// MIDDLEWARE: Actualizar estado según pagos
// ============================================
bookingSchema.methods.actualizarEstadoPago = function () {
  const { montoPagado, montoTotal } = this;

  if (montoPagado === 0) {
    this.estado = 'pendiente';
  } else if (montoPagado >= montoTotal) {
    this.estado = 'pagada_completa';
  } else {
    this.estado = 'en_proceso_pago';
  }
};

// ============================================
// MÉTODOS: Agregar pago
// ============================================
bookingSchema.methods.registrarPago = async function (montoPago, pagoId) {
  this.montoPagado += montoPago;
  this.montoPendiente = this.montoTotal - this.montoPagado;

  // Actualizar cuotas si las hay
  if (this.planCuotas.cuotas && this.planCuotas.cuotas.length > 0) {
    let montoRestante = montoPago;

    for (let cuota of this.planCuotas.cuotas) {
      if (cuota.estado === 'pendiente' && montoRestante > 0) {
        const montoAAplicar = Math.min(montoRestante, cuota.montoPendiente);

        cuota.montoPagado += montoAAplicar;
        cuota.montoPendiente -= montoAAplicar;
        cuota.pagos.push(pagoId);

        if (cuota.montoPendiente <= 0) {
          cuota.estado = 'pagada';
        }

        montoRestante -= montoAAplicar;
      }
    }
  }

  this.actualizarEstadoPago();
  await this.save();
};

// ============================================
// ÍNDICES
// ============================================
// ❌ ELIMINADO: bookingSchema.index({ numeroReserva: 1 }); 
// ↑ Ya está cubierto por unique: true en la definición del campo

bookingSchema.index({ usuario: 1, estado: 1 });
bookingSchema.index({ fechaSalida: 1 });
bookingSchema.index({ estado: 1, createdAt: -1 });
bookingSchema.index({ 'datosContacto.email': 1 });

export default mongoose.model('Booking', bookingSchema);