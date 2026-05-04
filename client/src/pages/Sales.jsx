import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [item, setItem] = useState({ product: "", quantity: 1, paymentMethod: "cash" });
  const selectedProduct = useMemo(() => products.find((product) => product._id === item.product), [products, item.product]);

  async function load() {
    const [productsRes, salesRes] = await Promise.all([api.get("/products?limit=100"), api.get("/sales?limit=50")]);
    setProducts(productsRes.data.data.items);
    setSales(salesRes.data.data.items);
  }
  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    await api.post("/sales", { items: [{ product: item.product, quantity: Number(item.quantity) }], paymentMethod: item.paymentMethod });
    toast.success("Sale recorded");
    setItem({ product: "", quantity: 1, paymentMethod: "cash" });
    load();
  }

  return (
    <div className="grid gap-4">
      <form className="card grid gap-3 md:grid-cols-[1fr_120px_160px_160px_auto]" onSubmit={submit}>
        <select className="input" value={item.product} onChange={(e) => setItem({ ...item, product: e.target.value })} required>
          <option value="">Select sold product</option>
          {products.map((p) => <option key={p._id} value={p._id}>{p.name} - Rs. {p.sellingPrice}</option>)}
        </select>
        <input className="input" type="number" min="1" value={item.quantity} onChange={(e) => setItem({ ...item, quantity: e.target.value })} />
        <select className="input" value={item.paymentMethod} onChange={(e) => setItem({ ...item, paymentMethod: e.target.value })}>
          <option value="cash">Cash</option><option value="card">Card</option><option value="digital">Digital</option>
        </select>
        <div className="grid min-h-10 place-items-center rounded-lg bg-cream px-3 text-sm font-bold">
          Rs. {(selectedProduct?.sellingPrice || 0) * Number(item.quantity || 0)}
        </div>
        <button className="btn-primary">Record Sale</button>
      </form>
      <DataTable
        columns={["Invoice", "Products Sold", "Total", "Date"]}
        rows={sales}
        renderRow={(sale) => [
          <button className="font-bold underline" onClick={() => setSelectedSale(sale)}>{sale.invoiceNumber}</button>,
          sale.items.map((saleItem) => saleItem.product?.name).filter(Boolean).join(", "),
          `Rs. ${sale.totalAmount}`,
          new Date(sale.saleDate).toLocaleDateString()
        ]}
      />

      {selectedSale && (
        <Modal title={`Invoice ${selectedSale.invoiceNumber}`} onClose={() => setSelectedSale(null)}>
          <div className="grid gap-3">
            <p className="text-sm text-navy/60">{new Date(selectedSale.saleDate).toLocaleString()} - {selectedSale.paymentMethod}</p>
            <DataTable
              columns={["Product", "Qty", "Unit Price", "Subtotal"]}
              rows={selectedSale.items}
              renderRow={(saleItem) => [saleItem.product?.name || "Product", saleItem.quantity, `Rs. ${saleItem.unitPrice}`, `Rs. ${saleItem.subtotal}`]}
            />
            <div className="rounded-lg bg-cream p-3 text-right text-xl font-black">Total: Rs. {selectedSale.totalAmount}</div>
          </div>
        </Modal>
      )}
    </div>
  );
}
