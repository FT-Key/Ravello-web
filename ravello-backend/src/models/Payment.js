// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  // Número de pago único
  numeroPago: {
    type: String,
    unique: true,
    sparse: true
  },

  // Relación con reserva
  reserva: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },

  // 💰 MONTO
  monto: { type: Number, required: true, min: 0 },
  moneda: { type: String, enum: ['ARS', 'USD', 'EUR'], default: 'ARS' },

  // 🏷️ CLASIFICACIÓN DEL PAGO
  tipoPago: {
    type: String,
    enum: ['senia', 'cuota', 'saldo', 'total'],
    required: true
  },

  // Cuota relacionada (si aplica)
  numeroCuota: Number,

  // 💳 MÉTODO DE PAGO
  metodoPago: {
    type: String,
    enum: ['mercadopago', 'efectivo', 'tarjeta_presencial', 'transferencia', 'cheque'],
    required: true
  },

  // 📊 ESTADO DEL PAGO
  estado: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado', 'cancelado', 'reembolsado', 'en_revision'],
    default: 'pendiente'
  },

  // ============================================
  // 🛒 MERCADOPAGO (Checkout Pro & Bricks)
  // ============================================
  mercadopago: {
    // IDs de MercadoPago
    preferenceId: String,
    paymentId: String,
    merchantOrderId: String,
    externalReference: String,

    // Estado de MP
    status: String,
    statusDetail: String,

    // Tipo de pago
    paymentTypeId: String,
    paymentMethodId: String,

    // Cuotas (si paga con tarjeta)
    installments: Number,
    installmentAmount: Number,

    // Montos
    transactionAmount: Number,
    netReceivedAmount: Number,
    totalPaidAmount: Number,

    // ⬅️ CORRECCIÓN CRÍTICA: feeDetails con { type: { type: String } }
    feeDetails: [{
      type: { type: String },  // ⬅️ Así se define un campo llamado "type"
      amount: Number,
      feePayer: String
    }],

    // ⬅️ CORRECCIÓN CRÍTICA: payer.identification con { type: { type: String } }
    payer: {
      id: String,
      email: String,
      firstName: String,
      lastName: String,
      identification: {
        type: { type: String },  // ⬅️ Así se define un campo llamado "type"
        number: String
      },
      phone: {
        areaCode: String,
        number: String
      }
    },

    // Tarjeta
    card: {
      firstSixDigits: String,
      lastFourDigits: String
    },

    // Fechas
    dateCreated: Date,
    dateApproved: Date,
    dateLastUpdated: Date,

    // URL para volver
    backUrls: {
      success: String,
      failure: String,
      pending: String
    },

    // Datos completos del webhook
    webhookData: mongoose.Schema.Types.Mixed
  },

  // ============================================
  // 💵 PAGO PRESENCIAL (efectivo/tarjeta en oficina)
  // ============================================
  presencial: {
    metodo: {
      type: String,
      enum: ['efectivo', 'tarjeta_debito', 'tarjeta_credito', 'mixto']
    },

    tarjeta: {
      tipo: { type: String, enum: ['debito', 'credito'] },
      marca: String,
      ultimos4Digitos: String,
      cuotas: Number,
      numeroAutorizacion: String,
      numeroTerminal: String,
      numeroLote: String
    },

    detalleMixto: [{
      metodo: String,
      monto: Number
    }],

    numeroRecibo: String,
    fechaRecibo: Date,

    usuarioRecibio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },

  // ============================================
  // 🏦 TRANSFERENCIA BANCARIA
  // ============================================
  transferencia: {
    banco: String,
    tipoCuenta: { type: String, enum: ['CA', 'CC'] },
    numeroCuenta: String,
    cbu: String,
    alias: String,
    titular: String,

    numeroComprobante: String,
    fechaTransferencia: Date,
    comprobanteUrl: String,

    verificado: { type: Boolean, default: false },
    fechaVerificacion: Date,
    usuarioVerificacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },

  // ============================================
  // 🧾 COMPROBANTE GENERAL
  // ============================================
  comprobante: {
    tipo: {
      type: String,
      enum: ['factura_a', 'factura_b', 'factura_c', 'recibo', 'ticket', 'ninguno'],
      default: 'recibo'
    },
    numero: String,
    url: String,
    fechaEmision: Date
  },

  // ============================================
  // 🔄 REEMBOLSO
  // ============================================
  reembolso: {
    realizado: { type: Boolean, default: false },
    monto: Number,
    fecha: Date,
    motivo: String,
    metodo: String,
    mercadopagoRefundId: String,
    usuarioAutorizo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },

  // ============================================
  // 📝 OBSERVACIONES
  // ============================================
  notas: String,
  notasInternas: String,

  usuarioRegistro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  fechaRegistro: { type: Date, default: Date.now },

  // ============================================
  // 🔐 SEGURIDAD Y ANTI-FRAUDE
  // ============================================
  seguridad: {
    ip: String,
    userAgent: String,
    navegador: String,
    dispositivo: String,

    esRiesgoso: { type: Boolean, default: false },
    motivoRiesgo: String,
    scoreRiesgo: { type: Number, min: 0, max: 100 },

    verificaciones: [{
      tipo: { type: String, enum: ['ip', 'email', 'documento', '3ds', 'manual'] },
      resultado: { type: String, enum: ['aprobado', 'rechazado', 'pendiente'] },
      fecha: { type: Date, default: Date.now },
      detalles: String
    }]
  },

  usuarioInicio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

// ============================================
// MIDDLEWARE: Generar número de pago
// ============================================
paymentSchema.pre('save', async function (next) {
  if (!this.numeroPago && this.isNew) {
    try {
      const count = await mongoose.model('Payment').countDocuments();
      const fecha = new Date();
      const year = fecha.getFullYear().toString().slice(-2);
      const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const numero = (count + 1).toString().padStart(5, '0');

      this.numeroPago = `PAG-${year}${month}-${numero}`;

      console.log('✅ Número de pago generado:', this.numeroPago);
    } catch (error) {
      console.error('❌ Error generando número de pago:', error);
      return next(error);
    }
  }
  next();
});

// ============================================
// ÍNDICES
// ============================================
paymentSchema.index({ reserva: 1, estado: 1 });
paymentSchema.index({ metodoPago: 1 });
paymentSchema.index({ estado: 1 });
paymentSchema.index({ 'mercadopago.paymentId': 1 });
paymentSchema.index({ createdAt: -1 });

export default mongoose.model('Payment', paymentSchema);