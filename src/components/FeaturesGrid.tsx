
import React from 'react';
import { Card } from "@/components/ui/card";
import { Shield, Zap, Users, Lock, Crown, Star, Globe, MessageCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const FeaturesGrid = () => {
  const { currentTheme } = useTheme();
  
  const features = [
    {
      icon: Shield,
      title: "Military-Grade Security",
      description: "Advanced encryption protecting every transaction",
      color: "text-emerald-400"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant delivery and processing",
      color: "text-yellow-400"
    },
    {
      icon: Crown,
      title: "VIP Treatment",
      description: "Premium support for all users",
      color: "text-purple-400"
    },
    {
      icon: Users,
      title: "Elite Community",
      description: "Connect with verified traders",
      color: "text-blue-400"
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data stays protected",
      color: "text-red-400"
    },
    {
      icon: Star,
      title: "5-Star Rated",
      description: "Highest customer satisfaction",
      color: "text-orange-400"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Available worldwide 24/7",
      color: "text-cyan-400"
    },
    {
      icon: MessageCircle,
      title: "Live Support",
      description: "Real-time assistance when needed",
      color: "text-pink-400"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-5xl font-bold ${currentTheme.text} mb-6`}>
            Why Choose SKID × HAVEN?
          </h2>
          <p className={`text-xl ${currentTheme.muted} max-w-3xl mx-auto`}>
            Experience the next generation of digital trading with features designed for professionals
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`${currentTheme.cardBg} border ${currentTheme.border} p-8 transition-all duration-500 hover:scale-110 hover:shadow-2xl group cursor-pointer relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <feature.icon className={`h-12 w-12 ${feature.color} group-hover:scale-125 transition-transform duration-300`} />
                </div>
                
                <h3 className={`text-xl font-bold ${currentTheme.text} mb-4`}>
                  {feature.title}
                </h3>
                
                <p className={`${currentTheme.muted} leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
