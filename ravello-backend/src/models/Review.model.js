import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    // 👤 Nombre del autor (visitante)
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },

    // 🔠 Iniciales generadas automáticamente (ej: “FT” para “Franco Toledo”)
    iniciales: {
      type: String,
      trim: true,
    },

    // ⭐ Calificación de 0 a 5
    calificacion: {
      type: Number,
      required: [true, 'La calificación es obligatoria'],
      min: [0, 'La calificación no puede ser menor que 0'],
      max: [5, 'La calificación no puede ser mayor que 5'],
    },

    // 🗒️ Comentario o reseña
    comentario: {
      type: String,
      trim: true,
      maxlength: [500, 'El comentario no puede superar los 500 caracteres'],
    },

    // 👀 Control de visibilidad (para moderar qué reseñas se muestran en la web)
    visible: {
      type: Boolean,
      default: true,
    },

    // 🧳 Relación opcional con un paquete turístico
    paquete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: false, // null → reseña general de la empresa
    },

    // 🏷️ Tipo de reseña: "empresa" o "paquete"
    tipo: {
      type: String,
      enum: ['empresa', 'paquete'],
      default: 'empresa',
    },
  },
  { timestamps: true }
);

// 🧠 Middleware: generar iniciales automáticamente antes de guardar
reviewSchema.pre('save', function (next) {
  if (this.nombre && !this.iniciales) {
    const partes = this.nombre.trim().split(' ');
    this.iniciales = partes
      .map(p => p.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }
  next();
});

export default mongoose.model('Review', reviewSchema);
