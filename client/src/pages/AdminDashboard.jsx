import React, { useEffect, useState } from "react";
import { Boxes, CircleDollarSign, ReceiptText, Store, Users } from "lucide-react";
import api from "../api/api";
import DataTable from "../components/DataTable";
import KPICard from "../components/KPICard";
import Modal from "../components/Modal";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({});
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  async function load() {
    const [summaryRes, usersRes] = await Promise.all([
      api.get("/admin/summary"),
      api.get(`/admin/users?limit=100&search=${encodeURIComponent(search)}`)
    ]);
    setSummary(summaryRes.data.data);
    setUsers(usersRes.data.data.items);
  }

  useEffect(() => {
    load();
  }, []);

  async function openUser(user) {
    const res = await api.get(`/admin/users/${user._id}`);
    setSelected(res.data.data);
  }

  return (
    <div className="grid gap-4">
      <section className="grid gap-4 md:grid-cols-5">
        <KPICard icon={Users} label="Total Users" value={summary.users || 0} />
        <KPICard icon={Store} label="Shop Users" value={summary.shops || 0} />
        <KPICard icon={Boxes} label="Products" value={summary.products || 0} />
        <KPICard icon={ReceiptText} label="Sales" value={summary.sales || 0} />
        <KPICard icon={CircleDollarSign} label="Revenue" value={`Rs. ${summary.revenue || 0}`} />
      </section>

      <section className="card grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <label className="grid gap-1 text-sm font-bold text-navy/70">
          Search users
          <input className="input" placeholder="Name, email, or shop name" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <button className="btn-primary" onClick={load}>Search</button>
      </section>

      <DataTable
        columns={["Name", "Email", "Shop", "Products", "Sales", "Revenue", "Action"]}
        rows={users}
        empty="No users found"
        renderRow={(user) => [
          user.name,
          user.email,
          user.shopName || "-",
          user.products,
          user.sales,
          `Rs. ${user.revenue}`,
          <button className="font-bold underline" onClick={() => openUser(user)}>View</button>
        ]}
      />

      {selected && (
        <Modal title={`${selected.user.name} - ${selected.user.shopName || "Admin account"}`} onClose={() => setSelected(null)}>
          <div className="grid max-h-[72vh] gap-4 overflow-y-auto pr-2">
            <section className="rounded-lg bg-cream p-3 text-sm">
              <p><strong>Email:</strong> {selected.user.email}</p>
              <p><strong>Phone:</strong> {selected.user.phone || "-"}</p>
              <p><strong>Joined:</strong> {new Date(selected.user.createdAt).toLocaleDateString()}</p>
            </section>
            <AdminMiniTable title="Recent Products" columns={["Name", "Category", "Price"]} rows={selected.products} renderRow={(p) => [p.name, p.category, `Rs. ${p.sellingPrice}`]} />
            <AdminMiniTable title="Recent Sales" columns={["Invoice", "Total", "Date"]} rows={selected.sales} renderRow={(s) => [s.invoiceNumber, `Rs. ${s.totalAmount}`, new Date(s.saleDate).toLocaleDateString()]} />
            <AdminMiniTable title="Inventory Snapshot" columns={["Product", "Stock", "Reorder"]} rows={selected.inventory} renderRow={(i) => [i.product?.name || "Product", i.currentStock, i.reorderPoint]} />
          </div>
        </Modal>
      )}
    </div>
  );
}

function AdminMiniTable({ title, columns, rows, renderRow }) {
  return (
    <section>
      <h3 className="mb-2 font-black">{title}</h3>
      <DataTable columns={columns} rows={rows || []} renderRow={renderRow} empty="No records" />
    </section>
  );
}
