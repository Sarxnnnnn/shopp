// src/pages/TermsPage.jsx
import React from 'react';
import { ShieldCheck, ClipboardList, PackageCheck, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

// ✅ ข้อมูลเงื่อนไขทั้งหมด
const terms = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: '1. ข้อตกลงทั่วไป',
    content:
      'ผู้ใช้ต้องให้ข้อมูลที่ถูกต้องและเป็นความจริงเมื่อสมัครสมาชิก และต้องไม่ใช้เว็บไซต์ในทางที่ผิดหรือผิดกฎหมาย',
  },
  {
    icon: <PackageCheck className="w-6 h-6 text-primary" />,
    title: '2. การจัดการคำสั่งซื้อ',
    content:
      'ทางร้านขอสงวนสิทธิ์ในการยกเลิกคำสั่งซื้อหากเกิดปัญหาด้านการชำระเงินหรือการส่งสินค้า',
  },
  {
    icon: <ClipboardList className="w-6 h-6 text-primary" />,
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
  return (
    <motion.div
      className="min-h-screen pt-24 px-4 md:ml-60 bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 🔸 Heading & Description */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-4xl font-bold mb-4">เงื่อนไขการให้บริการ</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          การเข้าใช้งานเว็บไซต์ของเราแสดงว่าคุณยอมรับข้อกำหนดและเงื่อนไขต่าง ๆ กรุณาอ่านข้อมูลอย่างละเอียดก่อนใช้งาน
        </p>
      </motion.div>

      {/* 🔸 เงื่อนไขแต่ละข้อ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {terms.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.15 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* 🔹 Icon */}
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
              {item.icon}
            </div>

            {/* 🔹 Content */}
            <div>
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-700 dark:text-gray-300">{item.content}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TermsPage;
