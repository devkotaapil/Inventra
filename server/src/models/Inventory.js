import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
    currentStock: { type: Number, default: 0, min: 0 },
    reorderPoint: { type: Number, default: 10, min: 0 },
    reorderQuantity: { type: Number, default: 20, min: 1 },
    lastRestocked: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);
