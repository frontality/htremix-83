
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimations } from "@/hooks/useAnimations";
import ParallaxHero from "@/components/ParallaxHero";
import LiveActivityTicker from "@/components/LiveActivityTicker";
import InteractiveFeatureGrid from "@/components/InteractiveFeatureGrid";
import VisualSeparator from "@/components/VisualSeparator";
import DiscordCommunityShowcase from "@/components/DiscordCommunityShowcase";

const Index = () => {
  const { currentTheme } = useTheme();
  const { hoverClasses } = useAnimations();

  const stats = [
    { number: "50K+", label: "Active Traders", icon: TrendingUp, color: "text-green-400" },
    { number: "1M+", label: "Successful Trades", icon: CheckCircle, color: "text-blue-400" },
    { number: "99.9%", label: "Uptime", icon: CheckCircle, color: "text-purple-400" },
    { number: "24/7", label: "Elite Support", icon: MessageCircle, color: "text-orange-400" }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bg} relative overflow-hidden`}>
      {/* Hero Section with Parallax */}
      <ParallaxHero />

      {/* Live Activity Ticker */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <LiveActivityTicker />
      </div>

      <VisualSeparator type="wave" />

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className={`text-3xl font-bold ${currentTheme.text} mb-4 animate-fade-in`}>
            The Numbers Don't Lie 📊
          </h3>
          <p className={`text-lg ${currentTheme.muted} animate-fade-in`} style={{ animationDelay: '0.3s' }}>
            Join the fastest-growing underground trading community
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 text-center ${hoverClasses.scale} transition-all duration-300 hover:shadow-xl group animate-fade-in`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-4 group-hover:animate-bounce`} />
              <div className={`text-3xl font-bold ${currentTheme.text} mb-2 group-hover:text-glow transition-all duration-300`}>
                {stat.number}
              </div>
              <p className={`text-sm ${currentTheme.muted} uppercase tracking-wider group-hover:${currentTheme.text} transition-colors duration-300`}>
                {stat.label}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <VisualSeparator type="circuit" />

      {/* Interactive Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h3 className={`text-4xl font-bold ${currentTheme.text} mb-4 animate-fade-in`}>
            Why We're the Underground Kings 👑
          </h3>
          <p className={`text-lg ${currentTheme.muted} max-w-2xl mx-auto animate-fade-in`} style={{ animationDelay: '0.3s' }}>
            Built different, trade different. Here's what makes us legendary.
          </p>
        </div>
        
        <InteractiveFeatureGrid />
      </div>

      <VisualSeparator type="glitch" />

      {/* Discord Community Section */}
      <div className="container mx-auto px-4 py-16">
        <DiscordCommunityShowcase />
      </div>

      <VisualSeparator type="wave" />

      {/* Final CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-16 text-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <Star className={`h-12 w-12 ${currentTheme.accent} mx-auto mb-6 animate-pulse-glow`} />
            <h3 className={`text-4xl font-bold ${currentTheme.text} mb-6 animate-fade-in`}>
              Ready to Join the Elite? 🚀
            </h3>
            <p className={`${currentTheme.muted} mb-10 text-xl leading-relaxed animate-fade-in`} style={{ animationDelay: '0.5s' }}>
              Your journey to trading greatness starts with a single click. 
              Join thousands of legendary traders who've already unlocked their potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in" style={{ animationDelay: '1s' }}>
              <Link to="/signup">
                <Button className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-10 py-4 text-xl font-semibold rounded-xl hover:scale-110 shadow-2xl transition-all duration-300 group relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  Become a Legend
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:animate-bounce" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" className={`${currentTheme.text} border-2 ${currentTheme.border} hover:${currentTheme.cardBg} px-10 py-4 text-xl font-semibold rounded-xl hover:scale-110 transition-all duration-300 group`}>
                  Browse the Underground
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
