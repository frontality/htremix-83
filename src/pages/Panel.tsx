
import { useState } from "react";
import { Terminal, Play, Square, Trash2, Download, Settings, Shield, Database, Wifi, WifiOff, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

const Panel = () => {
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  
  // Booting Tool State
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [command, setCommand] = useState("");
  const [target, setTarget] = useState("");
  const [port, setPort] = useState("22");
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "failed">("disconnected");
  const [progress, setProgress] = useState(0);

  const handleStart = async () => {
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
    setOutput("=== BOOTING TOOL STARTED ===\n");
    setOutput(prev => prev + `Target: ${target}:${port}\n`);
    setOutput(prev => prev + `Timestamp: ${new Date().toISOString()}\n\n`);
    
    const steps = [
      { text: "Initializing connection protocols...", delay: 800 },
      { text: `Attempting connection to ${target}:${port}...`, delay: 1200 },
      { text: "Performing security handshake...", delay: 1000 },
      { text: "Checking target system architecture...", delay: 900 },
      { text: "Analyzing boot sequence configuration...", delay: 1100 },
      { text: "Preparing boot environment variables...", delay: 800 },
      { text: "Executing primary boot commands...", delay: 1300 },
      { text: "Verifying system integrity...", delay: 700 },
      { text: "Finalizing boot process...", delay: 600 },
      { text: "✓ Boot process completed successfully!", delay: 500 }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].delay));
      setOutput(prev => prev + `[${new Date().toLocaleTimeString()}] ${steps[i].text}\n`);
      setProgress(((i + 1) / steps.length) * 100);
      
      if (i === 1) {
        setConnectionStatus("connected");
      }
    }

    setIsRunning(false);
    setConnectionStatus("connected");
    setOutput(prev => prev + "\n=== PROCESS COMPLETED ===\n");
    
    toast({
      title: "Success! 🎉",
      description: "Booting tool completed successfully",
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    setConnectionStatus("disconnected");
    setProgress(0);
    setOutput(prev => prev + `\n[${new Date().toLocaleTimeString()}] PROCESS STOPPED BY USER\n`);
    toast({
      title: "Stopped",
      description: "Booting tool has been stopped",
    });
  };

  const handleClear = () => {
    setOutput("");
    setProgress(0);
    setConnectionStatus("disconnected");
  };

  const handleDownload = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booting-tool-output-${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Output saved to file",
    });
  };

  const handleExecuteCommand = () => {
    if (!command.trim()) return;
    
    const timestamp = new Date().toLocaleTimeString();
    setOutput(prev => prev + `\n[${timestamp}] $ ${command}\n`);
    
    // Simulate different command responses
    const responses = {
      'help': 'Available commands: status, ping, scan, reboot, shutdown, info',
      'status': 'System Status: ONLINE | CPU: 45% | Memory: 67% | Uptime: 2d 4h 32m',
      'ping': 'PING successful - Response time: 12ms',
      'scan': 'Port scan completed - 3 open ports found: 22, 80, 443',
      'info': `Target: ${target} | OS: Linux Ubuntu 20.04 | Kernel: 5.4.0-42`,
      'reboot': 'System reboot initiated... Please wait.',
      'shutdown': 'System shutdown sequence started...'
    };
    
    const response = responses[command.toLowerCase() as keyof typeof responses] || `Command '${command}' executed successfully`;
    setOutput(prev => prev + `[${timestamp}] ${response}\n`);
    setCommand("");
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
              Control Panel
            </h1>
          </div>
          <p className={`${currentTheme.muted} text-lg`}>
            Advanced tools and utilities for system management
          </p>
        </div>

        <Tabs defaultValue="booting" className="space-y-6">
          <TabsList className={`${currentTheme.secondary} ${currentTheme.text} rounded-lg`}>
            <TabsTrigger value="booting" className="rounded-md flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Booting Tool
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-md flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Suite
            </TabsTrigger>
            <TabsTrigger value="database" className="rounded-md flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Manager
            </TabsTrigger>
          </TabsList>

          <TabsContent value="booting" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Configuration Panel */}
              <div className="lg:col-span-1">
                <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
                  <CardHeader>
                    <CardTitle className={`${currentTheme.text} flex items-center justify-between`}>
                      Configuration
                      <div className="flex items-center space-x-2">
                        {getStatusIcon()}
                        <Badge variant={connectionStatus === "connected" ? "default" : "secondary"}>
                          {getStatusText()}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription className={currentTheme.muted}>
                      Set up your target system
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="target" className={currentTheme.text}>Target IP/Hostname</Label>
                      <Input
                        id="target"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="192.168.1.100"
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
                        placeholder="22"
                        className={`${currentTheme.secondary} ${currentTheme.text}`}
                        disabled={isRunning}
                      />
                    </div>

                    {progress > 0 && (
                      <div className="space-y-2">
                        <Label className={currentTheme.text}>Progress</Label>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        onClick={handleStart}
                        disabled={isRunning}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {isRunning ? "Running..." : "Start"}
                      </Button>
                      
                      <Button
                        onClick={handleStop}
                        disabled={!isRunning}
                        variant="destructive"
                        className="flex-1"
                      >
                        <Square className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Command Panel */}
                <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl mt-6`}>
                  <CardHeader>
                    <CardTitle className={currentTheme.text}>Quick Commands</CardTitle>
                    <CardDescription className={currentTheme.muted}>
                      Available: help, status, ping, scan, info, reboot, shutdown
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
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
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
                      placeholder="Output will appear here..."
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
              <CardHeader>
                <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                  <Shield className="h-5 w-5" />
                  Security Suite
                </CardTitle>
                <CardDescription className={currentTheme.muted}>
                  Advanced security tools and vulnerability scanners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Shield className={`h-16 w-16 ${currentTheme.muted} mx-auto mb-4`} />
                  <p className={`${currentTheme.text} text-lg mb-2`}>Security Tools</p>
                  <p className={`${currentTheme.muted}`}>Coming Soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
              <CardHeader>
                <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                  <Database className="h-5 w-5" />
                  Database Manager
                </CardTitle>
                <CardDescription className={currentTheme.muted}>
                  Database administration and management tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Database className={`h-16 w-16 ${currentTheme.muted} mx-auto mb-4`} />
                  <p className={`${currentTheme.text} text-lg mb-2`}>Database Tools</p>
                  <p className={`${currentTheme.muted}`}>Coming Soon</p>
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
