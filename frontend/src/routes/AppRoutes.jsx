// AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// ผู้ใช้ทั่วไป
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import NormalProductPage from "../pages/NormalProductPage";
import NewProductPage from "../pages/NewProductPage";
import PopularProductPage from "../pages/PopularProductPage";
import ContactPage from "../pages/ContactPage";
import TermsPage from "../pages/TermsPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import AccountSettingPage from "../pages/AccountSettingsPage";
import ThankYouPage from "../pages/ThankYouPage";

// Admin
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedAdminRoute from "../pages/admin/ProtectedAdminRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes ผู้ใช้ทั่วไป */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/normalproduct" element={<NormalProductPage />} />
      <Route path="/newproduct" element={<NewProductPage />} />
      <Route path="/popularproduct" element={<PopularProductPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/account-settings" element={<AccountSettingPage />} />
      <Route path="/thankyou" element={<ThankYouPage />} />

      {/* Routes แอดมิน */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/*" element={
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
