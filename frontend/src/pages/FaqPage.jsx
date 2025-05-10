import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { usePageContent } from '../contexts/PageContentContext';
import { DynamicIcon } from "../components/DynamicIcon";

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { pageContents, pageSections, loading } = usePageContent('faq');

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen pt-24 px-4 md:ml-60 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-8"
        >
          {pageContents?.title}
        </motion.h1>

        <div className="prose dark:prose-invert max-w-none mb-8">
          {pageContents?.content}
        </div>

        <div className="space-y-4">
          {pageSections?.map((section, index) => (
            <motion.div
              key={section.section_key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <DynamicIcon name={section.icon} className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{section.title}</span>
                </div>
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
                      {section.content}
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
