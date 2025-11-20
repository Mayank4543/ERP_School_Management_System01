'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Users, TrendingUp, Download, FileText, Calendar } from 'lucide-react';

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState('november-2025');

  const payrollSummary = {
    totalEmployees: 45,
    totalSalary: 2250000,
    totalDeductions: 225000,
    netPayable: 2025000,
    processed: 40,
    pending: 5,
  };

  const employees = [
    {
      id: '1',
      name: 'Mr. Rajesh Sharma',
      employeeId: 'EMP001',
      designation: 'Senior Teacher',
      basicSalary: 50000,
      allowances: 15000,
      deductions: 5000,
      netSalary: 60000,
      status: 'processed',
    },
    {
      id: '2',
      name: 'Ms. Priya Gupta',
      employeeId: 'EMP002',
      designation: 'Teacher',
      basicSalary: 45000,
      allowances: 12000,
      deductions: 4500,
      netSalary: 52500,
      status: 'processed',
    },
    {
      id: '3',
      name: 'Dr. Amit Kumar',
      employeeId: 'EMP003',
      designation: 'Principal',
      basicSalary: 80000,
      allowances: 25000,
      deductions: 8000,
      netSalary: 97000,
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payroll Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage employee salaries and payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>Process Payroll</Button>
        </div>
      </div>

      {/* Month Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="november-2025">November 2025</SelectItem>
                <SelectItem value="october-2025">October 2025</SelectItem>
                <SelectItem value="september-2025">September 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollSummary.totalEmployees}</div>
            <p className="text-xs text-gray-500">{payrollSummary.processed} processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{(payrollSummary.totalSalary / 100000).toFixed(1)}L
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₹{(payrollSummary.totalDeductions / 100000).toFixed(1)}L
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Payable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₹{(payrollSummary.netPayable / 100000).toFixed(1)}L
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Details - November 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-800">
                  <th className="text-left p-3">Employee</th>
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Designation</th>
                  <th className="text-right p-3">Basic Salary</th>
                  <th className="text-right p-3">Allowances</th>
                  <th className="text-right p-3">Deductions</th>
                  <th className="text-right p-3">Net Salary</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-center p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3 font-medium">{emp.name}</td>
                    <td className="p-3">{emp.employeeId}</td>
                    <td className="p-3">{emp.designation}</td>
                    <td className="p-3 text-right">₹{emp.basicSalary.toLocaleString()}</td>
                    <td className="p-3 text-right text-green-600">+₹{emp.allowances.toLocaleString()}</td>
                    <td className="p-3 text-right text-red-600">-₹{emp.deductions.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-blue-600">₹{emp.netSalary.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        emp.status === 'processed' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {emp.status === 'processed' ? 'Processed' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-1 h-3 w-3" />
                        Slip
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
