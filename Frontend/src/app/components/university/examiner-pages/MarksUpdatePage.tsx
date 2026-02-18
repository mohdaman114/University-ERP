import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../student-pages/ui-components';

interface Student {
  _id: string;
  name: string;
  studentId: string;
  course: string;
  branch: string;
  currentSemester: number;
}

interface Subject {
  _id: string;
  name: string;
  code: string;
  credits: number;
  department: string;
}

interface MarksData {
  internal: number;
  external: number;
}

export function MarksUpdatePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [marks, setMarks] = useState<MarksData>({ internal: 0, external: 0 });
  const [selectedTerm, setSelectedTerm] = useState<'internal' | 'external'>('internal'); // New state for selected term
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedStudent && selectedSubject) {
      fetchMarks();
    } else {
        setMarks({ internal: 0, external: 0 });
    }
  }, [selectedStudent, selectedSubject]);

  const fetchStudents = useCallback(async () => {
      const token = localStorage.getItem('jwt_token');
      console.log('Fetching students - JWT Token:', token);
      if (!token) {
        toast.error('Authentication token not found. Please log in.');
        return;
      }
      try {
        const response = await fetch('/api/examiner-portal/students', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        toast.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Error fetching students');
    }
  }, []); // Added dependency array for useCallback

  const fetchSubjects = useCallback(async () => {
      const token = localStorage.getItem('jwt_token');
      console.log('Fetching subjects - JWT Token:', token);
      if (!token) {
        toast.error('Authentication token not found. Please log in.');
        return;
      }
      try {
        const response = await fetch('/api/examiner-portal/subjects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      } else {
        toast.error('Failed to fetch subjects');
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Error fetching subjects');
    }
  }, []);

  const fetchMarks = useCallback(async () => {
    if (!selectedStudent || !selectedSubject) return;

    const token = localStorage.getItem('jwt_token');
    console.log('Fetching marks - JWT Token:', token);
    if (!token) {
      toast.error('Authentication token not found. Please log in.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/examiner-portal/marks/${selectedStudent}/${selectedSubject}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMarks({
          internal: data.internal || 0,
          external: data.external || 0
        });
      } else {
        // If 404 or other error, likely no marks yet, so default to 0 is fine, but check status
        if (response.status !== 404) {
             // toast.error('Failed to fetch marks');
        }
        setMarks({ internal: 0, external: 0 });
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
      toast.error('Error fetching marks');
  } finally {
          setIsLoading(false);
        }
      }, [selectedStudent, selectedSubject]); // Added dependency array for useCallback};

  const handleUpdateMarks = async () => {
        if (!selectedStudent || !selectedSubject) {
          toast.error('Please select a student and a subject');
          return;
        }
  
        const token = localStorage.getItem('jwt_token');
        console.log('Updating marks - JWT Token:', token);
        if (!token) {
          toast.error('Authentication token not found. Please log in.');
          return;
        }
  
        try {
          setIsSaving(true);
          const dataToSend = {
            studentId: selectedStudent,
            subjectId: selectedSubject,
            term: selectedTerm, // Send the selected term
            marks: marks[selectedTerm] // Send only the marks for the selected term
          };
          console.log('Sending marks update request with data:', dataToSend);
          const response = await fetch('/api/examiner-portal/marks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dataToSend)
          });

      if (response.ok) {
        toast.success('Marks updated successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update marks');
      }
    } catch (error) {
      console.error('Error updating marks:', error);
      toast.error('Error updating marks');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarksChange = (field: keyof MarksData, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setMarks(prev => ({ ...prev, [field]: numValue }));
    } else if (value === '') {
       setMarks(prev => ({ ...prev, [field]: 0 }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Marks Update
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Select a student and subject to update examination marks.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Marks</CardTitle>
          <CardDescription>
            Update Term 1, Term 2, and Final marks for the selected student.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student._id} value={student._id}>
                      {student.name} ({student.studentId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Term</Label>
              <Select value={selectedTerm} onValueChange={(value: 'internal' | 'external') => setSelectedTerm(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedStudent && selectedSubject && (
            <div className="grid grid-cols-1 gap-6 pt-4 border-t">
              <div className="space-y-2">
                <Label>{selectedTerm === 'internal' ? 'Internal Marks' : 'External Marks'}</Label>
                <Input
                  type="number"
                  min="0"
                  max={selectedTerm === 'internal' ? '40' : '60'}
                  value={marks[selectedTerm] || ''}
                  onChange={(e) => handleMarksChange(selectedTerm, e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleUpdateMarks} 
            disabled={!selectedStudent || !selectedSubject || isSaving || isLoading}
          >
            {isSaving ? 'Updating...' : 'Update Marks'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
