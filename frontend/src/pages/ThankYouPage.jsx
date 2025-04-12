// pages/ThankYouPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const ThankYouPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-4">ขอบคุณสำหรับการสั่งซื้อ!</h1>
      <p className="mb-6">เราจะดำเนินการจัดส่งให้เร็วที่สุด</p>
      <Link to="/" className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">
        กลับสู่หน้าหลัก
      </Link>
    </div>
  );
};

export default ThankYouPage;
