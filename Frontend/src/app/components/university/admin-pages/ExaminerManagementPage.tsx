import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  UserPlus,
  Mail,
  Phone,
  BookOpen,
  Filter,
  Briefcase,
  X,
  Save,
  Loader2,
  Calendar
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

interface Examiner {
  _id: string;
  examinerId: string;
  name: string;
  email: string;
  department: string;
  qualification: string;
  subjects: { _id: string; name: string }[];
  profilePicture?: string;
}

interface ExaminerFormData {
  name: string;
  email: string;
  password?: string; // Password is only for creation
  examinerId: string;
  department: string;
  qualification: string;
  subjects: string[]; // Array of subject IDs
}

const INITIAL_FORM_STATE: ExaminerFormData = {
  name: '',
  email: '',
  password: '',
  examinerId: '',
  department: '',
  qualification: '',
  subjects: [],
};

export function ExaminerManagementPage() {
  const [examiners, setExaminers] = useState<Examiner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExaminer, setEditingExaminer] = useState<Examiner | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    fetchExaminers();
  }, []);

  const fetchExaminers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/examiners', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setExaminers(data);
      } else {
        toast.error(data.message || 'Failed to fetch examiners');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (e?: Examiner) => {
    if (e) {
      setEditingExaminer(e);
      setFormData({
        ...INITIAL_FORM_STATE,
        ...e,
        password: '', // Password is not editable
        subjects: e.subjects.map(sub => sub._id), // Assuming subjects are stored as IDs for editing
      });
    } else {
      setEditingExaminer(null);
      setFormData(INITIAL_FORM_STATE);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingExaminer(null);
    setFormData(INITIAL_FORM_STATE);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const url = editingExaminer 
        ? `/api/examiners/${editingExaminer._id}` 
        : '/api/examiners';
      
      const method = editingExaminer ? 'PUT' : 'POST';
      
      // Filter out empty strings from subjects
      const submissionData = {
        ...formData,
        subjects: formData.subjects.filter(s => s.trim() !== '')
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editingExaminer ? 'Examiner updated successfully' : 'Examiner created successfully');
        handleCloseDialog();
        fetchExaminers();
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
    if (!window.confirm('Are you sure you want to delete this examiner?')) return;

    try {
      const response = await fetch(`/api/examiners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      if (response.ok) {
        toast.success('Examiner deleted successfully');
        fetchExaminers();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete examiner');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  const filteredExaminers = examiners.filter(e => {
    const matchesSearch = 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.examinerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = filterDepartment === 'All' || e.department === filterDepartment;
    
    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...new Set(examiners.map(e => e.department))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-purple-600" />
            Examiner Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage examiner profiles, departments, and qualifications
          </p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => handleOpenDialog()}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Examiner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search examiners..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="bg-transparent border border-input rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Examiner Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExaminers.length > 0 ? (
                  filteredExaminers.map((e) => (
                    <TableRow key={e._id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{e.name}</span>
                          <span className="text-xs text-gray-500">{e.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{e.examinerId}</TableCell>
                      <TableCell>{e.department}</TableCell>
                      <TableCell>{e.qualification}</TableCell>
                      <TableCell>
                        {e.subjects && e.subjects.length > 0 ? (
                          e.subjects.map(sub => (
                            <Badge key={sub._id} variant="secondary" className="mr-1 mb-1">
                              {sub.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-600"
                            onClick={() => handleOpenDialog(e)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-600"
                            onClick={() => handleDelete(e._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No examiners found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>{editingExaminer ? 'Edit Examiner Profile' : 'Register New Examiner'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} />
            </div>
            {!editingExaminer && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required value={formData.password} onChange={handleInputChange} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="examinerId">Examiner ID</Label>
              <Input id="examinerId" name="examinerId" required value={formData.examinerId} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" name="department" required value={formData.department} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input id="qualification" name="qualification" required value={formData.qualification} onChange={handleInputChange} />
            </div>
            {/* Subjects input will need a more complex component, for now it's a simple text input */}
            <div className="space-y-2">
              <Label htmlFor="subjects">Subjects (comma-separated IDs for now)</Label>
              <Input 
                id="subjects" 
                name="subjects" 
                value={Array.isArray(formData.subjects) ? formData.subjects.join(',') : formData.subjects} 
                onChange={(e) => setFormData(prev => ({ ...prev, subjects: e.target.value.split(',').map(s => s.trim()) }))} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />{editingExaminer ? 'Update Examiner' : 'Create Examiner'}</>}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}