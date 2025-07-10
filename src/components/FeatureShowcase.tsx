
import React from 'react';
import { Card } from "@/components/ui/card";
import { Shield, Zap, Users, Lock, Gamepad2, Coins, Trophy, Eye, Clock, Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const FeatureShowcase = () => {
  const { currentTheme } = useTheme();
  
  const features = [
    { 
      icon: Shield, 
      title: "Military-Grade Security", 
      description: "Advanced encryption and multi-layer protection",
      color: "text-emerald-400",
      gradient: "from-emerald-500/20 to-green-500/20"
    },
    { 
      icon: Zap, 
      title: "Instant Transactions", 
      description: "Lightning-fast processing with zero delays",
      color: "text-yellow-400",
      gradient: "from-yellow-500/20 to-orange-500/20"
    },
    { 
      icon: Users, 
      title: "Elite Community", 
      description: "Verified traders with proven track records",
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    { 
      icon: Lock, 
      title: "Privacy First", 
      description: "Your data protected with enterprise security",
      color: "text-purple-400",
      gradient: "from-purple-500/20 to-indigo-500/20"
    },
    { 
      icon: Gamepad2, 
      title: "Gaming Focused", 
      description: "Specialized platform for digital gaming assets",
      color: "text-pink-400",
      gradient: "from-pink-500/20 to-rose-500/20"
    },
    { 
      icon: Coins, 
      title: "Multi-Currency", 
      description: "Support for crypto and traditional payments",
      color: "text-orange-400",
      gradient: "from-orange-500/20 to-red-500/20"
    },
    { 
      icon: Trophy, 
      title: "Reputation System", 
      description: "Build trust through verified transactions",
      color: "text-cyan-400",
      gradient: "from-cyan-500/20 to-teal-500/20"
    },
    { 
      icon: Clock, 
      title: "24/7 Monitoring", 
      description: "Round-the-clock security and support",
      color: "text-red-400",
      gradient: "from-red-500/20 to-pink-500/20"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <Card 
          key={index}
          className={`${currentTheme.cardBg} border ${currentTheme.border} p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer relative overflow-hidden`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Background gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          
          <div className="relative z-10">
            <div className="mb-6">
              <div className="relative">
                <feature.icon className={`h-14 w-14 ${feature.color} group-hover:scale-110 transition-all duration-300`} />
                <div className={`absolute inset-0 ${feature.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`}></div>
              </div>
            </div>
            
            <h3 className={`text-xl font-bold ${currentTheme.text} mb-4 group-hover:${feature.color} transition-colors duration-300`}>
              {feature.title}
            </h3>
            
            <p className={`${currentTheme.muted} leading-relaxed group-hover:text-gray-300 transition-colors duration-300`}>
              {feature.description}
            </p>
          </div>
          
          {/* Subtle border glow on hover */}
          <div className={`absolute inset-0 rounded-lg border ${feature.color} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
        </Card>
      ))}
    </div>
  );
};

export default FeatureShowcase;
