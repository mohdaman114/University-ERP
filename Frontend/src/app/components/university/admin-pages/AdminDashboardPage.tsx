import React from 'react';
import { motion } from 'motion/react';
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  GraduationCap,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import { useUniversity } from '@/contexts/UniversityContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Progress } from './AdminUI';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export function AdminDashboardPage() {
  const { analytics, departments, courses, users, notices, feePayments } = useUniversity();

  const departmentData = departments.map(dept => ({
    name: dept.code,
    students: Math.floor(analytics.totalStudents / departments.length),
    faculty: Math.floor(analytics.totalFaculty / departments.length),
  }));

  const roleDistribution = [
    { name: 'Students', value: users.filter(u => u.role === 'student').length },
    { name: 'Faculty', value: users.filter(u => u.role === 'faculty').length },
    { name: 'Admin', value: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length },
    { name: 'Other Staff', value: users.filter(u => ['examiner', 'accounts', 'library', 'support'].includes(u.role)).length },
  ];

  const revenuePercentage = (analytics.totalRevenue / (analytics.totalRevenue + analytics.pendingFees)) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of university operations and analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="pb-2">
              <CardDescription>Total Students</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-600" />
                {analytics.totalStudents.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Across {analytics.totalCourses} courses
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="pb-2">
              <CardDescription>Faculty Members</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-purple-600" />
                {analytics.totalFaculty.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                In {analytics.totalDepartments} departments
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="pb-2">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <DollarSign className="h-8 w-8 text-green-600" />
                ₹{(analytics.totalRevenue / 1000000).toFixed(1)}M
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={revenuePercentage} className="h-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {revenuePercentage.toFixed(1)}% collection rate
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-l-4 border-l-yellow-600">
            <CardHeader className="pb-2">
              <CardDescription>Total Accountants</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Users className="h-8 w-8 text-yellow-600" />
                {analytics.totalAccountant.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Total staff in accounts department
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Student and faculty distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#3b82f6" name="Students" />
                <Bar dataKey="faculty" fill="#8b5cf6" name="Faculty" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Notices</CardTitle>
            <CardDescription>Latest announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notices.slice(0, 5).map((notice) => (
                <div key={notice.id} className="flex items-start justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex-1">
                    <p className="font-medium">{notice.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{notice.content}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(notice.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={notice.category === 'urgent' ? 'destructive' : 'default'}>
                    {notice.category}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
