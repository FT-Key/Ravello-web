import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        package: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true }
      }
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pendiente", "pagado", "cancelado"], default: "pendiente" },
    paymentId: { type: String }, // ID de Mercado Pago
    status: { type: String, enum: ["creada", "confirmada", "cancelada"], default: "creada" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
