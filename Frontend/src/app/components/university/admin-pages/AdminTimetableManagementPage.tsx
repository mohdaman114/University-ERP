import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
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
  Badge,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label
} from './AdminUI';
import { toast } from 'sonner';
import useDebounce from '../../../../hooks/useDebounce';
import { useAuth } from '@/contexts/AuthContext';

interface Timetable {
  _id: string;
  course: string;
  semester: string;
  day: string;
  subject: string;
  time: string;
  faculty: string;
  createdAt: string;
  updatedAt: string;
}

const INITIAL_FORM_STATE: Omit<Timetable, '_id' | 'createdAt' | 'updatedAt'> = {
  course: '',
  semester: '',
  day: 'Monday',
  subject: '',
  time: '',
  faculty: ''
};

export function AdminTimetableManagementPage() {
  const { authenticatedFetch } = useAuth();
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState<Timetable | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchTimetables(debouncedSearchTerm);
  }, [debouncedSearchTerm, authenticatedFetch]);

  useEffect(() => {
    fetchFacultyList();
  }, [authenticatedFetch]);

  const fetchFacultyList = async () => {
    try {
      const response = await authenticatedFetch('/api/admin/faculty');
      const data = await response.json();
      if (response.ok) {
        setFacultyList(data);
      }
    } catch (error) {
      console.error('Error fetching faculty list:', error);
    }
  };

  const fetchTimetables = async (keyword = '') => {
    try {
      setIsLoading(true);
      setIsError(false);
      const response = await authenticatedFetch(`/api/timetable/all?keyword=${keyword}`);
      const data = await response.json();
      if (response.ok) {
        setTimetables(data);
      } else {
        toast.error(data.message || 'Failed to fetch timetables');
        setIsError(true);
      }
    } catch (error) {
      toast.error('Error connecting to server');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course || !formData.semester || !formData.day || !formData.subject || !formData.time || !formData.faculty) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const url = editingTimetable 
        ? `/api/timetable/${editingTimetable._id}`
        : '/api/timetable';
      
      const method = editingTimetable ? 'PUT' : 'POST';

      const response = await authenticatedFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editingTimetable ? 'Timetable updated successfully' : 'Timetable created successfully');
        setIsDialogOpen(false);
        resetForm();
        fetchTimetables(searchTerm);
      } else {
        toast.error(data.message || 'Failed to save timetable');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this timetable entry?')) {
      return;
    }

    try {
      const response = await authenticatedFetch(`/api/timetable/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Timetable deleted successfully');
        setTimetables(prev => prev.filter(t => t._id !== id));
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete timetable');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  const handleEdit = (timetable: Timetable) => {
    setEditingTimetable(timetable);
    setFormData({
      course: timetable.course,
      semester: timetable.semester,
      day: timetable.day,
      subject: timetable.subject,
      time: timetable.time,
      faculty: timetable.faculty
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setEditingTimetable(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Timetable Management</h1>
          <p className="text-muted-foreground">Manage course schedules and timetables</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Timetable
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Timetable Entries</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search timetables..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : timetables.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No timetable entries found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetables.map((timetable) => (
                  <TableRow key={timetable._id}>
                    <TableCell className="font-medium">{timetable.course}</TableCell>
                    <TableCell>{timetable.semester}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{timetable.day}</Badge>
                    </TableCell>
                    <TableCell>{timetable.subject}</TableCell>
                    <TableCell>{timetable.time}</TableCell>
                    <TableCell>{timetable.faculty}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(timetable)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(timetable._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogHeader>
          <DialogTitle>{editingTimetable ? 'Edit Timetable' : 'Add Timetable'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                placeholder="e.g. B.Tech"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <select
                id="semester"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                required
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem.toString()}>{sem}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <select
                id="day"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                required
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Mathematics"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g. 09:00 AM - 10:00 AM"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty</Label>
              <select
                id="faculty"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.faculty}
                onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                required
              >
                <option value="">Select Faculty</option>
                {facultyList.map((faculty) => (
                  <option key={faculty._id} value={faculty.name}>
                    {faculty.name} ({faculty.facultyId})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
