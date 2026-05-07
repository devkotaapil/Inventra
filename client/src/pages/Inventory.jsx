import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import api from "../api/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import StockBadge from "../components/StockBadge";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [restocking, setRestocking] = useState(null);
  const [form, setForm] = useState({ quantity: 10, reason: "Manual restock" });
  const [searchParams, setSearchParams] = useSearchParams();

  async function load() {
    const res = await api.get("/inventory?limit=100");
    setItems(res.data.data.items);
  }
  useEffect(() => { load(); }, []);

  useEffect(() => {
    const productId = searchParams.get("restock");
    if (!productId || !items.length) return;
    const match = items.find((item) => item.product?._id === productId);
    if (match) {
      setRestocking(match);
      setForm({ quantity: match.reorderQuantity || 10, reason: "Restock from recommendation" });
      setSearchParams({});
    }
  }, [items, searchParams, setSearchParams]);

  async function submitRestock(e) {
    e.preventDefault();
    await api.put(`/inventory/restock/${restocking.product._id}`, { quantity: Number(form.quantity), reason: form.reason });
    toast.success("Stock updated");
    setRestocking(null);
    setForm({ quantity: 10, reason: "Manual restock" });
    load();
  }

  async function deleteProduct(item) {
    const productName = item.product?.name || "this product";
    if (!window.confirm(`Delete ${productName}? It will be removed from product and inventory lists.`)) return;

    try {
      await api.delete(`/products/${item.product._id}`);
      toast.success("Product deleted");
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete product");
    }
  }

  return (
    <>
      <DataTable
        columns={["Product", "Stock", "Reorder Point", "Total Stock Price", "Action"]}
        rows={items}
        renderRow={(item) => [
          item.product?.name,
          <StockBadge key={item._id} item={item} />,
          item.reorderPoint,
          `Rs. ${(item.currentStock || 0) * (item.product?.sellingPrice || 0)}`,
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => setRestocking(item)}>Restock</button>
            <button className="inline-flex min-h-10 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-bold text-red-700 hover:bg-red-100" onClick={() => deleteProduct(item)} title="Delete product">
              <Trash2 size={16} />
            </button>
          </div>
        ]}
      />

      {restocking && (
        <Modal title={`Restock ${restocking.product?.name}`} onClose={() => setRestocking(null)}>
          <form className="grid gap-3" onSubmit={submitRestock}>
            <label className="grid gap-1 text-sm font-bold text-navy/70">
              Quantity to add
              <input className="input" type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            </label>
            <label className="grid gap-1 text-sm font-bold text-navy/70">
              Reason / note
              <input className="input" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            </label>
            <div className="rounded-lg bg-cream p-3 text-sm font-semibold">
              Current stock: {restocking.currentStock} · New stock: {Number(restocking.currentStock || 0) + Number(form.quantity || 0)}
            </div>
            <button className="btn-primary">Save restock</button>
          </form>
        </Modal>
      )}
    </>
  );
}
