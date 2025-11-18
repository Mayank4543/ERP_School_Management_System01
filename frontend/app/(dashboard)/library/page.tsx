'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Package, AlertCircle, Clock, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock data
  const books = [
    { id: '1', title: 'Physics Vol. 1', author: 'HC Verma', isbn: '978-81-7709-859-3', category: 'Science', available: 3, total: 5, status: 'available' },
    { id: '2', title: 'Mathematics XII', author: 'RD Sharma', isbn: '978-93-5143-435-9', category: 'Mathematics', available: 0, total: 8, status: 'unavailable' },
    { id: '3', title: 'English Grammar', author: 'Wren & Martin', isbn: '978-93-5011-078-8', category: 'Language', available: 5, total: 10, status: 'available' },
    { id: '4', title: 'Chemistry Practical', author: 'Laxmi Publications', isbn: '978-93-80257-82-1', category: 'Science', available: 2, total: 6, status: 'available' },
  ];

  const issuedBooks = [
    { id: '1', bookTitle: 'Physics Vol. 1', studentName: 'Rahul Kumar', rollNo: '1001', class: '10-A', issueDate: '2025-11-10', dueDate: '2025-11-24', status: 'issued' },
    { id: '2', bookTitle: 'Mathematics XII', studentName: 'Priya Sharma', rollNo: '1002', class: '10-A', issueDate: '2025-11-08', dueDate: '2025-11-22', status: 'overdue' },
    { id: '3', bookTitle: 'English Grammar', studentName: 'Amit Patel', rollNo: '1003', class: '9-B', issueDate: '2025-11-12', dueDate: '2025-11-26', status: 'issued' },
  ];

  const stats = {
    totalBooks: 450,
    available: 280,
    issued: 145,
    overdue: 25,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Library Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage books and track issues/returns</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/library/issue">Issue Book</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/library/add-book">
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issued</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.issued}</div>
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
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Books</TabsTrigger>
          <TabsTrigger value="issued">Issued Books</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Books</TabsTrigger>
        </TabsList>

        {/* Books Catalog */}
        <TabsContent value="all" className="space-y-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search books by title, author, or ISBN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">Filter</Button>
              </div>

              <div className="space-y-3">
                {books.map((book) => (
                  <div key={book.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{book.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            book.status === 'available'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {book.status === 'available' ? 'Available' : 'Out of Stock'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">by {book.author}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>ISBN: {book.isbn}</span>
                          <span>Category: {book.category}</span>
                          <span className={book.available > 0 ? 'text-green-600' : 'text-red-600'}>
                            Available: {book.available}/{book.total}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/library/books/${book.id}`}>View</Link>
                        </Button>
                        {book.available > 0 && (
                          <Button size="sm" asChild>
                            <Link href={`/dashboard/library/issue?bookId=${book.id}`}>Issue</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Issued Books */}
        <TabsContent value="issued" className="space-y-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {issuedBooks.map((issue) => {
                  const isOverdue = new Date(issue.dueDate) < new Date();
                  return (
                    <div key={issue.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{issue.bookTitle}</h3>
                            {isOverdue && (
                              <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                                Overdue
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <div>
                              <p className="text-gray-500">Student</p>
                              <p className="font-medium">{issue.studentName}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Roll No</p>
                              <p className="font-medium">{issue.rollNo}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Issue Date</p>
                              <p className="font-medium">{new Date(issue.issueDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Due Date</p>
                              <p className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                                {new Date(issue.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Return Book</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overdue Books */}
        <TabsContent value="overdue" className="space-y-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {issuedBooks.filter(b => b.status === 'overdue').map((issue) => (
                  <div key={issue.id} className="border border-red-200 rounded-lg p-4 bg-red-50 dark:bg-red-900/10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-900 dark:text-red-200">{issue.bookTitle}</h3>
                        <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-gray-500">Student</p>
                            <p className="font-medium">{issue.studentName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Roll No</p>
                            <p className="font-medium">{issue.rollNo}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Due Date</p>
                            <p className="font-medium text-red-600">{new Date(issue.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Days Overdue</p>
                            <p className="font-medium text-red-600">
                              {Math.ceil((new Date().getTime() - new Date(issue.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Send Reminder</Button>
                        <Button size="sm">Return Book</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
