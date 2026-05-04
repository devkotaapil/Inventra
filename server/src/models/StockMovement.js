import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    movementType: { type: String, enum: ["purchase", "sale", "adjustment", "return"], required: true },
    quantity: { type: Number, required: true },
    reason: { type: String, trim: true },
    reference: { type: mongoose.Schema.Types.ObjectId },
    createdAt: { type: Date, default: Date.now }
  }
);

stockMovementSchema.index({ owner: 1, product: 1, createdAt: -1 });

export default mongoose.model("StockMovement", stockMovementSchema);
