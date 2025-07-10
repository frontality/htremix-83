
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag, Activity } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MarketStats = () => {
  const { currentTheme } = useTheme();

  const statCards = [
    {
      title: "Market Activity",
      value: "Active",
      icon: DollarSign,
      color: "text-green-400"
    },
    {
      title: "Community",
      value: "Growing",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Digital Items",
      value: "Available",
      icon: ShoppingBag,
      color: "text-purple-400"
    },
    {
      title: "Platform Status",
      value: "Online",
      icon: Activity,
      color: "text-orange-400"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className={`${currentTheme.text} text-lg font-bold mb-4 flex items-center gap-2 hover:scale-105 transition-transform duration-300`}>
        <Activity className="h-5 w-5 animate-pulse" />
        Marketplace Overview
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className={`${currentTheme.cardBg} border ${currentTheme.border} hover:scale-105 transition-all duration-300 hover:shadow-xl group animate-fade-in`} style={{animationDelay: `${index * 100}ms`}}>
            <CardHeader className="pb-2">
              <CardTitle className={`${currentTheme.text} text-sm font-medium flex items-center justify-between transition-colors duration-200`}>
                <span>{stat.title}</span>
                <stat.icon className={`h-4 w-4 ${stat.color} group-hover:scale-110 transition-transform duration-300 group-hover:animate-pulse`} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className={`text-xl font-bold ${currentTheme.text} transition-all duration-300 group-hover:scale-105`}>
                  {stat.value}
                </div>
                <div className={`flex items-center text-sm transition-all duration-300 ${stat.color}`}>
                  <TrendingUp className="h-3 w-3 mr-1 animate-pulse" />
                  Active
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MarketStats;
