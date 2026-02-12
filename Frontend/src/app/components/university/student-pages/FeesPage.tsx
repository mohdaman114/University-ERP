import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Button } from './ui-components';

interface FeeEntry {
  description: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Waived';
}

interface SemesterFee {
  semester: string;
  totalFees: number;
  paidFees: number;
  remainingFees: number;
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
        const response = await authenticatedFetch(`/api/students/${user.id}/fees`);
        if (!response.ok) {
          throw new Error('Failed to fetch fees data.');
        }
        const data: SemesterFee[] = await response.json();
        setSemesterFees(data);
        if (data.length > 0) {
          setCurrentSemesterIndex(data.length - 1); // Set to the latest semester by default
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fees Overview</h2>

      {isLoading && <p className="text-center text-gray-500 dark:text-gray-400">Loading fees data...</p>}
      {error && <p className="text-center text-red-500 dark:text-red-400">Error: {error}</p>}

      {!isLoading && !error && semesterFees.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">No fees data found.</p>
      )}

      {!isLoading && !error && semesterFees.length > 0 && currentSemester && (
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{currentSemester.semester} Fees</h3>
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
