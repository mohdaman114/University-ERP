import React from 'react';
import { motion } from 'motion/react';
import { DashboardPage } from './DashboardPage';
import { FeesManagementPage } from './FeesManagementPage';
import { PaymentsPage } from './PaymentsPage';
import { ReceiptsPage } from './ReceiptsPage';
import { ReportsPage } from './ReportsPage';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function AccountantDashboard({ currentPage }: { currentPage: string }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {currentPage === 'dashboard' && <DashboardPage />}
      {currentPage === 'feesmanagement' && <FeesManagementPage />}
      {currentPage === 'payments' && <PaymentsPage />}
      {currentPage === 'receipts' && <ReceiptsPage />}
      {currentPage === 'reports' && <ReportsPage />}
    </motion.div>
  );
}
