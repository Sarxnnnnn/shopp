import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const faqs = [
    {
      question: "วิธีการสั่งซื้อสินค้า",
      answer: "ท่านสามารถเลือกสินค้าที่ต้องการ เพิ่มลงตะกร้า และทำการชำระเงินได้ทันที"
    },
    {
      question: "ช่องทางการชำระเงิน",
      answer: "รองรับการชำระเงินผ่านระบบเติมเงินในเว็บไซต์"
    },
    {
      question: "การจัดส่งสินค้า",
      answer: "จัดส่งสินค้าภายใน 24 ชั่วโมงหลังจากได้รับการยืนยันการชำระเงิน"
    },
    {
      question: "นโยบายการคืนสินค้า",
      answer: "สามารถคืนสินค้าได้ภายใน 7 วันหากพบปัญหาจากตัวสินค้า"
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-4 md:ml-60">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12"
        >
          คำถามที่พบบ่อย
        </motion.h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center"
              >
                <span className="font-semibold">{faq.question}</span>
                <ChevronDown
                  className={`transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
