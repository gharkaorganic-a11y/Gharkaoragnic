// routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext"; // adjust path

export const ProtectedRoute = ({ children }) => {
  const { isAuthorized, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F1F3F6]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2874F0]" />
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};
