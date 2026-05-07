import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();
  if (authLoading) return <div className="grid min-h-screen place-items-center bg-cream font-bold text-navy">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/" replace />;
}
