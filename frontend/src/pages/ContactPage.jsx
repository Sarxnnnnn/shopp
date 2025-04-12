// src/pages/ContactPage.jsx
import React from 'react';
import { Phone, Mail, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

// 🔸 ข้อมูลช่องทางการติดต่อ
const contactItems = [
  {
    icon: <Phone className="w-6 h-6 text-yellow-500" />,
    text: 'โทรศัพท์: 012-345-6789',
  },
  {
    icon: <Mail className="w-6 h-6 text-yellow-500" />,
    text: 'อีเมล: support@example.com',
  },
  {
    icon: <FileText className="w-6 h-6 text-yellow-500" />,
    text: 'เวลาทำการ: จันทร์–ศุกร์ 9:00–18:00',
  },
];

const ContactPage = () => {
  return (
    <motion.div
      className="min-h-screen pt-24 px-4 md:ml-60 bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 🔹 ส่วนหัว */}
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold mb-6 text-yellow-500">
          ติดต่อเรา
        </h1>

        {/* 🔹 กล่องข้อมูลการติดต่อ */}
        <div className="grid gap-4">
          {contactItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex items-center gap-4 hover:shadow-lg transition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.15 }}
              whileHover={{ scale: 1.03 }}
            >
              {item.icon}
              <span className="text-lg font-medium">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactPage;
