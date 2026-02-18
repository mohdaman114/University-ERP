import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { useUniversity } from '@/contexts/UniversityContext';
import { StudentDashboardPage } from '@/app/components/university/student-pages/StudentDashboardPage';
import { AttendancePage } from '@/app/components/university/student-pages/AttendancePage';
import { ResultsPage } from '@/app/components/university/student-pages/ResultsPage';
import { TimetablePage } from '@/app/components/university/student-pages/TimetablePage';
import { FeesPage } from '@/app/components/university/student-pages/FeesPage';
import { NoticePage } from '@/app/components/university/student-pages/NoticePage';
import { ProfilePage } from '@/app/components/university/student-pages/ProfilePage';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StudentDashboard({ currentPage }: { currentPage: string }) {
    const { user } = useAuth();
    const { } = useUniversity();
  
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* Conditional Rendering for Pages */}
      {currentPage === 'dashboard' && <StudentDashboardPage />}
      {currentPage === 'attendance' && <AttendancePage />}
      {currentPage === 'results' && <ResultsPage />}
      {currentPage === 'timetable' && <TimetablePage />}
      {currentPage === 'fees' && <FeesPage />}
        {currentPage === 'notice' && <NoticePage />}
        {currentPage === 'profile' && <ProfilePage />}

    </motion.div>
  );
}
