
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, Activity, Settings, Search, UserCheck, UserX, Crown } from 'lucide-react';

const Panel = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user data
  const recentUsers = [
    { id: 1, username: 'cryptomaster', email: 'crypto@email.com', status: 'active', role: 'user', joinDate: '2024-01-15' },
    { id: 2, username: 'hackerman', email: 'hack@email.com', status: 'active', role: 'premium', joinDate: '2024-01-14' },
    { id: 3, username: 'skidkid', email: 'skid@email.com', status: 'banned', role: 'user', joinDate: '2024-01-13' },
    { id: 4, username: 'elitehacker', email: 'elite@email.com', status: 'active', role: 'admin', joinDate: '2024-01-12' },
  ];

  const filteredUsers = recentUsers.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'banned': return 'bg-red-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'premium': return <Shield className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-gray-400">Manage your platform and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">2,847</div>
              <p className="text-xs text-green-500">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Today</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">847</div>
              <p className="text-xs text-blue-500">+5% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Premium Users</CardTitle>
              <Shield className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">347</div>
              <p className="text-xs text-purple-500">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Revenue</CardTitle>
              <Settings className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$12,847</div>
              <p className="text-xs text-yellow-500">+15% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* User Management Section (Replaces System Monitor) */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription className="text-gray-400">
              Manage users, roles, and account status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="users" className="text-white">Recent Users</TabsTrigger>
                <TabsTrigger value="search" className="text-white">Search Users</TabsTrigger>
                <TabsTrigger value="actions" className="text-white">Quick Actions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="users" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span className="font-medium text-white">{user.username}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {user.role}
                        </Badge>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">{user.joinDate}</span>
                        <Button size="sm" variant="outline" className="text-xs">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="search" className="space-y-4 mt-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by username or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span className="font-medium text-white">{user.username}</span>
                        </div>
                        <span className="text-sm text-gray-400">{user.email}</span>
                        <Badge variant="secondary" className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                    <UserCheck className="h-4 w-4" />
                    Approve Pending Users
                  </Button>
                  <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700">
                    <UserX className="h-4 w-4" />
                    Review Reported Users
                  </Button>
                  <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    <Shield className="h-4 w-4" />
                    Manage Permissions
                  </Button>
                  <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                    <Crown className="h-4 w-4" />
                    Promote to Premium
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Panel;
