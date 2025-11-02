import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
      trim: true
    },
    telefono: { type: String, match: [/^\+?[0-9\s\-]{7,15}$/, "Teléfono inválido"] },
    mensaje: { type: String, required: true, trim: true, maxlength: 2000 },
    leido: { type: Boolean, default: false },
    ip: String,
    userAgent: String,
    asunto: { type: String, default: "General" }
  },
  { timestamps: true }
);

contactMessageSchema.virtual('resumen').get(function () {
  return this.mensaje.length > 100 ? this.mensaje.slice(0, 100) + '...' : this.mensaje;
});

contactMessageSchema.index({ leido: 1 });

export default mongoose.model('ContactMessage', contactMessageSchema);
