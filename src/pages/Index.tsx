
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Star,
  Shield,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimations } from "@/hooks/useAnimations";
import EnhancedHero from "@/components/EnhancedHero";
import ActivityFeed from "@/components/ActivityFeed";
import FeatureShowcase from "@/components/FeatureShowcase";
import GeometricSeparator from "@/components/GeometricSeparator";
import CommunityHub from "@/components/CommunityHub";

const Index = () => {
  const { currentTheme } = useTheme();
  const { hoverClasses } = useAnimations();

  const metrics = [
    { 
      value: "50K+", 
      label: "Active Users", 
      icon: TrendingUp, 
      color: "text-emerald-400",
      description: "Verified traders worldwide"
    },
    { 
      value: "1M+", 
      label: "Transactions", 
      icon: CheckCircle, 
      color: "text-blue-400",
      description: "Completed successfully"
    },
    { 
      value: "99.9%", 
      label: "Security Rating", 
      icon: Shield, 
      color: "text-purple-400",
      description: "Military-grade protection"
    },
    { 
      value: "24/7", 
      label: "Support", 
      icon: MessageCircle, 
      color: "text-orange-400",
      description: "Always here for you"
    }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bg} relative overflow-hidden`}>
      {/* Enhanced Hero Section */}
      <EnhancedHero />

      {/* Activity Feed */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <ActivityFeed />
      </div>

      <GeometricSeparator variant="diagonal" />

      {/* Metrics Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${currentTheme.text} mb-6`}>
              Trusted by the Elite
            </h2>
            <p className={`text-xl ${currentTheme.muted} max-w-2xl mx-auto`}>
              Join thousands of verified traders in the most secure digital marketplace
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <Card 
                key={index} 
                className={`${currentTheme.cardBg} border ${currentTheme.border} p-8 text-center ${hoverClasses.scale} transition-all duration-500 hover:shadow-2xl group relative overflow-hidden`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="mb-6">
                    <metric.icon className={`h-12 w-12 ${metric.color} mx-auto group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <div className={`text-3xl font-bold ${currentTheme.text} mb-2`}>
                    {metric.value}
                  </div>
                  <div className={`text-lg font-semibold ${currentTheme.text} mb-2`}>
                    {metric.label}
                  </div>
                  <p className={`text-sm ${currentTheme.muted}`}>
                    {metric.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <GeometricSeparator variant="wave" />

      {/* Feature Showcase */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${currentTheme.text} mb-6`}>
              Advanced Trading Platform
            </h2>
            <p className={`text-xl ${currentTheme.muted} max-w-3xl mx-auto`}>
              Experience next-generation digital commerce with cutting-edge security and lightning-fast transactions
            </p>
          </div>
          
          <FeatureShowcase />
        </div>
      </section>

      <GeometricSeparator variant="circuit" />

      {/* Community Hub */}
      <section className="py-24">
        <CommunityHub />
      </section>

      <GeometricSeparator variant="mesh" />

      {/* Final CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-16 text-center relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-16 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-16 left-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
            
            <div className="max-w-4xl mx-auto relative z-10">
              <Star className={`h-16 w-16 ${currentTheme.accent} mx-auto mb-8`} />
              <h2 className={`text-5xl font-bold ${currentTheme.text} mb-8`}>
                Ready to Elevate Your Trading?
              </h2>
              <p className={`${currentTheme.muted} mb-12 text-xl leading-relaxed max-w-2xl mx-auto`}>
                Join the most sophisticated trading community where innovation meets security. 
                Your journey to digital commerce excellence starts here.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/signup">
                  <Button className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-12 py-4 text-xl font-semibold rounded-2xl hover:scale-105 shadow-2xl transition-all duration-300 group relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    Start Trading
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="outline" className={`${currentTheme.text} border-2 ${currentTheme.border} hover:${currentTheme.cardBg} px-12 py-4 text-xl font-semibold rounded-2xl hover:scale-105 transition-all duration-300`}>
                    Explore Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
