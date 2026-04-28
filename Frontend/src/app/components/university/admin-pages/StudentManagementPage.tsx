import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Search,
  Edit2,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  X,
  Save,
  Loader2
} from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label
} from './AdminUI';

import { toast } from 'sonner';
import useDebounce from '../../../../hooks/useDebounce';

// ✅ FIXED BASE URL
const BASE_URL = "https://backend-erp-nez2.onrender.com";

interface Student {
  _id: string;
  studentId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  course: string;
  branch: string;
  currentSemester: number;
  admissionYear: number;
  gender: string;
  dateOfBirth?: string;
  address?: string;
  parentName?: string;
  parentPhoneNumber?: string;
  enrollmentNumber?: string;
}

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  password: '',
  studentId: '',
  enrollmentNumber: '',
  dateOfBirth: '',
  gender: 'Male',
  address: '',
  phoneNumber: '',
  parentName: '',
  parentPhoneNumber: '',
  course: '',
  branch: '',
  admissionYear: new Date().getFullYear(),
  currentSemester: 1
};

export function StudentManagementPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchStudents(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // ✅ FIXED FETCH
  const fetchStudents = async (keyword = '') => {
    try {
      setIsLoading(true);
      setIsError(false);

      const response = await fetch(
        `${BASE_URL}/api/admin/students?keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStudents(data);
      } else {
        toast.error(data.message || 'Failed to fetch students');
        setIsError(true);
      }
    } catch (error) {
      toast.error('Error connecting to server');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        ...INITIAL_FORM_STATE,
        ...student,
        password: '',
        dateOfBirth: student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString().split('T')[0]
          : ''
      });
    } else {
      setEditingStudent(null);
      setFormData(INITIAL_FORM_STATE);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStudent(null);
    setFormData(INITIAL_FORM_STATE);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'currentSemester' || name === 'admissionYear'
          ? parseInt(value)
          : value
    }));
  };

  // ✅ FIXED CREATE / UPDATE
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const url = editingStudent
        ? `${BASE_URL}/api/admin/students/${editingStudent.studentId || editingStudent._id}`
        : `${BASE_URL}/api/admin/students`;

      const method = editingStudent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          editingStudent
            ? 'Student updated successfully'
            : 'Student created successfully'
        );
        handleCloseDialog();
        fetchStudents();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ FIXED DELETE
  const handleDelete = async (id: string, studentId: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/students/${studentId || id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
          }
        }
      );

      if (response.ok) {
        toast.success('Student deleted successfully');
        fetchStudents();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete student');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Student Management
          </h1>
          <p className="text-muted-foreground">
            Manage student profiles, enrollment, and academic details
          </p>
        </div>

        <Button onClick={() => handleOpenDialog()}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Student
        </Button>
      </div>

      <Card>
        <CardHeader>
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : isError ? (
            <div className="text-center text-red-500">Error loading students</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Info</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{student.name}</span>
                          <span className="text-xs">{student.studentId}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {student.course} ({student.branch})
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col text-xs">
                          <span>{student.email}</span>
                          {student.phoneNumber && (
                            <span>{student.phoneNumber}</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Button onClick={() => handleOpenDialog(student)}>
                          <Edit2 />
                        </Button>

                        <Button
                          onClick={() =>
                            handleDelete(student._id, student.studentId)
                          }
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
