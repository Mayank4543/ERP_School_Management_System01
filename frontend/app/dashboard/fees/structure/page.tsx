'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, TrendingDown, Download, FileText, Search } from 'lucide-react';

export default function FeeStructurePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const feeStructures = [
    {
      id: '1',
      class: 'Class 10',
      tuitionFee: 15000,
      admissionFee: 5000,
      labFee: 3000,
      libraryFee: 1000,
      examFee: 2000,
      transportFee: 4000,
      total: 30000,
      frequency: 'Annual',
    },
    {
      id: '2',
      class: 'Class 9',
      tuitionFee: 14000,
      admissionFee: 5000,
      labFee: 2500,
      libraryFee: 1000,
      examFee: 1500,
      transportFee: 4000,
      total: 28000,
      frequency: 'Annual',
    },
    {
      id: '3',
      class: 'Class 8',
      tuitionFee: 13000,
      admissionFee: 5000,
      labFee: 2000,
      libraryFee: 1000,
      examFee: 1500,
      transportFee: 4000,
      total: 26500,
      frequency: 'Annual',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fee Structure</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage class-wise fee structures</p>
        </div>
        <Button>Update Structure</Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fee Structures */}
      <div className="space-y-4">
        {feeStructures.map((structure) => (
          <Card key={structure.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{structure.class}</CardTitle>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Annual Fee</p>
                  <p className="text-2xl font-bold text-green-600">₹{structure.total.toLocaleString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tuition Fee</p>
                  <p className="text-lg font-semibold">₹{structure.tuitionFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Admission Fee</p>
                  <p className="text-lg font-semibold">₹{structure.admissionFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lab Fee</p>
                  <p className="text-lg font-semibold">₹{structure.labFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Library Fee</p>
                  <p className="text-lg font-semibold">₹{structure.libraryFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Exam Fee</p>
                  <p className="text-lg font-semibold">₹{structure.examFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transport Fee</p>
                  <p className="text-lg font-semibold">₹{structure.transportFee.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">Edit Structure</Button>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
