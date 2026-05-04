import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Recommendations() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/analytics/recommendations").then((res) => setItems(res.data.data));
  }, []);

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <section key={index} className={`card border-l-4 ${item.type === "urgent" ? "border-l-red-500" : item.type === "warning" ? "border-l-amber-500" : "border-l-blue-500"}`}>
          <p className="text-xs font-bold uppercase text-navy/50">{item.type}</p>
          <p className="font-semibold">{item.message}</p>
        </section>
      ))}
      {!items.length && <p className="card">No recommendations yet.</p>}
    </div>
  );
}

