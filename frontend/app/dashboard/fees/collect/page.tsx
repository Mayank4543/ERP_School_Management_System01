'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, DollarSign, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function CollectFeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMode: '',
    transactionId: '',
    remarks: '',
  });

  const students = [
    { id: '1', name: 'Rahul Kumar', rollNo: '1001', class: '10-A', pendingAmount: 10000 },
    { id: '2', name: 'Priya Sharma', rollNo: '1002', class: '10-A', pendingAmount: 15000 },
    { id: '3', name: 'Amit Patel', rollNo: '1003', class: '9-B', pendingAmount: 8000 },
  ];

  const handleSearch = () => {
    const student = students.find(s => 
      s.rollNo === searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (student) {
      setSelectedStudent(student);
      setPaymentData({ ...paymentData, amount: student.pendingAmount.toString() });
    } else {
      toast.error('Student not found');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Fee collected successfully');
      router.push('/dashboard/fees');
    } catch (error) {
      toast.error('Failed to collect fee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Collect Fee</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Record fee payment from students</p>
      </div>

      {/* Search Student */}
      <Card>
        <CardHeader>
          <CardTitle>Search Student</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Enter Roll Number or Student Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Student Details */}
      {selectedStudent && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Student Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Roll Number</p>
                  <p className="font-semibold">{selectedStudent.rollNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-semibold">{selectedStudent.class}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Amount</p>
                  <p className="font-semibold text-red-600">₹{selectedStudent.pendingAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={paymentData.amount}
                        onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMode">Payment Mode *</Label>
                    <Select value={paymentData.paymentMode} onValueChange={(value) => setPaymentData({ ...paymentData, paymentMode: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="online">Online Transfer</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {paymentData.paymentMode && paymentData.paymentMode !== 'cash' && (
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID / Cheque Number</Label>
                    <Input
                      id="transactionId"
                      placeholder="Enter transaction ID or cheque number"
                      value={paymentData.transactionId}
                      onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Input
                    id="remarks"
                    placeholder="Any additional notes..."
                    value={paymentData.remarks}
                    onChange={(e) => setPaymentData({ ...paymentData, remarks: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {loading ? 'Processing...' : 'Collect Fee'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </>
      )}
    </div>
  );
}
