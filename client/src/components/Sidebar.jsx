import React from "react";
import { BarChart3, Boxes, ClipboardList, Home, Lightbulb, PackageCheck, ReceiptText, TrendingUp } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  ["/", "Dashboard", Home],
  ["/products", "Products", Boxes],
  ["/inventory", "Inventory", PackageCheck],
  ["/sales", "Sales", ReceiptText],
  ["/analytics", "Analytics", BarChart3],
  ["/recommendations", "Recommendations", Lightbulb],
  ["/movements", "Movements", ClipboardList]
];

export default function Sidebar() {
  return (
    <aside className="bg-navy p-4 text-white lg:min-h-screen">
      <div className="mb-6 text-2xl font-black">Inventra</div>
      <nav className="flex gap-2 overflow-x-auto lg:grid">
        {links.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${isActive ? "bg-white text-navy" : "text-white/80 hover:bg-white/10"}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <TrendingUp className="mt-8 hidden text-white/20 lg:block" size={80} />
    </aside>
  );
}

