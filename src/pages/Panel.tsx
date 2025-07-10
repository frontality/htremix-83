
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Panel = () => {
  const [activeTab, setActiveTab] = useState('vm');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Panel
          </h1>
          <p className="text-xl text-gray-300">Your comprehensive cybersecurity toolkit</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-black/20 backdrop-blur">
            <TabsTrigger value="vm" className="data-[state=active]:bg-purple-600">Virtual Machine</TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-purple-600">Network Tools</TabsTrigger>
            <TabsTrigger value="osint" className="data-[state=active]:bg-purple-600">OSINT</TabsTrigger>
          </TabsList>

          <TabsContent value="vm" className="space-y-4">
            <Card className="bg-black/20 backdrop-blur border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Linux Virtual Machine</CardTitle>
                <CardDescription className="text-gray-300">
                  Full Ubuntu environment for penetration testing
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
                  <iframe 
                    src="https://bellard.org/jslinux/vm.html?url=https://bellard.org/jslinux/buildroot-x86.cfg"
                    className="w-full h-full"
                    title="Linux VM"
                  />
                  <div className="absolute top-0 left-0 w-full h-14 bg-black/50 flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="ml-4 text-white text-sm">root@linux:~</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <Card className="bg-black/20 backdrop-blur border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Network Analysis Tools</CardTitle>
                <CardDescription className="text-gray-300">
                  Port scanning, network discovery, and traffic analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Port Scanner</h3>
                    <p className="text-gray-300">Scan for open ports on target systems</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Network Discovery</h3>
                    <p className="text-gray-300">Discover devices on the network</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="osint" className="space-y-4">
            <Card className="bg-black/20 backdrop-blur border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">OSINT Tools</CardTitle>
                <CardDescription className="text-gray-300">
                  Open Source Intelligence gathering tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Domain Intelligence</h3>
                    <p className="text-gray-300">Gather information about domains and subdomains</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Social Media Analysis</h3>
                    <p className="text-gray-300">Analyze social media presence and connections</p>
                  </div>
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
