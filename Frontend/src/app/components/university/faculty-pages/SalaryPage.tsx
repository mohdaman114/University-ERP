import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { DollarSign, CreditCard, Download, FileText } from 'lucide-react';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, 
  Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
  Tabs, TabsList, TabsTrigger, TabsContent, Label
} from '../admin-pages/AdminUI';

interface SalaryStructure {
  _id?: string;
  baseSalary: number;
  hra: number;
  da: number;
  otherAllowances: number;
  deductions: number;
  netSalary: number;
}

interface SalaryRecord {
  _id: string;
  month: string;
  year: number;
  amountPaid: number;
  paymentDate: string;
  paymentMode: string;
  transactionId?: string;
  status: string;
  remarks?: string;
}

export function SalaryPage() {
  const { authenticatedFetch } = useAuth();
  const [activeTab, setActiveTab] = useState('structure');
  const [salaryStructure, setSalaryStructure] = useState<SalaryStructure | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [authenticatedFetch]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch structure
      const structRes = await authenticatedFetch('/api/salary/structure/me');
      if (structRes.ok) {
        const data = await structRes.json();
        setSalaryStructure(data);
      }

      // Fetch history
      const historyRes = await authenticatedFetch('/api/salary/history/me');
      if (historyRes.ok) {
        const data = await historyRes.json();
        setPaymentHistory(data);
      }
    } catch (err) {
      console.error('Error fetching salary data', err);
      toast.error('Failed to load salary information');
    } finally {
      setLoading(false);
    }
  };

  const downloadSlip = (record: SalaryRecord) => {
    // Placeholder for payslip download
    toast.info(`Downloading payslip for ${record.month} ${record.year}...`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <DollarSign className="h-8 w-8 text-green-600" />
        My Salary
      </h1>

      <Tabs defaultValue="structure" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="structure">Salary Structure</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Salary Structure</CardTitle>
              <CardDescription>Breakdown of your monthly compensation</CardDescription>
            </CardHeader>
            <CardContent>
              {salaryStructure ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600 dark:text-gray-400">Base Salary</span>
                      <span className="font-medium">₹{salaryStructure.baseSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600 dark:text-gray-400">HRA</span>
                      <span className="font-medium">₹{salaryStructure.hra.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600 dark:text-gray-400">DA</span>
                      <span className="font-medium">₹{salaryStructure.da.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600 dark:text-gray-400">Other Allowances</span>
                      <span className="font-medium">₹{salaryStructure.otherAllowances.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-red-600 dark:text-red-400">Deductions</span>
                      <span className="font-medium text-red-600 dark:text-red-400">- ₹{salaryStructure.deductions.toLocaleString()}</span>
                    </div>
                    
                    <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-green-900 dark:text-green-100">Net Monthly Salary</span>
                        <span className="text-3xl font-bold text-green-700 dark:text-green-300">
                          ₹{salaryStructure.netSalary.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Salary structure not defined yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Record of all salary payments received</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.length > 0 ? (
                    paymentHistory.map((record) => (
                      <TableRow key={record._id}>
                        <TableCell className="font-medium">{record.month} {record.year}</TableCell>
                        <TableCell>₹{record.amountPaid.toLocaleString()}</TableCell>
                        <TableCell>{new Date(record.paymentDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{record.paymentMode}</span>
                            {record.transactionId && (
                              <span className="text-xs text-gray-500">{record.transactionId}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {record.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => downloadSlip(record)}>
                            <Download className="h-4 w-4 mr-2" />
                            Payslip
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No payment history found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
