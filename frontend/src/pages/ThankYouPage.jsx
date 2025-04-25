import React from "react";
import { Link } from "react-router-dom";

const ThankYouPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-4">
        ขอบคุณสำหรับการสั่งซื้อ!
      </h1>
      <p className="text-lg sm:text-xl mb-6 text-center">
        เราจะดำเนินการจัดส่งให้เร็วที่สุด
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition duration-300 ease-in-out"
      >
        กลับสู่หน้าหลัก
      </Link>
    </div>
  );
};

export default ThankYouPage;
