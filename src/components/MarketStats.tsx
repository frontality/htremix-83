
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag, Activity } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MarketStats = () => {
  const { currentTheme } = useTheme();
  const [animatedStats, setAnimatedStats] = useState({
    totalValue: 0,
    activeUsers: 0,
    totalListings: 0,
    todaysSales: 0
  });

  // Simple demo stats that don't rely on database
  const demoStats = {
    totalValue: 125000,
    activeUsers: 1250,
    totalListings: 850,
    todaysSales: 45
  };

  // Animate numbers counting up on mount
  useEffect(() => {
    const animate = () => {
      const duration = 2000;
      const startTime = Date.now();
      
      const updateStats = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setAnimatedStats({
          totalValue: Math.floor(progress * demoStats.totalValue),
          activeUsers: Math.floor(progress * demoStats.activeUsers),
          totalListings: Math.floor(progress * demoStats.totalListings),
          todaysSales: Math.floor(progress * demoStats.todaysSales)
        });
        
        if (progress < 1) {
          requestAnimationFrame(updateStats);
        }
      };
      
      requestAnimationFrame(updateStats);
    };
    
    animate();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const statCards = [
    {
      title: "Market Value",
      value: `$${formatNumber(animatedStats.totalValue)}`,
      icon: DollarSign,
      change: 8.5,
      color: "text-green-400"
    },
    {
      title: "Active Traders",
      value: formatNumber(animatedStats.activeUsers),
      icon: Users,
      change: 4.8,
      color: "text-blue-400"
    },
    {
      title: "Digital Items",
      value: formatNumber(animatedStats.totalListings),
      icon: ShoppingBag,
      change: 2.7,
      color: "text-purple-400"
    },
    {
      title: "Today's Sales",
      value: formatNumber(animatedStats.todaysSales),
      icon: Activity,
      change: 12.3,
      color: "text-orange-400"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className={`${currentTheme.text} text-xl font-bold mb-4 flex items-center gap-2 hover:scale-105 transition-transform duration-300`}>
        <Activity className="h-5 w-5 animate-pulse" />
        Marketplace Overview
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const isPositive = stat.change >= 0;
          return (
            <Card key={index} className={`${currentTheme.cardBg} border ${currentTheme.border} hover:scale-105 transition-all duration-300 hover:shadow-xl group animate-fade-in`} style={{animationDelay: `${index * 100}ms`}}>
              <CardHeader className="pb-2">
                <CardTitle className={`${currentTheme.text} text-sm font-medium flex items-center justify-between transition-colors duration-200`}>
                  <span>{stat.title}</span>
                  <stat.icon className={`h-4 w-4 ${stat.color} group-hover:scale-110 transition-transform duration-300 group-hover:animate-pulse`} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className={`text-2xl font-bold ${currentTheme.text} transition-all duration-300 group-hover:scale-105`}>
                    {stat.value}
                  </div>
                  <div className={`flex items-center text-sm transition-all duration-300 ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 mr-1 animate-pulse" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1 animate-pulse" />
                    )}
                    {Math.abs(stat.change).toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MarketStats;
