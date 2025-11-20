import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    iniciales: {
      type: String,
      trim: true,
    },
    calificacion: {
      type: Number,
      required: [true, "La calificación es obligatoria"],
      min: [0, "La calificación no puede ser menor que 0"],
      max: [5, "La calificación no puede ser mayor que 5"],
    },
    comentario: {
      type: String,
      trim: true,
      maxlength: [500, "El comentario no puede superar los 500 caracteres"],
    },
    paquete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: false,
    },
    tipo: {
      type: String,
      enum: ["empresa", "paquete"],
      default: "empresa",
    },
    // ⚙️ Estado de moderación
    estadoModeracion: {
      type: String,
      enum: ["pendiente", "aprobada", "rechazada"],
      default: "pendiente",
    },
  },
  { timestamps: true }
);

// 🧠 Generar iniciales automáticamente
reviewSchema.pre("save", function (next) {
  if (this.nombre && !this.iniciales) {
    const partes = this.nombre.trim().split(" ");
    this.iniciales = partes
      .map((p) => p.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  }
  next();
});

export default mongoose.model("Review", reviewSchema);
