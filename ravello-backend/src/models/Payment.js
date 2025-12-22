// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  // Número de pago único
  numeroPago: {
    type: String,
    unique: true,  // ✅ Esto ya crea el índice automáticamente
    required: true
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
  // 🛒 MERCADOPAGO (Checkout Pro)
  // ============================================
  mercadopago: {
    // IDs de MercadoPago
    preferenceId: String,        // ID de la preferencia creada
    paymentId: String,            // ID del pago (cuando se completa)
    merchantOrderId: String,      // ID de la orden
    externalReference: String,    // Nuestra referencia (puede ser el numeroPago)

    // Estado de MP
    status: String,               // approved, rejected, pending, etc.
    statusDetail: String,         // Detalles del estado

    // Tipo de pago
    paymentTypeId: String,        // credit_card, debit_card, ticket, etc.
    paymentMethodId: String,      // visa, mastercard, rapipago, etc.

    // Cuotas (si paga con tarjeta)
    installments: Number,         // Cantidad de cuotas
    installmentAmount: Number,    // Monto por cuota

    // Montos
    transactionAmount: Number,    // Monto de la transacción
    netReceivedAmount: Number,    // Monto neto (después de comisiones MP)
    totalPaidAmount: Number,      // Monto total pagado por el usuario

    // Comisión de MercadoPago
    feeDetails: [{
      type: String,
      amount: Number,
      feePayer: String
    }],

    // Datos del pagador
    payer: {
      id: String,
      email: String,
      firstName: String,
      lastName: String,
      identification: {
        type: String,
        number: String
      },
      phone: {
        areaCode: String,
        number: String
      }
    },

    // Fechas
    dateCreated: Date,            // Fecha de creación en MP
    dateApproved: Date,           // Fecha de aprobación
    dateLastUpdated: Date,        // Última actualización

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
    // Método específico
    metodo: {
      type: String,
      enum: ['efectivo', 'tarjeta_debito', 'tarjeta_credito', 'mixto']
    },

    // Si es tarjeta
    tarjeta: {
      tipo: { type: String, enum: ['debito', 'credito'] },
      marca: String, // Visa, Mastercard, etc.
      ultimos4Digitos: String,
      cuotas: Number,
      numeroAutorizacion: String,
      numeroTerminal: String,
      numeroLote: String
    },

    // Si es mixto
    detalleMixto: [{
      metodo: String,
      monto: Number
    }],

    // Recibo
    numeroRecibo: String,
    fechaRecibo: Date,

    // Cajero que procesó el pago
    usuarioRecibio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return this.metodoPago !== 'mercadopago';
      }
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

    // Datos del comprobante
    numeroComprobante: String,
    fechaTransferencia: Date,
    comprobanteUrl: String, // URL del comprobante subido

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
    metodo: String, // mismo_medio, efectivo, transferencia
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

  // Auditoría
  usuarioRegistro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  fechaRegistro: { type: Date, default: Date.now }
},
  { timestamps: true });

// ============================================
// MIDDLEWARE: Generar número de pago
// ============================================
paymentSchema.pre('save', async function (next) {
  if (!this.numeroPago) {
    const count = await mongoose.model('Payment').countDocuments();
    const fecha = new Date();
    const year = fecha.getFullYear().toString().slice(-2);
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const numero = (count + 1).toString().padStart(5, '0');

    this.numeroPago = `PAG-${year}${month}-${numero}`;
  }
  next();
});

// ============================================
// ÍNDICES
// ============================================
// ❌ ELIMINADO: paymentSchema.index({ numeroPago: 1 }); 
// ↑ Ya está cubierto por unique: true en la definición del campo

paymentSchema.index({ reserva: 1, estado: 1 });
paymentSchema.index({ metodoPago: 1 });
paymentSchema.index({ estado: 1 });
paymentSchema.index({ 'mercadopago.paymentId': 1 });
paymentSchema.index({ createdAt: -1 });

export default mongoose.model('Payment', paymentSchema);