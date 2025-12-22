// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // Relaciones
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

  // Precios
  precioTotal: { type: Number, required: true },
  descuentoAplicado: { type: Number, default: 0 },
  montoSenia: { type: Number, required: true },
  montoPendiente: { type: Number, required: true },
  moneda: { type: String, enum: ['ARS', 'USD', 'EUR'], default: 'ARS' },

  // Estado de la reserva
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'pagada', 'cancelada', 'completada'],
    default: 'pendiente'
  },

  // Fechas límite
  fechaLimitePago: { type: Date, required: true },

  // Datos de contacto (por si el usuario no está registrado)
  datosContacto: {
    nombre: String,
    email: String,
    telefono: String,
    documento: String
  },

  // Pasajeros
  pasajeros: [{
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    tipoDocumento: { type: String, enum: ['DNI', 'Pasaporte', 'Otro'] },
    numeroDocumento: String,
    fechaNacimiento: Date,
    esMenor: { type: Boolean, default: false }
  }],

  // Observaciones
  notasCliente: String,
  notasInternas: String,

  // Cancelación
  motivoCancelacion: String,
  fechaCancelacion: Date,
  reembolsoRealizado: { type: Boolean, default: false }
},
  { timestamps: true });

// Índices
bookingSchema.index({ usuario: 1, estado: 1 });
bookingSchema.index({ fechaSalida: 1 });
bookingSchema.index({ estado: 1, createdAt: -1 });

export default mongoose.model('Booking', bookingSchema);