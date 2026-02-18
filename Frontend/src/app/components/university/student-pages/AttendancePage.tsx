import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Progress } from './ui-components';

interface AttendanceRecord {
  date: string;
  subject: string;
  status: 'present' | 'absent';
}

export function AttendancePage() {
  const { user, authenticatedFetch } = useAuth();
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user) {
        setError('User not authenticated.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await authenticatedFetch(`/api/attendance`);
        if (!response.ok) {
          throw new Error('Failed to fetch attendance data.');
        }
        const data = await response.json();
        setAttendanceData(data.detailedAttendance.sort((a: AttendanceRecord, b: AttendanceRecord) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [user, authenticatedFetch]);

  const totalClasses = attendanceData.length;
  const presentClasses = attendanceData.filter(a => a.status === 'present').length;
  const absentClasses = totalClasses - presentClasses;
  const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Overview</h2>

      {isLoading && <p className="text-center text-gray-500 dark:text-gray-400">Loading attendance data...</p>}
      {error && <p className="text-center text-red-500 dark:text-red-400">Error: {error}</p>}

      {!isLoading && !error && attendanceData.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">No attendance data found.</p>
      )}

      {!isLoading && !error && attendanceData.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="pb-2">
                <CardDescription>Total Classes</CardDescription>
                <CardTitle className="text-3xl">{totalClasses}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Classes recorded.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-600">
              <CardHeader className="pb-2">
                <CardDescription>Classes Attended</CardDescription>
                <CardTitle className="text-3xl">{presentClasses}</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={attendancePercentage} className="h-2" indicatorColor="bg-green-600" />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {presentClasses} out of {totalClasses} classes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardHeader className="pb-2">
                <CardDescription>Attendance Percentage</CardDescription>
                <CardTitle className="text-3xl">{attendancePercentage.toFixed(1)}%</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={attendancePercentage} className="h-2" indicatorColor="bg-purple-600" />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Your overall attendance rate.
                </p>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">Detailed Attendance Records</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {attendanceData.map((record: AttendanceRecord, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(record.date).toLocaleDateString('en-GB').replace(/\//g, '-')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {record.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {record.status === 'present' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          <CheckCircle className="h-4 w-4 mr-1" /> Present
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                          <XCircle className="h-4 w-4 mr-1" /> Absent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </motion.div>
  );
}
