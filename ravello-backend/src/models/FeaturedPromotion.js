import mongoose from "mongoose";

const featuredPromotionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    default: "Ofertas imperdibles",
  },
  descripcion: {
    type: String,
    default: "",
  },
  packages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
  ],
  activo: {
    type: Boolean,
    default: true,
  },
});

// ✅ Validación: exactamente 2 paquetes
featuredPromotionSchema.path("packages").validate(function (value) {
  return value.length === 2;
}, "Deben seleccionarse exactamente 2 paquetes.");

// ✅ Hook: garantizar que solo exista una instancia
featuredPromotionSchema.pre("save", async function (next) {
  const existing = await mongoose.model("FeaturedPromotion").countDocuments();
  if (existing >= 1 && this.isNew) {
    const err = new Error("Solo puede existir una instancia de FeaturedPromotion.");
    err.code = "ONLY_ONE_ALLOWED";
    return next(err);
  }
  next();
});

export default mongoose.model("FeaturedPromotion", featuredPromotionSchema);
