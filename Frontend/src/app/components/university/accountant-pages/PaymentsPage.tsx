import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge } from '../student-pages/ui-components';

interface FeeBreakdown {
  tuition: number;
  library: number;
  exam: number;
  other: number;
}

interface FeeSummary {
  _id: string;
  semester: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: string;
  dueDate: string;
  breakdown: FeeBreakdown;
  lastPaymentDate?: string;
  transactionId?: string;
}

interface StudentFeeDetails {
  studentId: string;
  studentName: string;
  course: string;
  currentSemester: number;
  feeSummary: FeeSummary[];
}

export function PaymentsPage() {
  const { authenticatedFetch } = useAuth();
  
  // Search State
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [studentDetails, setStudentDetails] = useState<StudentFeeDetails | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    studentId: '',
    semester: '',
    amountPaid: '',
    paymentMode: 'Cash',
    transactionId: '',
    remarks: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsSearching(true);
    setErrorMessage(null);
    setStudentDetails(null);

    try {
      const response = await authenticatedFetch(`/api/fees/student/${searchId}`);
      if (!response.ok) {
        throw new Error('Student not found or error fetching details');
      }
      const data = await response.json();
      setStudentDetails(data);
      // Auto-fill student ID in the form if found
      setFormData(prev => ({ ...prev, studentId: searchId }));
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePayClick = (summary: FeeSummary) => {
    setFormData({
      ...formData,
      semester: summary.semester.toString(),
      amountPaid: summary.pendingAmount > 0 ? summary.pendingAmount.toString() : '',
      studentId: searchId // Ensure student ID is consistent
    });
    // Scroll to form
    document.getElementById('payment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, paymentMode: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await authenticatedFetch('/api/fees/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amountPaid: Number(formData.amountPaid),
          semester: Number(formData.semester)
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Payment recording failed');
      }

      const data = await response.json();
      setSuccessMessage(`Payment recorded successfully! Receipt ID: ${data._id}`);
      
      // Refresh student details if we have a search active
      if (searchId) {
        const refreshResponse = await authenticatedFetch(`/api/fees/student/${searchId}`);
        if (refreshResponse.ok) {
          setStudentDetails(await refreshResponse.json());
        }
      }

      // Reset form but keep student ID if searching
      setFormData({
        studentId: searchId || '',
        semester: '',
        amountPaid: '',
        paymentMode: 'Cash',
        transactionId: '',
        remarks: ''
      });
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Record Payment</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Search for a student to view dues and record payments</p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Student</CardTitle>
          <CardDescription>Enter Student ID, User ID, or Roll Number</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input 
              placeholder="e.g. STU001 or User ID" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Fetch Details'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {errorMessage && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-100 text-green-700 rounded-md border border-green-200">
          {successMessage}
        </div>
      )}

      {/* Student Details & Fee Summary */}
      {studentDetails && (
        <Card>
          <CardHeader>
            <CardTitle>{studentDetails.studentName}</CardTitle>
            <CardDescription>
              {studentDetails.course} • Semester {studentDetails.currentSemester} • ID: {studentDetails.studentId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sem</TableHead>
                    <TableHead>Total Fee</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentDetails.feeSummary.length > 0 ? (
                    studentDetails.feeSummary.map((fee) => (
                      <TableRow key={fee._id}>
                        <TableCell className="font-medium">{fee.semester}</TableCell>
                        <TableCell>${fee.totalAmount}</TableCell>
                        <TableCell className="text-green-600">${fee.paidAmount}</TableCell>
                        <TableCell className="text-red-600">${fee.pendingAmount}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={fee.status === 'Paid' ? 'default' : fee.status === 'Partial' ? 'secondary' : 'destructive'}
                            className={
                              fee.status === 'Paid' ? 'bg-green-600 hover:bg-green-700' : 
                              fee.status === 'Partial' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : ''
                            }
                          >
                            {fee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {fee.pendingAmount > 0 && (
                            <Button size="sm" variant="outline" onClick={() => handlePayClick(fee)}>
                              Pay Now
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        No fee structures found for this student.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Payment Form */}
      <Card id="payment-form">
        <CardHeader>
          <CardTitle>Payment Entry</CardTitle>
          <CardDescription>Enter the payment details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID / User ID / Roll No</Label>
              <Input 
                id="studentId" 
                name="studentId" 
                placeholder="Enter Student ID" 
                value={formData.studentId} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input 
                  id="semester" 
                  name="semester" 
                  type="number" 
                  placeholder="e.g. 6" 
                  value={formData.semester} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amountPaid">Amount Paid</Label>
                <Input 
                  id="amountPaid" 
                  name="amountPaid" 
                  type="number" 
                  placeholder="0.00" 
                  value={formData.amountPaid} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMode">Payment Mode</Label>
              <Select onValueChange={handleSelectChange} value={formData.paymentMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="DD">Demand Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID / Cheque No.</Label>
              <Input 
                id="transactionId" 
                name="transactionId" 
                placeholder="Optional for Cash" 
                value={formData.transactionId} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Input 
                id="remarks" 
                name="remarks" 
                placeholder="Any additional notes" 
                value={formData.remarks} 
                onChange={handleInputChange} 
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Recording...' : 'Record Payment'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
