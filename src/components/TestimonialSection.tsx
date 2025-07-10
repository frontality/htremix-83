
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const TestimonialSection = () => {
  const { currentTheme } = useTheme();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Pro Trader",
      content: "SKID × HAVEN transformed my trading experience. The security and speed are unmatched.",
      rating: 5,
      avatar: "AC"
    },
    {
      name: "Sarah Johnson",
      role: "Digital Collector",
      content: "Found rare items I couldn't get anywhere else. The community is incredibly professional.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Mike Rodriguez",
      role: "Gaming Enthusiast",
      content: "Best marketplace for gaming accounts. Instant delivery and top-notch customer service.",
      rating: 5,
      avatar: "MR"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-5xl font-bold ${currentTheme.text} mb-6`}>
            What Our Traders Say
          </h2>
          <p className={`text-xl ${currentTheme.muted} max-w-3xl mx-auto`}>
            Real feedback from our verified community members
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-12 text-center relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
            
            <div className="relative z-10">
              <Quote className={`h-16 w-16 ${currentTheme.accent} mx-auto mb-8 opacity-50`} />
              
              <div className="mb-8">
                <p className={`text-2xl ${currentTheme.text} mb-6 leading-relaxed italic`}>
                  "{testimonials[activeTestimonial].content}"
                </p>
                
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <div className={`w-16 h-16 ${currentTheme.cardBg} border-2 ${currentTheme.border} rounded-full flex items-center justify-center font-bold text-xl`}>
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div className="text-left">
                  <div className={`font-bold text-lg ${currentTheme.text}`}>
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className={currentTheme.muted}>
                    {testimonials[activeTestimonial].role}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Testimonial Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial 
                    ? `bg-gradient-to-r ${currentTheme.gradient}` 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
