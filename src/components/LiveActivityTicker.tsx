
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Zap, DollarSign } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const LiveActivityTicker = () => {
  const { currentTheme } = useTheme();
  const [currentActivity, setCurrentActivity] = useState(0);
  
  const activities = [
    { icon: DollarSign, text: "💰 CyberNinja just sold Valorant Phantom for $45", color: "text-green-400" },
    { icon: TrendingUp, text: "🔥 SkidMaster completed 50th successful trade", color: "text-orange-400" },
    { icon: Zap, text: "⚡ New Discord Nitro codes available in marketplace", color: "text-purple-400" },
    { icon: Users, text: "🎮 Gaming section trending - 127 active traders", color: "text-blue-400" },
    { icon: DollarSign, text: "💎 Rare CS2 knife sold for $1,200 - verified trade", color: "text-cyan-400" },
    { icon: TrendingUp, text: "🚀 TradeGod reached Elite status with 500+ trades", color: "text-pink-400" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-4 overflow-hidden">
      <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-4`}>
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <span className={`text-sm font-semibold ${currentTheme.text}`}>LIVE</span>
          </div>
          
          <div className="flex-1 text-center">
            <div className="animate-fade-in key={currentActivity}">
              <span className={`text-sm md:text-base ${activities[currentActivity].color} font-medium`}>
                {activities[currentActivity].text}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-green-400" />
              <span className={currentTheme.muted}>1,337 online</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LiveActivityTicker;
