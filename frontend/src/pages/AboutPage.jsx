import React from 'react';
import { motion } from 'framer-motion';
import { usePageContent } from '../contexts/PageContentContext';
import { DynamicIcon } from "../components/DynamicIcon";

const AboutPage = () => {
  const { pageContents, pageSections, loading } = usePageContent('about');

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen pt-24 px-4 md:ml-60 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {pageContents?.title}
        </h1>

        <div className="prose dark:prose-invert max-w-none mb-12">
          {pageContents?.content}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pageSections?.map((section, index) => (
            <motion.div
              key={section.section_key}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <DynamicIcon name={section.icon} className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
