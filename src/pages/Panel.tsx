
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Search, 
  Zap, 
  Hash, 
  Monitor, 
  Wifi, 
  Database, 
  Lock,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Panel = () => {
  const [activeTab, setActiveTab] = useState("network-tools");

  // Mock states for various tools
  const [networkScanResults, setNetworkScanResults] = useState("");
  const [osintResults, setOsintResults] = useState("");
  const [payloadResults, setPayloadResults] = useState("");
  const [hashResults, setHashResults] = useState("");
  const [sqlResults, setSqlResults] = useState("");
  const [exploitResults, setExploitResults] = useState("");
  const [forensicsResults, setForensicsResults] = useState("");
  const [cryptoResults, setCryptoResults] = useState("");

  const handleNetworkScan = (target: string) => {
    setNetworkScanResults(`Scanning ${target}...\nOpen ports: 22, 80, 443, 3389\nOS: Linux Ubuntu 20.04\nServices detected: SSH, HTTP, HTTPS, RDP`);
  };

  const handleOsintSearch = (query: string) => {
    setOsintResults(`OSINT results for "${query}":\n• Social media profiles found: 3\n• Email addresses: 2\n• Domain registrations: 1\n• Public records: 5`);
  };

  const handlePayloadGeneration = (type: string, options: string) => {
    setPayloadResults(`Generated ${type} payload:\n\n#!/bin/bash\necho "Payload generated with options: ${options}"\n# This is a demonstration payload`);
  };

  const handleHashCrack = (hash: string, method: string) => {
    setHashResults(`Attempting to crack hash using ${method}...\nHash: ${hash}\nResult: Password123 (cracked in 0.3 seconds)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Panel</h1>
          <p className="text-gray-300">Advanced Security Testing Suite</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 gap-2 h-auto p-2 bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger value="network-tools" className="flex items-center gap-2 p-3">
              <Wifi size={16} />
              Network Tools
            </TabsTrigger>
            <TabsTrigger value="osint" className="flex items-center gap-2 p-3">
              <Search size={16} />
              OSINT
            </TabsTrigger>
            <TabsTrigger value="payload-generator" className="flex items-center gap-2 p-3">
              <Zap size={16} />
              Payload Generator
            </TabsTrigger>
            <TabsTrigger value="hash-cracker" className="flex items-center gap-2 p-3">
              <Hash size={16} />
              Hash Cracker
            </TabsTrigger>
            <TabsTrigger value="virtual-machine" className="flex items-center gap-2 p-3">
              <Monitor size={16} />
              Virtual Machine
            </TabsTrigger>
            <TabsTrigger value="sql-injection" className="flex items-center gap-2 p-3">
              <Database size={16} />
              SQL Injection
            </TabsTrigger>
            <TabsTrigger value="exploit-db" className="flex items-center gap-2 p-3">
              <Shield size={16} />
              Exploit Database
            </TabsTrigger>
            <TabsTrigger value="forensics" className="flex items-center gap-2 p-3">
              <Eye size={16} />
              Digital Forensics
            </TabsTrigger>
            <TabsTrigger value="crypto-tools" className="flex items-center gap-2 p-3">
              <Lock size={16} />
              Crypto Tools
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="network-tools">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Network Scanning Tools</CardTitle>
                  <CardDescription className="text-gray-300">
                    Advanced network reconnaissance and port scanning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Target IP or domain" 
                      className="bg-gray-700 border-gray-600 text-white"
                      id="network-target"
                    />
                    <Button 
                      onClick={() => {
                        const target = (document.getElementById('network-target') as HTMLInputElement)?.value;
                        if (target) handleNetworkScan(target);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Scan
                    </Button>
                  </div>
                  {networkScanResults && (
                    <div className="bg-gray-900 p-4 rounded border border-gray-600">
                      <pre className="text-green-400 text-sm whitespace-pre-wrap">{networkScanResults}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="osint">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">OSINT Investigation</CardTitle>
                  <CardDescription className="text-gray-300">
                    Open Source Intelligence gathering tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Search query (username, email, domain)" 
                      className="bg-gray-700 border-gray-600 text-white"
                      id="osint-query"
                    />
                    <Button 
                      onClick={() => {
                        const query = (document.getElementById('osint-query') as HTMLInputElement)?.value;
                        if (query) handleOsintSearch(query);
                      }}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Search
                    </Button>
                  </div>
                  {osintResults && (
                    <div className="bg-gray-900 p-4 rounded border border-gray-600">
                      <pre className="text-cyan-400 text-sm whitespace-pre-wrap">{osintResults}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payload-generator">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Payload Generator</CardTitle>
                  <CardDescription className="text-gray-300">
                    Generate custom payloads for penetration testing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Payload Type</Label>
                      <Select>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select payload type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reverse-shell">Reverse Shell</SelectItem>
                          <SelectItem value="bind-shell">Bind Shell</SelectItem>
                          <SelectItem value="web-shell">Web Shell</SelectItem>
                          <SelectItem value="meterpreter">Meterpreter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white">Options</Label>
                      <Input 
                        placeholder="LHOST=192.168.1.100 LPORT=4444" 
                        className="bg-gray-700 border-gray-600 text-white"
                        id="payload-options"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      const options = (document.getElementById('payload-options') as HTMLInputElement)?.value || "";
                      handlePayloadGeneration("reverse-shell", options);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Generate Payload
                  </Button>
                  {payloadResults && (
                    <div className="bg-gray-900 p-4 rounded border border-gray-600">
                      <pre className="text-yellow-400 text-sm whitespace-pre-wrap">{payloadResults}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hash-cracker">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Hash Cracker</CardTitle>
                  <CardDescription className="text-gray-300">
                    Decrypt and crack various hash formats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Hash to Crack</Label>
                    <Input 
                      placeholder="Enter hash (MD5, SHA1, SHA256, etc.)" 
                      className="bg-gray-700 border-gray-600 text-white"
                      id="hash-input"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Cracking Method</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dictionary">Dictionary Attack</SelectItem>
                        <SelectItem value="brute-force">Brute Force</SelectItem>
                        <SelectItem value="rainbow">Rainbow Tables</SelectItem>
                        <SelectItem value="hybrid">Hybrid Attack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={() => {
                      const hash = (document.getElementById('hash-input') as HTMLInputElement)?.value;
                      if (hash) handleHashCrack(hash, "dictionary");
                    }}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Start Cracking
                  </Button>
                  {hashResults && (
                    <div className="bg-gray-900 p-4 rounded border border-gray-600">
                      <pre className="text-orange-400 text-sm whitespace-pre-wrap">{hashResults}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="virtual-machine">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Virtual Machine Environment</CardTitle>
                  <CardDescription className="text-gray-300">
                    Isolated testing environment for security research
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '600px' }}>
                    <div className="absolute top-0 left-0 w-full h-14 bg-black z-10"></div>
                    <iframe
                      src="https://copy.sh/v86/?profile=linux26"
                      className="w-full h-full border-0"
                      title="Virtual Machine"
                      sandbox="allow-scripts allow-same-origin allow-forms"
                    />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                      Reset VM
                    </Button>
                    <Button variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                      Save State
                    </Button>
                    <Button variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                      Load State
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sql-injection">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">SQL Injection Testing</CardTitle>
                  <CardDescription className="text-gray-300">
                    Test web applications for SQL injection vulnerabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Target URL</Label>
                    <Input 
                      placeholder="https://example.com/login.php" 
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Injection Payload</Label>
                    <Textarea 
                      placeholder="' OR 1=1 -- " 
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={() => setSqlResults("SQL injection test completed:\n• Vulnerability detected in login form\n• Database: MySQL 5.7\n• Tables discovered: users, admin, logs")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Test Injection
                  </Button>
                  {sqlResults && (
                    <div className="bg-gray-900 p-4 rounded border border-gray-600">
                      <pre className="text-green-400 text-sm whitespace-pre-wrap">{sqlResults}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exploit-db">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Exploit Database</CardTitle>
                  <CardDescription className="text-gray-300">
                    Search and browse known exploits and vulnerabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Search CVE, software, or exploit type" 
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button 
                      onClick={() => setExploitResults("Exploit search results:\n\n1. CVE-2023-1234 - Apache HTTP Server RCE\n2. CVE-2023-5678 - Windows SMB Buffer Overflow\n3. CVE-2023-9012 - Linux Kernel Privilege Escalation")}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Search
                    </Button>
                  </div>
                  {exploitResults && (
                    <div className="bg-gray-900 p-4 rounded border border-gray-600">
                      <pre className="text-red-400 text-sm whitespace-pre-wrap">{exploitResults}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forensics">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Digital Forensics</CardTitle>
                  <CardDescription className="text-gray-300">
                    Analyze digital evidence and recover deleted data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Evidence File</Label>
                    <Input 
                      type="file" 
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <Button 
                    onClick={() => setForensicsResults("Forensic analysis complete:\n• File system: NTFS\n• Deleted files recovered: 47\n• Registry entries found: 1,234\n• Timeline created: 2023-01-01 to 2023-12-31")}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Analyze Evidence
                  </Button>
                  {forensicsResults && (
                    <div className="bg-gray-900 p-4 rounded border border-gray-600">
                      <pre className="text-indigo-400 text-sm whitespace-pre-wrap">{forensicsResults}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crypto-tools">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Cryptography Tools</CardTitle>
                  <CardDescription className="text-gray-300">
                    Encryption, decryption, and cryptographic analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Input Text</Label>
                    <Textarea 
                      placeholder="Enter text to encrypt/decrypt" 
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={() => setCryptoResults("Encryption complete:\nAlgorithm: AES-256\nKey: Generated\nCiphertext: 4a7d1ed414474e4033ac29ccb8653d9b...")}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Encrypt
                    </Button>
                    <Button 
                      onClick={() => setCryptoResults("Decryption complete:\nAlgorithm: AES-256\nPlaintext: Hello, this is a secret message!")}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Decrypt
                    </Button>
                  </div>
                  {cryptoResults && (
                    <div className="bg-gray-900 p-4 rounded border border-gray-600">
                      <pre className="text-teal-400 text-sm whitespace-pre-wrap">{cryptoResults}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Panel;
