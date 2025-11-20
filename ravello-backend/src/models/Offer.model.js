import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: String,
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: false,
    },
    tipoDescuento: {
      type: String,
      enum: ['porcentaje', 'monto'],
      default: 'porcentaje',
    },
    valorDescuento: { type: Number, required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    destacada: { type: Boolean, default: false },
    imagen: String,
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Offer', offerSchema);
