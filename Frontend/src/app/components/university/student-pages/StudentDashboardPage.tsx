import React from 'react';
import { motion } from 'motion/react';
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

// Temporary data for Latest Results
const temporaryLatestResults = [
  { id: '1', subject: 'Mathematics I', score: 85, grade: 'A', semester: 'Fall 2023' },
  { id: '2', subject: 'Physics I', score: 78, grade: 'B+', semester: 'Fall 2023' },
  { id: '3', subject: 'Computer Science I', score: 92, grade: 'A+', semester: 'Fall 2023' },
];

// Temporary data for Upcoming Fees
const temporaryUpcomingFees = [
  { id: 'f1', description: 'Tuition Fee - Spring 2024', amount: 1500, dueDate: '2024-03-15', status: 'Pending' },
  { id: 'f2', description: 'Library Fine', amount: 25, dueDate: '2024-02-28', status: 'Overdue' },
];

// Temporary data for Recent Notices
const temporaryRecentNotices = [
  { id: 'n1', title: 'Spring Semester Registration Open', date: '2024-02-20', category: 'Academic' },
  { id: 'n2', title: 'Holiday Schedule Update', date: '2024-02-15', category: 'General' },
  { id: 'n3', title: 'Career Fair on March 10th', date: '2024-02-10', category: 'Events' },
];

// Temporary data for Attendance Summary
const temporaryAttendanceSummary = [
  { subject: 'Mathematics I', percentage: 90, status: 'Good' },
  { subject: 'Physics I', percentage: 75, status: 'Average' },
  { subject: 'Computer Science I', percentage: 95, status: 'Excellent' },
];

export function StudentDashboardPage() {
    const { user } = useAuth();
    const { } = useUniversity();
  
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

        {/* Latest Results Overview */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Latest Results</CardTitle>
              <CardDescription>Your most recent examination scores.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Semester</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {temporaryLatestResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.subject}</TableCell>
                      <TableCell>{result.score}</TableCell>
                      <TableCell>
                        <Badge variant={result.grade === 'A+' || result.grade === 'A' ? 'default' : 'secondary'}>
                          {result.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>{result.semester}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Fees Overview */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Fees</CardTitle>
              <CardDescription>Important fee deadlines and statuses.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {temporaryUpcomingFees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">{fee.description}</TableCell>
                      <TableCell>${fee.amount}</TableCell>
                      <TableCell>{fee.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant={fee.status === 'Overdue' ? 'destructive' : 'default'}>
                          {fee.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Notices Overview */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Notices</CardTitle>
              <CardDescription>Important announcements and updates.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {temporaryRecentNotices.map((notice) => (
                  <div key={notice.id} className="flex items-start space-x-3">
                    <Badge variant="outline">{notice.category}</Badge>
                    <div>
                      <p className="font-medium">{notice.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{notice.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Attendance Summary Overview */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>Your attendance percentage for current subjects.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {temporaryAttendanceSummary.map((attendance) => (
                  <div key={attendance.subject} className="flex items-center space-x-4">
                    <p className="flex-1 font-medium">{attendance.subject}</p>
                    <Progress value={attendance.percentage} className="w-[60%]" />
                    <Badge variant={attendance.status === 'Excellent' ? 'default' : attendance.status === 'Good' ? 'secondary' : 'destructive'}>
                      {attendance.percentage}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }
