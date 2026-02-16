import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  Save,
  Book,
  Hash,
  Building2,
  CreditCard
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
  Badge,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label
} from './AdminUI';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@radix-ui/react-select';
import { toast } from 'sonner';
import useDebounce from '../../../../hooks/useDebounce';
import { Course } from '../../../../types/university'; // Import the global Course interface

const INITIAL_FORM_STATE: {
  name: string;
  code: string;
  credits: string;
  totalFees: string;
  totalDuration: string;
  courseType: string;
} = {
  name: '',
  code: '',
  credits: '',
  totalFees: '',
  totalDuration: '',
  courseType: '',
};

const CourseManagementPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchCourses(debouncedSearchTerm);
  }, [debouncedSearchTerm]);


  const fetchCourses = async (keyword = '') => {
    try {
      setIsLoading(true);
      setIsError(false);
      const response = await fetch(`/api/admin/courses?keyword=${keyword}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        // Map _id to id for frontend consistency
        const coursesWithId = data.map((course: any) => ({
          ...course,
          id: course._id,
        }));
        setCourses(coursesWithId);
      } else {
        toast.error(data.message || 'Failed to fetch courses');
        setIsError(true);
      }
    } catch (error) {
      toast.error('Error connecting to server');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setFormData(INITIAL_FORM_STATE);
    setIsDialogOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      credits: course.credits.toString(),
      totalFees: course.totalFees.toString(),
      totalDuration: course.totalDuration.toString(),
      courseType: course.courseType,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Client-side validation
    if (!formData.name.trim()) {
      toast.error('Course Name is required.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.code.trim()) {
      toast.error('Course Code is required.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.courseType.trim()) {
      toast.error('Course Type is required.');
      setIsSubmitting(false);
      return;
    }

    const credits = parseInt(formData.credits);
    if (isNaN(credits) || credits <= 0) {
      toast.error('Credits must be a positive number.');
      setIsSubmitting(false);
      return;
    }

    const totalFees = parseFloat(formData.totalFees);
    if (isNaN(totalFees) || totalFees <= 0) {
      toast.error('Total Fees must be a positive number.');
      setIsSubmitting(false);
      return;
    }



    try {
      const method = editingCourse ? 'PUT' : 'POST';
      const url = editingCourse ? `/api/admin/courses/${editingCourse.id}` : '/api/admin/courses';
      const body: any = {
        name: formData.name,
        code: formData.code,
        credits: credits,
        totalFees: totalFees,
        totalDuration: formData.totalDuration,
        courseType: formData.courseType,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Course ${editingCourse ? 'updated' : 'added'} successfully`);
        setIsDialogOpen(false);
        fetchCourses(); // Refresh the list
      } else {
        toast.error(data.message || `Failed to ${editingCourse ? 'update' : 'add'} course`);
      }
    } catch (error) {
      toast.error('Error connecting to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });

      if (response.ok) {
        toast.success('Course deleted successfully');
        fetchCourses(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete course');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-7 w-7" /> Course Management
            </CardTitle>
            <CardDescription>Manage university courses, including adding, editing, and deleting courses.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Button onClick={handleAddCourse}>
                <Plus className="h-4 w-4 mr-2" /> Add New Course
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <div className="text-center text-red-500">
                Failed to load courses. Please try again.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Total Fees</TableHead>
                    <TableHead>Total Duration</TableHead>
                    <TableHead>Course Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No courses found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.name}</TableCell>
                        <TableCell>{course.code}</TableCell>
                        <TableCell>{course.credits}</TableCell>
                        <TableCell>{course.totalFees}</TableCell>
                        <TableCell>{course.totalDuration}</TableCell>
                        <TableCell>{course.courseType}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCourse(course)}
                            className="mr-2"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credits" className="text-right">
                Credits
              </Label>
              <Input
                id="credits"
                name="credits"
                type="number"
                value={formData.credits}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalFees" className="text-right">
                Total Fees
              </Label>
              <Input
                id="totalFees"
                name="totalFees"
                type="number"
                value={formData.totalFees}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalDuration" className="text-right">
                Total Duration (Years)
              </Label>
              <Input
                id="totalDuration"
            name="totalDuration"
            type="text"
                value={formData.totalDuration}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="courseType" className="text-right">
                Course Type
              </Label>
              <Input
                id="courseType"
                name="courseType"
                value={formData.courseType}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="e.g., B.Tech, BCA, B.Pharma"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {editingCourse ? 'Save Changes' : 'Add Course'}
            </Button>
          </DialogFooter>   
        </form>
      </Dialog>
    </div>
  );
};

export default CourseManagementPage;
