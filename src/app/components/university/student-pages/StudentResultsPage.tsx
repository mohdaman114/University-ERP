import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { useUniversity } from '@/contexts/UniversityContext';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/app/components/university/student-pages/ui-components'; // Assuming shared UI components

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

export function StudentResultsPage() {
  const { user } = useAuth();
  const { results, subjects, examinations } = useUniversity();

  const studentResults = results.filter(r => r.studentId === user?.id);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Examination Results
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View your performance in examinations.
        </p>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Your Results</CardTitle>
            <CardDescription>Detailed breakdown of your scores</CardDescription>
          </CardHeader>
          <CardContent>
            {studentResults.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Marks Obtained</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentResults.map((result) => {
                    const examination = examinations.find(e => e.id === result.examinationId);
                    const subject = subjects.find(s => s.id === examination?.subjectId);
                    return (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{examination?.name || 'N/A'}</TableCell>
                        <TableCell>{subject?.name || 'N/A'}</TableCell>
                        <TableCell>{result.marksObtained}</TableCell>
                        <TableCell>{examination?.totalMarks || 'N/A'}</TableCell>
                        <TableCell>{result.grade}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-8 text-gray-500">No examination results available yet.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
