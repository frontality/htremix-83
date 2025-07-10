
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Crown, Zap, Shield, Gamepad2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const DiscordCommunityShowcase = () => {
  const { currentTheme } = useTheme();
  const [floatingIcons, setFloatingIcons] = useState([]);
  
  useEffect(() => {
    const icons = [
      { icon: "🔥", delay: 0 },
      { icon: "💎", delay: 1000 },
      { icon: "⚡", delay: 2000 },
      { icon: "🎮", delay: 3000 },
      { icon: "💰", delay: 4000 },
    ];
    setFloatingIcons(icons);
  }, []);

  return (
    <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-12 text-center relative overflow-hidden`}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-indigo-500/10"></div>
      
      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <div
          key={index}
          className="absolute text-2xl animate-float opacity-20"
          style={{
            left: `${20 + index * 15}%`,
            top: `${10 + (index % 2) * 20}%`,
            animationDelay: `${item.delay}ms`,
            animationDuration: '3s'
          }}
        >
          {item.icon}
        </div>
      ))}
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <div className="relative">
            <MessageCircle className="h-16 w-16 text-[#5865F2] animate-bounce-subtle" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xs font-bold text-white">!</span>
            </div>
          </div>
          <div className="ml-4">
            <Crown className="h-12 w-12 text-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-4xl font-bold ${currentTheme.text} mb-4 animate-fade-in`}>
          🔥 Unlock the Secret Trader Lounge
        </h3>
        
        <p className={`${currentTheme.muted} mb-8 text-lg max-w-2xl mx-auto animate-fade-in`} style={{ animationDelay: '0.5s' }}>
          Join the most exclusive trading community. Where elite traders share secrets, 
          insider tips, and legendary deals that never hit the public market.
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className={`${currentTheme.secondary} rounded-xl p-4 hover:scale-105 transition-transform duration-300`}>
            <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="font-semibold text-sm">VIP Channels</div>
            <div className="text-xs opacity-75">Exclusive trader rooms</div>
          </div>
          <div className={`${currentTheme.secondary} rounded-xl p-4 hover:scale-105 transition-transform duration-300`}>
            <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="font-semibold text-sm">Early Access</div>
            <div className="text-xs opacity-75">First dibs on hot deals</div>
          </div>
          <div className={`${currentTheme.secondary} rounded-xl p-4 hover:scale-105 transition-transform duration-300`}>
            <Gamepad2 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="font-semibold text-sm">Game Nights</div>
            <div className="text-xs opacity-75">Community events & prizes</div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center space-x-8 mb-8 animate-fade-in" style={{ animationDelay: '1.5s' }}>
          <div className="text-center">
            <div className={`text-2xl font-bold ${currentTheme.text}`}>2,500+</div>
            <div className={`text-sm ${currentTheme.muted}`}>Elite Traders</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${currentTheme.text}`}>24/7</div>
            <div className={`text-sm ${currentTheme.muted}`}>Active Support</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${currentTheme.text}`}>$1M+</div>
            <div className={`text-sm ${currentTheme.muted}`}>Trades Monthly</div>
          </div>
        </div>

        {/* CTA Button */}
        <a 
          href="https://discord.gg/bY6TRDP4hV" 
          target="_blank" 
          rel="noopener noreferrer"
          className="animate-fade-in"
          style={{ animationDelay: '2s' }}
        >
          <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 px-8 text-lg rounded-xl transition-all duration-300 hover:scale-110 shadow-2xl group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <MessageCircle className="mr-3 h-6 w-6 group-hover:animate-bounce" />
            Join the Underground
            <Users className="ml-3 h-5 w-5 group-hover:animate-pulse" />
          </Button>
        </a>
      </div>
    </Card>
  );
};

export default DiscordCommunityShowcase;
