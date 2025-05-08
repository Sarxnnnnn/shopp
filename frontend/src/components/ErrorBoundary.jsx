import React from "react";
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // อัปเดต state เพื่อแสดง UI สำรองเมื่อเกิดข้อผิดพลาด
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // สามารถบันทึกข้อผิดพลาดไปยังบริการ log ได้
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full animate-fade-in">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertTriangle className="w-16 h-16 text-yellow-500 animate-bounce" />
              <h1 className="text-2xl font-bold">เกิดข้อผิดพลาดในระบบ</h1>
              <p className="text-gray-600 dark:text-gray-400">
                ขออภัยในความไม่สะดวก กรุณารีเฟรชหน้าเว็บหรือกลับมาใหม่ภายหลัง
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                รีเฟรชหน้าเว็บ
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              >
                กลับสู่หน้าหลัก
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;