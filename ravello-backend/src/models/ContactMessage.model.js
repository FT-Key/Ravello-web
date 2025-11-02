import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: String,
    mensaje: { type: String, required: true },
    leido: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);
