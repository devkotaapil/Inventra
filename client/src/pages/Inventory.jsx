import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/api";
import DataTable from "../components/DataTable";
import StockBadge from "../components/StockBadge";

export default function Inventory() {
  const [items, setItems] = useState([]);

  async function load() {
    const res = await api.get("/inventory?limit=100");
    setItems(res.data.data.items);
  }
  useEffect(() => { load(); }, []);

  async function restock(item) {
    const quantity = Number(prompt("Quantity to add?", "10"));
    if (!quantity) return;
    await api.put(`/inventory/restock/${item.product._id}`, { quantity, reason: "Manual restock" });
    toast.success("Stock updated");
    load();
  }

  return (
    <DataTable
      columns={["Product", "Stock", "Reorder Point", "Action"]}
      rows={items}
      renderRow={(item) => [item.product?.name, <StockBadge key={item._id} item={item} />, item.reorderPoint, <button className="btn-secondary" onClick={() => restock(item)}>Restock</button>]}
    />
  );
}

