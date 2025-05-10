import React from 'react';
import { motion } from 'framer-motion';
import { History, Check, X } from 'lucide-react';

const TopUpHistory = ({ transactions = [] }) => { // กำหนดค่าเริ่มต้นเป็น array ว่าง
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <History className="w-5 h-5" />
        ประวัติการเติมเงิน
      </h3>
      <div className="space-y-3">
        {transactions?.length > 0 ? (
          transactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center p-3 border dark:border-gray-700 rounded-lg"
            >
              <div>
                <p className="font-medium">฿{transaction.amount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(transaction.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {transaction.status === 'completed' ? (
                  <span className="text-green-500 flex items-center gap-1">
                    <Check size={16} />
                    สำเร็จ
                  </span>
                ) : transaction.status === 'pending' ? (
                  <span className="text-yellow-500">รอตรวจสอบ</span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1">
                    <X size={16} />
                    ไม่สำเร็จ
                  </span>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            ไม่มีประวัติการเติมเงิน
          </div>
        )}
      </div>
    </div>
  );
};

export default TopUpHistory;
