
import React from "react";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import EnhancedMarketplace from "@/components/EnhancedMarketplace";
import { useTheme } from "@/contexts/ThemeContext";

const Marketplace = () => {
  const { currentTheme } = useTheme();

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      <div className="container mx-auto px-4 py-8">
        <EnhancedMarketplace />
      </div>
      <SkidHavenFooter />
    </div>
  );
};

export default Marketplace;
