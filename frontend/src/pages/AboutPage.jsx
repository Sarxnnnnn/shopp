import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Clock, CreditCard } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-yellow-500" />,
      title: "สินค้าคุณภาพ",
      description: "เราคัดสรรสินค้าคุณภาพดีที่สุดสำหรับลูกค้า"
    },
    {
      icon: <Truck className="w-8 h-8 text-yellow-500" />,
      title: "จัดส่งรวดเร็ว",
      description: "บริการจัดส่งรวดเร็ว ติดตามสถานะได้ตลอดเวลา"
    },
    {
      icon: <Clock className="w-8 h-8 text-yellow-500" />,
      title: "บริการ 24/7",
      description: "พร้อมให้บริการตลอด 24 ชั่วโมง"
    },
    {
      icon: <CreditCard className="w-8 h-8 text-yellow-500" />,
      title: "ชำระเงินปลอดภัย",
      description: "ระบบชำระเงินที่ปลอดภัยและน่าเชื่อถือ"
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
          เกี่ยวกับเรา
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-4">
                {feature.icon}
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
