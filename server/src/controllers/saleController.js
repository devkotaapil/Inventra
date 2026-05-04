import { body } from "express-validator";
import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import StockMovement from "../models/StockMovement.js";
import { fail, generateInvoiceNumber, ok, pagination } from "../utils/helpers.js";

export const saleRules = [
  body("items").isArray({ min: 1 }),
  body("items.*.product").notEmpty(),
  body("items.*.quantity").isInt({ min: 1 }),
  body("paymentMethod").optional().isIn(["cash", "card", "digital"])
];

export async function createSale(req, res) {
  const saleItems = [];
  let total = 0;

  for (const item of req.body.items) {
    const product = await Product.findOne({ _id: item.product, owner: req.user._id });
    const inventory = await Inventory.findOne({ owner: req.user._id, product: item.product });
    if (!product || !product.isActive || !inventory) return fail(res, "Product not found", 404);
    if (inventory.currentStock < item.quantity) return fail(res, `${product.name} does not have enough stock`);
    const subtotal = product.sellingPrice * item.quantity;
    total += subtotal;
    saleItems.push({ product: product._id, quantity: item.quantity, unitPrice: product.sellingPrice, subtotal });
  }

  const discount = Number(req.body.discount || 0);
  const sale = await Sale.create({
    owner: req.user._id,
    invoiceNumber: await generateInvoiceNumber(req.user._id),
    items: saleItems,
    totalAmount: total - discount,
    discount,
    paymentMethod: req.body.paymentMethod || "cash"
  });

  for (const item of saleItems) {
    await Inventory.updateOne({ owner: req.user._id, product: item.product }, { $inc: { currentStock: -item.quantity } });
    await StockMovement.create({ owner: req.user._id, product: item.product, movementType: "sale", quantity: -item.quantity, reason: "Sale", reference: sale._id });
  }

  ok(res, sale, "Sale recorded", 201);
}

export async function listSales(req, res) {
  const { page, limit, skip } = pagination(req);
  const filter = { owner: req.user._id };
  if (req.query.from || req.query.to) filter.saleDate = {};
  if (req.query.from) filter.saleDate.$gte = new Date(req.query.from);
  if (req.query.to) filter.saleDate.$lte = new Date(req.query.to);
  const [items, total] = await Promise.all([
    Sale.find(filter).populate("items.product").sort({ saleDate: -1 }).skip(skip).limit(limit),
    Sale.countDocuments(filter)
  ]);
  ok(res, { items, total, page, pages: Math.ceil(total / limit) || 1 }, "Sales loaded");
}

export async function getSale(req, res) {
  const sale = await Sale.findOne({ _id: req.params.id, owner: req.user._id }).populate("items.product");
  if (!sale) return fail(res, "Sale not found", 404);
  ok(res, sale, "Sale loaded");
}

export async function dailySummary(_req, res) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const data = await Sale.aggregate([{ $match: { owner: req.user._id, saleDate: { $gte: start } } }, { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } }]);
  ok(res, data[0] || { total: 0, count: 0 }, "Daily summary loaded");
}

export async function monthlySummary(_req, res) {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const data = await Sale.aggregate([{ $match: { owner: req.user._id, saleDate: { $gte: start } } }, { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } }]);
  ok(res, data[0] || { total: 0, count: 0 }, "Monthly summary loaded");
}
