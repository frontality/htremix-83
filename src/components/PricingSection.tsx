
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const PricingSection = () => {
  const { currentTheme } = useTheme();
  
  const plans = [
    {
      name: "Starter",
      price: "Free",
      icon: Zap,
      features: [
        "Basic marketplace access",
        "Standard security",
        "Community support",
        "5 transactions/month"
      ],
      color: "text-blue-400",
      popular: false
    },
    {
      name: "Pro",
      price: "$29/mo",
      icon: Crown,
      features: [
        "Premium marketplace access",
        "Priority support",
        "Advanced analytics",
        "Unlimited transactions",
        "VIP Discord access"
      ],
      color: "text-purple-400",
      popular: true
    },
    {
      name: "Elite",
      price: "$99/mo",
      icon: Star,
      features: [
        "All Pro features",
        "Exclusive deals",
        "Personal account manager",
        "Custom integrations",
        "API access"
      ],
      color: "text-orange-400",
      popular: false
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-5xl font-bold ${currentTheme.text} mb-6`}>
            Choose Your Plan
          </h2>
          <p className={`text-xl ${currentTheme.muted} max-w-3xl mx-auto`}>
            Flexible pricing for traders of all levels
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`${currentTheme.cardBg} border ${
                plan.popular ? 'border-purple-500 border-2' : currentTheme.border
              } p-8 text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden ${
                plan.popular ? 'transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </div>
                </div>
              )}
              
              <div className="mb-8">
                <plan.icon className={`h-16 w-16 ${plan.color} mx-auto mb-4`} />
                <h3 className={`text-2xl font-bold ${currentTheme.text} mb-2`}>
                  {plan.name}
                </h3>
                <div className={`text-4xl font-black ${plan.color} mb-4`}>
                  {plan.price}
                </div>
              </div>
              
              <div className="mb-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className={currentTheme.muted}>{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/signup">
                <Button 
                  className={`w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 ${
                    plan.popular 
                      ? `bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white hover:scale-105`
                      : `${currentTheme.text} border-2 ${currentTheme.border} hover:${currentTheme.cardBg}`
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
