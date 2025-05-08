import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white p-6">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-10 max-w-lg w-full text-center animate-fade-in md:ml-[15rem]">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-16 h-16 text-yellow-500" />
        </div>
        <h1 className="text-5xl font-extrabold mb-3">404</h1>
        <h2 className="text-2xl font-semibold mb-2">ไม่พบหน้านี้</h2>
        <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
          ขออภัย! เราไม่พบหน้าที่คุณกำลังค้นหา หรืออาจถูกลบไปแล้ว
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          กลับสู่หน้าหลัก
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
