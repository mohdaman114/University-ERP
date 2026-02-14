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

interface Faculty {
  _id: string;
  facultyId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  department: string;
  designation: string;
  dateOfJoining?: string;
  gender?: string;
  address?: string;
  qualification?: string;
  experience?: string;
}

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  password: '',
  facultyId: '',
  department: '',
  designation: '',
  dateOfJoining: new Date().toISOString().split('T')[0],
  gender: 'Male',
  address: '',
  phoneNumber: '',
  qualification: '',
  experience: ''
};

export function FacultyManagementPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/faculty', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setFaculty(data);
      } else {
        toast.error(data.message || 'Failed to fetch faculty');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (f?: Faculty) => {
    if (f) {
      setEditingFaculty(f);
      setFormData({
        ...INITIAL_FORM_STATE,
        ...f,
        password: '',
        dateOfJoining: f.dateOfJoining ? new Date(f.dateOfJoining).toISOString().split('T')[0] : INITIAL_FORM_STATE.dateOfJoining
      });
    } else {
      setEditingFaculty(null);
      setFormData(INITIAL_FORM_STATE);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingFaculty(null);
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
      const url = editingFaculty 
        ? `/api/admin/faculty/${editingFaculty.facultyId || editingFaculty._id}` 
        : '/api/admin/faculty';
      
      const method = editingFaculty ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editingFaculty ? 'Faculty updated successfully' : 'Faculty created successfully');
        handleCloseDialog();
        fetchFaculty();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, facultyId: string) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;

    try {
      const response = await fetch(`/api/admin/faculty/${facultyId || id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      if (response.ok) {
        toast.success('Faculty deleted successfully');
        fetchFaculty();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete faculty');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.facultyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = filterDepartment === 'All' || f.department === filterDepartment;
    
    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...new Set(faculty.map(f => f.department))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-purple-600" />
            Faculty Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage faculty profiles, departments, and designations
          </p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => handleOpenDialog()}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Faculty
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search faculty..."
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
                  <TableHead>Faculty Member</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFaculty.length > 0 ? (
                  filteredFaculty.map((f) => (
                    <TableRow key={f._id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{f.name}</span>
                          <span className="text-xs text-gray-500">{f.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{f.facultyId}</TableCell>
                      <TableCell>{f.department}</TableCell>
                      <TableCell>{f.designation}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-600"
                            onClick={() => handleOpenDialog(f)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-600"
                            onClick={() => handleDelete(f._id, f.facultyId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No faculty found matching your criteria
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
          <DialogTitle>{editingFaculty ? 'Edit Faculty Profile' : 'Register New Faculty'}</DialogTitle>
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
            {!editingFaculty && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required value={formData.password} onChange={handleInputChange} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="facultyId">Faculty ID</Label>
              <Input id="facultyId" name="facultyId" required value={formData.facultyId} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" name="department" required value={formData.department} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" name="designation" required value={formData.designation} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfJoining">Date of Joining</Label>
              <Input id="dateOfJoining" name="dateOfJoining" type="date" required value={formData.dateOfJoining} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select 
                id="gender" 
                name="gender" 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" name="phoneNumber" required value={formData.phoneNumber} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input id="qualification" name="qualification" required value={formData.qualification} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (Years)</Label>
              <Input id="experience" name="experience" required value={formData.experience} onChange={handleInputChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Full Address</Label>
              <Input id="address" name="address" required value={formData.address} onChange={handleInputChange} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />{editingFaculty ? 'Update Faculty' : 'Create Faculty'}</>}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
