'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Award, CreditCard, CheckCircle } from 'lucide-react';

export default function CertificatesPage() {
  const [certificateType, setCertificateType] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const certificates = [
    {
      id: '1',
      type: 'Transfer Certificate',
      icon: FileText,
      description: 'Issue TC for students leaving school',
      color: 'blue',
    },
    {
      id: '2',
      type: 'Bonafide Certificate',
      icon: Award,
      description: 'Certificate of enrollment proof',
      color: 'green',
    },
    {
      id: '3',
      type: 'Character Certificate',
      icon: CheckCircle,
      description: 'Student character certificate',
      color: 'purple',
    },
    {
      id: '4',
      type: 'ID Card',
      icon: CreditCard,
      description: 'Student ID card generation',
      color: 'orange',
    },
  ];

  const recentRequests = [
    {
      id: '1',
      studentName: 'Rahul Kumar',
      rollNo: '1001',
      class: '10-A',
      certificateType: 'Bonafide Certificate',
      requestDate: '2025-11-15',
      status: 'pending',
    },
    {
      id: '2',
      studentName: 'Priya Sharma',
      rollNo: '1002',
      class: '9-B',
      certificateType: 'Transfer Certificate',
      requestDate: '2025-11-14',
      status: 'approved',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certificates & Documents</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Generate and manage student certificates</p>
        </div>
        <Button>View All Requests</Button>
      </div>

      {/* Certificate Types */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {certificates.map((cert) => {
          const Icon = cert.icon;
          return (
            <Card key={cert.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-lg bg-${cert.color}-100 dark:bg-${cert.color}-900/20 flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 text-${cert.color}-600`} />
                </div>
                <h3 className="font-semibold mb-2">{cert.type}</h3>
                <p className="text-sm text-gray-500">{cert.description}</p>
                <Button className="w-full mt-4" variant="outline">Generate</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Certificate Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Certificate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select value={certificateType} onValueChange={setCertificateType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Certificate Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tc">Transfer Certificate</SelectItem>
                  <SelectItem value="bonafide">Bonafide Certificate</SelectItem>
                  <SelectItem value="character">Character Certificate</SelectItem>
                  <SelectItem value="idcard">ID Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {['6', '7', '8', '9', '10', '11', '12'].map((cls) => (
                    <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button>Generate Certificate</Button>
            <Button variant="outline">Preview</Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Bulk Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Certificate Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{request.studentName}</h4>
                  <p className="text-sm text-gray-500">
                    {request.rollNo} • {request.class} • {request.certificateType}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Requested on {request.requestDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    request.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {request.status}
                  </span>
                  <Button size="sm">Process</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
