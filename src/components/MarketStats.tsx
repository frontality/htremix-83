
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag, Activity, Gamepad2, Gift, Zap } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MarketStats = () => {
  const { currentTheme } = useTheme();
  const [stats, setStats] = useState({
    totalValue: 0,
    activeUsers: 0,
    totalListings: 0,
    todaysSales: 0,
    priceChange: 0,
    volume24h: 0
  });

  useEffect(() => {
    // Simulate real-time stats for digital marketplace
    const interval = setInterval(() => {
      setStats({
        totalValue: Math.floor(Math.random() * 500000) + 250000,
        activeUsers: Math.floor(Math.random() * 3000) + 800,
        totalListings: Math.floor(Math.random() * 8000) + 3000,
        todaysSales: Math.floor(Math.random() * 300) + 50,
        priceChange: (Math.random() - 0.5) * 8,
        volume24h: Math.floor(Math.random() * 80000) + 30000
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const statCards = [
    {
      title: "Market Value",
      value: `$${formatNumber(stats.totalValue)}`,
      icon: DollarSign,
      change: stats.priceChange,
      color: "text-green-400"
    },
    {
      title: "Active Traders",
      value: formatNumber(stats.activeUsers),
      icon: Users,
      change: 4.8,
      color: "text-blue-400"
    },
    {
      title: "Digital Items",
      value: formatNumber(stats.totalListings),
      icon: ShoppingBag,
      change: 2.7,
      color: "text-purple-400"
    },
    {
      title: "24h Volume",
      value: `$${formatNumber(stats.volume24h)}`,
      icon: Activity,
      change: stats.priceChange * 0.6,
      color: "text-orange-400"
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className={`${currentTheme.text} text-xl font-bold mb-4 flex items-center gap-2`}>
        <Activity className="h-5 w-5" />
        Live Digital Market Stats
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const isPositive = stat.change >= 0;
          return (
            <Card key={index} className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`${currentTheme.text} text-sm font-medium flex items-center justify-between`}>
                  <span>{stat.title}</span>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className={`text-2xl font-bold ${currentTheme.text}`}>
                    {stat.value}
                  </div>
                  <div className={`flex items-center text-sm ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stat.change).toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Live Digital Activity Feed */}
      <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
        <CardHeader>
          <CardTitle className={`${currentTheme.text} text-lg flex items-center gap-2`}>
            <Activity className="h-5 w-5" />
            Recent Digital Trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "Gaming Account sold", item: "Fortnite OG Account", price: "$85", time: "1m ago", icon: Gamepad2 },
              { action: "Discord Nitro listed", item: "12-Month Subscription", price: "$45", time: "3m ago", icon: Zap },
              { action: "Gift Card sold", item: "$50 Steam Card", price: "$47", time: "5m ago", icon: Gift },
              { action: "New trader joined", item: "GamerPro_2024", price: "", time: "7m ago", icon: Users },
              { action: "Account upgraded", item: "Minecraft Premium", price: "$65", time: "12m ago", icon: Gamepad2 }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-0">
                <div className="flex items-center gap-3">
                  <activity.icon className={`h-4 w-4 ${currentTheme.accent}`} />
                  <div className="flex flex-col">
                    <span className={`${currentTheme.text} text-sm font-medium`}>{activity.action}</span>
                    <span className={`${currentTheme.muted} text-xs`}>{activity.item}</span>
                  </div>
                </div>
                <div className="text-right">
                  {activity.price && (
                    <div className="text-green-400 text-sm font-semibold">{activity.price}</div>
                  )}
                  <div className={`${currentTheme.muted} text-xs`}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketStats;
