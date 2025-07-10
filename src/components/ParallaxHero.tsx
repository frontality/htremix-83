
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const ParallaxHero = () => {
  const { currentTheme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [typedText, setTypedText] = useState("");
  
  const fullText = "Where Traders Thrive in the Digital Underground";
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);
    return () => clearInterval(typing);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-cyan-900/10 to-pink-900/10"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Animated Logo */}
        <div className="mb-12 animate-scale-in">
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight">
            <span className={`bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent animate-pulse-glow`}>
              SKID
            </span>
            <span className={`mx-3 ${currentTheme.text} animate-bounce-subtle`}>×</span>
            <span className={`bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent animate-pulse-glow`}>
              HAVEN
            </span>
          </h1>
          <div className={`w-32 h-1 bg-gradient-to-r ${currentTheme.gradient} mx-auto rounded-full mb-8 animate-pulse-glow`}></div>
        </div>

        {/* Typing Animation */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '1s' }}>
          <h2 className={`text-2xl md:text-4xl ${currentTheme.text} mb-6 font-light max-w-4xl mx-auto leading-relaxed min-h-[3rem]`}>
            <span className="text-glow">{typedText}</span>
            <span className="animate-pulse">|</span>
          </h2>
          <p className={`text-lg ${currentTheme.muted} mb-8 max-w-2xl mx-auto leading-relaxed`}>
            ⚡ The darknet of legit trades. Where speed, security, and loyalty matter.
          </p>
        </div>

        {/* Animated CTAs */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in" style={{ animationDelay: '2s' }}>
          <Link to="/marketplace">
            <Button className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-xl group relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <ShoppingBag className="mr-3 h-5 w-5 group-hover:animate-bounce" />
              Enter the Underground
              <Sparkles className="ml-2 h-4 w-4 group-hover:animate-spin" />
            </Button>
          </Link>
          <Link to="/sell">
            <Button variant="outline" className={`${currentTheme.text} border-2 ${currentTheme.border} hover:${currentTheme.cardBg} px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-xl group`}>
              <TrendingUp className="mr-3 h-5 w-5 group-hover:animate-pulse" />
              Start Trading
            </Button>
          </Link>
        </div>

        {/* Enhanced Search */}
        <div className="relative max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '2.5s' }}>
          <div className="relative group">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.muted} group-hover:text-cyan-400 transition-colors`} />
            <Input
              placeholder="Search the underground... try '/secret' 👀"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-12 py-4 text-lg ${currentTheme.cardBg} ${currentTheme.text} border ${currentTheme.border} rounded-xl shadow-lg focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 group-hover:shadow-cyan-500/20`}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxHero;
