
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Activity, 
  ShoppingCart, 
  MessageSquare, 
  TrendingUp, 
  UserPlus,
  Clock,
  Star,
  Shield,
  AlertTriangle
} from 'lucide-react';

const Panel = () => {
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 89,
    newUsersToday: 23,
    totalSales: 5642,
    pendingOrders: 12,
    supportTickets: 7
  });

  const [recentUsers, setRecentUsers] = useState([
    { id: 1, username: 'SkidMaster2024', joinedAt: '2 hours ago', status: 'online' },
    { id: 2, username: 'HackerPro', joinedAt: '5 hours ago', status: 'offline' },
    { id: 3, username: 'CyberWarrior', joinedAt: '1 day ago', status: 'online' },
    { id: 4, username: 'CodeBreaker', joinedAt: '2 days ago', status: 'away' },
    { id: 5, username: 'NetNinja', joinedAt: '3 days ago', status: 'online' }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'New user registered', user: 'SkidMaster2024', time: '2 hours ago', type: 'user' },
    { id: 2, action: 'Purchase completed', user: 'HackerPro', time: '3 hours ago', type: 'sale' },
    { id: 3, action: 'Support ticket created', user: 'CyberWarrior', time: '4 hours ago', type: 'support' },
    { id: 4, action: 'Forum post reported', user: 'Anonymous', time: '6 hours ago', type: 'report' },
    { id: 5, action: 'New product listed', user: 'Admin', time: '8 hours ago', type: 'product' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <UserPlus className="h-4 w-4" />;
      case 'sale': return <ShoppingCart className="h-4 w-4" />;
      case 'support': return <MessageSquare className="h-4 w-4" />;
      case 'report': return <AlertTriangle className="h-4 w-4" />;
      case 'product': return <Star className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Monitor and manage your platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.newUsersToday} new today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Currently online
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingOrders} pending orders
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="reports">Reports & Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Platform Activity</CardTitle>
                <CardDescription>Latest actions and events on your platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {activity.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          by {activity.user}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent User Registrations</CardTitle>
                <CardDescription>Newly registered users and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></div>
                          <span className="font-medium">{user.username}</span>
                        </div>
                        <Badge variant="secondary">{user.status}</Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">
                          Joined {user.joinedAt}
                        </span>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span>Support Tickets</span>
                  </CardTitle>
                  <CardDescription>Pending support requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{stats.supportTickets}</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    3 high priority, 4 normal
                  </p>
                  <Button className="w-full">
                    View All Tickets
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    <span>Security Alerts</span>
                  </CardTitle>
                  <CardDescription>Recent security events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">2</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Failed login attempts detected
                  </p>
                  <Button variant="destructive" className="w-full">
                    Review Alerts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Panel;
