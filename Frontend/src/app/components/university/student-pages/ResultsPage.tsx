import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Progress, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Button } from './ui-components';

interface SubjectResult {
  subject: string;
  internal: number;
  external: number;
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
      const token = localStorage.getItem('jwt_token');
      console.log('Fetching results - JWT Token:', token);
      if (!token) {
        // Handle case where token is not found, e.g., redirect to login
        setError('Authentication token not found. Please log in.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/results', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }); 
        if (!response.ok) {
            // Check if 404 - might mean no results yet, or student not found
            if (response.status === 404) {
                 setSemesterResults([]); // Treat as empty results
                 return;
            }
            throw new Error('Failed to fetch results data.');
        }
        const data = await response.json();
        // Transform data if necessary or ensure it matches the interface
        // The backend should return data matching SemesterResult[]
        setSemesterResults(data);
        if (data && data.length > 0) {
            setCurrentSemesterIndex(data.length - 1);
        }
      } catch (err: any) {
        console.error("Error fetching results:", err);
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

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
        <p className="text-xl text-gray-600 dark:text-gray-400 mt-10">Result will be declared soon</p>
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
                  <TableHead>Internal (Total: 40)</TableHead>
                  <TableHead>External (Total: 60)</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSemester.subjects.map((sub, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{sub.subject}</TableCell>
                    <TableCell>Obtained Marks: {sub.internal}</TableCell>
                    <TableCell>Obtained Marks: {sub.external}</TableCell>
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
