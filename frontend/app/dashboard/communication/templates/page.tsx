'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, Bell, Send } from 'lucide-react';

export default function NotificationTemplatesPage() {
  const [templates, setTemplates] = useState([
    {
      id: '1',
      name: 'Fee Reminder',
      type: 'SMS',
      subject: '',
      content: 'Dear Parent, Fee payment for {student_name} is due on {due_date}. Please pay at earliest. - {school_name}',
      variables: ['student_name', 'due_date', 'school_name'],
    },
    {
      id: '2',
      name: 'Exam Notification',
      type: 'Email',
      subject: 'Exam Schedule - {exam_name}',
      content: 'Dear Parent,\n\nExam schedule for {exam_name} has been released. Please check the student portal.\n\nRegards,\n{school_name}',
      variables: ['exam_name', 'school_name'],
    },
    {
      id: '3',
      name: 'Attendance Alert',
      type: 'Push',
      subject: '',
      content: '{student_name} was marked absent today ({date}). Please contact school if this is incorrect.',
      variables: ['student_name', 'date'],
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Communication Templates</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage SMS, Email & Push notification templates</p>
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Templates</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500 mt-1">Active templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Templates</CardTitle>
            <Mail className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500 mt-1">Active templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Push Templates</CardTitle>
            <Bell className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-gray-500 mt-1">Active templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Templates Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="push">Push Notification</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{template.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        template.type === 'SMS' ? 'bg-blue-100 text-blue-700' :
                        template.type === 'Email' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {template.type}
                      </span>
                    </div>

                    {template.subject && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-500">Subject</p>
                        <p className="font-medium">{template.subject}</p>
                      </div>
                    )}

                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Content</p>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{template.content}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Variables</p>
                      <div className="flex flex-wrap gap-2">
                        {template.variables.map((variable) => (
                          <span
                            key={variable}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded"
                          >
                            {`{${variable}}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm">Edit</Button>
                    <Button size="sm" variant="outline">Test Send</Button>
                    <Button size="sm" variant="outline">Duplicate</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sms" className="space-y-4 mt-4">
          {templates.filter(t => t.type === 'SMS').map((template) => (
            <Card key={template.id}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{template.content}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="email" className="space-y-4 mt-4">
          {templates.filter(t => t.type === 'Email').map((template) => (
            <Card key={template.id}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject: {template.subject}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {template.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="push" className="space-y-4 mt-4">
          {templates.filter(t => t.type === 'Push').map((template) => (
            <Card key={template.id}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{template.content}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Create Template Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name</Label>
              <Input id="templateName" placeholder="e.g., Fee Reminder" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateType">Type</Label>
              <select
                id="templateType"
                className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
              >
                <option value="SMS">SMS</option>
                <option value="Email">Email</option>
                <option value="Push">Push Notification</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject (for Email only)</Label>
            <Input id="subject" placeholder="Email subject line" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Type your message here. Use {variable_name} for dynamic content."
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Available Variables</Label>
            <div className="flex flex-wrap gap-2">
              {['student_name', 'class', 'date', 'school_name', 'parent_name', 'amount'].map((v) => (
                <span
                  key={v}
                  className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 rounded cursor-pointer"
                >
                  {`{${v}}`}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button>Save Template</Button>
            <Button variant="outline">Save & Test</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
