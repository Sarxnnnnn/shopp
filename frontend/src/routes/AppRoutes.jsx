import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import NormalProductPage from "../pages/NormalProductPage";
import NewProductPage from "../pages/NewProductPage";
import PopularProductPage from "../pages/PopularProductPage";
import AccountSettingsPage from "../pages/AccountSettingsPage";
import NotFoundPage from "../pages/NotFoundPage";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedAdminRoute from "../pages/admin/ProtectedAdminRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import TopUpPage from "../pages/TopUpPage";
import OrderHistoryPage from "../pages/OrderHistoryPage";
import ContactPage from '../pages/ContactPage';
import TermsPage from '../pages/TermsPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import AboutPage from '../pages/AboutPage';
import FaqPage from '../pages/FaqPage';

const AppRoutes = ({ balanceUpdateCallback }) => {
  return (
    <Routes>
      {/* หน้าพื้นฐานของระบบ */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* หน้าที่ต้องล็อกอินก่อนเข้าใช้งาน */}
      <Route path="/topup" element={
        <ProtectedRoute requireAuth={true}>
          <TopUpPage onBalanceUpdate={balanceUpdateCallback} />
        </ProtectedRoute>
      } />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/normalproduct" element={<NormalProductPage />} />
      <Route path="/newproduct" element={<NewProductPage />} />
      <Route path="/popularproduct" element={<PopularProductPage />} />
      <Route
        path="/account-settings"
        element={
          <ProtectedRoute requireAuth={true}>
            <AccountSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-history"
        element={
          <ProtectedRoute requireAuth={true}>
            <OrderHistoryPage />
          </ProtectedRoute>
        }
      />

      {/* หน้าจัดการระบบสำหรับผู้ดูแล */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />

      {/* หน้าข้อมูลทั่วไปของเว็บไซต์ */}
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faq" element={<FaqPage />} />

      {/* หน้าแสดงข้อผิดพลาด */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;