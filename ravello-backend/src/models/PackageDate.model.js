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
// 🟣 Middleware: recalcular regreso en updates
// ============================================================
packageDateSchema.pre("findOneAndUpdate", async function (next) {
  console.log("🟣 PRE-UPDATE PackageDate ejecutado");

  const update = this.getUpdate();
  console.log("📥 Update recibido:", update);

  // Determinar package y salida
  const pkgId = update.package || this._conditions.package;
  const salida = update.salida;

  console.log("📦 package ID:", pkgId);
  console.log("📅 nueva salida:", salida);

  // Si no hay salida, no recalcular
  if (!pkgId || !salida) return next();

  try {
    const Package = mongoose.model("Package");
    const pkg = await Package.findById(pkgId);

    if (!pkg) {
      console.log("❌ Package no encontrado");
      return next(new Error("Package no encontrado para esta salida"));
    }

    const dias = pkg.duracionTotal || 0;
    const salidaDate = new Date(salida);
    const regresoDate = new Date(salidaDate);
    regresoDate.setDate(regresoDate.getDate() + dias);

    console.log("📅 regreso calculado:", regresoDate);

    // Insertar regreso en el update
    update.regreso = regresoDate;
    this.setUpdate(update);

    console.log("🟢 Regreso agregado a update");
    next();
  } catch (err) {
    console.log("❌ Error:", err);
    next(err);
  }
});

export default mongoose.model("PackageDate", packageDateSchema);
