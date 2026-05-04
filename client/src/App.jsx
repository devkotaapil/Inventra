import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
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

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
      <Route path="/products" element={<ProtectedPage><Products /></ProtectedPage>} />
      <Route path="/inventory" element={<ProtectedPage><Inventory /></ProtectedPage>} />
      <Route path="/sales" element={<ProtectedPage><Sales /></ProtectedPage>} />
      <Route path="/analytics" element={<ProtectedPage><Analytics /></ProtectedPage>} />
      <Route path="/recommendations" element={<ProtectedPage><Recommendations /></ProtectedPage>} />
      <Route path="/movements" element={<ProtectedPage><Movements /></ProtectedPage>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

