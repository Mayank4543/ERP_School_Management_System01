'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users,
  RefreshCw,
  Eye,
  Lock
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'login_attempt' | 'suspicious_activity' | 'data_breach' | 'permission_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  user?: string;
  ip?: string;
  details?: string;
}

export default function SecurityPage() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSecurityEvents();
  }, []);

  const fetchSecurityEvents = async () => {
    try {
      setIsLoading(true);
      // Mock data
      const mockEvents: SecurityEvent[] = [
        {
          id: '1',
          timestamp: '2024-12-20T10:30:00Z',
          type: 'login_attempt',
          severity: 'medium',
          message: 'Multiple failed login attempts',
          user: 'unknown@domain.com',
          ip: '192.168.1.200',
          details: '5 failed attempts in 10 minutes'
        },
        {
          id: '2',
          timestamp: '2024-12-20T09:15:00Z',
          type: 'suspicious_activity',
          severity: 'high',
          message: 'Unusual data access pattern detected',
          user: 'user@school.com',
          ip: '192.168.1.150',
          details: 'Accessed 50+ student records in 5 minutes'
        },
        {
          id: '3',
          timestamp: '2024-12-20T08:45:00Z',
          type: 'permission_change',
          severity: 'low',
          message: 'User permissions modified',
          user: 'admin@school.com',
          ip: '192.168.1.100',
          details: 'Added teacher permissions to user'
        }
      ];
      
      setSecurityEvents(mockEvents);
      toast.success('Security events loaded');
    } catch (error) {
      console.error('Failed to fetch security events:', error);
      toast.error('Failed to load security events');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return CheckCircle;
      case 'medium': return AlertTriangle;
      case 'high': return XCircle;
      case 'critical': return XCircle;
      default: return Activity;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Security Audit</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor security events and threats</p>
        </div>
        <Button onClick={fetchSecurityEvents}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Security Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold">{securityEvents.length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">
                  {securityEvents.filter(event => event.severity === 'critical').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-orange-600">
                  {securityEvents.filter(event => event.severity === 'high').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recent Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityEvents.map((event) => {
              const SeverityIcon = getSeverityIcon(event.severity);
              
              return (
                <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <SeverityIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500 capitalize">{event.type.replace('_', ' ')}</span>
                        </div>
                        
                        <p className="font-medium text-gray-900 mb-1">{event.message}</p>
                        
                        {event.details && (
                          <p className="text-sm text-gray-600 mb-2">{event.details}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                          {event.user && <span>User: {event.user}</span>}
                          {event.ip && <span>IP: {event.ip}</span>}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Lock className="h-3 w-3 mr-1" />
                          Block
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {securityEvents.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No security events</h3>
              <p className="text-gray-600">Your system is secure. No threats detected.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}