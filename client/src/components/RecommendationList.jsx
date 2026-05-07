import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

const toneClass = {
  urgent: "border-l-red-500 bg-red-50/70",
  warning: "border-l-amber-500 bg-amber-50/70",
  info: "border-l-blue-500 bg-blue-50/70"
};

export default function RecommendationList({ items, subtle = false }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const visibleItems = subtle ? items.slice(0, 3) : items;

  if (!visibleItems.length) {
    return <p className={subtle ? "text-sm text-navy/50" : "card"}>No recommendations right now.</p>;
  }

  return (
    <>
      <div className={subtle ? "grid gap-3" : "grid max-h-[68vh] gap-3 overflow-y-auto pr-2"}>
        {visibleItems.map((item, index) => (
          <button
            key={`${item.productId || item.message}-${index}`}
            className={`rounded-lg border border-navy/10 border-l-4 p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${toneClass[item.type] || toneClass.info}`}
            onClick={() => setSelected(item)}
          >
            <p className="text-xs font-black uppercase text-navy/50">{item.type}</p>
            <p className={subtle ? "line-clamp-2 text-sm font-semibold" : "font-semibold"}>{item.message}</p>
          </button>
        ))}
      </div>

      {selected && (
        <Modal title={selected.productName || "Recommendation"} onClose={() => setSelected(null)}>
          <div className="grid gap-3">
            <p className="font-semibold">{selected.message}</p>
            <div className="grid gap-2 rounded-lg bg-cream p-3 text-sm">
              <div className="flex justify-between gap-3"><span>Current stock</span><strong>{selected.currentStock}</strong></div>
              <div className="flex justify-between gap-3"><span>Reorder point</span><strong>{selected.reorderPoint}</strong></div>
              <div className="flex justify-between gap-3"><span>Suggested reorder quantity</span><strong>{selected.reorderQuantity}</strong></div>
              <div className="flex justify-between gap-3"><span>Current stock value</span><strong>Rs. {selected.stockValue || 0}</strong></div>
            </div>
            <button
              className="btn-primary"
              onClick={() => {
                setSelected(null);
                navigate(`/inventory?restock=${selected.productId}`);
              }}
            >
              Go to restocking
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
