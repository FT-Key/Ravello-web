import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: String,

    // Oferta puede estar asociada a un paquete existente
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: false,
    },

    // Descuento: puede ser % o monto fijo
    tipoDescuento: {
      type: String,
      enum: ['porcentaje', 'monto'],
      default: 'porcentaje',
    },
    valorDescuento: { type: Number, required: true },

    // Fechas de validez
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },

    // Si se desea mostrar como oferta destacada
    destacada: { type: Boolean, default: false },

    // Imagen de portada
    imagen: String,

    // Estado
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Offer', offerSchema);
