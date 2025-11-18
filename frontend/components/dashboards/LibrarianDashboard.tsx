'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Clock,
  Package,
  Star
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function LibrarianDashboard() {
  const { user } = useAuth();

  // Library Stats
  const libraryStats = [
    {
      title: 'Total Books',
      value: '5,240',
      change: '+120 new',
      trend: 'up',
      icon: BookOpen,
      color: 'blue',
      description: 'In collection',
    },
    {
      title: 'Issued Books',
      value: '342',
      change: '6.5% rate',
      trend: 'neutral',
      icon: Users,
      color: 'green',
      description: 'Currently with members',
    },
    {
      title: 'Overdue Books',
      value: '28',
      change: '12 critical',
      trend: 'down',
      icon: AlertTriangle,
      color: 'orange',
      description: 'Need follow-up',
    },
    {
      title: 'New Arrivals',
      value: '45',
      change: 'This month',
      trend: 'up',
      icon: Package,
      color: 'purple',
      description: 'To be catalogued',
    },
  ];

  // Recent Book Issues
  const recentIssues = [
    { 
      memberName: 'Raj Kumar', 
      memberType: 'student',
      class: '10-A', 
      bookTitle: 'Introduction to Algorithms',
      bookNo: 'CS-2024-1234',
      issueDate: '2025-11-15',
      dueDate: '2025-11-29',
      status: 'active'
    },
    { 
      memberName: 'Priya Sharma', 
      memberType: 'student',
      class: '9-B', 
      bookTitle: 'Pride and Prejudice',
      bookNo: 'LIT-2024-5678',
      issueDate: '2025-11-14',
      dueDate: '2025-11-28',
      status: 'active'
    },
    { 
      memberName: 'Mr. Singh', 
      memberType: 'teacher',
      class: 'Staff', 
      bookTitle: 'Modern Teaching Methods',
      bookNo: 'EDU-2024-9012',
      issueDate: '2025-11-13',
      dueDate: '2025-12-13',
      status: 'active'
    },
    { 
      memberName: 'Amit Patel', 
      memberType: 'student',
      class: '11-A', 
      bookTitle: 'Physics for Beginners',
      bookNo: 'SCI-2024-3456',
      issueDate: '2025-11-12',
      dueDate: '2025-11-26',
      status: 'active'
    },
  ];

  // Overdue Books List
  const overdueBooks = [
    { 
      memberName: 'Rohit Singh', 
      class: '10-A',
      memberType: 'student',
      bookTitle: 'Harry Potter and the Sorcerer\'s Stone',
      bookNo: 'FIC-2024-7890',
      dueDate: '2025-10-20',
      daysOverdue: 28,
      fineAmount: 280,
      priority: 'high'
    },
    { 
      memberName: 'Sonia Mehta', 
      class: '9-B',
      memberType: 'student',
      bookTitle: 'The Great Gatsby',
      bookNo: 'LIT-2024-2345',
      dueDate: '2025-11-01',
      daysOverdue: 16,
      fineAmount: 160,
      priority: 'medium'
    },
    { 
      memberName: 'Arjun Kumar', 
      class: '11-C',
      memberType: 'student',
      bookTitle: 'Data Structures and Algorithms',
      bookNo: 'CS-2024-6789',
      dueDate: '2025-11-05',
      daysOverdue: 12,
      fineAmount: 120,
      priority: 'medium'
    },
    { 
      memberName: 'Ms. Gupta', 
      class: 'Staff',
      memberType: 'teacher',
      bookTitle: 'Classroom Management',
      bookNo: 'EDU-2024-4567',
      dueDate: '2025-11-10',
      daysOverdue: 7,
      fineAmount: 70,
      priority: 'low'
    },
  ];

  // Popular Books
  const popularBooks = [
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', issueCount: 45, rating: 4.8 },
    { title: 'Introduction to Algorithms', author: 'CLRS', category: 'Computer Science', issueCount: 38, rating: 4.9 },
    { title: 'Physics Principles', author: 'HC Verma', category: 'Science', issueCount: 35, rating: 4.7 },
    { title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Literature', issueCount: 32, rating: 4.6 },
  ];

  // New Arrivals
  const newArrivals = [
    { title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', dateAdded: '2025-11-15', status: 'available' },
    { title: 'The AI Revolution', author: 'Dr. Smith', category: 'Technology', dateAdded: '2025-11-14', status: 'processing' },
    { title: 'Modern Mathematics', author: 'Prof. Kumar', category: 'Mathematics', dateAdded: '2025-11-13', status: 'available' },
    { title: 'World History', author: 'Dr. Patel', category: 'History', dateAdded: '2025-11-12', status: 'available' },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
  };

  const memberTypeColors = {
    student: 'bg-blue-100 text-blue-700',
    teacher: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.first_name}! 📚
        </h1>
        <p className="text-indigo-100">
          Here's your library overview and recent activities
        </p>
      </div>

      {/* Library Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {libraryStats.map((stat, index) => {
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
                  ) : stat.trend === 'down' ? (
                    <AlertTriangle size={14} className="text-orange-500 mr-1" />
                  ) : (
                    <TrendingUp size={14} className="text-gray-500 mr-1" />
                  )}
                  <span className={
                    stat.trend === 'up' ? 'text-green-500' : 
                    stat.trend === 'down' ? 'text-orange-500' : 
                    'text-gray-500'
                  }>
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
        {/* Recent Book Issues */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} />
              Recent Book Issues
            </CardTitle>
            <CardDescription>Latest book checkouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentIssues.map((issue, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold truncate">{issue.memberName}</p>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${memberTypeColors[issue.memberType as keyof typeof memberTypeColors]}`}
                      >
                        {issue.memberType}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{issue.bookTitle}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{issue.bookNo} • {issue.class}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        Due: {new Date(issue.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overdue Books */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={20} />
              Overdue Books
            </CardTitle>
            <CardDescription>Books pending return</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueBooks.map((overdue, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold">{overdue.memberName}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          overdue.priority === 'high' ? 'border-red-500 text-red-500' :
                          overdue.priority === 'medium' ? 'border-yellow-500 text-yellow-500' :
                          'border-green-500 text-green-500'
                        }`}
                      >
                        {overdue.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{overdue.bookTitle}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{overdue.bookNo} • {overdue.class}</span>
                      <span className="text-xs text-red-600 font-medium">Fine: ₹{overdue.fineAmount}</span>
                    </div>
                    <p className="text-xs text-orange-600 mt-1">{overdue.daysOverdue} days overdue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout - Popular & New Arrivals */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Popular Books */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star size={20} />
              Popular Books
            </CardTitle>
            <CardDescription>Most issued this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularBooks.map((book, index) => (
                <div key={index} className="p-3 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1">{book.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">by {book.author}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
                      <Star size={12} fill="currentColor" />
                      {book.rating}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">{book.category}</Badge>
                    <span className="text-xs text-gray-500">{book.issueCount} issues</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* New Arrivals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package size={20} />
              New Arrivals
            </CardTitle>
            <CardDescription>Recently added books</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {newArrivals.map((book, index) => (
                <div key={index} className="p-3 rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1">{book.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">by {book.author}</p>
                    </div>
                    <Badge 
                      variant={book.status === 'available' ? 'secondary' : 'outline'}
                      className={`text-xs ${
                        book.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {book.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">{book.category}</Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(book.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
