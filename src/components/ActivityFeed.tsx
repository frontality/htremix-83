
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Zap, DollarSign, Shield, Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ActivityFeed = () => {
  const { currentTheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const activities = [
    { 
      icon: DollarSign, 
      text: "Premium Valorant Account sold for $245", 
      user: "CyberTrader",
      color: "text-emerald-400",
      time: "2m ago"
    },
    { 
      icon: Shield, 
      text: "Elite Seller status achieved", 
      user: "DigitalMaster",
      color: "text-blue-400",
      time: "5m ago"
    },
    { 
      icon: Star, 
      text: "Rare CS2 Knife Collection listed", 
      user: "SkinCollector",
      color: "text-purple-400",
      time: "8m ago"
    },
    { 
      icon: TrendingUp, 
      text: "Gaming category trending with 247 active traders", 
      user: "System",
      color: "text-orange-400",
      time: "12m ago"
    },
    { 
      icon: Zap, 
      text: "Lightning-fast delivery completed", 
      user: "SpeedRunner",
      color: "text-yellow-400",
      time: "15m ago"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const IconComponent = activities[currentIndex].icon;

  return (
    <Card className={`${currentTheme.cardBg} border ${currentTheme.border} backdrop-blur-sm shadow-2xl`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
            <span className={`text-sm font-semibold ${currentTheme.text} tracking-wide`}>
              LIVE ACTIVITY
            </span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <span className={currentTheme.muted}>2,337 online</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className={currentTheme.muted}>+15% today</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t border-gray-800 pt-4">
          <div className="transition-all duration-500 ease-in-out" key={currentIndex}>
            <div className="flex items-center space-x-4">
              <IconComponent className={`h-5 w-5 ${activities[currentIndex].color}`} />
              <div className="flex-1">
                <span className={`${currentTheme.text} font-medium`}>
                  {activities[currentIndex].user !== "System" && (
                    <span className={activities[currentIndex].color}>
                      {activities[currentIndex].user}
                    </span>
                  )}
                  {activities[currentIndex].user !== "System" && " "}
                  {activities[currentIndex].text}
                </span>
                <span className={`ml-3 text-sm ${currentTheme.muted}`}>
                  {activities[currentIndex].time}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivityFeed;
