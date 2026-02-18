import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUniversity } from '@/contexts/UniversityContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Progress, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui-components';

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

export function StudentDashboardPage() {
    const { user, authenticatedFetch } = useAuth();
    const { } = useUniversity();
    const [attendancePercentage, setAttendancePercentage] = useState<number | null>(null);
    const [totalFees, setTotalFees] = useState<number | null>(null);
    const [pendingFees, setPendingFees] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notices, setNotices] = useState<any[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch Attendance Data
          const attendanceResponse = await authenticatedFetch('/api/attendance', {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          const attendanceData = await attendanceResponse.json();
          setAttendancePercentage(attendanceData.overallAttendancePercentage);

          // Fetch Fee Data
          const feeResponse = await authenticatedFetch('/api/fees/my');
          const feeData = await feeResponse.json();
          
          let calculatedTotalFees = 0;
          let calculatedPendingFees = 0;

          if (feeData && feeData.feeSummary) {
            feeData.feeSummary.forEach((fee: any) => {
              calculatedTotalFees += fee.totalAmount;
              calculatedPendingFees += fee.pendingAmount;
            });
          }
          setTotalFees(calculatedTotalFees);
          setPendingFees(calculatedPendingFees);

          // Fetch Notices
          const noticesResponse = await authenticatedFetch('/api/notices');
          const noticesData = await noticesResponse.json();
          setNotices(noticesData);

        } catch (err: any) {
          console.error("Error fetching dashboard data:", err);
          setError(err.message || 'An error occurred while fetching dashboard data.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [authenticatedFetch]);

    if (isLoading) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h2>
          <p>Loading dashboard data...</p>
        </motion.div>
      );
    }
  
    if (error) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h2>
          <p className="text-red-500">Error: {error}</p>
        </motion.div>
      );
    }
  
    return (
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Welcome Section */}
        <motion.div variants={item}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's your academic overview.
          </p>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Attendance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendancePercentage !== null ? `${attendancePercentage}%` : 'N/A'}</div>
                <p className="text-xs text-muted-foreground">Overall attendance percentage</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalFees !== null ? totalFees.toFixed(2) : 'N/A'}</div>
                <p className="text-xs text-muted-foreground">Total fees charged across all semesters</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${pendingFees !== null ? pendingFees.toFixed(2) : 'N/A'}</div>
                <p className="text-xs text-muted-foreground">Outstanding balance</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Other sections (Latest Results, Recent Notices) can remain or be updated as needed */}
        {/* For now, removing temporary data from these as well, as per instruction "remove all the tempiry data" */}



        {/* Recent Notices Overview - Keeping structure, but removing temporary data */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Notices</CardTitle>
              <CardDescription>Important announcements and updates.</CardDescription>
            </CardHeader>
            <CardContent>
              {notices.length > 0 ? (
                <div className="space-y-4">
                  {notices.map((notice: any) => (
                    <div key={notice._id} className="border-b pb-2 last:border-b-0 last:pb-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{notice.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{notice.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notice.date).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No recent notices available.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }
