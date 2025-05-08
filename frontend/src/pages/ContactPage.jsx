import React, { useState } from 'react';
import { Phone, Mail, FileText, MessageSquare, Facebook, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

// 🔸 ข้อมูลช่องทางการติดต่อ
const contactItems = [
  {
    icon: <Phone className="w-6 h-6 text-yellow-500" />,
    title: "โทรศัพท์",
    text: "012-345-6789",
    description: "ติดต่อได้ในเวลาทำการ"
  },
  {
    icon: <Mail className="w-6 h-6 text-yellow-500" />,
    title: "อีเมล",
    text: "support@example.com",
    description: "ตอบกลับภายใน 24 ชั่วโมง"
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-yellow-500" />,
    title: "Line Official",
    text: "@yourlineid",
    description: "ติดต่อได้ตลอด 24 ชั่วโมง"
  },
  {
    icon: <Facebook className="w-6 h-6 text-yellow-500" />,
    title: "Facebook",
    text: "facebook.com/yourpage",
    description: "ติดตามข่าวสารและโปรโมชั่น"
  }
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
        setSubmitted(true); 
        showNotification('ส่งข้อความสำเร็จ ขอบคุณสำหรับการติดต่อ', 'success');
      } else {
        showNotification('เกิดข้อผิดพลาดในการส่งข้อความ', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('ไม่สามารถส่งข้อความได้ในขณะนี้', 'error');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 md:ml-60 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          ช่องทางการติดต่อ
        </h1>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {contactItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex items-start gap-4 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-yellow-500 font-medium">{item.text}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {item.description}
                </p>
              </div>
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
      </div>
    </div>
  );
};

export default ContactPage;
