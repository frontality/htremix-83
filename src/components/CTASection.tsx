
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const CTASection = () => {
  const { currentTheme } = useTheme();

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-16 text-center relative overflow-hidden max-w-5xl mx-auto`}>
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20"></div>
          <div className="absolute top-10 left-10 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-16 w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-16 left-1/4 w-2.5 h-2.5 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-10 right-10 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          
          <div className="relative z-10">
            <Star className={`h-20 w-20 ${currentTheme.accent} mx-auto mb-8 animate-bounce-subtle`} />
            
            <h2 className={`text-6xl font-black ${currentTheme.text} mb-8`}>
              Ready to Start Trading?
            </h2>
            
            <p className={`${currentTheme.muted} mb-12 text-2xl leading-relaxed max-w-3xl mx-auto`}>
              Join thousands of successful traders in the most secure and sophisticated digital marketplace. 
              Your journey to digital trading excellence starts now.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Link to="/signup">
                <Button className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-16 py-6 text-2xl font-black rounded-2xl hover:scale-110 shadow-2xl transition-all duration-300 group relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Sparkles className="mr-4 h-7 w-7 group-hover:rotate-180 transition-transform duration-500" />
                  Join Elite Traders
                  <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/marketplace">
                <Button variant="outline" className={`${currentTheme.text} border-3 ${currentTheme.border} hover:${currentTheme.cardBg} px-16 py-6 text-2xl font-black rounded-2xl hover:scale-110 transition-all duration-300 backdrop-blur-sm`}>
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;
