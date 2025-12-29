import mongoose from "mongoose";

const packageDateSchema = new mongoose.Schema(
  {
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true
    },

    salida: {
      type: Date,
      required: true
    },

    // Fecha de regreso calculada automáticamente
    regreso: {
      type: Date
    },

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

/* ============================================================
   🟢 UTIL: calcular fecha de regreso
============================================================ */
async function calcularRegreso(packageId, salida) {
  if (!packageId || !salida) return null;

  const Package = mongoose.model("Package");
  const pkg = await Package.findById(packageId);

  if (!pkg) {
    throw new Error("Package no encontrado para calcular regreso");
  }

  const dias = pkg.duracionTotal || 0;

  const salidaDate = new Date(salida);
  const regresoDate = new Date(salidaDate);
  regresoDate.setDate(regresoDate.getDate() + dias);

  return regresoDate;
}

/* ============================================================
   🟣 PRE-SAVE → creación
============================================================ */
packageDateSchema.pre("save", async function (next) {
  try {
    // Solo al crear y si no está calculado
    if (!this.isNew || this.regreso) return next();

    const regreso = await calcularRegreso(this.package, this.salida);
    if (regreso) this.regreso = regreso;

    next();
  } catch (err) {
    next(err);
  }
});

/* ============================================================
   🟣 PRE-FINDONEANDUPDATE → updates
============================================================ */
packageDateSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();

    const salida =
      update.salida ||
      update.$set?.salida;

    const packageId =
      update.package ||
      update.$set?.package ||
      this._conditions.package;

    // Si no cambia la salida, no recalcular
    if (!salida || !packageId) return next();

    const regreso = await calcularRegreso(packageId, salida);

    if (regreso) {
      update.$set = {
        ...update.$set,
        regreso
      };
    }

    this.setUpdate(update);
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("PackageDate", packageDateSchema);
