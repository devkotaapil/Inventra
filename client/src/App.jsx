import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import Analytics from "./pages/Analytics";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Movements from "./pages/Movements";
import Products from "./pages/Products";
import Recommendations from "./pages/Recommendations";
import Register from "./pages/Register";
import Sales from "./pages/Sales";

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function ShopPage({ children }) {
  const { user, authLoading } = useAuth();

  if (authLoading) return <div className="grid min-h-screen place-items-center bg-cream font-bold text-navy">Loading...</div>;
  if (user?.isAdmin) return <Navigate to="/admin" replace />;

  return <ProtectedPage>{children}</ProtectedPage>;
}

function AdminPage() {
  const { user, authLoading } = useAuth();

  if (authLoading) return <div className="grid min-h-screen place-items-center bg-cream font-bold text-navy">Loading...</div>;
  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ProtectedPage>
      <AdminDashboard />
    </ProtectedPage>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<ShopPage><Dashboard /></ShopPage>} />
      <Route path="/products" element={<ShopPage><Products /></ShopPage>} />
      <Route path="/inventory" element={<ShopPage><Inventory /></ShopPage>} />
      <Route path="/sales" element={<ShopPage><Sales /></ShopPage>} />
      <Route path="/analytics" element={<ShopPage><Analytics /></ShopPage>} />
      <Route path="/recommendations" element={<ShopPage><Recommendations /></ShopPage>} />
      <Route path="/movements" element={<ShopPage><Movements /></ShopPage>} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
