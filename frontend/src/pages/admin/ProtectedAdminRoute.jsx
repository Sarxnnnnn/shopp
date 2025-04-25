// src/pages/admin/ProtectedAdminRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/AdminAuthContext"; // ใช้ AdminAuthContext
import axios from "axios";

const ProtectedAdminRoute = ({ children }) => {
  const { admin, loading: authLoading, setAdmin } = useAdminAuth(); // ใช้ useAdminAuth สำหรับตรวจสอบแอดมิน
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // หากไม่มี token หรือไม่ใช่แอดมินให้ข้ามการเรียก API
      if (!admin) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/api/check-admin", {
          headers: { Authorization: `Bearer ${admin.token}` },
        });

        const role = response.data.isAdmin ? "admin" : "user";
        setAdmin((prev) => ({ ...prev, role }));
      } catch (error) {
        console.error("Error checking admin status:", error);
        setAdmin(null); // ล้างสถานะ admin
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [admin, setAdmin, authLoading]);

  if (loading) return <div>Loading...</div>;

  const isAdmin = admin?.role === "admin";

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
