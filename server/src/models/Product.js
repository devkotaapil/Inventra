import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    category: { type: String, required: true, trim: true },
    unit: { type: String, default: "pcs", trim: true },
    costPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.index({ owner: 1, name: "text", sku: "text", category: "text" });

export default mongoose.model("Product", productSchema);
