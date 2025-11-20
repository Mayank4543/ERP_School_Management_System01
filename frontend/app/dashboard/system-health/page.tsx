'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, Database, Server, Cpu, HardDrive, Wifi, RefreshCw } from 'lucide-react';

export default function SystemHealthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [healthData, setHealthData] = useState({
    cpu: { usage: 45, status: 'good' },
    memory: { usage: 68, total: 16, used: 10.9, status: 'warning' },
    disk: { usage: 34, total: 500, used: 170, status: 'good' },
    network: { status: 'excellent', latency: 12 },
    database: { status: 'good', connections: 25, maxConnections: 100 },
    uptime: '15d 8h 42m'
  });

  const refreshHealth = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setHealthData(prev => ({
        ...prev,
        cpu: { ...prev.cpu, usage: Math.floor(Math.random() * 30) + 30 },
        memory: { ...prev.memory, usage: Math.floor(Math.random() * 20) + 60 }
      }));
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">System Health</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor system performance and health metrics</p>
        </div>
        <Button onClick={refreshHealth} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CPU Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthData.cpu.usage}%</div>
            <Progress value={healthData.cpu.usage} className="mt-2" />
            <Badge className={`mt-2 ${getStatusColor(healthData.cpu.status)}`}>
              {healthData.cpu.status.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthData.memory.usage}%</div>
            <p className="text-xs text-muted-foreground">
              {healthData.memory.used}GB / {healthData.memory.total}GB
            </p>
            <Progress value={healthData.memory.usage} className="mt-2" />
            <Badge className={`mt-2 ${getStatusColor(healthData.memory.status)}`}>
              {healthData.memory.status.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        {/* Disk Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthData.disk.usage}%</div>
            <p className="text-xs text-muted-foreground">
              {healthData.disk.used}GB / {healthData.disk.total}GB
            </p>
            <Progress value={healthData.disk.usage} className="mt-2" />
            <Badge className={`mt-2 ${getStatusColor(healthData.disk.status)}`}>
              {healthData.disk.status.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        {/* Network Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthData.network.latency}ms</div>
            <p className="text-xs text-muted-foreground">Average latency</p>
            <Badge className={`mt-2 ${getStatusColor(healthData.network.status)}`}>
              {healthData.network.status.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        {/* Database Connections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthData.database.connections}</div>
            <p className="text-xs text-muted-foreground">
              Active connections / {healthData.database.maxConnections} max
            </p>
            <Progress value={(healthData.database.connections / healthData.database.maxConnections) * 100} className="mt-2" />
            <Badge className={`mt-2 ${getStatusColor(healthData.database.status)}`}>
              {healthData.database.status.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        {/* System Uptime */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthData.uptime}</div>
            <p className="text-xs text-muted-foreground">Server running time</p>
            <Badge className="mt-2 text-green-600 bg-green-100">
              STABLE
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Health Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-medium text-green-900">Overall System Status</h4>
                <p className="text-sm text-green-700">All systems operational</p>
              </div>
              <Badge className="bg-green-600 text-white">HEALTHY</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium">Performance Metrics</h5>
                <ul className="text-sm space-y-1">
                  <li>• Response Time: 145ms (Excellent)</li>
                  <li>• Error Rate: 0.02% (Very Low)</li>
                  <li>• API Requests: 12,456/hour</li>
                  <li>• Active Sessions: 89</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium">System Resources</h5>
                <ul className="text-sm space-y-1">
                  <li>• Load Average: 0.45, 0.52, 0.48</li>
                  <li>• Network I/O: 45MB/s in, 23MB/s out</li>
                  <li>• Disk I/O: 12 IOPS read, 8 IOPS write</li>
                  <li>• Cache Hit Rate: 94.2%</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}