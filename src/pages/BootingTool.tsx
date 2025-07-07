
import { useState } from "react";
import { Terminal, Play, Square, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

const BootingTool = () => {
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [command, setCommand] = useState("");
  const [target, setTarget] = useState("");
  const [port, setPort] = useState("22");

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
    setOutput("Starting booting tool...\n");
    
    // Simulate tool execution
    const steps = [
      "Initializing connection...",
      `Connecting to ${target}:${port}...`,
      "Checking target system...",
      "Analyzing boot sequence...",
      "Preparing boot environment...",
      "Executing boot commands...",
      "Boot process completed successfully!"
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOutput(prev => prev + steps[i] + "\n");
    }

    setIsRunning(false);
    toast({
      title: "Success! 🎉",
      description: "Booting tool completed successfully",
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    setOutput(prev => prev + "Process stopped by user\n");
    toast({
      title: "Stopped",
      description: "Booting tool has been stopped",
    });
  };

  const handleClear = () => {
    setOutput("");
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'booting-tool-output.txt';
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
    
    setOutput(prev => prev + `$ ${command}\n`);
    setOutput(prev => prev + "Command executed successfully\n");
    setCommand("");
  };

  return (
    <div className={`min-h-screen pt-12 ${currentTheme.bg}`}>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Terminal className={`h-8 w-8 ${currentTheme.accent}`} />
            <h1 className={`text-3xl font-bold ${currentTheme.text} bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>
              Booting Tool Panel
            </h1>
          </div>
          <p className={`${currentTheme.muted} text-lg`}>
            Advanced system booting and management tool
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
              <CardHeader>
                <CardTitle className={currentTheme.text}>Configuration</CardTitle>
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
                  />
                </div>

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
      </div>
    </div>
  );
};

export default BootingTool;
