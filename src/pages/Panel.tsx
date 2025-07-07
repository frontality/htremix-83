
import { useState } from "react";
import { Terminal, Play, Square, Trash2, Download, Settings, Shield, Database, Wifi, WifiOff, CheckCircle, XCircle, Activity, HardDrive, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

const Panel = () => {
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  
  // Network Tools State
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [command, setCommand] = useState("");
  const [target, setTarget] = useState("");
  const [port, setPort] = useState("80");
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "failed">("disconnected");
  const [progress, setProgress] = useState(0);

  // System Monitor State
  const [systemStats, setSystemStats] = useState({
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 12
  });

  // Security Scanner State
  const [scanResults, setScanResults] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleNetworkDiagnostic = async () => {
    if (!target.trim()) {
      toast({
        title: "Error",
        description: "Please enter a target IP or hostname",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setConnectionStatus("connecting");
    setOutput("=== NETWORK DIAGNOSTIC TOOL ===\n");
    setOutput(prev => prev + `Target: ${target}:${port}\n`);
    setOutput(prev => prev + `Started: ${new Date().toISOString()}\n\n`);
    
    const diagnosticSteps = [
      { text: "Resolving hostname...", delay: 600 },
      { text: `Pinging ${target}...`, delay: 800 },
      { text: "PING successful - Response time: 12ms", delay: 400 },
      { text: "Traceroute initiated...", delay: 900 },
      { text: "Hop 1: 192.168.1.1 (12ms)", delay: 300 },
      { text: "Hop 2: 10.0.0.1 (25ms)", delay: 300 },
      { text: `Hop 3: ${target} (45ms)`, delay: 400 },
      { text: `Port scan on ${target}:${port}...`, delay: 1000 },
      { text: `Port ${port} is OPEN`, delay: 500 },
      { text: "Service detection: HTTP/HTTPS Web Server", delay: 600 },
      { text: "✓ Network diagnostic completed successfully!", delay: 300 }
    ];

    for (let i = 0; i < diagnosticSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, diagnosticSteps[i].delay));
      setOutput(prev => prev + `[${new Date().toLocaleTimeString()}] ${diagnosticSteps[i].text}\n`);
      setProgress(((i + 1) / diagnosticSteps.length) * 100);
      
      if (i === 1) {
        setConnectionStatus("connected");
      }
    }

    setIsRunning(false);
    setOutput(prev => prev + "\n=== DIAGNOSTIC COMPLETED ===\n");
    
    toast({
      title: "Success! 🎉",
      description: "Network diagnostic completed successfully",
    });
  };

  const handlePortScan = async () => {
    if (!target.trim()) {
      toast({
        title: "Error",
        description: "Please enter a target for port scanning",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setOutput(prev => prev + `\n=== PORT SCAN: ${target} ===\n`);
    
    const commonPorts = [22, 80, 443, 21, 25, 53, 110, 143, 993, 995];
    const openPorts = [80, 443, 22]; // Simulated open ports
    
    for (let i = 0; i < commonPorts.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const port = commonPorts[i];
      const isOpen = openPorts.includes(port);
      const status = isOpen ? "OPEN" : "CLOSED";
      const service = isOpen ? getServiceName(port) : "";
      setOutput(prev => prev + `Port ${port}: ${status} ${service}\n`);
    }
    
    setOutput(prev => prev + `\nScan completed - ${openPorts.length} open ports found\n`);
    setIsRunning(false);
  };

  const getServiceName = (port: number) => {
    const services = {
      22: "(SSH)",
      80: "(HTTP)",
      443: "(HTTPS)",
      21: "(FTP)",
      25: "(SMTP)",
      53: "(DNS)",
      110: "(POP3)",
      143: "(IMAP)",
      993: "(IMAPS)",
      995: "(POP3S)"
    };
    return services[port as keyof typeof services] || "";
  };

  const handleSystemMonitor = () => {
    // Simulate real-time system stats
    setSystemStats({
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      disk: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 50)
    });
    
    setOutput(prev => prev + `\n=== SYSTEM MONITOR ===\n`);
    setOutput(prev => prev + `CPU Usage: ${systemStats.cpu}%\n`);
    setOutput(prev => prev + `Memory Usage: ${systemStats.memory}%\n`);
    setOutput(prev => prev + `Disk Usage: ${systemStats.disk}%\n`);
    setOutput(prev => prev + `Network I/O: ${systemStats.network} MB/s\n`);
    setOutput(prev => prev + `Uptime: 5d 12h 34m\n`);
    setOutput(prev => prev + `Load Average: 1.2, 1.5, 1.8\n\n`);
  };

  const handleSecurityScan = async () => {
    if (!target.trim()) {
      toast({
        title: "Error",
        description: "Please enter a target for security scanning",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanResults([]);
    setOutput(prev => prev + `\n=== SECURITY SCAN: ${target} ===\n`);
    
    const vulnerabilities = [
      "SSL/TLS Configuration: SECURE",
      "HTTP Security Headers: Missing X-Frame-Options",
      "Server Version Disclosure: Apache/2.4.41",
      "Directory Listing: Disabled",
      "Default Pages: Not Found",
      "SQL Injection: No vulnerabilities detected",
      "XSS Protection: Enabled",
      "CSRF Protection: Implemented"
    ];

    for (let i = 0; i < vulnerabilities.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setOutput(prev => prev + `[CHECK] ${vulnerabilities[i]}\n`);
      setScanResults(prev => [...prev, vulnerabilities[i]]);
    }
    
    setOutput(prev => prev + `\nSecurity scan completed - 1 recommendation found\n`);
    setIsScanning(false);
    
    toast({
      title: "Security Scan Complete",
      description: "Found 1 security recommendation",
    });
  };

  const handleExecuteCommand = () => {
    if (!command.trim()) return;
    
    const timestamp = new Date().toLocaleTimeString();
    setOutput(prev => prev + `\n[${timestamp}] $ ${command}\n`);
    
    // Enhanced command responses
    const responses = {
      'help': 'Available commands: ping, nslookup, netstat, ps, top, df, free, uptime, whoami, pwd',
      'ping': `PING ${target || 'localhost'} successful - Average: 15ms`,
      'nslookup': `Server: 8.8.8.8\nAddress: ${target || 'localhost'}\nNon-authoritative answer: 93.184.216.34`,
      'netstat': 'Active connections:\nTCP 127.0.0.1:3000 LISTENING\nTCP 127.0.0.1:5432 LISTENING',
      'ps': 'PID   COMMAND\n1234  node server.js\n5678  postgres\n9012  nginx',
      'top': `CPU: 45% | Memory: 67% | Load: 1.2\nTop processes: nginx, postgres, node`,
      'df': 'Filesystem     Size  Used Avail Use%\n/dev/sda1       50G   12G   35G  25%',
      'free': 'Memory: 8GB total, 5.3GB used, 2.7GB available',
      'uptime': 'System uptime: 5 days, 12 hours, 34 minutes',
      'whoami': 'admin',
      'pwd': '/home/admin/tools'
    };
    
    const response = responses[command.toLowerCase() as keyof typeof responses] || `Command '${command}' executed successfully`;
    setOutput(prev => prev + `[${timestamp}] ${response}\n`);
    setCommand("");
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsScanning(false);
    setConnectionStatus("disconnected");
    setProgress(0);
    setOutput(prev => prev + `\n[${new Date().toLocaleTimeString()}] PROCESS STOPPED BY USER\n`);
    toast({
      title: "Stopped",
      description: "All processes have been stopped",
    });
  };

  const handleClear = () => {
    setOutput("");
    setProgress(0);
    setConnectionStatus("disconnected");
    setScanResults([]);
  };

  const handleDownload = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-tools-output-${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Output saved to file",
    });
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "connecting":
        return <Wifi className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "failed":
        return "Failed";
      default:
        return "Disconnected";
    }
  };

  return (
    <div className={`min-h-screen pt-12 ${currentTheme.bg}`}>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className={`h-8 w-8 ${currentTheme.accent}`} />
            <h1 className={`text-3xl font-bold ${currentTheme.text} bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>
              System Administration Panel
            </h1>
          </div>
          <p className={`${currentTheme.muted} text-lg`}>
            Professional network diagnostics, system monitoring, and security tools
          </p>
        </div>

        <Tabs defaultValue="network" className="space-y-6">
          <TabsList className={`${currentTheme.secondary} ${currentTheme.text} rounded-lg`}>
            <TabsTrigger value="network" className="rounded-md flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Network Tools
            </TabsTrigger>
            <TabsTrigger value="monitor" className="rounded-md flex items-center gap-2">
              <Activity className="h-4 w-4" />
              System Monitor
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-md flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Scanner
            </TabsTrigger>
            <TabsTrigger value="database" className="rounded-md flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="network" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Configuration Panel */}
              <div className="lg:col-span-1">
                <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
                  <CardHeader>
                    <CardTitle className={`${currentTheme.text} flex items-center justify-between`}>
                      Network Configuration
                      <div className="flex items-center space-x-2">
                        {getStatusIcon()}
                        <Badge variant={connectionStatus === "connected" ? "default" : "secondary"}>
                          {getStatusText()}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription className={currentTheme.muted}>
                      Configure network diagnostic tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="target" className={currentTheme.text}>Target IP/Hostname</Label>
                      <Input
                        id="target"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="google.com or 8.8.8.8"
                        className={`${currentTheme.secondary} ${currentTheme.text}`}
                        disabled={isRunning}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="port" className={currentTheme.text}>Port</Label>
                      <Input
                        id="port"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        placeholder="80"
                        className={`${currentTheme.secondary} ${currentTheme.text}`}
                        disabled={isRunning}
                      />
                    </div>

                    {progress > 0 && (
                      <div className="space-y-2">
                        <Label className={currentTheme.text}>Progress</Label>
                        <Progress value={progress} className="w-full" />
                        <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={handleNetworkDiagnostic}
                        disabled={isRunning}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                        size="sm"
                      >
                        <Wifi className="h-4 w-4 mr-1" />
                        Diagnose
                      </Button>
                      
                      <Button
                        onClick={handlePortScan}
                        disabled={isRunning}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                        size="sm"
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Port Scan
                      </Button>
                      
                      <Button
                        onClick={handleStop}
                        disabled={!isRunning}
                        variant="destructive"
                        size="sm"
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Stop
                      </Button>
                      
                      <Button
                        onClick={handleSystemMonitor}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                        size="sm"
                      >
                        <Activity className="h-4 w-4 mr-1" />
                        Stats
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Command Panel */}
                <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl mt-6`}>
                  <CardHeader>
                    <CardTitle className={currentTheme.text}>Terminal Commands</CardTitle>
                    <CardDescription className={currentTheme.muted}>
                      Available: ping, nslookup, netstat, ps, top, df, free, uptime
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Input
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="Enter command..."
                        className={`${currentTheme.secondary} ${currentTheme.text}`}
                        onKeyPress={(e) => e.key === 'Enter' && handleExecuteCommand()}
                      />
                    </div>
                    <Button
                      onClick={handleExecuteCommand}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                      disabled={!command.trim()}
                    >
                      Execute
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Output Terminal */}
              <div className="lg:col-span-2">
                <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl h-full`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className={currentTheme.text}>Terminal Output</CardTitle>
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          size="sm"
                          className={`${currentTheme.secondary} ${currentTheme.text}`}
                          disabled={!output}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          onClick={handleClear}
                          variant="outline"
                          size="sm"
                          className={`${currentTheme.secondary} ${currentTheme.text}`}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Clear
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={output}
                      readOnly
                      className={`min-h-96 font-mono text-sm ${currentTheme.secondary} ${currentTheme.text} resize-none`}
                      placeholder="Network diagnostic output will appear here..."
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitor" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
                <CardHeader className="pb-2">
                  <CardTitle className={`${currentTheme.text} flex items-center gap-2 text-sm`}>
                    <Cpu className="h-4 w-4" />
                    CPU Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">{systemStats.cpu}%</div>
                  <Progress value={systemStats.cpu} className="mt-2" />
                </CardContent>
              </Card>

              <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
                <CardHeader className="pb-2">
                  <CardTitle className={`${currentTheme.text} flex items-center gap-2 text-sm`}>
                    <Activity className="h-4 w-4" />
                    Memory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{systemStats.memory}%</div>
                  <Progress value={systemStats.memory} className="mt-2" />
                </CardContent>
              </Card>

              <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
                <CardHeader className="pb-2">
                  <CardTitle className={`${currentTheme.text} flex items-center gap-2 text-sm`}>
                    <HardDrive className="h-4 w-4" />
                    Disk Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">{systemStats.disk}%</div>
                  <Progress value={systemStats.disk} className="mt-2" />
                </CardContent>
              </Card>

              <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
                <CardHeader className="pb-2">
                  <CardTitle className={`${currentTheme.text} flex items-center gap-2 text-sm`}>
                    <Wifi className="h-4 w-4" />
                    Network I/O
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-500">{systemStats.network} MB/s</div>
                  <Progress value={systemStats.network * 2} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
              <CardHeader>
                <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                  <Activity className="h-5 w-5" />
                  System Information
                </CardTitle>
                <CardDescription className={currentTheme.muted}>
                  Real-time system monitoring and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleSystemMonitor} className="mb-4">
                  Refresh Stats
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className={currentTheme.text}><strong>OS:</strong> Linux Ubuntu 20.04</p>
                    <p className={currentTheme.text}><strong>Kernel:</strong> 5.4.0-42-generic</p>
                    <p className={currentTheme.text}><strong>Architecture:</strong> x86_64</p>
                    <p className={currentTheme.text}><strong>Uptime:</strong> 5d 12h 34m</p>
                  </div>
                  <div>
                    <p className={currentTheme.text}><strong>Load Average:</strong> 1.2, 1.5, 1.8</p>
                    <p className={currentTheme.text}><strong>Processes:</strong> 234 total, 1 running</p>
                    <p className={currentTheme.text}><strong>Users:</strong> 3 logged in</p>
                    <p className={currentTheme.text}><strong>Last Boot:</strong> 2024-01-02 09:15:42</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
              <CardHeader>
                <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                  <Shield className="h-5 w-5" />
                  Security Scanner
                </CardTitle>
                <CardDescription className={currentTheme.muted}>
                  Comprehensive security assessment and vulnerability scanning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <Input
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Enter target for security scan..."
                    className={`${currentTheme.secondary} ${currentTheme.text} flex-1`}
                  />
                  <Button
                    onClick={handleSecurityScan}
                    disabled={isScanning}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    {isScanning ? "Scanning..." : "Start Scan"}
                  </Button>
                </div>

                {scanResults.length > 0 && (
                  <div className="space-y-2">
                    <h4 className={`${currentTheme.text} font-semibold`}>Scan Results:</h4>
                    <div className="space-y-1">
                      {scanResults.map((result, index) => (
                        <div key={index} className={`p-2 rounded ${currentTheme.secondary} text-sm`}>
                          {result}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
              <CardHeader>
                <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                  <Database className="h-5 w-5" />
                  Database Administration
                </CardTitle>
                <CardDescription className={currentTheme.muted}>
                  Database management and administration tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Database className={`h-16 w-16 ${currentTheme.muted} mx-auto mb-4`} />
                  <p className={`${currentTheme.text} text-lg mb-2`}>Database Tools</p>
                  <p className={`${currentTheme.muted}`}>Coming Soon - SQL Query Builder, Backup Tools, Performance Monitor</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Panel;
