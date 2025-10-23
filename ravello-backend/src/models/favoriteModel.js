import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  itemId: {
    type: String,
    required: true
  },
  itemType: {
    type: String,
    required: true
  },
  itemName: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model("Favorite", favoriteSchema);
