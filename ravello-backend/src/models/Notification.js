// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Destinatario
  usuario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  email: { type: String, required: true },

  // Tipo de notificación
  tipo: {
    type: String,
    enum: [
      'reserva_confirmada',
      'pago_recibido',
      'recordatorio_pago',
      'cancelacion',
      'actualizacion_reserva',
      'promocion',
      'bienvenida'
    ],
    required: true
  },

  // Contenido
  asunto: { type: String, required: true },
  mensaje: { type: String, required: true },
  html: String,

  // Estado
  estado: {
    type: String,
    enum: ['pendiente', 'enviado', 'fallido', 'leido'],
    default: 'pendiente'
  },

  // Intentos de envío
  intentosEnvio: { type: Number, default: 0 },
  ultimoIntento: Date,
  fechaEnviado: Date,
  
  // Error (si falló)
  error: String,

  // Tracking
  abierto: { type: Boolean, default: false },
  fechaApertura: Date,
  
  // Relación con reserva/pago
  reserva: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking' 
  },
  pago: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Payment' 
  }
}, 
{ timestamps: true });

// Índices
notificationSchema.index({ email: 1, createdAt: -1 });
notificationSchema.index({ estado: 1 });
notificationSchema.index({ tipo: 1 });

export default mongoose.model('Notification', notificationSchema);