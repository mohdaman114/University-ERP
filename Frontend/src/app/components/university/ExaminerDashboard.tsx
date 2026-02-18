import React from 'react';
import { motion } from 'motion/react';
import { DashboardPage } from './examiner-pages/DashboardPage';
import { MarksUpdatePage } from './examiner-pages/MarksUpdatePage';
import { ExamSchedulePage } from './examiner-pages/ExamSchedulePage';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function ExaminerDashboard({ currentPage }: { currentPage: string }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {currentPage === 'dashboard' && <DashboardPage />}
      {currentPage === 'marks' && <MarksUpdatePage />}
      {currentPage === 'schedule' && <ExamSchedulePage />}
      
      {/* Fallback for undefined routes */}
      {!['dashboard', 'marks', 'schedule'].includes(currentPage) && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
          <p className="text-gray-500">The page "{currentPage}" does not exist.</p>
        </div>
      )}
    </motion.div>
  );
}
