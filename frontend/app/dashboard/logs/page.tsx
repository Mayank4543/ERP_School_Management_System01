'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Database, 
  Server,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  category: string;
  message: string;
  user?: string;
  ip?: string;
  details?: string;
}

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'info' | 'warning' | 'error' | 'critical'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'auth' | 'database' | 'api' | 'system'>('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, selectedLevel, selectedCategory]);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      // Mock data - replace with actual API call
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: '2024-12-20T10:30:00Z',
          level: 'info',
          category: 'auth',
          message: 'User login successful',
          user: 'admin@school.com',
          ip: '192.168.1.100',
          details: 'SuperAdmin user logged in successfully'
        },
        {
          id: '2',
          timestamp: '2024-12-20T10:25:00Z',
          level: 'warning',
          category: 'database',
          message: 'Database connection pool reaching limit',
          details: 'Connection pool utilization at 85%'
        },
        {
          id: '3',
          timestamp: '2024-12-20T10:20:00Z',
          level: 'error',
          category: 'api',
          message: 'API rate limit exceeded',
          user: 'user@school.com',
          ip: '192.168.1.101',
          details: 'User exceeded API rate limit of 100 requests per minute'
        },
        {
          id: '4',
          timestamp: '2024-12-20T10:15:00Z',
          level: 'critical',
          category: 'system',
          message: 'High memory usage detected',
          details: 'Memory usage reached 95% capacity'
        },
        {
          id: '5',
          timestamp: '2024-12-20T10:10:00Z',
          level: 'info',
          category: 'auth',
          message: 'Password reset requested',
          user: 'teacher@school.com',
          ip: '192.168.1.105'
        },
        {
          id: '6',
          timestamp: '2024-12-20T10:05:00Z',
          level: 'warning',
          category: 'system',
          message: 'Scheduled backup completed with warnings',
          details: 'Backup completed but some files were skipped due to permissions'
        },
        {
          id: '7',
          timestamp: '2024-12-20T10:00:00Z',
          level: 'info',
          category: 'database',
          message: 'Database optimization completed',
          details: 'Table optimization reduced storage by 15%'
        },
        {
          id: '8',
          timestamp: '2024-12-20T09:55:00Z',
          level: 'error',
          category: 'auth',
          message: 'Failed login attempt',
          user: 'unknown@domain.com',
          ip: '192.168.1.200',
          details: 'Multiple failed login attempts detected'
        }
      ];
      
      setLogs(mockLogs);
      toast.info('System logs loaded');
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      toast.error('Failed to load system logs');
    } finally {
      setIsLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }

    setFilteredLogs(filtered);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      case 'critical': return XCircle;
      default: return Activity;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth': return Users;
      case 'database': return Database;
      case 'api': return Server;
      case 'system': return Activity;
      default: return Activity;
    }
  };

  const refreshLogs = () => {
    fetchLogs();
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
          <h1 className="text-2xl font-semibold text-gray-900">System Logs</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor system activity and troubleshoot issues</p>
        </div>
        <Button onClick={refreshLogs}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Logs
        </Button>
      </div>

      {/* Log Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold">{logs.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-red-600">
                  {logs.filter(log => log.level === 'error' || log.level === 'critical').length}
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
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {logs.filter(log => log.level === 'warning').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Info</p>
                <p className="text-2xl font-bold text-green-600">
                  {logs.filter(log => log.level === 'info').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border rounded-md text-sm"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as any)}
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="critical">Critical</option>
              </select>
              
              <select 
                className="px-3 py-2 border rounded-md text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
              >
                <option value="all">All Categories</option>
                <option value="auth">Authentication</option>
                <option value="database">Database</option>
                <option value="api">API</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Logs ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const LevelIcon = getLevelIcon(log.level);
              const CategoryIcon = getCategoryIcon(log.category);
              
              return (
                <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <LevelIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <CategoryIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getLevelColor(log.level)}>
                            {log.level.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500 capitalize">{log.category}</span>
                        </div>
                        
                        <p className="font-medium text-gray-900 mb-1">{log.message}</p>
                        
                        {log.details && (
                          <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                          {log.user && <span>User: {log.user}</span>}
                          {log.ip && <span>IP: {log.ip}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or refresh the logs.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}