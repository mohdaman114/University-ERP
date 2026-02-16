import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  BellRing,
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

interface Notice {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
}

const INITIAL_FORM_STATE = {
  title: '',
  description: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
};

export function NoticeManagementPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/notices', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setNotices(data);
      } else {
        toast.error(data.message || 'Failed to fetch notices');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (n?: Notice) => {
    if (n) {
      setEditingNotice(n);
      setFormData({
        ...n,
        date: n.date ? new Date(n.date).toISOString().split('T')[0] : INITIAL_FORM_STATE.date
      });
    } else {
      setEditingNotice(null);
      setFormData(INITIAL_FORM_STATE);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingNotice(null);
    setFormData(INITIAL_FORM_STATE);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const url = editingNotice 
        ? `/api/admin/notices/${editingNotice._id}` 
        : '/api/admin/notices';
      
      const method = editingNotice ? 'PUT' : 'POST';
      
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
        toast.success(editingNotice ? 'Notice updated successfully' : 'Notice created successfully');
        handleCloseDialog();
        fetchNotices();
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
    if (!window.confirm('Are you sure you want to delete this notice?')) return;

    try {
      const response = await fetch(`/api/admin/notices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      if (response.ok) {
        toast.success('Notice deleted successfully');
        fetchNotices();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete notice');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  const filteredNotices = notices.filter(n => {
    return (
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BellRing className="h-8 w-8 text-blue-600" />
            Notice Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage important announcements and notices for students and faculty
          </p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => handleOpenDialog()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Notice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notices..."
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((n) => (
                    <TableRow key={n._id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{n.title}</span>
                          <span className="text-xs text-gray-500">{n.description}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{n.category}</Badge></TableCell>
                      <TableCell>{new Date(n.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-600"
                            onClick={() => handleOpenDialog(n)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-600"
                            onClick={() => handleDelete(n._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No notices found matching your criteria
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
          <DialogTitle>{editingNotice ? 'Edit Notice' : 'Create New Notice'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required value={formData.title} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description" 
                name="description" 
                required 
                value={formData.description} 
                onChange={handleInputChange}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              ></textarea>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" required value={formData.category} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />{editingNotice ? 'Update Notice' : 'Create Notice'}</>}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
