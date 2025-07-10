
import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Shield, Zap } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const StatsSection = () => {
  const { currentTheme } = useTheme();
  
  const stats = [
    { 
      icon: Users, 
      value: "100K+", 
      label: "Verified Traders",
      color: "text-emerald-400",
      gradient: "from-emerald-500/20 to-green-500/20"
    },
    { 
      icon: TrendingUp, 
      value: "$50M+", 
      label: "Total Volume",
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    { 
      icon: Shield, 
      value: "99.9%", 
      label: "Success Rate",
      color: "text-purple-400",
      gradient: "from-purple-500/20 to-indigo-500/20"
    },
    { 
      icon: Zap, 
      value: "<2min", 
      label: "Avg Delivery",
      color: "text-orange-400",
      gradient: "from-orange-500/20 to-red-500/20"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-5xl font-bold ${currentTheme.text} mb-6`}>
            Trusted by Thousands
          </h2>
          <p className={`text-xl ${currentTheme.muted} max-w-3xl mx-auto`}>
            Join the most active digital trading community with verified results
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className={`${currentTheme.cardBg} border ${currentTheme.border} p-8 text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer relative overflow-hidden`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <stat.icon className={`h-16 w-16 ${stat.color} mx-auto group-hover:scale-125 transition-transform duration-300`} />
                </div>
                
                <div className={`text-4xl font-black ${currentTheme.text} mb-3`}>
                  {stat.value}
                </div>
                
                <div className={`text-lg font-semibold ${stat.color} mb-2`}>
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
