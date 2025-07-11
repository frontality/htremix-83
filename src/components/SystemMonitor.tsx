
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cpu, HardDrive, MemoryStick, Network, Activity } from "lucide-react";

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

const SystemMonitor = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0
  });

  const [isActive, setIsActive] = useState(true);

  // Simulate realistic system metrics that change over time
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(prev => ({
        cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(85, prev.memory + (Math.random() - 0.5) * 5)),
        disk: Math.max(30, Math.min(90, prev.disk + (Math.random() - 0.5) * 2)),
        network: Math.max(0, Math.min(1000, prev.network + (Math.random() - 0.5) * 100))
      }));
    };

    // Initialize with realistic starting values
    setMetrics({
      cpu: 25 + Math.random() * 30,
      memory: 45 + Math.random() * 25,
      disk: 50 + Math.random() * 20,
      network: 100 + Math.random() * 200
    });

    const interval = setInterval(updateMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: { warning: number; danger: number }) => {
    if (value >= thresholds.danger) return "bg-red-500";
    if (value >= thresholds.warning) return "bg-yellow-500";
    return "bg-green-500";
  };

  const formatNetworkSpeed = (mbps: number) => {
    if (mbps >= 1000) {
      return `${(mbps / 1000).toFixed(1)} GB/s`;
    }
    return `${Math.round(mbps)} MB/s`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Monitor
          </CardTitle>
          <CardDescription>
            Real-time system resource monitoring and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CPU Usage */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">CPU Usage</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usage</span>
                  <span className="font-mono">{Math.round(metrics.cpu)}%</span>
                </div>
                <Progress 
                  value={metrics.cpu} 
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  Status: {metrics.cpu < 70 ? 'Normal' : metrics.cpu < 85 ? 'High' : 'Critical'}
                </div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MemoryStick className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Memory</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>RAM</span>
                  <span className="font-mono">{Math.round(metrics.memory)}%</span>
                </div>
                <Progress 
                  value={metrics.memory} 
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  {(metrics.memory * 16 / 100).toFixed(1)} GB / 16 GB
                </div>
              </div>
            </div>

            {/* Disk Usage */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Disk Usage</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Storage</span>
                  <span className="font-mono">{Math.round(metrics.disk)}%</span>
                </div>
                <Progress 
                  value={metrics.disk} 
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  {(metrics.disk * 500 / 100).toFixed(0)} GB / 500 GB
                </div>
              </div>
            </div>

            {/* Network I/O */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Network I/O</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Speed</span>
                  <span className="font-mono">{formatNetworkSpeed(metrics.network)}</span>
                </div>
                <Progress 
                  value={Math.min(100, metrics.network / 10)} 
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  {metrics.network < 100 ? 'Low' : metrics.network < 500 ? 'Normal' : 'High'} Activity
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Monitoring Status: {isActive ? 'Active' : 'Inactive'}</span>
              <span>Last Updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitor;
