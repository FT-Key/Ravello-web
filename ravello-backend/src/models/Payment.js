// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  // Relación con reserva
  reserva: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },

  // Monto
  monto: { type: Number, required: true, min: 0 },
  moneda: { type: String, enum: ['ARS', 'USD', 'EUR'], default: 'ARS' },

  // Tipo de pago
  tipoPago: {
    type: String,
    enum: ['senia', 'total', 'parcial', 'saldo'],
    required: true
  },

  // Método de pago
  metodoPago: {
    type: String,
    enum: ['mercadopago', 'transferencia', 'efectivo', 'tarjeta'],
    required: true
  },

  // Estado del pago
  estado: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado', 'cancelado', 'reembolsado'],
    default: 'pendiente'
  },

  // Datos de MercadoPago
  mercadopago: {
    paymentId: String,          // ID del pago en MP
    preferenceId: String,        // ID de la preferencia
    merchantOrderId: String,     // ID de orden de comercio
    externalReference: String,   // Referencia externa
    status: String,              // approved, rejected, etc
    statusDetail: String,        // Detalle del estado
    paymentType: String,         // credit_card, debit_card, etc
    installments: Number,        // Cuotas
    transactionAmount: Number,   // Monto de la transacción
    netReceivedAmount: Number,   // Monto neto recibido (después de comisiones)

    // Datos del pagador
    payer: {
      email: String,
      identification: {
        type: String,
        number: String
      }
    },

    // Fecha de pago
    dateApproved: Date,

    // Webhook data
    webhookData: mongoose.Schema.Types.Mixed
  },

  // Datos de transferencia bancaria
  transferencia: {
    banco: String,
    cbu: String,
    alias: String,
    comprobanteUrl: String,
    fechaTransferencia: Date
  },

  // Comprobante/Recibo
  comprobanteUrl: String,
  numeroComprobante: String,

  // Auditoría
  usuarioRegistro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Reembolso
  reembolso: {
    realizado: { type: Boolean, default: false },
    monto: Number,
    fecha: Date,
    motivo: String,
    mercadopagoRefundId: String
  },

  notas: String
},
  { timestamps: true });

// Índices
paymentSchema.index({ reserva: 1 });
paymentSchema.index({ estado: 1 });
paymentSchema.index({ 'mercadopago.paymentId': 1 });
paymentSchema.index({ createdAt: -1 });

export default mongoose.model('Payment', paymentSchema);