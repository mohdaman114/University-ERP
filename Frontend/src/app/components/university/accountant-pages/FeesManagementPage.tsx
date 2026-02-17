import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input, Label, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../student-pages/ui-components';

interface FeeStructure {
  _id: string;
  courseId: {
    _id: string;
    name: string;
  };
  semester: number;
  tuitionFee: number;
  libraryFee: number;
  examFee: number;
  otherFee: number;
  totalAmount: number;
  dueDate: string;
}

export function FeesManagementPage() {
  const { authenticatedFetch } = useAuth();
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    courseId: '',
    semester: '',
    tuitionFee: '',
    libraryFee: '',
    examFee: '',
    otherFee: '',
    dueDate: ''
  });

  const fetchFeeStructures = async () => {
    try {
      const response = await authenticatedFetch('/api/fees/structures');
      if (!response.ok) throw new Error('Failed to fetch fee structures');
      const data = await response.json();
      setFeeStructures(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeStructures();
  }, [authenticatedFetch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authenticatedFetch('/api/fees/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          semester: Number(formData.semester),
          tuitionFee: Number(formData.tuitionFee),
          libraryFee: Number(formData.libraryFee),
          examFee: Number(formData.examFee),
          otherFee: Number(formData.otherFee)
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to create fee structure');
      }

      alert('Fee Structure Created Successfully');
      fetchFeeStructures();
      setFormData({
        courseId: '',
        semester: '',
        tuitionFee: '',
        libraryFee: '',
        examFee: '',
        otherFee: '',
        dueDate: ''
      });
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fee structure?')) return;
    
    try {
      const response = await authenticatedFetch(`/api/fees/structure/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete');
      
      fetchFeeStructures();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fees Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage fee structures for courses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Fee Structure Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Create Fee Structure</CardTitle>
            <CardDescription>Define fees for a course semester</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courseId">Course Name / Code</Label>
                <Input 
                  id="courseId" 
                  name="courseId" 
                  placeholder="e.g. BCA, MCA, BTECH" 
                  value={formData.courseId} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input 
                  id="semester" 
                  name="semester" 
                  type="number" 
                  placeholder="e.g. 1" 
                  value={formData.semester} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tuitionFee">Tuition Fee</Label>
                  <Input 
                    id="tuitionFee" 
                    name="tuitionFee" 
                    type="number" 
                    value={formData.tuitionFee} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="libraryFee">Library Fee</Label>
                  <Input 
                    id="libraryFee" 
                    name="libraryFee" 
                    type="number" 
                    value={formData.libraryFee} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="examFee">Exam Fee</Label>
                  <Input 
                    id="examFee" 
                    name="examFee" 
                    type="number" 
                    value={formData.examFee} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherFee">Other Fee</Label>
                  <Input 
                    id="otherFee" 
                    name="otherFee" 
                    type="number" 
                    value={formData.otherFee} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  name="dueDate" 
                  type="date" 
                  value={formData.dueDate} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <Button type="submit" className="w-full">Create Fee Structure</Button>
            </form>
          </CardContent>
        </Card>

        {/* Fee Structures List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Existing Fee Structures</CardTitle>
            <CardDescription>List of all defined fee structures</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Sem</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeStructures.map((fee) => (
                      <TableRow key={fee._id}>
                        <TableCell className="font-medium">
                          {fee.courseId?.name || 'Unknown Course'}
                        </TableCell>
                        <TableCell>{fee.semester}</TableCell>
                        <TableCell>${fee.totalAmount}</TableCell>
                        <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(fee._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {feeStructures.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                          No fee structures found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
