
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Search, Network, Activity, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SystemAnalyzer = () => {
  const { toast } = useToast();
  const [target, setTarget] = useState("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);

  const validateTarget = (input: string): boolean => {
    const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const domainPattern = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
    return ipPattern.test(input) || domainPattern.test(input);
  };

  const performAnalysis = async (type: string) => {
    if (!target.trim()) {
      toast({
        title: "Target Required",
        description: "Please specify a target for analysis",
        variant: "destructive",
      });
      return;
    }

    if (!validateTarget(target)) {
      toast({
        title: "Invalid Target",
        description: "Please enter a valid IP address or domain",
        variant: "destructive",
      });
      return;
    }

    setScanning(true);
    setProgress(0);
    setResults([]);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          generateResults(type);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const generateResults = (type: string) => {
    const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995];
    const services = ['SSH', 'HTTP', 'HTTPS', 'FTP', 'SMTP', 'DNS', 'TELNET'];
    const statuses = ['open', 'filtered', 'closed'];
    
    let mockResults = [];

    switch (type) {
      case 'port':
        mockResults = commonPorts.slice(0, 5 + Math.floor(Math.random() * 3)).map(port => ({
          port,
          service: services[Math.floor(Math.random() * services.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          banner: `Service ${port}/tcp`
        }));
        break;
      case 'service':
        mockResults = [
          { service: 'Web Server', version: 'Apache 2.4.41', status: 'active' },
          { service: 'Database', version: 'MySQL 8.0', status: 'active' },
          { service: 'Mail Server', version: 'Postfix 3.4', status: 'inactive' }
        ];
        break;
      case 'network':
        mockResults = [
          { metric: 'Latency', value: '12ms', status: 'good' },
          { metric: 'Bandwidth', value: '100 Mbps', status: 'excellent' },
          { metric: 'Packet Loss', value: '0.1%', status: 'good' }
        ];
        break;
    }

    setResults(mockResults);
    toast({
      title: "Analysis Complete",
      description: `Found ${mockResults.length} items`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
      case 'active':
      case 'good':
        return 'bg-green-500';
      case 'filtered':
      case 'inactive':
        return 'bg-yellow-500';
      case 'closed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-blue-500" />
        <h2 className="text-2xl font-bold">System Analyzer</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Target Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter IP address or domain"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="flex-1"
            />
          </div>
          {scanning && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600">Analysis in progress: {Math.round(progress)}%</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="port" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="port">Port Analysis</TabsTrigger>
          <TabsTrigger value="service">Service Detection</TabsTrigger>
          <TabsTrigger value="network">Network Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="port" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Network className="h-5 w-5" />
                <span>Port Scanner</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => performAnalysis('port')} 
                disabled={scanning}
                className="w-full"
              >
                {scanning ? 'Scanning...' : 'Start Port Scan'}
              </Button>
              {results.length > 0 && (
                <div className="mt-4 space-y-2">
                  {results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span>Port {result.port}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{result.service}</span>
                        <Badge className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="service" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Service Detection</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => performAnalysis('service')} 
                disabled={scanning}
                className="w-full"
              >
                {scanning ? 'Detecting...' : 'Detect Services'}
              </Button>
              {results.length > 0 && (
                <div className="mt-4 space-y-2">
                  {results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{result.service}</span>
                        <p className="text-sm text-gray-600">{result.version}</p>
                      </div>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Network Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => performAnalysis('network')} 
                disabled={scanning}
                className="w-full"
              >
                {scanning ? 'Analyzing...' : 'Analyze Network'}
              </Button>
              {results.length > 0 && (
                <div className="mt-4 space-y-2">
                  {results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span>{result.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{result.value}</span>
                        <Badge className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemAnalyzer;
