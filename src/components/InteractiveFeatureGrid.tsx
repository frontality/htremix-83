
import React from 'react';
import { Card } from "@/components/ui/card";
import { Shield, Zap, Users, Lock, Gamepad2, Coins, Trophy, Eye } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const InteractiveFeatureGrid = () => {
  const { currentTheme } = useTheme();
  
  const features = [
    { 
      icon: Shield, 
      title: "Military-Grade Security", 
      description: "Fort Knox wishes it was this secure",
      color: "text-green-400",
      glowColor: "hover:shadow-green-500/20",
      delay: "0ms"
    },
    { 
      icon: Zap, 
      title: "Lightning Delivery", 
      description: "Faster than your WiFi can handle",
      color: "text-yellow-400",
      glowColor: "hover:shadow-yellow-500/20",
      delay: "100ms"
    },
    { 
      icon: Users, 
      title: "Elite Community", 
      description: "Where legends are born and noobs learn",
      color: "text-blue-400",
      glowColor: "hover:shadow-blue-500/20",
      delay: "200ms"
    },
    { 
      icon: Lock, 
      title: "Privacy First", 
      description: "Your secrets are safer than Area 51",
      color: "text-purple-400",
      glowColor: "hover:shadow-purple-500/20",
      delay: "300ms"
    },
    { 
      icon: Gamepad2, 
      title: "Gaming Paradise", 
      description: "Every skin, every account, every dream",
      color: "text-pink-400",
      glowColor: "hover:shadow-pink-500/20",
      delay: "400ms"
    },
    { 
      icon: Coins, 
      title: "Crypto Ready", 
      description: "HODL while you trade like a boss",
      color: "text-orange-400",
      glowColor: "hover:shadow-orange-500/20",
      delay: "500ms"
    },
    { 
      icon: Trophy, 
      title: "Reputation System", 
      description: "Flex your trade score on the leaderboard",
      color: "text-cyan-400",
      glowColor: "hover:shadow-cyan-500/20",
      delay: "600ms"
    },
    { 
      icon: Eye, 
      title: "24/7 Monitoring", 
      description: "We never sleep so you can trade in peace",
      color: "text-red-400",
      glowColor: "hover:shadow-red-500/20",
      delay: "700ms"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <Card 
          key={index}
          className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 transition-all duration-500 hover:scale-105 ${feature.glowColor} hover:shadow-xl group cursor-pointer animate-fade-in`}
          style={{ animationDelay: feature.delay }}
        >
          <div className="text-center">
            <div className="relative mb-4">
              <feature.icon className={`h-12 w-12 ${feature.color} mx-auto group-hover:scale-110 transition-all duration-300 group-hover:animate-pulse`} />
              <div className={`absolute inset-0 ${feature.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`}></div>
            </div>
            <h4 className={`text-xl font-semibold ${currentTheme.text} mb-3 group-hover:text-glow transition-all duration-300`}>
              {feature.title}
            </h4>
            <p className={`text-sm ${currentTheme.muted} leading-relaxed group-hover:${currentTheme.text} transition-colors duration-300`}>
              {feature.description}
            </p>
          </div>
          
          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
        </Card>
      ))}
    </div>
  );
};

export default InteractiveFeatureGrid;
