import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // ปิด scroll ขณะ modal เปิด
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onCancel}
          />

          {/* Modal Container - ใช้ flex center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
              <div className="flex items-center gap-4 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-semibold">ยืนยันการสั่งซื้อ</h3>
              </div>
              <div className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-300">{message}</p>
                <p className="text-sm text-red-500 mt-2">
                  หมายเหตุ: กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดยืนยัน เนื่องจากไม่สามารถยกเลิกรายการได้ในภายหลัง ชื่อและรหัสจะถูกส่งอยู่ในหน้าประวัติคำสั่งซื้อ
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
