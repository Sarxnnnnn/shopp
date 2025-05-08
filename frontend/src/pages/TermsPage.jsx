import React from "react";
import { motion } from "framer-motion";
import { Shield, ClipboardCheck, PackageCheck, RefreshCcw } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";

// ✅ ข้อมูลเงื่อนไขทั้งหมด
const terms = [
  {
    icon: <Shield className="w-6 h-6 text-primary" />,
    title: '1. ข้อตกลงทั่วไป',
    content: 'การใช้บริการของเราถือว่าคุณได้ยอมรับข้อตกลงทั้งหมดแล้ว'
  },
  {
    icon: <PackageCheck className="w-6 h-6 text-primary" />,
    title: '2. การจัดการคำสั่งซื้อ',
    content:
      'ทางร้านขอสงวนสิทธิ์ในการยกเลิกคำสั่งซื้อหากเกิดปัญหาด้านการชำระเงินหรือการส่งสินค้า',
  },
  {
    icon: <ClipboardCheck className="w-6 h-6 text-primary" />,
    title: '3. ลิขสิทธิ์',
    content:
      'เนื้อหา รูปภาพ และข้อมูลทั้งหมดบนเว็บไซต์นี้เป็นทรัพย์สินของเรา ห้ามคัดลอกหรือเผยแพร่โดยไม่ได้รับอนุญาต',
  },
  {
    icon: <RefreshCcw className="w-6 h-6 text-primary" />,
    title: '4. การเปลี่ยนแปลงเงื่อนไข',
    content:
      'เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงเงื่อนไขการให้บริการโดยไม่ต้องแจ้งให้ทราบล่วงหน้า',
  },
];

// ✅ Component หลัก
const TermsPage = () => {
  const { showNotification } = useNotification();
  
  const handleAcceptTerms = () => {
    localStorage.setItem('terms-accepted', 'true');
    showNotification('ยอมรับเงื่อนไขการใช้งานเรียบร้อยแล้ว', 'success');
  };

  return (
    <div className="min-h-screen pt-24 px-4 md:ml-60 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          เงื่อนไขการให้บริการ
        </h1>
        
        <div className="grid grid-cols-1 gap-6">
          {terms.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.15 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
                {item.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-700 dark:text-gray-300">{item.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
