import Product from "../models/Product.js";
import Sale from "../models/Sale.js";

export function ok(res, data, message = "OK", status = 200) {
  return res.status(status).json({ success: true, data, message });
}

export function fail(res, message, status = 400, data = null) {
  return res.status(status).json({ success: false, data, message });
}

export function pagination(req) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
}

export async function generateSku(category) {
  const prefix = category.replace(/[^a-z0-9]/gi, "").slice(0, 3).toUpperCase() || "GEN";
  const count = await Product.countDocuments({ category: new RegExp(`^${category}$`, "i") });
  return `INV-${prefix}-${String(count + 1).padStart(4, "0")}`;
}

export async function generateInvoiceNumber(owner, date = new Date()) {
  const stamp = date.toISOString().slice(0, 10).replaceAll("-", "");
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const count = await Sale.countDocuments({ owner, saleDate: { $gte: start, $lt: end } });
  return `INV-${stamp}-${String(count + 1).padStart(4, "0")}`;
}
