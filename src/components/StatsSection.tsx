
import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Shield, Zap } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const StatsSection = () => {
  const { currentTheme } = useTheme();
  
  const stats = [
    { 
      icon: Users, 
      value: "Elite", 
      label: "Community",
      color: "text-emerald-400",
      gradient: "from-emerald-500/20 to-green-500/20"
    },
    { 
      icon: TrendingUp, 
      value: "Premium", 
      label: "Experience",
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    { 
      icon: Shield, 
      value: "Secure", 
      label: "Platform",
      color: "text-purple-400",
      gradient: "from-purple-500/20 to-indigo-500/20"
    },
    { 
      icon: Zap, 
      value: "Instant", 
      label: "Delivery",
      color: "text-orange-400",
      gradient: "from-orange-500/20 to-red-500/20"
    }
  ];

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold ${currentTheme.text} mb-4`}>
            Trusted by Professionals
          </h2>
          <p className={`text-lg ${currentTheme.muted} max-w-2xl mx-auto`}>
            Join the most active digital trading community
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 text-center transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer relative overflow-hidden`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className="mb-4">
                  <stat.icon className={`h-12 w-12 ${stat.color} mx-auto group-hover:scale-125 transition-transform duration-300`} />
                </div>
                
                <div className={`text-2xl font-black ${currentTheme.text} mb-2`}>
                  {stat.value}
                </div>
                
                <div className={`text-base font-semibold ${stat.color}`}>
                  {stat.label}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
