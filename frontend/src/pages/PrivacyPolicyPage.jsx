import React from "react";
import { motion } from "framer-motion";
import { usePageContent } from '../contexts/PageContentContext';
import { DynamicIcon } from "../components/DynamicIcon";

const PrivacyPolicyPage = () => {
  const { pageContents, pageSections, loading } = usePageContent('privacy');

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen pt-24 px-4 md:ml-60 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          {pageContents?.title}
        </h1>

        <div className="prose dark:prose-invert max-w-none mb-8">
          {pageContents?.content}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pageSections?.map((section, index) => (
            <motion.div
              key={section.section_key}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.15 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <DynamicIcon name={section.icon} className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg">{section.title}</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
