import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from '../student-pages/ui-components';
import { DollarSign, FileText, TrendingUp, Users } from 'lucide-react';

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

// Temporary data for Quick Stats
const quickStats = [
  { label: 'Total Revenue', value: '$125,000', change: '+12%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Pending Fees', value: '$15,000', change: '-5%', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-100' },
  { label: 'New Payments', value: '45', change: '+8%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Total Students', value: '1,250', change: '+2%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
];

// Temporary data for Recent Transactions
const recentTransactions = [
  { id: 't1', student: 'John Doe', description: 'Tuition Fee - Spring 2024', amount: 1500, date: '2024-02-16', status: 'Completed' },
  { id: 't2', student: 'Jane Smith', description: 'Library Fine', amount: 25, date: '2024-02-15', status: 'Pending' },
  { id: 't3', student: 'Michael Brown', description: 'Hostel Fee', amount: 800, date: '2024-02-14', status: 'Completed' },
  { id: 't4', student: 'Sarah Wilson', description: 'Exam Fee', amount: 150, date: '2024-02-13', status: 'Failed' },
];

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome Section */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here's your financial overview.
        </p>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activities and payments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.student}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>${transaction.amount}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Badge variant={
                        transaction.status === 'Completed' ? 'default' : 
                        transaction.status === 'Pending' ? 'secondary' : 'destructive'
                      }>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
