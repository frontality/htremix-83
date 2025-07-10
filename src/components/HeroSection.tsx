
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Zap, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const HeroSection = () => {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [typedText, setTypedText] = useState("");
  
  const heroText = "Elite Digital Marketplace";
  
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i <= heroText.length) {
        setTypedText(heroText.slice(0, i));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 150);
    return () => clearInterval(typing);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4">
      <div className="container mx-auto text-center max-w-6xl">
        {/* Logo Animation */}
        <div className="mb-12 animate-fade-in">
          <div className="relative inline-block">
            <h1 className="text-8xl md:text-9xl font-black tracking-tighter mb-8">
              <span className="relative">
                <span className={`bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent animate-pulse-glow`}>
                  SKID
                </span>
              </span>
              <span className={`mx-6 ${currentTheme.text} opacity-50`}>×</span>
              <span className="relative">
                <span className={`bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-pulse-glow`}>
                  HAVEN
                </span>
              </span>
            </h1>
            
            {/* Animated Underline */}
            <div className="flex justify-center space-x-4 mb-8">
              <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-float"></div>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        {/* Typed Tagline */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '1s' }}>
          <h2 className={`text-4xl md:text-6xl ${currentTheme.text} mb-8 font-light tracking-wide min-h-[4rem]`}>
            {typedText}
            <span className="animate-pulse text-cyan-400">|</span>
          </h2>
          <p className={`text-xl md:text-2xl ${currentTheme.muted} mb-8 max-w-4xl mx-auto leading-relaxed`}>
            Where premium digital assets meet uncompromising security. 
            Trade with confidence in the most sophisticated marketplace.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-scale-in" style={{ animationDelay: '2s' }}>
          <Link to="/marketplace">
            <Button className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-12 py-6 text-xl font-bold rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-2xl group relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Star className="mr-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
              Enter Marketplace
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </Link>
          
          <Link to="/sell">
            <Button variant="outline" className={`${currentTheme.text} border-2 ${currentTheme.border} hover:${currentTheme.cardBg} px-12 py-6 text-xl font-bold rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl group backdrop-blur-sm`}>
              <Zap className="mr-3 h-6 w-6 group-hover:animate-bounce" />
              Start Selling
            </Button>
          </Link>
        </div>

        {/* Premium Search */}
        <div className="relative max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '2.5s' }}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <Search className={`absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 ${currentTheme.muted} group-hover:text-cyan-400 transition-colors z-10`} />
              <Input
                placeholder="Search premium accounts, rare items, exclusive content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-16 pr-6 py-6 text-lg ${currentTheme.cardBg} ${currentTheme.text} border-2 ${currentTheme.border} rounded-2xl shadow-2xl focus:ring-4 focus:ring-cyan-500/30 transition-all duration-300 backdrop-blur-lg`}
              />
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                <span className={`text-sm ${currentTheme.muted} font-medium`}>AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
