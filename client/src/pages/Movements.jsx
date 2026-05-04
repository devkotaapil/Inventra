import React, { useEffect, useState } from "react";
import api from "../api/api";
import DataTable from "../components/DataTable";

export default function Movements() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/movements?limit=100").then((res) => setItems(res.data.data.items));
  }, []);

  return (
    <DataTable
      columns={["Product", "Type", "Qty", "Reason", "Date"]}
      rows={items}
      renderRow={(m) => [m.product?.name, m.movementType, m.quantity, m.reason, new Date(m.createdAt).toLocaleString()]}
    />
  );
}

