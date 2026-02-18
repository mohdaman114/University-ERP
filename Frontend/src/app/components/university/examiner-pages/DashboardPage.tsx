import React from 'react';
import { motion } from 'motion/react';

export function DashboardPage() {
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
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold mb-4">Dashboard Coming Soon</h2>
      <p className="text-muted-foreground text-lg max-w-md">
        We're working hard to bring you the Examiner Dashboard. Stay tuned for updates!
      </p>
    </motion.div>
  );
}
