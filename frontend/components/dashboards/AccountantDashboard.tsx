'use client';

// TODO: Backend APIs needed for full integration:
// - GET /fees/stats (today_collection, monthly_collection, pending_fees, monthly_expenses)
// - GET /fees/recent-transactions (recent payments with receipt details)
// - GET /fees/payment-modes (distribution by payment method)
// - GET /reports/defaulters/:schoolId (fee defaulters list) ✅ AVAILABLE
// - GET /fees/upcoming-dues (upcoming fee collection schedule)

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
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AccountantDashboard() {
  const { user } = useAuth();

  // TODO: Replace with real API data
  // const [financeStats, setFinanceStats] = useState(null);
  // useEffect(() => {
  //   fetchFinanceStats();
  // }, []);

  const financeStats = [
    {
      title: 'Today\'s Collection',
      value: '₹52,450',
      change: '+12.5%',
      icon: DollarSign,
      color: 'blue',
    },
    {
      title: 'Monthly Collection',
      value: '₹5,24,000',
      change: '+8.2%',
      icon: Wallet,
      color: 'green',
    },
    {
      title: 'Pending Fees',
      value: '₹2,45,000',
      change: '125 students',
      icon: AlertCircle,
      color: 'orange',
    },
    {
      title: 'Expenses',
      value: '₹98,000',
      change: 'This month',
      icon: CreditCard,
      color: 'purple',
    },
  ];

  const recentTransactions = [
    { 
      receiptNo: 'FEE-2025-1234', 
      studentName: 'Raj Kumar', 
      class: '10-A', 
      amount: 10000, 
      mode: 'UPI', 
      time: '10:30 AM',
      status: 'completed'
    },
    { 
      receiptNo: 'FEE-2025-1233', 
      studentName: 'Priya Sharma', 
      class: '9-B', 
      amount: 8000, 
      mode: 'Cash', 
      time: '09:15 AM',
      status: 'completed'
    },
  ];

  const feeDefaulters = [
    { 
      name: 'Rohit Singh', 
      class: '10-A', 
      rollNo: '12', 
      pendingAmount: 25000, 
      months: 'Oct, Nov', 
      daysOverdue: 45, 
      priority: 'high' 
    },
    { 
      name: 'Sonia Mehta', 
      class: '9-B', 
      rollNo: '08', 
      pendingAmount: 18000, 
      months: 'Nov', 
      daysOverdue: 15, 
      priority: 'medium' 
    },
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
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
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
                <div key={index} className="p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{transaction.studentName}</p>
                      <p className="text-xs text-gray-500">{transaction.receiptNo} • {transaction.class}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      {transaction.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      ₹{transaction.amount.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{transaction.mode}</Badge>
                      <span className="text-xs text-gray-500">{transaction.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                <div key={index} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold">{defaulter.name}</p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        defaulter.priority === 'high' ? 'border-red-500 text-red-500' :
                        'border-yellow-500 text-yellow-500'
                      }`}
                    >
                      {defaulter.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Class {defaulter.class} • Roll No: {defaulter.rollNo}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-600">
                      ₹{defaulter.pendingAmount.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">{defaulter.months}</span>
                  </div>
                  <p className="text-xs text-orange-500 mt-1">{defaulter.daysOverdue} days overdue</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
