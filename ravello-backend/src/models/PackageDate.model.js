import mongoose from "mongoose";

const packageDateSchema = new mongoose.Schema(
  {
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true
    },

    salida: { type: Date, required: true },

    // Será calculado automáticamente
    regreso: { type: Date },

    precioFinal: Number,
    moneda: { type: String, default: "ARS" },

    cuposTotales: Number,
    cuposDisponibles: Number,

    estado: {
      type: String,
      enum: ["disponible", "agotado", "cancelado"],
      default: "disponible"
    },

    notas: String
  },
  { timestamps: true }
);

// ============================================================
// 🟩 Middleware: Calcula la fecha de regreso basado en el itinerario
// ============================================================
packageDateSchema.pre("save", async function (next) {
  try {
    const Package = mongoose.model("Package");
    const pkg = await Package.findById(this.package);

    if (!pkg) {
      return next(new Error("Package no encontrado para esta salida"));
    }

    const dias = pkg.duracionTotal || 0;

    const salida = new Date(this.salida);
    const regreso = new Date(salida);
    regreso.setDate(regreso.getDate() + dias);

    this.regreso = regreso;

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("PackageDate", packageDateSchema);
