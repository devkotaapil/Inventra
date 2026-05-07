import React, { useEffect, useState } from "react";
import api from "../api/api";
import RecommendationList from "../components/RecommendationList";

export default function Recommendations() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/analytics/recommendations").then((res) => setItems(res.data.data));
  }, []);

  return (
    <RecommendationList items={items} />
  );
}
