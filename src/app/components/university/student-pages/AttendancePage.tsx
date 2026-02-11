import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
// import { useUniversity } from '@/contexts/UniversityContext'; // No longer needed for temp data
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Progress } from './ui-components';

// Define a type for our temporary attendance data
interface TempAttendanceRecord {
  date: string;
  subject: string;
  status: 'present' | 'absent';
}

// Function to generate random attendance data
const generateTempAttendanceData = (days: number): TempAttendanceRecord[] => {
  const data: TempAttendanceRecord[] = [];
  const subjects = ['Chemistry', 'Physics', 'Math'];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i); // Go back in time for 'days' days

    subjects.forEach(subject => {
      // Randomly assign present or absent
      const status: 'present' | 'absent' = Math.random() > 0.7 ? 'absent' : 'present'; // Roughly 70% present
      data.push({
        date: date.toISOString().split('T')[0], // YYYY-MM-DD format
        subject,
        status,
      });
    });
  }
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending
};

export function AttendancePage() {
  const { user } = useAuth();
  // const { attendance } = useUniversity(); // No longer using real attendance data

  const tempAttendanceData = generateTempAttendanceData(365); // Generate data for 365 days

  const totalClasses = tempAttendanceData.length;
  const presentClasses = tempAttendanceData.filter(a => a.status === 'present').length;
  const absentClasses = totalClasses - presentClasses;
  const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-2">
            <CardDescription>Total Classes</CardDescription>
            <CardTitle className="text-3xl">{totalClasses}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Classes recorded over the last 365 days.
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
            {tempAttendanceData.map((record, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {record.date}
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
    </motion.div>
  );
}
