'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  AlertCircle,
  Receipt,
  Users,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AccountantDashboard() {
  const { user } = useAuth();

  // Finance Stats
  const financeStats = [
    {
      title: 'Today\'s Collection',
      value: '₹52,450',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue',
      description: 'Cash: ₹15K | Online: ₹37K',
    },
    {
      title: 'Monthly Collection',
      value: '₹5,24,000',
      change: '+8.2%',
      trend: 'up',
      icon: Wallet,
      color: 'green',
      description: 'Target: ₹6,00,000',
    },
    {
      title: 'Pending Fees',
      value: '₹2,45,000',
      change: '125 students',
      trend: 'down',
      icon: AlertCircle,
      color: 'orange',
      description: 'Follow-up required',
    },
    {
      title: 'Expenses',
      value: '₹98,000',
      change: '-5.1%',
      trend: 'up',
      icon: CreditCard,
      color: 'purple',
      description: 'This month',
    },
  ];

  // Recent Transactions
  const recentTransactions = [
    { 
      receiptNo: 'FEE-2025-1234', 
      studentName: 'Raj Kumar', 
      class: '10-A', 
      amount: 10000, 
      mode: 'UPI', 
      date: '2025-11-17 10:30 AM',
      type: 'fee',
      status: 'completed'
    },
    { 
      receiptNo: 'FEE-2025-1233', 
      studentName: 'Priya Sharma', 
      class: '9-B', 
      amount: 8000, 
      mode: 'Cash', 
      date: '2025-11-17 09:15 AM',
      type: 'fee',
      status: 'completed'
    },
    { 
      receiptNo: 'EXP-2025-456', 
      studentName: 'Electricity Bill', 
      class: '-', 
      amount: 15000, 
      mode: 'Online', 
      date: '2025-11-16 02:45 PM',
      type: 'expense',
      status: 'completed'
    },
    { 
      receiptNo: 'FEE-2025-1232', 
      studentName: 'Amit Patel', 
      class: '11-A', 
      amount: 12000, 
      mode: 'Cheque', 
      date: '2025-11-16 11:20 AM',
      type: 'fee',
      status: 'pending'
    },
    { 
      receiptNo: 'FEE-2025-1231', 
      studentName: 'Neha Gupta', 
      class: '8-C', 
      amount: 9000, 
      mode: 'Card', 
      date: '2025-11-16 10:05 AM',
      type: 'fee',
      status: 'completed'
    },
  ];

  // Fee Defaulters
  const feeDefaulters = [
    { name: 'Rohit Singh', class: '10-A', rollNo: '12', pendingAmount: 25000, months: 'Oct, Nov', daysOverdue: 45, priority: 'high' },
    { name: 'Sonia Mehta', class: '9-B', rollNo: '08', pendingAmount: 18000, months: 'Nov', daysOverdue: 15, priority: 'medium' },
    { name: 'Arjun Kumar', class: '11-C', rollNo: '22', pendingAmount: 30000, months: 'Sep, Oct, Nov', daysOverdue: 75, priority: 'high' },
    { name: 'Kavya Reddy', class: '8-A', rollNo: '15', pendingAmount: 12000, months: 'Nov', daysOverdue: 10, priority: 'low' },
  ];

  // Upcoming Dues
  const upcomingDues = [
    { month: 'December 2025', studentsCount: 850, totalAmount: 850000, dueDate: '2025-12-01', daysLeft: 14 },
    { month: 'January 2026', studentsCount: 850, totalAmount: 850000, dueDate: '2026-01-01', daysLeft: 45 },
  ];

  // Payment Mode Distribution
  const paymentModes = [
    { mode: 'UPI/Online', amount: 325000, percentage: 62, count: 245 },
    { mode: 'Cash', amount: 120000, percentage: 23, count: 180 },
    { mode: 'Cheque', amount: 55000, percentage: 10, count: 35 },
    { mode: 'Card', amount: 24000, percentage: 5, count: 28 },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.first_name}! 💰
        </h1>
        <p className="text-emerald-100">
          Here's your financial overview and collection summary
        </p>
      </div>

      {/* Finance Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {financeStats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp size={14} className="text-green-500 mr-1" />
                  ) : (
                    <TrendingDown size={14} className="text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-500' : 'text-orange-500'}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Transactions */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt size={20} />
              Recent Transactions
            </CardTitle>
            <CardDescription>Latest payment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'fee' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'fee' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold truncate">{transaction.studentName}</p>
                      <Badge 
                        variant={transaction.status === 'completed' ? 'secondary' : 'outline'}
                        className={`text-xs ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{transaction.receiptNo} • {transaction.class}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">₹{transaction.amount.toLocaleString()}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{transaction.mode}</Badge>
                        <span className="text-xs text-gray-500">{transaction.date.split(' ')[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Mode Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={20} />
              Payment Modes
            </CardTitle>
            <CardDescription>Distribution by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentModes.map((mode, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{mode.mode}</span>
                      <Badge variant="outline" className="text-xs">{mode.count} txns</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">₹{(mode.amount / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-gray-500">{mode.percentage}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${mode.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout - Defaulters & Upcoming Dues */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Fee Defaulters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle size={20} />
              Fee Defaulters
            </CardTitle>
            <CardDescription>Students with pending fees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feeDefaulters.map((defaulter, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold">{defaulter.name}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          defaulter.priority === 'high' ? 'border-red-500 text-red-500' :
                          defaulter.priority === 'medium' ? 'border-yellow-500 text-yellow-500' :
                          'border-green-500 text-green-500'
                        }`}
                      >
                        {defaulter.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Class {defaulter.class} • Roll No: {defaulter.rollNo}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-600">₹{defaulter.pendingAmount.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">{defaulter.months}</span>
                    </div>
                    <p className="text-xs text-orange-500 mt-1">{defaulter.daysOverdue} days overdue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Dues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Upcoming Dues
            </CardTitle>
            <CardDescription>Fee collection schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDues.map((due, index) => (
                <div key={index} className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">{due.month}</p>
                    <Badge variant="secondary" className="text-xs">
                      {due.daysLeft} days left
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Expected Amount</p>
                      <p className="text-lg font-bold text-green-600">₹{(due.totalAmount / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Students</p>
                      <p className="text-lg font-bold text-blue-600">{due.studentsCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                    <Calendar size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-500">
                      Due Date: {new Date(due.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
