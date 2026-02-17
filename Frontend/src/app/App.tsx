import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { UniversityProvider } from '@/contexts/UniversityContext';
import { LoginPage } from '@/app/components/university/LoginPage';
import { DashboardLayout } from '@/app/components/university/DashboardLayout';
import { StudentDashboard } from '@/app/components/university/StudentDashboard';
import { AdminDashboardPage } from '@/app/components/university/admin-pages/AdminDashboardPage';
import { StudentManagementPage } from '@/app/components/university/admin-pages/StudentManagementPage';
import { FacultyManagementPage } from '@/app/components/university/admin-pages/FacultyManagementPage';
import { AccountantManagementPage } from '@/app/components/university/admin-pages/AccountantManagementPage';
import { NoticeManagementPage } from '@/app/components/university/admin-pages/NoticeManagementPage';
import { AdminTimetableManagementPage } from '@/app/components/university/admin-pages/AdminTimetableManagementPage';
import CourseManagementPage from '@/app/components/university/admin-pages/CourseManagementPage';
import { AdminProfilePage } from '@/app/components/university/admin-pages/AdminProfilePage';
import { FacultyDashboard } from '@/app/components/university/FacultyDashboard';
import { AccountantDashboard } from '@/app/components/university/accountant-pages/AccountantDashboard';
import {
  ExaminationDashboard,
  LibraryDashboard,
} from '@/app/components/university/OtherDashboards';
import { AIChatbox } from '@/app/components/AIChatbox';
import { LoadingScreen } from '@/app/components/LoadingScreen';
import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

// Public Website Components
import { PublicNavbar } from '@/app/components/website/PublicNavbar';
import { PublicFooter } from '@/app/components/website/PublicFooter';
import { HomePage } from '@/app/components/website/HomePage';
import { AboutPage } from '@/app/components/website/AboutPage';
import { AcademicsPage } from '@/app/components/website/AcademicsPage';
import { AdmissionsPage } from '@/app/components/website/AdmissionsPage';
import { ResearchPage } from '@/app/components/website/ResearchPage';
import { CampusPage } from '@/app/components/website/CampusPage';
import { NewsPage } from '@/app/components/website/NewsPage';
import { GalleryPage } from '@/app/components/website/GalleryPage';
import { ContactPage } from '@/app/components/website/ContactPage';

// Public Website Layout
function PublicWebsite() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/campus" element={<CampusPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <PublicFooter />
      <AIChatbox />
    </div>
  );
}

// ERP System Component
function ERPSystem() {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  const renderDashboard = () => {
    // Render different dashboards based on user role
    switch (user.role) {
      case 'super_admin':
      case 'admin':
        if (currentPage === 'dashboard') {
          return <AdminDashboardPage />;
        }
        if (currentPage === 'students') {
          return <StudentManagementPage />;
        }
        if (currentPage === 'faculty') {
          return <FacultyManagementPage />;
        }
        if (currentPage === 'accountants') {
          return <AccountantManagementPage />;
        }
        if (currentPage === 'notices') {
          return <NoticeManagementPage />;
        }
        if (currentPage === 'courses') {
          return <CourseManagementPage />;
        }
        if (currentPage === 'timetable') {
          return <AdminTimetableManagementPage />;
        }
        if (currentPage === 'profile') {
          return <AdminProfilePage />;
        }
        // For other admin pages, show coming soon
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h2>
            <p className="text-gray-600 dark:text-gray-400">This page is under development.</p>
          </div>
        );

      case 'student':
        return <StudentDashboard currentPage={currentPage} />;

      case 'faculty':
        return <FacultyDashboard currentPage={currentPage} />;

      case 'examination':
        return <ExaminationDashboard />;

      case 'accountant':
        return <AccountantDashboard currentPage={currentPage} />;

      case 'library':

        return <LibraryDashboard />;

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your dashboard is being set up.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderDashboard()}
      </DashboardLayout>
      <AIChatbox />
    </>
  );
}

// Main App Component
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <UniversityProvider>
          <Routes>
            {/* ERP Portal Route */}
            <Route path="/erp/*" element={<ERPSystem />} />
            
            {/* Public Website Routes */}
            <Route path="/*" element={<PublicWebsite />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </UniversityProvider>
      </AuthProvider>
    </Router>
  );
}