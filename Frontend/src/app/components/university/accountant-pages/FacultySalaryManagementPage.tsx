import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Search, DollarSign, CreditCard, History, User } from 'lucide-react';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, 
  Button, Input, Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
  Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, Label,
  Tabs, TabsList, TabsTrigger, TabsContent,
  cn // Import cn utility for consistent styling
} from '../admin-pages/AdminUI';

// Custom Select component to match AdminUI styling
interface SelectProps extends React.ComponentProps<'select'> {
  options: (string | number)[];
  id: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, id, ...props }, ref) => {
    return (
      <select
        id={id}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }
);
Select.displayName = "Select";

// Types matching backend models
interface Faculty {
  _id: string;
  name: string;
  facultyId: string;
  department: string;
  designation: string;
}

interface SalaryStructure {
  _id?: string;
  facultyId: string | Faculty;
  baseSalary: number;
  hra: number;
  da: number;
  otherAllowances: number;
  deductions: number;
  netSalary: number;
}

interface SalaryRecord {
  _id: string;
  facultyId: Faculty;
  month: string;
  year: number;
  amountPaid: number;
  paymentDate: string;
  paymentMode: string;
  transactionId?: string;
  status: string;
  remarks?: string;
}

export function FacultySalaryManagementPage() {
  const { authenticatedFetch } = useAuth();
  const [activeTab, setActiveTab] = useState('structure');
  
  // State for Faculty Search & Selection
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  
  // State for Salary Structure
  const [salaryStructure, setSalaryStructure] = useState<SalaryStructure | null>(null);
  const [isEditingStructure, setIsEditingStructure] = useState(false);
  const [structureForm, setStructureForm] = useState({
    baseSalary: 0,
    hra: 0,
    da: 0,
    otherAllowances: 0,
    deductions: 0
  });

  // State for Payment
  const [paymentHistory, setPaymentHistory] = useState<SalaryRecord[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
    amountPaid: 0,
    paymentMode: 'Bank Transfer',
    transactionId: '',
    remarks: ''
  });

  // Fetch all faculty for search
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await authenticatedFetch('/api/salary/faculty');
        if (response.ok) {
          const data = await response.json();
          setFaculties(data);
        }
      } catch (err) {
        console.error('Failed to fetch faculty list', err);
        toast.error('Failed to load faculty list');
      }
    };
    fetchFaculties();
  }, [authenticatedFetch]);

  // Fetch structure and history when faculty is selected
  useEffect(() => {
    if (selectedFaculty) {
      fetchSalaryStructure();
      fetchPaymentHistory();
    }
  }, [selectedFaculty]);

  const fetchSalaryStructure = async () => {
    if (!selectedFaculty) return;
    try {
      const response = await authenticatedFetch(`/api/salary/structure/${selectedFaculty._id}`);
      if (response.ok) {
        const data = await response.json();
        setSalaryStructure(data);
        setStructureForm({
          baseSalary: data.baseSalary,
          hra: data.hra,
          da: data.da,
          otherAllowances: data.otherAllowances,
          deductions: data.deductions
        });
        // Auto-fill payment amount
        setPaymentForm(prev => ({ ...prev, amountPaid: data.netSalary }));
      } else if (response.status === 404) {
        // Normal case for new faculty, just reset form
        setSalaryStructure(null);
        setStructureForm({ baseSalary: 0, hra: 0, da: 0, otherAllowances: 0, deductions: 0 });
      } else {
        setSalaryStructure(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPaymentHistory = async () => {
    if (!selectedFaculty) return;
    try {
      const response = await authenticatedFetch(`/api/salary/history/${selectedFaculty._id}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentHistory(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);

  const handleUpdateStructure = async () => {
    if (!selectedFaculty) return;
    try {
      const response = await authenticatedFetch('/api/salary/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facultyId: selectedFaculty._id,
          ...structureForm
        })
      });

      if (response.ok) {
        toast.success('Salary structure updated successfully');
        setIsEditingStructure(false);
        setIsConfirmSaveOpen(false); // Close confirmation dialog
        fetchSalaryStructure();
      } else {
        toast.error('Failed to update salary structure');
      }
    } catch (err) {
      toast.error('Error updating salary structure');
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedFaculty) return;
    try {
      const response = await authenticatedFetch('/api/salary/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facultyId: selectedFaculty._id,
          ...paymentForm
        })
      });

      if (response.ok) {
        toast.success('Salary payment recorded successfully');
        setIsPaymentDialogOpen(false);
        fetchPaymentHistory();
      } else {
        toast.error('Failed to record payment');
      }
    } catch (err) {
      toast.error('Error recording payment');
    }
  };

  const filteredFaculties = faculties.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.facultyId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateNetSalary = () => {
    const { baseSalary, hra, da, otherAllowances, deductions } = structureForm;
    return Number(baseSalary) + Number(hra) + Number(da) + Number(otherAllowances) - Number(deductions);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <DollarSign className="h-8 w-8 text-green-600" />
        Faculty Salary Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Faculty Search & Selection */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Select Faculty</CardTitle>
            <CardDescription>Search and select a faculty member</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by name or ID..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="max-h-[500px] overflow-y-auto space-y-2 border rounded-md p-2">
              {filteredFaculties.map(faculty => (
                <div 
                  key={faculty._id}
                  onClick={() => setSelectedFaculty(faculty)}
                  className={`p-3 rounded-md cursor-pointer transition-colors flex items-center gap-3 ${
                    selectedFaculty?._id === faculty._id 
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 border' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{faculty.name}</p>
                    <p className="text-xs text-gray-500">{faculty.facultyId} • {faculty.department}</p>
                  </div>
                </div>
              ))}
              {filteredFaculties.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-4">No faculty found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Salary Details & History */}
        <div className="md:col-span-2 space-y-6">
          {selectedFaculty ? (
            <Tabs defaultValue="structure" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="structure">Salary Structure</TabsTrigger>
                <TabsTrigger value="history">Payment History</TabsTrigger>
              </TabsList>

              {/* Tab 1: Salary Structure */}
              <TabsContent value="structure">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Current Salary Structure</CardTitle>
                      <CardDescription>
                        For {selectedFaculty.name} ({selectedFaculty.designation})
                      </CardDescription>
                    </div>
                    <Button onClick={() => setIsEditingStructure(!isEditingStructure)}>
                      {isEditingStructure ? 'Cancel' : (salaryStructure ? 'Edit Structure' : 'Create Structure')}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Earnings */}
                      <Card className="col-span-1">
                        <CardHeader>
                          <CardTitle className="text-lg">Earnings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="baseSalary">Base Salary (₹)</Label>
                            <Input 
                              id="baseSalary"
                              type="number" 
                              disabled={!isEditingStructure}
                              value={structureForm.baseSalary}
                              onChange={(e) => setStructureForm({...structureForm, baseSalary: Number(e.target.value)})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hra">HRA (₹)</Label>
                            <Input 
                              id="hra"
                              type="number" 
                              disabled={!isEditingStructure}
                              value={structureForm.hra}
                              onChange={(e) => setStructureForm({...structureForm, hra: Number(e.target.value)})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="da">DA (₹)</Label>
                            <Input 
                              id="da"
                              type="number" 
                              disabled={!isEditingStructure}
                              value={structureForm.da}
                              onChange={(e) => setStructureForm({...structureForm, da: Number(e.target.value)})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="otherAllowances">Other Allowances (₹)</Label>
                            <Input 
                              id="otherAllowances"
                              type="number" 
                              disabled={!isEditingStructure}
                              value={structureForm.otherAllowances}
                              onChange={(e) => setStructureForm({...structureForm, otherAllowances: Number(e.target.value)})}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Deductions */}
                      <Card className="col-span-1">
                        <CardHeader>
                          <CardTitle className="text-lg">Deductions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="deductions">Deductions (₹)</Label>
                            <Input 
                              id="deductions"
                              type="number" 
                              className="text-red-600"
                              disabled={!isEditingStructure}
                              value={structureForm.deductions}
                              onChange={(e) => setStructureForm({...structureForm, deductions: Number(e.target.value)})}
                            />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="md:col-span-2 pt-4 border-t mt-2">
                        <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <span className="font-semibold text-lg text-green-900 dark:text-green-100">Net Salary (Monthly)</span>
                          <span className="font-bold text-2xl text-green-700 dark:text-green-300">
                            ₹{isEditingStructure ? calculateNetSalary().toLocaleString() : (salaryStructure?.netSalary || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {isEditingStructure && (
                        <div className="md:col-span-2 flex justify-end mt-4">
                          <Button onClick={() => setIsConfirmSaveOpen(true)} className="bg-green-600 hover:bg-green-700">
                            Save Salary Structure
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Confirmation Dialog for Save */}
              <Dialog open={isConfirmSaveOpen} onOpenChange={setIsConfirmSaveOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Save</DialogTitle>
                  </DialogHeader>
                  <p>Are you sure you want to save these changes to the salary structure?</p>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsConfirmSaveOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateStructure}>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Tab 2: Payment History */}
              <TabsContent value="history">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Payment History</CardTitle>
                      <CardDescription>Past salary disbursements</CardDescription>
                    </div>
                    <Button onClick={() => setIsPaymentDialogOpen(true)} disabled={!salaryStructure}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Record New Payment
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {!salaryStructure && (
                      <div className="p-4 mb-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200">
                        Please define a salary structure before recording payments.
                      </div>
                    )}
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month/Year</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentHistory.length > 0 ? (
                          paymentHistory.map((record) => (
                            <TableRow key={record._id}>
                              <TableCell className="font-medium">{record.month} {record.year}</TableCell>
                              <TableCell>₹{record.amountPaid.toLocaleString()}</TableCell>
                              <TableCell>{record.paymentMode}</TableCell>
                              <TableCell>{new Date(record.paymentDate).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                  {record.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                              No payment records found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 min-h-[400px]">
              <div className="text-center text-gray-500">
                <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No Faculty Selected</p>
                <p className="text-sm">Select a faculty member from the list to manage their salary.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Record Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Salary Payment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMonth">Month</Label>
                <Select
                  id="paymentMonth"
                  value={paymentForm.month}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentForm({...paymentForm, month: e.target.value})}
                  options={[
                    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
                  ]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentYear">Year</Label>
                <Select
                  id="paymentYear"
                  value={paymentForm.year}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentForm({...paymentForm, year: Number(e.target.value)})}
                  options={Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)} // Last 5 years
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Amount Paid (₹)</Label>
              <Input 
                type="number"
                value={paymentForm.amountPaid}
                onChange={(e) => setPaymentForm({...paymentForm, amountPaid: Number(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Mode</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={paymentForm.paymentMode}
                onChange={(e) => setPaymentForm({...paymentForm, paymentMode: e.target.value})}
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Transaction ID (Optional)</Label>
              <Input 
                value={paymentForm.transactionId}
                onChange={(e) => setPaymentForm({...paymentForm, transactionId: e.target.value})}
                placeholder="e.g. UTR123456789"
              />
            </div>

            <div className="space-y-2">
              <Label>Remarks (Optional)</Label>
              <Input 
                value={paymentForm.remarks}
                onChange={(e) => setPaymentForm({...paymentForm, remarks: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRecordPayment} className="bg-green-600 hover:bg-green-700">Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
