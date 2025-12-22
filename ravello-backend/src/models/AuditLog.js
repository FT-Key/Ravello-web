// models/AuditLog.js
import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  // Usuario que realizó la acción
  usuario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  usuarioEmail: String, // Por si se elimina el usuario

  // Acción realizada
  accion: {
    type: String,
    enum: [
      // Reservas
      'reserva_creada', 'reserva_modificada', 'reserva_cancelada',
      // Pagos
      'pago_iniciado', 'pago_aprobado', 'pago_rechazado', 'pago_reembolsado',
      // Usuarios
      'usuario_creado', 'usuario_modificado', 'usuario_eliminado',
      'login', 'logout', 'cambio_password',
      // Paquetes
      'paquete_creado', 'paquete_modificado', 'paquete_eliminado',
      // Otros
      'acceso_denegado', 'error_sistema'
    ],
    required: true
  },

  // Entidad afectada
  entidad: {
    tipo: { 
      type: String, 
      enum: ['Booking', 'Payment', 'User', 'Package', 'PackageDate', 'Sistema'] 
    },
    id: mongoose.Schema.Types.ObjectId
  },

  // Detalles
  descripcion: { type: String, required: true },
  
  // Datos antes y después (para modificaciones)
  datosAnteriores: mongoose.Schema.Types.Mixed,
  datosNuevos: mongoose.Schema.Types.Mixed,

  // Contexto técnico
  ip: String,
  userAgent: String,
  
  // Nivel de severidad
  nivel: {
    type: String,
    enum: ['info', 'warning', 'error', 'critical'],
    default: 'info'
  },

  // Metadata adicional
  metadata: mongoose.Schema.Types.Mixed
}, 
{ timestamps: true });

// Índices
auditLogSchema.index({ usuario: 1, createdAt: -1 });
auditLogSchema.index({ accion: 1, createdAt: -1 });
auditLogSchema.index({ 'entidad.tipo': 1, 'entidad.id': 1 });
auditLogSchema.index({ nivel: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);