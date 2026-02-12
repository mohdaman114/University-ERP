import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Progress, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Button } from './ui-components';

interface SubjectResult {
  subject: string;
  marks: number;
  grade: string;
  status: 'Pass' | 'Fail';
}

interface SemesterResult {
  semester: string;
  gpa: number;
  subjects: SubjectResult[];
}

export function ResultsPage() {
  const { user, authenticatedFetch } = useAuth();
  const [semesterResults, setSemesterResults] = useState<SemesterResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSemesterIndex, setCurrentSemesterIndex] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) {
        setError('User not authenticated.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await authenticatedFetch(`/api/students/${user.id}/results`);
        if (!response.ok) {
          throw new Error('Failed to fetch results data.');
        }
        const data: SemesterResult[] = await response.json();
        setSemesterResults(data);
        if (data.length > 0) {
          setCurrentSemesterIndex(data.length - 1); // Set to the latest semester by default
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [user, authenticatedFetch]);

  const currentSemester = semesterResults ? semesterResults[currentSemesterIndex] : null;

  const handlePreviousSemester = () => {
    setCurrentSemesterIndex(prevIndex => Math.max(0, prevIndex - 1));
  };

  const handleNextSemester = () => {
    if (semesterResults) {
      setCurrentSemesterIndex(prevIndex => Math.min(semesterResults.length - 1, prevIndex + 1));
    }
  };

  const handleDownload = () => {
    if (currentSemester) {
      alert(`Downloading results for ${currentSemester.semester}... (This is a placeholder for actual download logic)`);
    }
    // In a real application, you would generate a PDF or CSV here
  };

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Results Overview</h2>
        <p>Loading results...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Results Overview</h2>
        <p className="text-red-500">Error: {error}</p>
      </motion.div>
    );
  }

  if (!semesterResults || semesterResults.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Results Overview</h2>
        <p>No results found.</p>
      </motion.div>
    );
  }

  if (!currentSemester) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Results Overview</h2>
        <p>No semester selected or available.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Results Overview</h2>


      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{currentSemester.semester} Results</h3>
          <div className="flex space-x-2">
            <Button onClick={handlePreviousSemester} disabled={currentSemesterIndex === 0}>
              Previous Semester
            </Button>
            <Button onClick={handleNextSemester} disabled={semesterResults ? currentSemesterIndex === semesterResults.length - 1 : true}>
              Next Semester
            </Button>
            <Button onClick={handleDownload} variant="outline">
              Download Result
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>GPA: {currentSemester.gpa}</CardTitle>
            <CardDescription>Detailed subject-wise performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSemester.subjects.map((sub, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{sub.subject}</TableCell>
                    <TableCell>{sub.marks}</TableCell>
                    <TableCell>{sub.grade}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        sub.status === 'Pass' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {sub.status}
                      </span>
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
