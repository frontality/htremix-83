import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  Wifi, 
  Search, 
  Code, 
  Key, 
  Database, 
  Bug, 
  Fingerprint, 
  Lock 
} from "lucide-react";

interface VMOverlayProps {
  ipAddress: string;
  isRunning: boolean;
}

const VMOverlay: React.FC<VMOverlayProps> = ({ ipAddress, isRunning }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Virtual Machine Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">IP Address:</p>
            <p className="text-lg">{ipAddress}</p>
          </div>
          <div>
            <Badge variant={isRunning ? "default" : "destructive"}>
              {isRunning ? "Running" : "Stopped"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface NavItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ title, description, icon, onClick }) => {
  return (
    <Card className="hover:bg-secondary cursor-pointer" onClick={onClick}>
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const Panel = () => {
  const [ipAddress, setIpAddress] = useState("192.168.1.100");
  const [isRunning, setIsRunning] = useState(true);

  const handleStartVM = () => {
    setIsRunning(true);
  };

  const handleStopVM = () => {
    setIsRunning(false);
  };

  const handleScanNetwork = () => {
    alert("Scanning network...");
  };

  const handlePortScan = () => {
    alert("Performing port scan...");
  };

  const handleVulnerabilityScan = () => {
    alert("Running vulnerability scan...");
  };

  const handleExploit = () => {
    alert("Attempting exploit...");
  };

  const handleBruteForce = () => {
    alert("Starting brute force attack...");
  };

  const handleSQLInjection = () => {
    alert("Performing SQL injection...");
  };

  const handleXSS = () => {
    alert("Attempting XSS attack...");
  };

  const handleCredentialHarvesting = () => {
    alert("Harvesting credentials...");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Panel</h1>
          <p className="text-muted-foreground">Advanced Security Testing Platform</p>
        </div>

        <VMOverlay ipAddress={ipAddress} isRunning={isRunning} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <NavItem
            title="Network Scan"
            description="Discover devices on the network"
            icon={<Wifi className="w-4 h-4 mr-2" />}
            onClick={handleScanNetwork}
          />
          <NavItem
            title="Port Scan"
            description="Identify open ports on a target"
            icon={<Terminal className="w-4 h-4 mr-2" />}
            onClick={handlePortScan}
          />
          <NavItem
            title="Vulnerability Scan"
            description="Find known vulnerabilities"
            icon={<Search className="w-4 h-4 mr-2" />}
            onClick={handleVulnerabilityScan}
          />
          <NavItem
            title="Exploit"
            description="Exploit identified vulnerabilities"
            icon={<Code className="w-4 h-4 mr-2" />}
            onClick={handleExploit}
          />
          <NavItem
            title="Brute Force"
            description="Attempt to crack passwords"
            icon={<Key className="w-4 h-4 mr-2" />}
            onClick={handleBruteForce}
          />
          <NavItem
            title="SQL Injection"
            description="Inject SQL code into databases"
            icon={<Database className="w-4 h-4 mr-2" />}
            onClick={handleSQLInjection}
          />
          <NavItem
            title="XSS Attack"
            description="Perform Cross-Site Scripting attacks"
            icon={<Bug className="w-4 h-4 mr-2" />}
            onClick={handleXSS}
          />
          <NavItem
            title="Credential Harvesting"
            description="Gather user credentials"
            icon={<Fingerprint className="w-4 h-4 mr-2" />}
            onClick={handleCredentialHarvesting}
          />
          <NavItem
            title="Lock System"
            description="Lock the system"
            icon={<Lock className="w-4 h-4 mr-2" />}
            onClick={() => alert("Locking system...")}
          />
        </div>

        <div className="mt-8 flex justify-center">
          {isRunning ? (
            <Button variant="destructive" onClick={handleStopVM}>
              Stop VM
            </Button>
          ) : (
            <Button onClick={handleStartVM}>Start VM</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Panel;
