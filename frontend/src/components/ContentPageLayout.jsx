import React from 'react';
import { motion } from 'framer-motion';

const ContentPageLayout = ({ title, description, children }) => {
  return (
    <motion.div
      className="min-h-screen pt-24 px-4 md:ml-60 bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {description}
        </p>
      </motion.div>

      {children}
    </motion.div>
  );
};

export default ContentPageLayout;
