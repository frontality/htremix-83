
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Zap, Star, Sparkles, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const HeroSection = () => {
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [typedText, setTypedText] = useState("");
  
  const heroText = "Gods of Underground";
  
  // Search functionality - maps keywords to routes
  const searchRoutes = {
    'marketplace': '/marketplace',
    'market': '/marketplace',
    'shop': '/marketplace',
    'buy': '/marketplace',
    'sell': '/sell',
    'selling': '/sell',
    'items': '/sell',
    'profile': '/profile',
    'account': '/profile',
    'settings': '/settings',
    'config': '/settings',
    'messages': '/messages',
    'chat': '/messages',
    'forum': '/forum',
    'discussion': '/forum',
    'crypto': '/crypto-exchange',
    'exchange': '/crypto-exchange',
    'bitcoin': '/crypto-exchange',
    'payment': '/payment',
    'pay': '/payment',
    'panel': '/panel',
    'admin': '/panel',
    'login': '/login',
    'signup': '/signup',
    'register': '/signup'
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const query = searchQuery.toLowerCase().trim();
    
    // Find matching route
    for (const [keyword, route] of Object.entries(searchRoutes)) {
      if (query.includes(keyword)) {
        navigate(route);
        return;
      }
    }
    
    // Default to marketplace if no specific match
    navigate('/marketplace');
  };
  
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
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="container mx-auto text-center max-w-6xl">
        {/* Logo Animation with Individual Character Glow */}
        <div className="mb-8 animate-fade-in">
          <div className="relative inline-block">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
              <span className="relative">
                {/* SKID with individual character glow */}
                {'SKID'.split('').map((char, index) => (
                  <span
                    key={index}
                    className={`inline-block bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.8))',
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
              <span className={`mx-4 ${currentTheme.text} opacity-50`}>×</span>
              <span className="relative">
                {/* HAVEN with individual character glow */}
                {'HAVEN'.split('').map((char, index) => (
                  <span
                    key={index}
                    className={`inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent`}
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(192, 132, 252, 0.8))',
                      animationDelay: `${(index + 4) * 0.1}s`
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </h1>
            
            {/* Animated Underline */}
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-float"></div>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        {/* Typed Tagline */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '1s' }}>
          <h2 className={`text-3xl md:text-5xl ${currentTheme.text} mb-6 font-light tracking-wide min-h-[3rem]`}>
            {typedText}
            <span className="animate-pulse text-cyan-400">|</span>
          </h2>
          <p className={`text-lg md:text-xl ${currentTheme.muted} mb-6 max-w-4xl mx-auto leading-relaxed`}>
            Your all-in-one hub for digital trading, secure transactions, and community connections. 
            From crypto exchanges to premium accounts - we've got everything you need.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-scale-in" style={{ animationDelay: '2s' }}>
          <Link to="/marketplace">
            <Button className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Star className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              Enter Marketplace
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </Link>
          
          <Link to="/sell">
            <Button variant="outline" className={`${currentTheme.text} border-2 ${currentTheme.border} hover:${currentTheme.cardBg} px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl group backdrop-blur-sm`}>
              <Zap className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Start Selling
            </Button>
          </Link>
        </div>

        {/* Discord Community Link */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '2.5s' }}>
          <a 
            href="https://discord.gg/bY6TRDP4hV" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 ${currentTheme.text} hover:${currentTheme.accent} transition-colors duration-300 group`}
          >
            <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-medium">Join our Discord Community</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>

        {/* Functional Search */}
        <div className="relative max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '3s' }}>
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.muted} group-hover:text-cyan-400 transition-colors z-10`} />
              <Input
                placeholder="Search pages: marketplace, sell, profile, messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-12 pr-4 py-4 text-lg ${currentTheme.cardBg} ${currentTheme.text} border-2 ${currentTheme.border} rounded-xl shadow-xl focus:ring-4 focus:ring-cyan-500/30 transition-all duration-300 backdrop-blur-lg`}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
