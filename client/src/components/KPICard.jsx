import React from "react";

export default function KPICard({ icon: Icon, label, value }) {
  return (
    <section className="card transition hover:-translate-y-0.5 hover:shadow-md">
      <Icon className="mb-3 text-navy" size={24} />
      <p className="text-sm text-navy/60">{label}</p>
      <strong className="text-2xl">{value}</strong>
    </section>
  );
}
