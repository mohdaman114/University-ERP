import React, { useEffect, useState } from 'react';
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

interface PaymentRecord {
  _id: string;
  studentId: { name: string; rollNumber?: string };
  feeStructureId: { semester: number; courseId: { name: string } };
  amountPaid: number;
  paymentMode: string;
  transactionId?: string;
  paymentDate: string;
  status: string;
  remarks?: string;
}

export function DashboardPage() {
  const { user, authenticatedFetch } = useAuth();
  const [recentPayments, setRecentPayments] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    transactionCount: 0,
    todayRevenue: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await authenticatedFetch('/api/fees/payments');
        if (response.ok) {
          const data: PaymentRecord[] = await response.json();
          setRecentPayments(data.slice(0, 10)); // Show top 10

          // Calculate stats from the recent 100 payments
          const totalRev = data.reduce((acc, curr) => acc + curr.amountPaid, 0);
          const today = new Date().toISOString().split('T')[0];
          const todayRev = data
            .filter(p => p.paymentDate.startsWith(today))
            .reduce((acc, curr) => acc + curr.amountPaid, 0);

          setStats({
            totalRevenue: totalRev,
            transactionCount: data.length,
            todayRevenue: todayRev
          });
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };

    fetchDashboardData();
  }, [authenticatedFetch]);

  // Derived Quick Stats
  const quickStats = [
    { 
      label: 'Recent Revenue', 
      value: `$${stats.totalRevenue.toLocaleString()}`, 
      change: 'Last 100 txns', 
      icon: DollarSign, 
      color: 'text-green-600', 
      bg: 'bg-green-100' 
    },
    { 
      label: "Today's Revenue", 
      value: `$${stats.todayRevenue.toLocaleString()}`, 
      change: 'Today', 
      icon: TrendingUp, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100' 
    },
    { 
      label: 'Transactions', 
      value: stats.transactionCount.toString(), 
      change: 'Recent', 
      icon: FileText, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100' 
    },
  ];

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
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <p className="text-xs mt-1 text-gray-500">
                    {stat.change}
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
                  <TableHead>Course / Sem</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.length > 0 ? (
                  recentPayments.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell className="font-medium">
                        {transaction.studentId?.name || 'Unknown'}
                        {transaction.studentId?.rollNumber && <span className="text-xs text-gray-500 block">{transaction.studentId.rollNumber}</span>}
                      </TableCell>
                      <TableCell>
                        {transaction.feeStructureId?.courseId?.name} 
                        <span className="text-xs text-gray-500 ml-1">(Sem {transaction.feeStructureId?.semester})</span>
                      </TableCell>
                      <TableCell>${transaction.amountPaid}</TableCell>
                      <TableCell>{new Date(transaction.paymentDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={transaction.status === 'Paid' ? 'default' : transaction.status === 'Partial' ? 'secondary' : 'destructive'}
                          className={transaction.status === 'Paid' ? 'bg-green-600 text-white' : ''}
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                      No recent transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
