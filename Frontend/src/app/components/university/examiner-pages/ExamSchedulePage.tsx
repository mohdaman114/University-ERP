import React from 'react';
import { motion } from 'motion/react';

export function ExamSchedulePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8"
    >
      <div className="bg-primary/10 p-6 rounded-full mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary w-12 h-12"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold mb-4">Exam Schedule Coming Soon</h2>
      <p className="text-muted-foreground text-lg max-w-md">
        This feature is under development. You will soon be able to manage exam schedules here.
      </p>
    </motion.div>
  );
}
