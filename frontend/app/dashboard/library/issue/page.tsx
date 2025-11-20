'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, AlertCircle, Download, Plus } from 'lucide-react';

export default function LibraryIssuePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    totalIssued: 245,
    dueToday: 12,
    overdue: 8,
    returned: 230,
  };

  const issuedBooks = [
    {
      id: '1',
      bookTitle: 'Physics Vol. 1',
      bookCode: 'PHY-001',
      studentName: 'Rahul Kumar',
      rollNo: '1001',
      class: '10-A',
      issueDate: '2025-11-01',
      dueDate: '2025-11-15',
      status: 'overdue',
      fine: 30,
    },
    {
      id: '2',
      bookTitle: 'Mathematics Guide',
      bookCode: 'MATH-045',
      studentName: 'Priya Sharma',
      rollNo: '1002',
      class: '9-B',
      issueDate: '2025-11-10',
      dueDate: '2025-11-24',
      status: 'issued',
      fine: 0,
    },
    {
      id: '3',
      bookTitle: 'English Literature',
      bookCode: 'ENG-023',
      studentName: 'Amit Patel',
      rollNo: '1003',
      class: '10-A',
      issueDate: '2025-11-15',
      dueDate: '2025-11-17',
      status: 'due-today',
      fine: 0,
    },
  ];

  const filteredBooks = (status?: string) => {
    let filtered = issuedBooks;
    if (status === 'overdue') {
      filtered = filtered.filter(b => b.status === 'overdue');
    } else if (status === 'due-today') {
      filtered = filtered.filter(b => b.status === 'due-today');
    }
    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bookCode.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Book Issue & Return</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage library book circulation</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Issue Book
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issued</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalIssued}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.dueToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.returned}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search by student name, book title, or book code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Issued ({stats.totalIssued})</TabsTrigger>
          <TabsTrigger value="due-today">Due Today ({stats.dueToday})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({stats.overdue})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {filteredBooks().map((book) => (
            <Card key={book.id} className={`border-l-4 ${
              book.status === 'overdue' ? 'border-l-red-500' :
              book.status === 'due-today' ? 'border-l-yellow-500' :
              'border-l-blue-500'
            }`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{book.bookTitle}</h3>
                      <span className="text-sm text-gray-500">({book.bookCode})</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        book.status === 'overdue' ? 'bg-red-100 text-red-700' :
                        book.status === 'due-today' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {book.status === 'overdue' ? 'Overdue' :
                         book.status === 'due-today' ? 'Due Today' : 'Issued'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Student</p>
                        <p className="font-medium">{book.studentName}</p>
                        <p className="text-sm text-gray-500">{book.class} • {book.rollNo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Issue Date</p>
                        <p className="font-medium">{book.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className={`font-medium ${
                          book.status === 'overdue' ? 'text-red-600' : ''
                        }`}>{book.dueDate}</p>
                      </div>
                      {book.fine > 0 && (
                        <div>
                          <p className="text-sm text-gray-500">Fine</p>
                          <p className="font-medium text-red-600">₹{book.fine}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm">Return Book</Button>
                    <Button size="sm" variant="outline">Renew</Button>
                    {book.status === 'overdue' && (
                      <Button size="sm" variant="outline">Collect Fine</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="due-today" className="space-y-3 mt-4">
          {filteredBooks('due-today').map((book) => (
            <Card key={book.id} className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{book.bookTitle}</h3>
                    <p className="text-sm text-gray-500">{book.studentName} • {book.class}</p>
                  </div>
                  <Button size="sm">Return Book</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-3 mt-4">
          {filteredBooks('overdue').map((book) => (
            <Card key={book.id} className="border-l-4 border-l-red-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{book.bookTitle}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {book.studentName} • {book.class} • Due: {book.dueDate}
                    </p>
                    <p className="text-sm font-medium text-red-600">Fine: ₹{book.fine}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Return & Pay</Button>
                    <Button size="sm" variant="outline">Send Reminder</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
