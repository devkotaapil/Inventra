import React from "react";

export default function StockBadge({ item }) {
  const stock = item.currentStock ?? item.inventory?.currentStock ?? 0;
  const reorder = item.reorderPoint ?? item.inventory?.reorderPoint ?? 0;
  const cls = stock === 0 ? "bg-red-100 text-red-700" : stock <= reorder ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700";
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${cls}`}>{stock}</span>;
}

