'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Users, Filter } from 'lucide-react';

export default function CommunicationPage() {
    const [messages] = useState([
        { id: 1, subject: 'School Holiday Notice', from: 'Admin', to: 'All Students', date: '2025-11-18', status: 'sent' },
        { id: 2, subject: 'Parent-Teacher Meeting', from: 'Principal', to: 'All Parents', date: '2025-11-17', status: 'sent' },
        { id: 3, subject: 'Exam Schedule Released', from: 'Academic Office', to: 'Grade 10', date: '2025-11-16', status: 'draft' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Communication</h1>
                    <p className="text-muted-foreground">Manage school communications and announcements</p>
                </div>
                <Button>
                    <Send className="mr-2 h-4 w-4" />
                    New Message
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">248</div>
                        <p className="text-xs text-muted-foreground">+12 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
                        <Send className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">To 450 recipients</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recipients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,245</div>
                        <p className="text-xs text-muted-foreground">Active contacts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Draft Messages</CardTitle>
                        <Filter className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Pending review</p>
                    </CardContent>
                </Card>
            </div>

            {/* Messages List */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Messages</CardTitle>
                    <CardDescription>Latest communications sent to students, parents, and staff</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium">{message.subject}</h4>
                                    <p className="text-sm text-muted-foreground">From: {message.from} • To: {message.to}</p>
                                    <p className="text-xs text-muted-foreground">{message.date}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={message.status === 'sent' ? 'default' : 'secondary'}>
                                        {message.status}
                                    </Badge>
                                    <Button variant="outline" size="sm">View</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Send Announcement</CardTitle>
                        <CardDescription>Broadcast message to selected groups</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input placeholder="Subject" />
                        <Textarea placeholder="Type your message here..." />
                        <Button className="w-full">
                            <Send className="mr-2 h-4 w-4" />
                            Send Announcement
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Message Templates</CardTitle>
                        <CardDescription>Use pre-defined templates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">Holiday Notice</Button>
                            <Button variant="outline" className="w-full justify-start">Meeting Reminder</Button>
                            <Button variant="outline" className="w-full justify-start">Fee Payment</Button>
                            <Button variant="outline" className="w-full justify-start">Exam Schedule</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}