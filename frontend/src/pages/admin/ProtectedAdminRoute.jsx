// src/pages/admin/ProtectedAdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuth();

  // สมมุติว่าเฉพาะ user ที่เป็น admin เท่านั้นที่เข้าได้
  const isAdmin = user?.role === "admin";

  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
