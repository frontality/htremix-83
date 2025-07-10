
import React from 'react';
import { useTheme } from "@/contexts/ThemeContext";

interface GeometricSeparatorProps {
  variant?: "diagonal" | "wave" | "circuit" | "mesh";
}

const GeometricSeparator = ({ variant = "diagonal" }: GeometricSeparatorProps) => {
  const { currentTheme } = useTheme();

  if (variant === "diagonal") {
    return (
      <div className="relative h-32 overflow-hidden">
        <div 
          className={`absolute inset-0 bg-gradient-to-r ${currentTheme.gradient} opacity-10`}
          style={{ 
            clipPath: 'polygon(0 0, 100% 20%, 100% 100%, 0 80%)',
            transform: 'translateY(-10px)'
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-full h-px bg-gradient-to-r ${currentTheme.gradient} opacity-30`}></div>
        </div>
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div className="relative h-24 overflow-hidden">
        <svg
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="absolute bottom-0 w-full h-full"
        >
          <path
            d="M0,60 C300,100 900,20 1200,60 L1200,120 L0,120 Z"
            className={`fill-current opacity-20`}
            fill="url(#waveGradient)"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.2" />
              <stop offset="50%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (variant === "circuit") {
    return (
      <div className="relative h-20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-full h-px bg-gradient-to-r ${currentTheme.gradient} opacity-40`}></div>
          <div className="absolute flex space-x-12">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="relative">
                <div
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentTheme.gradient} animate-pulse`}
                  style={{ animationDelay: `${i * 0.3}s` }}
                ></div>
                <div
                  className={`absolute inset-0 w-2 h-2 rounded-full bg-gradient-to-r ${currentTheme.gradient} animate-ping opacity-50`}
                  style={{ animationDelay: `${i * 0.3}s` }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // mesh variant
  return (
    <div className="relative h-16 overflow-hidden">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)
        `
      }}></div>
    </div>
  );
};

export default GeometricSeparator;
