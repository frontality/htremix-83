
import React from 'react';
import { useTheme } from "@/contexts/ThemeContext";

const VisualSeparator = ({ type = "wave" }: { type?: "wave" | "circuit" | "glitch" }) => {
  const { currentTheme } = useTheme();

  if (type === "wave") {
    return (
      <div className="relative h-20 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full"
        >
          <path
            d="M0,60 C150,100 350,20 600,60 C850,100 1050,20 1200,60 L1200,120 L0,120 Z"
            className={`fill-current ${currentTheme.cardBg} opacity-50`}
          />
        </svg>
      </div>
    );
  }

  if (type === "circuit") {
    return (
      <div className="relative h-16 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-full h-px bg-gradient-to-r ${currentTheme.gradient} opacity-50`}></div>
          <div className="absolute flex space-x-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentTheme.gradient} animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-12 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-r ${currentTheme.gradient} opacity-10 transform skew-y-2`}></div>
    </div>
  );
};

export default VisualSeparator;
