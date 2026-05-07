import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, CircleDollarSign, PackageMinus, ReceiptText } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../api/api";
import KPICard from "../components/KPICard";
import RecommendationList from "../components/RecommendationList";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [trend, setTrend] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    api.get("/analytics/dashboard").then((res) => setStats(res.data.data));
    api.get("/analytics/revenue-trend").then((res) => setTrend(res.data.data));
    api.get("/analytics/recommendations").then((res) => setRecommendations(res.data.data));
  }, []);

  return (
    <div className="grid gap-4">
      <section className="grid gap-4 md:grid-cols-4">
        <Link to="/products"><KPICard icon={Boxes} label="Products" value={stats.products || 0} /></Link>
        <Link to="/sales"><KPICard icon={ReceiptText} label="Sales Today" value={stats.todaySales || 0} /></Link>
        <Link to="/analytics"><KPICard icon={CircleDollarSign} label="Revenue Today" value={`Rs. ${stats.revenue || 0}`} /></Link>
        <Link to="/inventory"><KPICard icon={PackageMinus} label="Low Stock" value={stats.lowStock || 0} /></Link>
      </section>
      <section className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Revenue over time</h2>
          <Link className="text-sm font-bold underline" to="/analytics">Open analytics</Link>
        </div>
        <div className="h-80">
          <ResponsiveContainer>
            <LineChart data={trend}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#1E2A5E" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="card">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-bold">Quiet stock notes</h2>
            <p className="text-sm text-navy/50">A few suggestions worth checking before the shelf gets thin.</p>
          </div>
          <Link className="text-sm font-bold underline" to="/recommendations">View all</Link>
        </div>
        <RecommendationList items={recommendations} subtle />
      </section>
    </div>
  );
}
