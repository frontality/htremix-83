
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, Zap, Users, Activity, Wrench } from "lucide-react";
import WebhookSpammer from "@/components/WebhookSpammer";

const Panel = () => {
  const { currentTheme } = useTheme();

  const panelCards = [
    {
      icon: Shield,
      title: "Security Tools",
      description: "Advanced security and protection utilities",
      color: "text-red-400"
    },
    {
      icon: Zap,
      title: "Performance",
      description: "System optimization and monitoring",
      color: "text-yellow-400"
    },
    {
      icon: Users,
      title: "User Management",
      description: "Manage users and permissions",
      color: "text-blue-400"
    },
    {
      icon: Activity,
      title: "Analytics",
      description: "View detailed analytics and reports",
      color: "text-green-400"
    }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bg} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wrench className={`w-8 h-8 ${currentTheme.accent}`} />
            <h1 className={`text-4xl font-bold ${currentTheme.text}`}>Control Panel</h1>
          </div>
          <p className={`text-lg ${currentTheme.muted} max-w-2xl mx-auto`}>
            Advanced tools and utilities for power users. Handle with care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {panelCards.map((card, index) => (
            <Card key={index} className={`${currentTheme.cardBg} ${currentTheme.border} hover:scale-105 transition-transform cursor-pointer`}>
              <CardHeader className="text-center">
                <card.icon className={`w-12 h-12 mx-auto ${card.color} mb-2`} />
                <CardTitle className={`${currentTheme.text} text-lg`}>{card.title}</CardTitle>
                <CardDescription className={currentTheme.muted}>
                  {card.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WebhookSpammer />
          
          <Card className={`${currentTheme.cardBg} ${currentTheme.border}`}>
            <CardHeader>
              <CardTitle className={currentTheme.text}>System Status</CardTitle>
              <CardDescription className={currentTheme.muted}>
                Monitor system health and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={currentTheme.text}>CPU Usage</span>
                  <span className="text-green-400">23%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={currentTheme.text}>Memory Usage</span>
                  <span className="text-yellow-400">67%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={currentTheme.text}>Network Status</span>
                  <span className="text-green-400">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={currentTheme.text}>Active Users</span>
                  <span className="text-blue-400">1,234</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Panel;
