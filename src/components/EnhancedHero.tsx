
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag, TrendingUp, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const EnhancedHero = () => {
  const { currentTheme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsTyping(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Sophisticated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-gray-900 to-black"></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Geometric Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, ${currentTheme.border} 1px, transparent 1px),
              linear-gradient(${currentTheme.border} 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Sophisticated Logo */}
        <div className="mb-16">
          <div className="relative inline-block">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6">
              <span className="relative">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                  SKID
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              </span>
              <span className="mx-4 text-gray-600">×</span>
              <span className="relative">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                  HAVEN
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              </span>
            </h1>
            
            {/* Subtle underline */}
            <div className="flex justify-center space-x-2 mb-8">
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="mb-12">
          <h2 className={`text-3xl md:text-5xl ${currentTheme.text} mb-6 font-light max-w-5xl mx-auto leading-tight`}>
            The Future of Digital Commerce
            {isTyping && <span className="animate-pulse ml-2 text-cyan-400">|</span>}
          </h2>
          <p className={`text-xl ${currentTheme.muted} mb-8 max-w-3xl mx-auto leading-relaxed`}>
            Where innovation meets security in the most advanced trading ecosystem. 
            Experience seamless transactions with military-grade protection.
          </p>
        </div>

        {/* Enhanced CTAs */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link to="/marketplace">
            <Button className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-10 py-5 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-xl group relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <ShoppingBag className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
              Explore Marketplace
              <Sparkles className="ml-2 h-4 w-4 group-hover:animate-spin" />
            </Button>
          </Link>
          <Link to="/sell">
            <Button variant="outline" className={`${currentTheme.text} border-2 ${currentTheme.border} hover:${currentTheme.cardBg} px-10 py-5 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl group backdrop-blur-sm`}>
              <TrendingUp className="mr-3 h-5 w-5 group-hover:translate-y-[-2px] transition-transform duration-200" />
              Start Selling
            </Button>
          </Link>
        </div>

        {/* Advanced Search */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.muted} group-hover:text-cyan-400 transition-colors`} />
              <Input
                placeholder="Search premium digital assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-12 py-4 text-lg ${currentTheme.cardBg} ${currentTheme.text} border ${currentTheme.border} rounded-xl shadow-lg focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 backdrop-blur-sm`}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Zap className="h-4 w-4 text-yellow-400 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHero;
