import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    destination: { type: String, required: true },
    image: { type: String }, // URL Firebase
    category: { type: String, enum: ["Nacional", "Internacional"], required: true },
    duration: { type: String }, // ej. "5 días / 4 noches"
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);
