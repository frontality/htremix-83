
import { useState } from 'react';
import { Search, ShoppingBag, User, Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const HotTopicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-10">
      {/* Top banner */}
      <div className="bg-gradient-to-r from-hottopic-teal to-hottopic-purple border-b border-hottopic-teal/30 backdrop-blur-md">
        <div className="container mx-auto">
          <div className="text-white text-center py-1.5 px-4 text-sm flex items-center justify-center">
            <Zap className="h-4 w-4 text-hottopic-teal mr-2 animate-pulse" />
            <p className="font-medium glow-text">LIMITED TIME! Buy Gift Cards at 50% OFF! <span className="bg-hottopic-teal/20 rounded px-1.5 ml-1">EXCLUSIVE ONLINE OFFER!</span></p>
          </div>
        </div>
      </div>
      
      {/* Main header */}
      <div className="bg-black/80 backdrop-blur-md border-b border-hottopic-teal/20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center py-4 px-4">
            {/* Mobile menu button */}
            <button 
              className="lg:hidden text-white p-2" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} className="text-hottopic-teal" /> : <Menu size={24} />}
            </button>
            
            {/* Logo */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <a href="/" className="inline-block relative group">
                <h1 className="text-2xl font-bold tracking-widest text-white red-glow-text group-hover:text-hottopic-teal group-hover:glow-text transition-colors duration-300">
                  HOT TOPIC
                </h1>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-hottopic-teal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>
            </div>
            
            {/* Desktop navigation - hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
              <NavLink href="#" label="NEW" />
              <NavLink href="#" label="GIFTS" isActive />
              <NavLink href="#" label="APPAREL" />
              <NavLink href="#" label="ACCESSORIES" />
              <NavLink href="#" label="COLLECTIBLES" />
              <NavLink href="#" label="SALE" highlight />
            </nav>
            
            {/* Header actions */}
            <div className="flex items-center space-x-5 text-white">
              <button className="hidden md:block hover:text-hottopic-teal transition-colors duration-200" aria-label="Search">
                <Search size={20} />
              </button>
              <button className="hidden md:block hover:text-hottopic-teal transition-colors duration-200" aria-label="Account">
                <User size={20} />
              </button>
              <button className="relative hover:text-hottopic-teal transition-colors duration-200 group" aria-label="Cart">
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 bg-hottopic-teal text-white text-xs rounded-full w-4 h-4 flex items-center justify-center group-hover:shadow-teal-glow transition-shadow duration-300">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card/95 backdrop-blur-md border-b border-hottopic-teal/20">
          <nav className="container py-4 px-6 flex flex-col space-y-3">
            <MobileNavLink href="#" label="NEW" />
            <MobileNavLink href="#" label="GIFTS" isActive />
            <MobileNavLink href="#" label="APPAREL" />
            <MobileNavLink href="#" label="ACCESSORIES" />
            <MobileNavLink href="#" label="COLLECTIBLES" />
            <MobileNavLink href="#" label="SALE" highlight />
          </nav>
        </div>
      )}
    </header>
  );
};

// Desktop navigation link
const NavLink = ({ 
  href, 
  label, 
  isActive = false, 
  highlight = false 
}: { 
  href: string; 
  label: string; 
  isActive?: boolean; 
  highlight?: boolean;
}) => {
  const baseClasses = "font-bold text-sm tracking-wider relative group";
  
  const textClasses = `${
    isActive ? "text-hottopic-teal glow-text" : "text-white"
  } ${highlight ? "text-hottopic-pink" : ""}`;
  
  return (
    <a href={href} className={`${baseClasses} ${textClasses}`}>
      {label}
      <span className={`absolute -bottom-1 left-0 w-full h-0.5 ${isActive ? 'bg-hottopic-teal scale-x-100' : 'bg-hottopic-teal scale-x-0 group-hover:scale-x-100'} transition-transform duration-300 origin-left`}></span>
    </a>
  );
};

// Mobile navigation link
const MobileNavLink = ({ 
  href, 
  label, 
  isActive = false, 
  highlight = false 
}: { 
  href: string; 
  label: string; 
  isActive?: boolean; 
  highlight?: boolean;
}) => {
  const classes = `font-bold text-sm tracking-wider py-2 relative ${
    isActive ? "text-hottopic-teal glow-text" : "text-white"
  } ${highlight ? "text-hottopic-pink" : ""}`;
  
  return (
    <a href={href} className={classes}>
      <span className="flex items-center">
        {isActive && <span className="w-1 h-4 bg-hottopic-teal rounded-full mr-2"></span>}
        {label}
      </span>
    </a>
  );
};

export default HotTopicHeader;
