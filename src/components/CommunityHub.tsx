
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Crown, Zap, Shield, Gamepad2, ExternalLink } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const CommunityHub = () => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  
  const benefits = [
    {
      icon: Crown,
      title: "VIP Access",
      description: "Exclusive channels and early access to premium listings"
    },
    {
      icon: Shield,
      title: "Verified Trades",
      description: "Direct access to our most trusted sellers"
    },
    {
      icon: Zap,
      title: "Instant Support",
      description: "Priority customer service and technical assistance"
    },
    {
      icon: Gamepad2,
      title: "Gaming Events",
      description: "Community tournaments and exclusive giveaways"
    }
  ];

  const stats = [
    { label: "Active Members", value: "15,000+", color: "text-emerald-400" },
    { label: "Daily Messages", value: "50,000+", color: "text-blue-400" },
    { label: "Expert Traders", value: "2,500+", color: "text-purple-400" },
    { label: "Success Rate", value: "99.8%", color: "text-orange-400" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % benefits.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4">
      <Card className={`${currentTheme.cardBg} border ${currentTheme.border} relative overflow-hidden`}>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-12">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              <MessageCircle className="h-16 w-16 text-[#5865F2] mr-4" />
              <Crown className="h-12 w-12 text-yellow-400" />
            </div>
            
            <h2 className={`text-4xl font-bold ${currentTheme.text} mb-6`}>
              Join the Elite Trading Community
            </h2>
            
            <p className={`text-xl ${currentTheme.muted} max-w-3xl mx-auto mb-8`}>
              Connect with verified traders, access exclusive deals, and be part of the most sophisticated digital marketplace community.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${currentTheme.muted}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Benefits Showcase */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  index === activeTab 
                    ? `${currentTheme.border} bg-gradient-to-br from-white/5 to-white/10` 
                    : `border-gray-800/50 hover:${currentTheme.border}`
                }`}
              >
                <benefit.icon className={`h-8 w-8 text-blue-400 mb-4 ${
                  index === activeTab ? 'animate-pulse' : ''
                }`} />
                <h4 className={`font-semibold ${currentTheme.text} mb-2`}>
                  {benefit.title}
                </h4>
                <p className={`text-sm ${currentTheme.muted}`}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a 
              href="https://discord.gg/bY6TRDP4hV" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 px-12 text-xl rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <MessageCircle className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                Join Community
                <ExternalLink className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CommunityHub;
