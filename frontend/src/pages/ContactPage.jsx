import React, { useState } from 'react';
import { Phone, Mail, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios'; // นำเข้า axios

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/contact', { name, email, message });

      if (response.data.success) {
        setSubmitted(true); // หากส่งข้อความสำเร็จ
      } else {
        setError('เกิดข้อผิดพลาดในการส่งข้อความ');
      }
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการส่งคำขอ');
    }
  };

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
        <h1 className="text-2xl font-bold mb-6 text-yellow-500">ติดต่อเรา</h1>

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

        {/* 🔹 ฟอร์มการติดต่อ */}
        <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold text-yellow-500 mb-4">ส่งข้อความ</h2>

          {submitted ? (
            <p className="text-center text-green-500">ข้อความของคุณถูกส่งเรียบร้อยแล้ว</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="ชื่อของคุณ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
              />
              <input
                type="email"
                placeholder="อีเมลของคุณ"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
              />
              <textarea
                placeholder="ข้อความ"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
              />
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded transition"
              >
                ส่งข้อความ
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactPage;
