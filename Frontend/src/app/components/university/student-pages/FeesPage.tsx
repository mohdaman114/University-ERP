import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Button } from './ui-components';

interface FeeEntry {
  description: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Waived' | 'Partial';
}

interface SemesterFee {
  semester: string;
  totalFees: number;
  paidFees: number;
  remainingFees: number;
  status: 'Paid' | 'Pending' | 'Waived' | 'Partial';
  details: FeeEntry[];
}

export function FeesPage() {
  const { user, authenticatedFetch } = useAuth();
  const [semesterFees, setSemesterFees] = useState<SemesterFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSemesterIndex, setCurrentSemesterIndex] = useState(0);

  useEffect(() => {
    const fetchFees = async () => {
      if (!user) {
        setError('User not authenticated.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await authenticatedFetch('/api/fees/my');
        if (!response.ok) {
          throw new Error('Failed to fetch fees data.');
        }
        
        const data = await response.json();
        
        if (data.feeSummary) {
          const transformedData: SemesterFee[] = data.feeSummary.map((fee: any) => ({
            semester: `Semester ${fee.semester}`,
            totalFees: fee.totalAmount,
            paidFees: fee.paidAmount,
            remainingFees: fee.pendingAmount,
            status: fee.status,
            details: [
              { description: 'Tuition Fee', amount: fee.breakdown.tuition || 0, status: fee.status },
              { description: 'Library Fee', amount: fee.breakdown.library || 0, status: fee.status },
              { description: 'Exam Fee', amount: fee.breakdown.exam || 0, status: fee.status },
              { description: 'Other Fee', amount: fee.breakdown.other || 0, status: fee.status }
            ].filter((item: any) => item.amount > 0)
          }));
          
          setSemesterFees(transformedData);
          if (transformedData.length > 0) {
            setCurrentSemesterIndex(transformedData.length - 1); // Set to the latest semester by default
          }
        } else {
           setSemesterFees([]);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFees();
  }, [user, authenticatedFetch]);

  const currentSemester = semesterFees[currentSemesterIndex];

  const handlePreviousSemester = () => {
    setCurrentSemesterIndex(prevIndex => Math.max(0, prevIndex - 1));
  };

  const handleNextSemester = () => {
    setCurrentSemesterIndex(prevIndex => Math.min(semesterFees.length - 1, prevIndex + 1));
  };

  const totalOverview = React.useMemo(() => {
    return semesterFees.reduce((acc, sem) => ({
      total: acc.total + sem.totalFees,
      paid: acc.paid + sem.paidFees,
      pending: acc.pending + sem.remainingFees
    }), { total: 0, paid: 0, pending: 0 });
  }, [semesterFees]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fees Overview</h2>

      {isLoading && <p className="text-center text-gray-500 dark:text-gray-400">Loading fees data...</p>}
      {error && <p className="text-center text-red-500 dark:text-red-400">Error: {error}</p>}

      {!isLoading && !error && semesterFees.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">No fees data found.</p>
      )}

      {!isLoading && !error && semesterFees.length > 0 && currentSemester && (
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="space-y-8">
          
          {/* Total Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Course Fee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">${totalOverview.total.toLocaleString()}</div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">All Semesters</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">Total Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900 dark:text-green-100">${totalOverview.paid.toLocaleString()}</div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Successfully Cleared</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300">Total Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-900 dark:text-red-100">${totalOverview.pending.toLocaleString()}</div>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Outstanding Dues</p>
              </CardContent>
            </Card>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Semester Breakdown</h3>
          </div>

          {/* Semester Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {semesterFees.map((sem, index) => (
              <div 
                key={index}
                onClick={() => setCurrentSemesterIndex(index)}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  currentSemesterIndex === index 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
                    : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{sem.semester}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    sem.status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    sem.status === 'Pending' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {sem.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-medium">${sem.totalFees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid:</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">${sem.paidFees}</span>
                  </div>
                  {sem.remainingFees > 0 && (
                    <div className="flex justify-between mt-1 pt-1 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-red-600 dark:text-red-400">Due:</span>
                      <span className="text-red-600 dark:text-red-400 font-bold">${sem.remainingFees}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Detailed Breakdown: {currentSemester.semester}</h3>
            <div className="flex space-x-2">
              <Button onClick={handlePreviousSemester} disabled={currentSemesterIndex === 0}>
                Previous Semester
              </Button>
              <Button onClick={handleNextSemester} disabled={currentSemesterIndex === semesterFees.length - 1}>
                Next Semester
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardDescription>Total Fees</CardDescription>
                <CardTitle className="text-2xl">${currentSemester.totalFees}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Paid Fees</CardDescription>
                <CardTitle className="text-2xl text-green-600">${currentSemester.paidFees}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Remaining Fees</CardDescription>
                <CardTitle className="text-2xl text-red-600">${currentSemester.remainingFees}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fee Details</CardTitle>
              <CardDescription>Breakdown of fees for {currentSemester.semester}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSemester.details.map((fee, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{fee.description}</TableCell>
                      <TableCell>${fee.amount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          fee.status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          fee.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {fee.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
