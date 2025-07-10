
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import TestimonialSection from "@/components/TestimonialSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  const { currentTheme } = useTheme();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`min-h-screen ${currentTheme.bg} relative overflow-hidden`}>
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/5 via-purple-900/5 to-pink-900/5"></div>
        <div 
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        ></div>
        <div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * -0.3}px)` }}
        ></div>
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Final CTA */}
      <CTASection />
    </div>
  );
};

export default Index;
