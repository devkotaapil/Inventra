import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <Sidebar />
      <main className="min-w-0 p-4 lg:p-6">
        <Navbar />
        {children}
      </main>
    </div>
  );
}

