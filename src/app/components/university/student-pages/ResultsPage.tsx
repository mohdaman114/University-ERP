import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUniversity } from '@/contexts/UniversityContext';
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

const generateTemporaryResults = (): SemesterResult[] => {
  const semesters: SemesterResult[] = [];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'];

  for (let i = 1; i <= 3; i++) { // Generate results for 3 semesters
    const semesterSubjects: SubjectResult[] = subjects.map(sub => {
      const marks = Math.floor(Math.random() * (100 - 40 + 1)) + 40; // Marks between 40 and 100
      let grade: string;
      let status: 'Pass' | 'Fail' = 'Fail';

      if (marks >= 90) { grade = 'A+'; status = 'Pass'; }
      else if (marks >= 80) { grade = 'A'; status = 'Pass'; }
      else if (marks >= 70) { grade = 'B+'; status = 'Pass'; }
      else if (marks >= 60) { grade = 'B'; status = 'Pass'; }
      else if (marks >= 50) { grade = 'C'; status = 'Pass'; }
      else { grade = 'F'; status = 'Fail'; }

      return { subject: sub, marks, grade, status };
    });

    const totalMarks = semesterSubjects.reduce((sum, sub) => sum + sub.marks, 0);
    const gpa = (totalMarks / (semesterSubjects.length * 10)).toFixed(2); // Simple GPA calculation

    semesters.push({
      semester: `Semester ${i}`,
      gpa: parseFloat(gpa),
      subjects: semesterSubjects,
    });
  }
  return semesters;
};

export function ResultsPage() {
  const { user } = useAuth();
  const { results } = useUniversity();

  const studentResults = results.filter(r => r.studentId === user?.id);
  const averageMarks = studentResults.length > 0
    ? studentResults.reduce((sum, r) => sum + r.marksObtained, 0) / studentResults.length
    : 0;

  const temporarySemesterResults = generateTemporaryResults();
  const [currentSemesterIndex, setCurrentSemesterIndex] = React.useState(temporarySemesterResults.length - 1);
  const currentSemester = temporarySemesterResults[currentSemesterIndex];

  const handlePreviousSemester = () => {
    setCurrentSemesterIndex(prevIndex => Math.max(0, prevIndex - 1));
  };

  const handleNextSemester = () => {
    setCurrentSemesterIndex(prevIndex => Math.min(temporarySemesterResults.length - 1, prevIndex + 1));
  };

  const handleDownload = () => {
    alert(`Downloading results for ${currentSemester.semester}... (This is a placeholder for actual download logic)`);
    // In a real application, you would generate a PDF or CSV here
  };

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
            <Button onClick={handleNextSemester} disabled={currentSemesterIndex === temporarySemesterResults.length - 1}>
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
