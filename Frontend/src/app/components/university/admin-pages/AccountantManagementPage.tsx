import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  UserPlus,
  Mail,
  Phone,
  Filter,
  Briefcase,
  Wallet,
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

interface Accountant {
  _id: string;
  accountantId: string;
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
  accountantId: '',
  department: 'Finance',
  designation: '',
  dateOfJoining: new Date().toISOString().split('T')[0],
  gender: 'Male',
  address: '',
  phoneNumber: '',
  qualification: '',
  experience: ''
};

export function AccountantManagementPage() {
  const [accountants, setAccountants] = useState<Accountant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccountant, setEditingAccountant] = useState<Accountant | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    fetchAccountants();
  }, []);

  const fetchAccountants = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/accountants', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setAccountants(data);
      } else {
        toast.error(data.message || 'Failed to fetch accountants');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (a?: Accountant) => {
    if (a) {
      setEditingAccountant(a);
      setFormData({
        ...INITIAL_FORM_STATE,
        ...a,
        password: '',
        dateOfJoining: a.dateOfJoining ? new Date(a.dateOfJoining).toISOString().split('T')[0] : INITIAL_FORM_STATE.dateOfJoining
      });
    } else {
      setEditingAccountant(null);
      setFormData(INITIAL_FORM_STATE);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAccountant(null);
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
      const url = editingAccountant 
        ? `/api/admin/accountants/${editingAccountant.accountantId || editingAccountant._id}` 
        : '/api/admin/accountants';
      
      const method = editingAccountant ? 'PUT' : 'POST';
      
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
        toast.success(editingAccountant ? 'Accountant updated successfully' : 'Accountant created successfully');
        handleCloseDialog();
        fetchAccountants();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, accountantId: string) => {
    if (!window.confirm('Are you sure you want to delete this accountant?')) return;

    try {
      const response = await fetch(`/api/admin/accountants/${accountantId || id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      if (response.ok) {
        toast.success('Accountant deleted successfully');
        fetchAccountants();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete accountant');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  const filteredAccountants = accountants.filter(a => {
    return (
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.accountantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Wallet className="h-8 w-8 text-green-600" />
            Accountant Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage accountant profiles, finance department staff, and designations
          </p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => handleOpenDialog()}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Accountant
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search accountants..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Accountant</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccountants.length > 0 ? (
                  filteredAccountants.map((a) => (
                    <TableRow key={a._id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{a.name}</span>
                          <span className="text-xs text-gray-500">{a.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{a.accountantId}</TableCell>
                      <TableCell>{a.department}</TableCell>
                      <TableCell>{a.designation}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-600"
                            onClick={() => handleOpenDialog(a)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-600"
                            onClick={() => handleDelete(a._id, a.accountantId)}
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
                      No accountants found matching your criteria
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
          <DialogTitle>{editingAccountant ? 'Edit Accountant Profile' : 'Register New Accountant'}</DialogTitle>
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
            {!editingAccountant && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required value={formData.password} onChange={handleInputChange} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="accountantId">Accountant ID</Label>
              <Input id="accountantId" name="accountantId" required value={formData.accountantId} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" name="designation" required value={formData.designation} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfJoining">Date of Joining</Label>
              <Input id="dateOfJoining" name="dateOfJoining" type="date" value={formData.dateOfJoining} onChange={handleInputChange} />
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
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input id="qualification" name="qualification" value={formData.qualification} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input id="experience" name="experience" value={formData.experience} onChange={handleInputChange} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />{editingAccountant ? 'Update Accountant' : 'Create Accountant'}</>}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
