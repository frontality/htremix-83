import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Zap, 
  History, 
  Users, 
  Target, 
  Wifi, 
  Search, 
  Hammer, 
  Hash, 
  Monitor,
  Shield,
  Play, 
  Square, 
  Download, 
  Trash2,
  Plus,
  Edit,
  Eye
} from 'lucide-react';
import VulnerabilityScanner from '../components/VulnerabilityScanner';

const Panel = () => {
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackProgress, setAttackProgress] = useState(0);
  const [attackOutput, setAttackOutput] = useState("Attack output will appear here...");
  const [attackHistory, setAttackHistory] = useState([
    { id: 1, target: "192.168.1.1", method: "HTTP-GET-FLOOD", timestamp: "2024-01-15 14:30:25", status: "Completed", duration: "120s" },
    { id: 2, target: "example.com", method: "TCP-SYN", timestamp: "2024-01-15 13:15:10", status: "Failed", duration: "45s" },
    { id: 3, target: "test.local", method: "UDP-FLOOD", timestamp: "2024-01-15 12:00:05", status: "Completed", duration: "300s" },
  ]);
  const [users, setUsers] = useState([
    { id: 1, username: "admin", email: "admin@skithaven.com", role: "Administrator", status: "Active", lastLogin: "2024-01-15 14:30" },
    { id: 2, username: "moderator1", email: "mod1@skithaven.com", role: "Moderator", status: "Active", lastLogin: "2024-01-15 13:45" },
    { id: 3, username: "user123", email: "user@example.com", role: "User", status: "Inactive", lastLogin: "2024-01-14 16:20" },
    { id: 4, username: "testuser", email: "test@example.com", role: "User", status: "Banned", lastLogin: "2024-01-13 10:15" },
  ]);

  const handleStartAttack = () => {
    setIsAttacking(true);
    setAttackProgress(0);
    setAttackOutput("Starting attack...\nInitializing connection...\nSending requests...");
    
    const interval = setInterval(() => {
      setAttackProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAttacking(false);
          setAttackOutput(prev => prev + "\nAttack completed successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  };

  const handleStopAttack = () => {
    setIsAttacking(false);
    setAttackProgress(0);
    setAttackOutput(prev => prev + "\nAttack stopped by user.");
  };

  const clearOutput = () => {
    setAttackOutput("Attack output will appear here...");
  };

  const downloadOutput = () => {
    const element = document.createElement("a");
    const file = new Blob([attackOutput], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "attack_output.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'administrator': return 'bg-red-500';
      case 'moderator': return 'bg-yellow-500';
      case 'user': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'banned': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-3xl font-bold text-white">Attack Panel V5.0</h1>
              <div className="flex items-center gap-4 mt-1">
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Offline</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-4 h-4" />
              <span>Attacks: 0</span>
            </div>
            <Badge className="bg-purple-500 text-white">Running 0</Badge>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="attack-panel" className="space-y-6">
          <TabsList className="grid w-full grid-cols-9 bg-gray-900/50 border border-red-900/20">
            <TabsTrigger value="attack-panel" className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Attack Panel
            </TabsTrigger>
            <TabsTrigger value="attack-history" className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center gap-2">
              <History className="w-4 h-4" />
              Attack History
            </TabsTrigger>
            <TabsTrigger value="user-management" className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="reconnaissance" className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center gap-2">
              <Target className="w-4 h-4" />
              Reconnaissance
            </TabsTrigger>
            <TabsTrigger value="network-tools" className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Network Tools
            </TabsTrigger>
            <TabsTrigger value="osint" className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center gap-2">
              <Search className="w-4 h-4" />
              OSINT
            </TabsTrigger>
            <TabsTrigger value="payload-generator" className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center gap-2">
              <Hammer className="w-4 h-4" />
              Payload Generator
            </TabsTrigger>
            <TabsTrigger value="hash-cracker" className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Hash Cracker
            </TabsTrigger>
            <TabsTrigger value="vulnerability-scanner" className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Vuln Scanner
            </TabsTrigger>
          </TabsList>

          {/* Attack Panel Tab */}
          <TabsContent value="attack-panel" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Host Configuration */}
              <Card className="bg-gray-900/50 border-red-900/20">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Host Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">URL (https://example.com)</Label>
                    <Input
                      className="bg-gray-800 border-red-900/20 text-white"
                      defaultValue="https://example.com"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Attack Methods</Label>
                    <Select defaultValue="http-get-flood">
                      <SelectTrigger className="bg-gray-800 border-red-900/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-red-900/20">
                        <SelectItem value="http-get-flood">HTTP-GET-FLOOD</SelectItem>
                        <SelectItem value="http-post-flood">HTTP-POST-FLOOD</SelectItem>
                        <SelectItem value="tcp-syn">TCP-SYN</SelectItem>
                        <SelectItem value="udp-flood">UDP-FLOOD</SelectItem>
                        <SelectItem value="slowloris">Slowloris</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">HTTP Version</Label>
                    <Select defaultValue="http2">
                      <SelectTrigger className="bg-gray-800 border-red-900/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-red-900/20">
                        <SelectItem value="http1">HTTP/1</SelectItem>
                        <SelectItem value="http2">HTTP/2</SelectItem>
                        <SelectItem value="http3">HTTP/3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Requests per Second</Label>
                    <Input
                      className="bg-gray-800 border-red-900/20 text-white"
                      type="number"
                      defaultValue="150"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Concurrent Threads</Label>
                    <Input
                      className="bg-gray-800 border-red-900/20 text-white"
                      type="number"
                      defaultValue="1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Duration (Seconds)</Label>
                    <Input
                      className="bg-gray-800 border-red-900/20 text-white"
                      type="number"
                      defaultValue="60"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Geolocation</Label>
                    <Select defaultValue="worldwide">
                      <SelectTrigger className="bg-gray-800 border-red-900/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-red-900/20">
                        <SelectItem value="worldwide">World Wide</SelectItem>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleStartAttack}
                      disabled={isAttacking}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Attack
                    </Button>
                    <Button 
                      onClick={handleStopAttack}
                      variant="outline" 
                      className="flex-1 border-red-900/20 text-red-400 hover:bg-red-900/20"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                  
                  {isAttacking && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Attack Progress</span>
                        <span>{attackProgress}%</span>
                      </div>
                      <Progress value={attackProgress} className="bg-gray-800" />
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Attack Output */}
              <Card className="lg:col-span-2 bg-gray-900/50 border-red-900/20">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center justify-between">
                    <span>Attack Output</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={downloadOutput} className="border-red-900/20 text-red-400">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" onClick={clearOutput} className="border-red-900/20 text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/50 p-4 rounded-lg border border-red-900/20 h-96 overflow-y-auto">
                    <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                      {attackOutput}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Attack History Tab */}
          <TabsContent value="attack-history" className="space-y-6">
            <Card className="bg-gray-900/50 border-red-900/20">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Attack History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-red-900/20">
                        <th className="text-left py-3 px-4 text-gray-300">Target</th>
                        <th className="text-left py-3 px-4 text-gray-300">Method</th>
                        <th className="text-left py-3 px-4 text-gray-300">Timestamp</th>
                        <th className="text-left py-3 px-4 text-gray-300">Status</th>
                        <th className="text-left py-3 px-4 text-gray-300">Duration</th>
                        <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attackHistory.map((attack) => (
                        <tr key={attack.id} className="border-b border-red-900/10 hover:bg-red-900/10">
                          <td className="py-3 px-4 text-white">{attack.target}</td>
                          <td className="py-3 px-4 text-gray-300">{attack.method}</td>
                          <td className="py-3 px-4 text-gray-300">{attack.timestamp}</td>
                          <td className="py-3 px-4">
                            <Badge className={attack.status === 'Completed' ? 'bg-green-500' : 'bg-red-500'}>
                              {attack.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-300">{attack.duration}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="border-red-900/20 text-red-400">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-red-900/20 text-red-400">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="user-management" className="space-y-6">
            <Card className="bg-gray-900/50 border-red-900/20">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Management
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-red-900/20">
                        <th className="text-left py-3 px-4 text-gray-300">Username</th>
                        <th className="text-left py-3 px-4 text-gray-300">Email</th>
                        <th className="text-left py-3 px-4 text-gray-300">Role</th>
                        <th className="text-left py-3 px-4 text-gray-300">Status</th>
                        <th className="text-left py-3 px-4 text-gray-300">Last Login</th>
                        <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-red-900/10 hover:bg-red-900/10">
                          <td className="py-3 px-4 text-white font-medium">{user.username}</td>
                          <td className="py-3 px-4 text-gray-300">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge className={`${getRoleColor(user.role)} text-white`}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={`${getStatusColor(user.status)} text-white`}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-300">{user.lastLogin}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="border-red-900/20 text-red-400">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-red-900/20 text-red-400">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other existing tabs... */}
          <TabsContent value="reconnaissance">
            <Card className="bg-gray-900/50 border-red-900/20">
              <CardHeader>
                <CardTitle className="text-red-400">Reconnaissance Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Reconnaissance tools coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network-tools">
            <Card className="bg-gray-900/50 border-red-900/20">
              <CardHeader>
                <CardTitle className="text-red-400">Network Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Network analysis tools coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="osint">
            <Card className="bg-gray-900/50 border-red-900/20">
              <CardHeader>
                <CardTitle className="text-red-400">OSINT Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Open Source Intelligence tools coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payload-generator">
            <Card className="bg-gray-900/50 border-red-900/20">
              <CardHeader>
                <CardTitle className="text-red-400">Payload Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Payload generation tools coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hash-cracker">
            <Card className="bg-gray-900/50 border-red-900/20">
              <CardHeader>
                <CardTitle className="text-red-400">Hash Cracker</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Hash cracking tools coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Vulnerability Scanner Tab */}
          <TabsContent value="vulnerability-scanner">
            <VulnerabilityScanner />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Panel;
