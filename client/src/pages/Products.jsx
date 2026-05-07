import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/api";
import DataTable from "../components/DataTable";

const emptyForm = { name: "", category: "", unit: "pcs", costPrice: "", sellingPrice: "", currentStock: "", reorderPoint: 10, reorderQuantity: 20 };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    const res = await api.get("/products?limit=100");
    setProducts(res.data.data.items);
  }
  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    await api.post("/products", {
      ...form,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      currentStock: Number(form.currentStock || 0),
      reorderPoint: Number(form.reorderPoint || 0),
      reorderQuantity: Number(form.reorderQuantity || 1)
    });
    toast.success("Product added with opening stock");
    setForm(emptyForm);
    load();
  }

  return (
    <div className="grid gap-4">
      <form className="card grid gap-3 md:grid-cols-4" onSubmit={submit}>
        <Field label="Name"><input className="input" placeholder="Rice 5kg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
        <Field label="Category"><input className="input" placeholder="Grocery" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></Field>
        <Field label="Unit"><input className="input" placeholder="pcs, bag, bottle" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></Field>
        <Field label="Initial stock"><input className="input" type="number" min="0" value={form.currentStock} onChange={(e) => setForm({ ...form, currentStock: e.target.value })} /></Field>
        <Field label="Cost"><input className="input" type="number" min="0" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} required /></Field>
        <Field label="Price"><input className="input" type="number" min="0" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} required /></Field>
        <Field label="Reorder point"><input className="input" type="number" min="0" value={form.reorderPoint} onChange={(e) => setForm({ ...form, reorderPoint: e.target.value })} /></Field>
        <Field label="Reorder quantity"><input className="input" type="number" min="1" value={form.reorderQuantity} onChange={(e) => setForm({ ...form, reorderQuantity: e.target.value })} /></Field>
        <button className="btn-primary md:col-span-4">Add Product</button>
      </form>
      <DataTable columns={["SKU", "Name", "Category", "Unit", "Price"]} rows={products} renderRow={(p) => [p.sku, p.name, p.category, p.unit, `Rs. ${p.sellingPrice}`]} />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1 text-sm font-bold text-navy/70">
      {label}
      {children}
    </label>
  );
}
