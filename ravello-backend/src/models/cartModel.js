import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
