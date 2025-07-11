
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "@/contexts/ThemeContext";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import SystemAnalyzer from "@/components/SystemAnalyzer";
import { 
  Activity, 
  BarChart3, 
  Database, 
  Settings, 
  Shield,
  Users,
  Zap,
  TrendingUp,
  Server,
  Globe
} from "lucide-react";

const Panel = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "Active Sessions", value: "1,247", icon: Activity, change: "+12%" },
    { label: "Data Processed", value: "2.4TB", icon: Database, change: "+8%" },
    { label: "Response Time", value: "0.3s", icon: Zap, change: "-15%" },
    { label: "Success Rate", value: "99.7%", icon: TrendingUp, change: "+2%" },
  ];

  const recentActivity = [
    { action: "System backup completed", time: "2 minutes ago", status: "success" },
    { action: "New user registration", time: "5 minutes ago", status: "info" },
    { action: "API rate limit adjusted", time: "12 minutes ago", status: "warning" },
    { action: "Database optimization", time: "1 hour ago", status: "success" },
  ];

  const systemMetrics = [
    { name: "CPU Usage", value: 65, max: 100, status: "normal" },
    { name: "Memory", value: 78, max: 100, status: "normal" },
    { name: "Storage", value: 45, max: 100, status: "good" },
    { name: "Network", value: 23, max: 100, status: "good" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
      case "good":
        return "bg-green-500";
      case "warning":
      case "normal":
        return "bg-yellow-500";
      case "error":
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold ${currentTheme.text} mb-2`}>
            Control Panel
          </h1>
          <p className={`${currentTheme.muted}`}>
            Welcome back, {profile?.username || user?.email?.split('@')[0] || 'User'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full grid-cols-4 ${currentTheme.cardBg}`}>
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2">
              <Server className="h-4 w-4" />
              <span>System</span>
            </TabsTrigger>
            <TabsTrigger value="analyzer" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Analyzer</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className={`${currentTheme.cardBg} ${currentTheme.border}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium ${currentTheme.text}`}>
                      {stat.label}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${currentTheme.muted}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${currentTheme.text}`}>
                      {stat.value}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant={stat.change.startsWith('+') ? 'default' : 'secondary'}>
                        {stat.change}
                      </Badge>
                      <span className={`text-xs ${currentTheme.muted}`}>from last month</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={`${currentTheme.cardBg} ${currentTheme.border}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${currentTheme.text}`}>
                    <Activity className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
                        <span className={`text-sm ${currentTheme.text}`}>{activity.action}</span>
                      </div>
                      <span className={`text-xs ${currentTheme.muted}`}>{activity.time}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className={`${currentTheme.cardBg} ${currentTheme.border}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${currentTheme.text}`}>
                    <Server className="h-5 w-5" />
                    <span>System Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${currentTheme.text}`}>{metric.name}</span>
                        <span className={`text-sm ${currentTheme.muted}`}>{metric.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getStatusColor(metric.status)}`}
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className={`${currentTheme.cardBg} ${currentTheme.border}`}>
              <CardHeader>
                <CardTitle className={`${currentTheme.text}`}>Analytics Dashboard</CardTitle>
                <CardDescription className={`${currentTheme.muted}`}>
                  Detailed performance metrics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Globe className={`h-8 w-8 mx-auto mb-2 ${currentTheme.text}`} />
                    <div className={`text-2xl font-bold ${currentTheme.text}`}>156K</div>
                    <div className={`text-sm ${currentTheme.muted}`}>Global Requests</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Users className={`h-8 w-8 mx-auto mb-2 ${currentTheme.text}`} />
                    <div className={`text-2xl font-bold ${currentTheme.text}`}>23.5K</div>
                    <div className={`text-sm ${currentTheme.muted}`}>Active Users</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Zap className={`h-8 w-8 mx-auto mb-2 ${currentTheme.text}`} />
                    <div className={`text-2xl font-bold ${currentTheme.text}`}>99.9%</div>
                    <div className={`text-sm ${currentTheme.muted}`}>Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className={`${currentTheme.cardBg} ${currentTheme.border}`}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${currentTheme.text}`}>
                  <Settings className="h-5 w-5" />
                  <span>System Configuration</span>
                </CardTitle>
                <CardDescription className={`${currentTheme.muted}`}>
                  Manage system settings and configurations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-12 justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Database Management
                  </Button>
                  <Button variant="outline" className="h-12 justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </Button>
                  <Button variant="outline" className="h-12 justify-start">
                    <Server className="h-4 w-4 mr-2" />
                    Server Configuration
                  </Button>
                  <Button variant="outline" className="h-12 justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Performance Monitoring
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analyzer" className="space-y-6">
            <SystemAnalyzer />
          </TabsContent>
        </Tabs>
      </div>

      <SkidHavenFooter />
    </div>
  );
};

export default Panel;
