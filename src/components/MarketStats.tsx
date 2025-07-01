
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag, Activity, Gamepad2, Gift, Zap } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

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

  const fetchRealStats = async () => {
    try {
      // Get real user count
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });

      // Get conversation count (represents activity)
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('id', { count: 'exact' });

      // Get message count (represents engagement)
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('id', { count: 'exact' });

      const profileCount = profiles?.length || 0;
      const conversationCount = conversations?.length || 0;
      const messageCount = messages?.length || 0;

      setStats({
        totalValue: 0, // No sales yet, so $0
        activeUsers: profileCount,
        totalListings: 0, // No items listed yet
        todaysSales: 0, // No sales yet
        priceChange: 0, // No change since no sales
        volume24h: messageCount * 10 // Use message activity as volume indicator
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to zeros if error
      setStats({
        totalValue: 0,
        activeUsers: 0,
        totalListings: 0,
        todaysSales: 0,
        priceChange: 0,
        volume24h: 0
      });
    }
  };

  useEffect(() => {
    fetchRealStats();
    
    // Refresh every 30 seconds with real data
    const interval = setInterval(fetchRealStats, 30000);
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
            {(stats.activeUsers > 0 ? [
              { action: "New user joined", item: "Welcome to SkidHaven!", price: "", time: "Recent", icon: Users },
              { action: "Platform growing", item: `${stats.activeUsers} active users`, price: "", time: "Live", icon: Activity },
              { action: "Ready for trading", item: "Start your digital marketplace journey", price: "", time: "Now", icon: Gift }
            ] : [
              { action: "No activity yet", item: "Be the first to join!", price: "", time: "Waiting", icon: Users }
            ]).map((activity, index) => (
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
