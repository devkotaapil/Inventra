import { body } from "express-validator";
import Inventory from "../models/Inventory.js";
import StockMovement from "../models/StockMovement.js";
import { fail, ok, pagination } from "../utils/helpers.js";

export const stockRules = [body("quantity").isNumeric(), body("reason").optional().isString()];

export async function listInventory(req, res) {
  const { page, limit, skip } = pagination(req);
  const [items, total] = await Promise.all([
    Inventory.find({ owner: req.user._id }).populate("product").sort({ updatedAt: -1 }).skip(skip).limit(limit),
    Inventory.countDocuments({ owner: req.user._id })
  ]);
  ok(res, { items, total, page, pages: Math.ceil(total / limit) || 1 }, "Inventory loaded");
}

export async function lowStock(_req, res) {
  const items = await Inventory.find({ owner: req.user._id, $expr: { $lte: ["$currentStock", "$reorderPoint"] } }).populate("product");
  ok(res, items, "Low stock loaded");
}

export async function restock(req, res) {
  const quantity = Number(req.body.quantity);
  if (quantity <= 0) return fail(res, "Quantity must be greater than zero");
  const inventory = await Inventory.findOne({ owner: req.user._id, product: req.params.productId });
  if (!inventory) return fail(res, "Inventory item not found", 404);
  inventory.currentStock += quantity;
  inventory.lastRestocked = new Date();
  await inventory.save();
  await StockMovement.create({ owner: req.user._id, product: req.params.productId, movementType: "purchase", quantity, reason: req.body.reason || "Restock" });
  ok(res, inventory, "Stock restocked");
}

export async function adjust(req, res) {
  const quantity = Number(req.body.quantity);
  const inventory = await Inventory.findOne({ owner: req.user._id, product: req.params.productId });
  if (!inventory) return fail(res, "Inventory item not found", 404);
  if (inventory.currentStock + quantity < 0) return fail(res, "Adjustment cannot make stock negative");
  inventory.currentStock += quantity;
  await inventory.save();
  await StockMovement.create({ owner: req.user._id, product: req.params.productId, movementType: "adjustment", quantity, reason: req.body.reason || "Manual adjustment" });
  ok(res, inventory, "Stock adjusted");
}
