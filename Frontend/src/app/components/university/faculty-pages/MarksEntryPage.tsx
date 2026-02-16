import React from 'react';
import { motion } from 'framer-motion';

export function MarksEntryPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full py-10"
    >
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Marks Entry</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">This section is coming soon!</p>
    </motion.div>
  );
}
