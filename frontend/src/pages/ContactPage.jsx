import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePageContent } from '../contexts/PageContentContext';
import { useNotification } from "../contexts/NotificationContext";
import axios from 'axios';
import { DynamicIcon } from "../components/DynamicIcon";

const ContactPage = () => {
  const { pageContents, pageSections, loading } = usePageContent('contact');
  const { showNotification } = useNotification();
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
          {pageContents?.title}
        </h1>

        <div className="prose dark:prose-invert max-w-none mb-8">
          {pageContents?.content}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {pageSections?.map((section, index) => (
            <motion.div
              key={section.section_key}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-primary/10 p-3 rounded-lg">
                <DynamicIcon name={section.icon} className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{section.title}</h3>
                <p className="text-primary">{section.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

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
