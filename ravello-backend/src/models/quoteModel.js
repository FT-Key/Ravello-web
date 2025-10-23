import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    destination: { type: String, required: true },
    message: { type: String },
    dateRange: { type: String }, // ej. "10/11/2025 - 15/11/2025"
    type: { type: String, enum: ["Nacional", "Internacional"], required: true },
    status: { type: String, enum: ["pendiente", "respondido"], default: "pendiente" }
  },
  { timestamps: true }
);

export default mongoose.model("Quote", quoteSchema);
