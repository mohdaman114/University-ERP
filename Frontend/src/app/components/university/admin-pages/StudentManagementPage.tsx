import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Loader2,
  GraduationCap,
  MapPin,
  Calendar,
  UserCircle
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
  DialogContent, // Added DialogContent
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
        setStudents(Array.isArray(data) ? data : []);
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
        password: '', // Password kept empty on edit for security
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'currentSemester' || name === 'admissionYear'
          ? parseInt(value) || 0
          : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Construct URL: Use MongoDB _id for specific endpoint targeting if studentId isn't reliable
      const url = editingStudent
        ? `${BASE_URL}/api/admin/students/${editingStudent._id}`
        : `${BASE_URL}/api/admin/students`;

      const method = editingStudent ? 'PUT' : 'POST';

      // Clean payload: If editing, don't send empty password
      const payload = { ...formData };
      if (editingStudent && !payload.password) {
        delete (payload as any).password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify(payload)
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/students/${id}`,
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
    <div className="space-y-6 p-6">
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              className="pl-10"
              placeholder="Search by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-10 text-destructive bg-destructive/10 rounded-lg">
              <p className="font-medium">Error loading students. Please check your connection.</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => fetchStudents()}>
                Retry
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Info</TableHead>
                    <TableHead>Academic Details</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No students found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <UserCircle className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{student.name}</span>
                              <span className="text-xs text-muted-foreground">ID: {student.studentId}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium">{student.course}</span>
                            <span className="text-xs text-muted-foreground">{student.branch} | Sem {student.currentSemester}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col text-xs gap-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {student.email}
                            </span>
                            {student.phoneNumber && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {student.phoneNumber}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleOpenDialog(student)}
                            >
                              <Edit2 className="w-4 h-4 text-blue-600" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(student._id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ✅ CORRECTED DIALOG STRUCTURE */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingStudent ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {editingStudent ? 'Edit Student Profile' : 'Register New Student'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{editingStudent ? 'Change Password (Optional)' : 'Password'}</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required={!editingStudent} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" name="studentId" value={formData.studentId} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                <Input id="enrollmentNumber" name="enrollmentNumber" value={formData.enrollmentNumber} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
              </div>
            </div>

            {/* Academic & Bio */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Input id="course" name="course" value={formData.course} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input id="branch" name="branch" value={formData.branch} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentSemester">Current Semester</Label>
                <Input id="currentSemester" name="currentSemester" type="number" min="1" max="12" value={formData.currentSemester} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admissionYear">Admission Year</Label>
                <Input id="admissionYear" name="admissionYear" type="number" value={formData.admissionYear} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select 
                  id="gender" 
                  name="gender" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                  value={formData.gender} 
                  onChange={handleInputChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
              </div>
            </div>

            {/* Guardian Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="parentName">Guardian Name</Label>
                <Input id="parentName" name="parentName" value={formData.parentName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhoneNumber">Guardian Phone</Label>
                <Input id="parentPhoneNumber" name="parentPhoneNumber" value={formData.parentPhoneNumber} onChange={handleInputChange} />
              </div>
            </div>

            <DialogFooter className="pt-6 border-t gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingStudent ? 'Update Student' : 'Register Student'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
