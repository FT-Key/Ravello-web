import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    iniciales: String, // Calculado automáticamente a partir del nombre
    calificacion: { type: Number, min: 0, max: 5, required: true },
    comentario: String,
    visible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
