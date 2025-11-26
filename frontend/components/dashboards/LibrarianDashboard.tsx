'use client';

// TODO: Backend APIs needed for full integration:
// - GET /library/stats (total_books, issued_books, overdue_books, new_arrivals_count)
// - GET /library/recent-issues (recent book issues list)
// - GET /library/overdue (overdue books with fine details)
// - GET /library/popular (most issued books)
// - GET /library/new-arrivals (recently added books)

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Users,
  Package,
  Star,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function LibrarianDashboard() {
  const { user } = useAuth();

  // TODO: Replace with real API data
  // const [libraryStats, setLibraryStats] = useState(null);
  // useEffect(() => {
  //   fetchLibraryStats();
  // }, []);

  const libraryStats = [
    {
      title: 'Total Books',
      value: '5,240',
      change: '+120 new',
      icon: BookOpen,
      color: 'blue',
    },
    {
      title: 'Issued Books',
      value: '342',
      change: '6.5% rate',
      icon: Users,
      color: 'green',
    },
    {
      title: 'Overdue Books',
      value: '28',
      change: '12 critical',
      icon: AlertTriangle,
      color: 'orange',
    },
    {
      title: 'New Arrivals',
      value: '45',
      change: 'This month',
      icon: Package,
      color: 'purple',
    },
  ];

  const recentIssues = [
    { 
      memberName: 'Raj Kumar', 
      class: '10-A', 
      bookTitle: 'Introduction to Algorithms',
      issueDate: '2025-11-15',
      dueDate: '2025-11-29',
    },
    { 
      memberName: 'Priya Sharma', 
      class: '9-B', 
      bookTitle: 'Pride and Prejudice',
      issueDate: '2025-11-14',
      dueDate: '2025-11-28',
    },
    { 
      memberName: 'Mr. Singh', 
      class: 'Staff', 
      bookTitle: 'Modern Teaching Methods',
      issueDate: '2025-11-13',
      dueDate: '2025-12-13',
    },
  ];

  const overdueBooks = [
    { 
      memberName: 'Rohit Singh', 
      class: '10-A',
      bookTitle: 'Harry Potter and the Sorcerer\'s Stone',
      daysOverdue: 28,
      fineAmount: 280,
      priority: 'high'
    },
    { 
      memberName: 'Sonia Mehta', 
      class: '9-B',
      bookTitle: 'The Great Gatsby',
      daysOverdue: 16,
      fineAmount: 160,
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
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
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
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Book Issues */}
        <Card>
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
                <div key={index} className="p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{issue.memberName}</p>
                      <p className="text-xs text-gray-500">{issue.class}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{issue.bookTitle}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={12} />
                    Due: {new Date(issue.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                <div key={index} className="p-3 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold">{overdue.memberName}</p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        overdue.priority === 'high' ? 'border-red-500 text-red-500' :
                        'border-yellow-500 text-yellow-500'
                      }`}
                    >
                      {overdue.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{overdue.bookTitle}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-orange-600">{overdue.daysOverdue} days overdue</span>
                    <span className="text-xs text-red-600 font-medium">Fine: ₹{overdue.fineAmount}</span>
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
