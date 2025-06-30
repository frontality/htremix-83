
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  name: string;
  bg: string;
  cardBg: string;
  headerBg: string;
  text: string;
  accent: string;
  primary: string;
  secondary: string;
  border: string;
  muted: string;
  gradient: string;
}

const themes: Record<string, Theme> = {
  volcano: {
    name: 'Volcano',
    bg: 'bg-gradient-to-br from-red-950 via-orange-950 to-black',
    cardBg: 'bg-red-900/20',
    headerBg: 'bg-red-950/80 backdrop-blur-md',
    text: 'text-red-100',
    accent: 'text-orange-400',
    primary: 'bg-red-600 hover:bg-red-700',
    secondary: 'bg-orange-800/30',
    border: 'border-red-800/30',
    muted: 'text-red-300',
    gradient: 'from-red-500 to-orange-500'
  },
  ocean: {
    name: 'Ocean',
    bg: 'bg-gradient-to-br from-blue-950 via-cyan-950 to-black',
    cardBg: 'bg-blue-900/20',
    headerBg: 'bg-blue-950/80 backdrop-blur-md',
    text: 'text-blue-100',
    accent: 'text-cyan-400',
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-cyan-800/30',
    border: 'border-blue-800/30',
    muted: 'text-blue-300',
    gradient: 'from-blue-500 to-cyan-500'
  },
  forest: {
    name: 'Forest',
    bg: 'bg-gradient-to-br from-green-950 via-emerald-950 to-black',
    cardBg: 'bg-green-900/20',
    headerBg: 'bg-green-950/80 backdrop-blur-md',
    text: 'text-green-100',
    accent: 'text-emerald-400',
    primary: 'bg-green-600 hover:bg-green-700',
    secondary: 'bg-emerald-800/30',
    border: 'border-green-800/30',
    muted: 'text-green-300',
    gradient: 'from-green-500 to-emerald-500'
  },
  galaxy: {
    name: 'Galaxy',
    bg: 'bg-gradient-to-br from-purple-950 via-pink-950 to-black',
    cardBg: 'bg-purple-900/20',
    headerBg: 'bg-purple-950/80 backdrop-blur-md',
    text: 'text-purple-100',
    accent: 'text-pink-400',
    primary: 'bg-purple-600 hover:bg-purple-700',
    secondary: 'bg-pink-800/30',
    border: 'border-purple-800/30',
    muted: 'text-purple-300',
    gradient: 'from-purple-500 to-pink-500'
  },
  dark: {
    name: 'Dark',
    bg: 'bg-black',
    cardBg: 'bg-gray-900/50',
    headerBg: 'bg-black/80 backdrop-blur-md',
    text: 'text-white',
    accent: 'text-gray-300',
    primary: 'bg-gray-700 hover:bg-gray-600',
    secondary: 'bg-gray-800/30',
    border: 'border-gray-700/30',
    muted: 'text-gray-400',
    gradient: 'from-gray-500 to-gray-700'
  }
};

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeName: string) => void;
  availableThemes: Record<string, Theme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentThemeName, setCurrentThemeName] = useState<string>('volcano');

  useEffect(() => {
    const savedTheme = localStorage.getItem('skid-haven-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentThemeName(savedTheme);
    }
  }, []);

  const setTheme = (themeName: string) => {
    if (themes[themeName]) {
      setCurrentThemeName(themeName);
      localStorage.setItem('skid-haven-theme', themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme: themes[currentThemeName],
      setTheme,
      availableThemes: themes
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
