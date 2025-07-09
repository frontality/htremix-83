
import { useState } from "react";
import { 
  Terminal, 
  Activity, 
  Search, 
  Network, 
  Eye, 
  Wrench, 
  Hash, 
  Monitor 
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const Panel = () => {
  const [activeTab, setActiveTab] = useState("virtual-machine");
  const { currentTheme } = useTheme();

  const tabs = [
    { id: "attack-history", label: "Attack History", icon: Terminal },
    { id: "system-monitor", label: "System Monitor", icon: Activity },
    { id: "reconnaissance", label: "Reconnaissance", icon: Search },
    { id: "network-tools", label: "Network Tools", icon: Network },
    { id: "osint", label: "OSINT", icon: Eye },
    { id: "payload-generator", label: "Payload Generator", icon: Wrench },
    { id: "hash-cracker", label: "Hash Cracker", icon: Hash },
    { id: "virtual-machine", label: "Virtual Machine", icon: Monitor },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "attack-history":
        return (
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Attack History</h3>
            <div className="space-y-3">
              {[
                { target: "192.168.1.100", method: "SQL Injection", status: "Success", time: "2024-01-15 14:30" },
                { target: "example.com", method: "XSS", status: "Failed", time: "2024-01-15 13:45" },
                { target: "10.0.0.50", method: "Port Scan", status: "Success", time: "2024-01-15 12:20" },
              ].map((attack, index) => (
                <div key={index} className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{attack.target}</p>
                      <p className="text-gray-400 text-sm">{attack.method}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        attack.status === "Success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}>
                        {attack.status}
                      </span>
                      <p className="text-gray-400 text-xs mt-1">{attack.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "system-monitor":
        return (
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">System Monitor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border}`}>
                <h4 className="text-white font-medium mb-2">CPU Usage</h4>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                </div>
                <p className="text-gray-400 text-sm mt-1">75%</p>
              </div>
              <div className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border}`}>
                <h4 className="text-white font-medium mb-2">Memory Usage</h4>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-1/2"></div>
                </div>
                <p className="text-gray-400 text-sm mt-1">8.2GB / 16GB</p>
              </div>
              <div className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border}`}>
                <h4 className="text-white font-medium mb-2">Network Activity</h4>
                <p className="text-gray-400 text-sm">↑ 125 MB/s ↓ 89 MB/s</p>
              </div>
              <div className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border}`}>
                <h4 className="text-white font-medium mb-2">Active Connections</h4>
                <p className="text-gray-400 text-sm">247 connections</p>
              </div>
            </div>
          </div>
        );

      case "reconnaissance":
        return (
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Reconnaissance Tools</h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border}`}>
                <h4 className="text-white font-medium mb-2">Target Discovery</h4>
                <input 
                  type="text" 
                  placeholder="Enter target IP or domain..." 
                  className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600"
                />
                <button className={`mt-2 px-4 py-2 ${currentTheme.primary} text-white rounded hover:opacity-80`}>
                  Start Scan
                </button>
              </div>
              <div className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border}`}>
                <h4 className="text-white font-medium mb-2">Recent Scans</h4>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">192.168.1.0/24 - 15 hosts found</p>
                  <p className="text-gray-400 text-sm">example.com - Port 80, 443 open</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "network-tools":
        return (
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Network Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border}`}>
                <h4 className="text-white font-medium mb-2">Port Scanner</h4>
                <input 
                  type="text" 
                  placeholder="Target IP..." 
                  className="w-full p-2 mb-2 bg-gray-800 text-white rounded border border-gray-600"
                />
                <input 
                  type="text" 
                  placeholder="Port range (1-1000)..." 
                  className="w-full p-2 mb-2 bg-gray-800 text-white rounded border border-gray-600"
                />
                <button className={`px-4 py-2 ${currentTheme.primary} text-white rounded hover:opacity-80`}>
                  Scan Ports
                </button>
              </div>
              <div className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border}`}>
                <h4 className="text-white font-medium mb-2">Network Mapper</h4>
                <input 
                  type="text" 
                  placeholder="Network range..." 
                  className="w-full p-2 mb-2 bg-gray-800 text-white rounded border border-gray-600"
                />
                <button className={`px-4 py-2 ${currentTheme.primary} text-white rounded hover:opacity-80`}>
                  Map Network
                </button>
              </div>
            </div>
          </div>
        );

      case "osint":
        return (
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">OSINT Tools</h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border}`}>
                <h4 className="text-white font-medium mb-2">Domain Intelligence</h4>
                <input 
                  type="text" 
                  placeholder="Enter domain name..." 
                  className="w-full p-2 mb-2 bg-gray-800 text-white rounded border border-gray-600"
                />
                <button className={`px-4 py-2 ${currentTheme.primary} text-white rounded hover:opacity-80`}>
                  Gather Intelligence
                </button>
              </div>
              <div className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border}`}>
                <h4 className="text-white font-medium mb-2">Social Media Search</h4>
                <input 
                  type="text" 
                  placeholder="Search query..." 
                  className="w-full p-2 mb-2 bg-gray-800 text-white rounded border border-gray-600"
                />
                <button className={`px-4 py-2 ${currentTheme.primary} text-white rounded hover:opacity-80`}>
                  Search
                </button>
              </div>
            </div>
          </div>
        );

      case "payload-generator":
        return (
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Payload Generator</h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border}`}>
                <h4 className="text-white font-medium mb-2">Payload Type</h4>
                <select className="w-full p-2 mb-2 bg-gray-800 text-white rounded border border-gray-600">
                  <option>Reverse Shell</option>
                  <option>Bind Shell</option>
                  <option>Web Shell</option>
                  <option>SQL Injection</option>
                  <option>XSS</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Target IP..." 
                  className="w-full p-2 mb-2 bg-gray-800 text-white rounded border border-gray-600"
                />
                <input 
                  type="text" 
                  placeholder="Port..." 
                  className="w-full p-2 mb-2 bg-gray-800 text-white rounded border border-gray-600"
                />
                <button className={`px-4 py-2 ${currentTheme.primary} text-white rounded hover:opacity-80`}>
                  Generate Payload
                </button>
              </div>
              <div className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border}`}>
                <h4 className="text-white font-medium mb-2">Generated Payload</h4>
                <textarea 
                  className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600 h-24"
                  placeholder="Generated payload will appear here..."
                  readOnly
                />
              </div>
            </div>
          </div>
        );

      case "hash-cracker":
        return (
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Hash Cracker</h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border}`}>
                <h4 className="text-white font-medium mb-2">Hash Input</h4>
                <textarea 
                  className="w-full p-2 mb-2 bg-gray-800 text-white rounded border border-gray-600 h-24"
                  placeholder="Enter hash to crack..."
                />
                <select className="w-full p-2 mb-2 bg-gray-800 text-white rounded border border-gray-600">
                  <option>MD5</option>
                  <option>SHA1</option>
                  <option>SHA256</option>
                  <option>NTLM</option>
                  <option>bcrypt</option>
                </select>
                <button className={`px-4 py-2 ${currentTheme.primary} text-white rounded hover:opacity-80`}>
                  Start Cracking
                </button>
              </div>
              <div className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.border}`}>
                <h4 className="text-white font-medium mb-2">Cracking Progress</h4>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div className="bg-yellow-600 h-2 rounded-full w-1/3"></div>
                </div>
                <p className="text-gray-400 text-sm">Progress: 33% (Dictionary attack)</p>
              </div>
            </div>
          </div>
        );

      case "virtual-machine":
        return (
          <div className="relative h-full">
            <div className="absolute top-0 left-0 w-32 h-14 bg-black z-10"></div>
            <iframe
              src="https://copy.sh/v86/?profile=linux26"
              className="w-full h-[600px] border-0 rounded-lg"
              title="Virtual Machine"
            />
          </div>
        );

      default:
        return <div className="p-6 text-white">Select a tool from the navigation above.</div>;
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Panel</h1>
          <p className="text-gray-400">Advanced Security Testing Tools</p>
        </div>

        {/* Navigation Grid - 3x3 layout */}
        <div className="grid grid-cols-3 gap-2 mb-8 max-w-4xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-all text-sm font-medium ${
                  activeTab === tab.id
                    ? `${currentTheme.primary} text-white shadow-lg`
                    : `${currentTheme.cardBg} text-gray-300 hover:${currentTheme.secondary} border ${currentTheme.border}`
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className={`${currentTheme.cardBg} rounded-lg border ${currentTheme.border} min-h-[600px]`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Panel;
