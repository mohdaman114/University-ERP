import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../student-pages/ui-components';

interface PaymentRecord {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    rollNumber?: string;
  };
  feeStructureId: {
    semester: number;
    courseId: {
      name: string;
    };
  };
  amountPaid: number;
  paymentMode: string;
  transactionId?: string;
  paymentDate: string;
  status: string;
  remarks?: string;
}

export function ReceiptsPage() {
  const { authenticatedFetch } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await authenticatedFetch('/api/fees/payments');
        if (!response.ok) throw new Error('Failed to fetch payments');
        const data = await response.json();
        setPayments(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [authenticatedFetch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment Receipts</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">View recent fee payments and receipts</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>List of all recent fee payments</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading payments...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Course/Sem</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Txn ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.studentId?.name || 'Unknown'}
                        {payment.studentId?.rollNumber && (
                          <span className="text-xs text-gray-500 block">
                            {payment.studentId.rollNumber}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {payment.feeStructureId?.courseId?.name} (Sem {payment.feeStructureId?.semester})
                      </TableCell>
                      <TableCell className="text-green-600 font-medium">
                        ${payment.amountPaid}
                      </TableCell>
                      <TableCell>{payment.paymentMode}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {payment.transactionId || '-'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          payment.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {payments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500">
                        No payments found.
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
  );
}
