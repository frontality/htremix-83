
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Sparkles, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const CTASection = () => {
  const { currentTheme } = useTheme();

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-6">
        <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-8 text-center relative overflow-hidden max-w-4xl mx-auto`}>
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20"></div>
          <div className="absolute top-8 left-8 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute top-16 right-12 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-12 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-8 right-8 w-1 h-1 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          
          <div className="relative z-10">
            <Star className={`h-16 w-16 ${currentTheme.accent} mx-auto mb-6 animate-bounce-subtle`} />
            
            <h2 className={`text-4xl font-black ${currentTheme.text} mb-6`}>
              Ready to Start Trading?
            </h2>
            
            <p className={`${currentTheme.muted} mb-8 text-lg leading-relaxed max-w-2xl mx-auto`}>
              Join the most secure and sophisticated digital marketplace. 
              Your journey to digital trading excellence starts now.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/signup">
                <Button className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-8 py-3 text-lg font-black rounded-xl hover:scale-110 shadow-xl transition-all duration-300 group relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Sparkles className="mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                  Join Elite Traders
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/marketplace">
                <Button variant="outline" className={`${currentTheme.text} border-2 ${currentTheme.border} hover:${currentTheme.cardBg} px-8 py-3 text-lg font-black rounded-xl hover:scale-110 transition-all duration-300 backdrop-blur-sm`}>
                  Browse Marketplace
                </Button>
              </Link>
            </div>

            {/* Discord Community Link */}
            <div className="mt-6">
              <a 
                href="https://discord.gg/your-server" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 ${currentTheme.muted} hover:${currentTheme.text} transition-colors duration-300 group`}
              >
                <MessageSquare className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span>Join our Discord for exclusive updates</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;
