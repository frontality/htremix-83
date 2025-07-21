import React, { useState } from 'react';
import AttackPanel from "@/components/AttackPanel";
import AttackHistory from "@/components/AttackHistory";
import SystemMonitor from "@/components/SystemMonitor";
import Reconnaissance from "@/components/Reconnaissance";
import NetworkTools from "@/components/NetworkTools";
import OSINT from "@/components/OSINT";
import PayloadGenerator from "@/components/PayloadGenerator";
import HashCracker from "@/components/HashCracker";
import WebhookSpammer from "@/components/WebhookSpammer";

const Panel = () => {
  const [activeTab, setActiveTab] = useState('attack');

  const renderContent = () => {
    switch (activeTab) {
      case 'attack':
        return <AttackPanel />;
      case 'history':
        return <AttackHistory />;
      case 'monitor':
        return <SystemMonitor />;
      case 'recon':
        return <Reconnaissance />;
      case 'network':
        return <NetworkTools />;
      case 'osint':
        return <OSINT />;
      case 'payload':
        return <PayloadGenerator />;
      case 'hash':
        return <HashCracker />;
      case 'webhook':
        return <WebhookSpammer />;
      default:
        return <AttackPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="flex">
        <aside className="w-64 bg-card border-r min-h-screen p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('attack')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'attack' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              Attack Panel
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'history' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              Attack History
            </button>
            <button
              onClick={() => setActiveTab('monitor')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'monitor' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              System Monitor
            </button>
            <button
              onClick={() => setActiveTab('recon')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'recon' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              Reconnaissance
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'network' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              Network Tools
            </button>
            <button
              onClick={() => setActiveTab('osint')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'osint' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              OSINT
            </button>
            <button
              onClick={() => setActiveTab('payload')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'payload' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              Payload Generator
            </button>
            <button
              onClick={() => setActiveTab('hash')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'hash' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              Hash Cracker
            </button>
            <button
              onClick={() => setActiveTab('webhook')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'webhook' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              Discord Webhook Spammer
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Panel;
