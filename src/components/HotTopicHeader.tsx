
import { useState } from 'react';
import { Search, ShoppingBag, User, Menu, X, Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const HotTopicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-0">
        {/* Top banner */}
        <div className="bg-hottopic-red text-white text-center py-2 px-4 text-xs font-futura font-bold">
          <p>FREE SHIPPING ON ORDERS $60+ | FREE RETURNS IN STORE | JOIN HOTTOPIC+ FOR FREE SHIPPING!</p>
        </div>
        
        {/* Middle banner */}
        <div className="bg-black text-white text-center py-1.5 px-4 text-xs flex justify-center items-center space-x-6 border-y border-hottopic-gray/20 font-helvetica">
          <a href="#" className="hover:underline">FIND A STORE</a>
          <a href="#" className="hover:underline">TRACK ORDER</a>
          <a href="#" className="hover:underline">HELP</a>
          <a href="#" className="hover:underline">HOTTOPIC+</a>
        </div>
        
        {/* Main header */}
        <div className="flex justify-between items-center py-3 px-4">
          {/* Mobile menu button */}
          <button 
            className="lg:hidden text-white p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <a href="/" className="inline-block">
              <img 
                src="https://i.imgur.com/XvAQJr0.png" 
                alt="Hot Topic"
                className="h-8" 
              />
            </a>
          </div>
          
          {/* Search bar - visible on desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input 
                type="search" 
                placeholder="Search..."
                className="w-full bg-white text-black px-3 py-1.5 rounded-sm font-helvetica text-sm"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Search size={16} />
              </button>
            </div>
          </div>
          
          {/* Header actions */}
          <div className="flex items-center space-x-4 text-white font-futura text-xs">
            <button className="hidden md:flex flex-col items-center hover:text-hottopic-red">
              <User size={20} />
              <span className="mt-1">Sign In</span>
            </button>
            <button className="hidden md:flex flex-col items-center hover:text-hottopic-red">
              <Heart size={20} />
              <span className="mt-1">Favorites</span>
            </button>
            <button className="flex flex-col items-center hover:text-hottopic-red">
              <div className="relative">
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 bg-hottopic-red text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </div>
              <span className="mt-1">Bag</span>
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="hidden lg:block bg-black text-white border-t border-hottopic-gray/20">
          <div className="container flex justify-center">
            <div className="flex items-center">
              <NavLink href="#" label="NEW" />
              <NavLink href="#" label="GIFTS" isActive hasDropdown />
              <NavLink href="#" label="APPAREL" hasDropdown />
              <NavLink href="#" label="ACCESSORIES" hasDropdown />
              <NavLink href="#" label="POP CULTURE" hasDropdown />
              <NavLink href="#" label="COLLECTIBLES" hasDropdown />
              <NavLink href="#" label="BEAUTY" hasDropdown />
              <NavLink href="#" label="HOME & TECH" hasDropdown />
              <NavLink href="#" label="SALE" highlight />
            </div>
          </div>
        </nav>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black border-t border-hottopic-gray">
          <div className="container pt-2 pb-4 px-4">
            {/* Mobile search */}
            <div className="relative mb-4">
              <input 
                type="search" 
                placeholder="Search..."
                className="w-full bg-white text-black px-3 py-1.5 rounded-sm font-helvetica text-sm"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Search size={16} />
              </button>
            </div>
            
            {/* Mobile navigation */}
            <nav className="flex flex-col space-y-4">
              <MobileNavLink href="#" label="NEW" />
              <MobileNavLink href="#" label="GIFTS" isActive />
              <MobileNavLink href="#" label="APPAREL" />
              <MobileNavLink href="#" label="ACCESSORIES" />
              <MobileNavLink href="#" label="POP CULTURE" />
              <MobileNavLink href="#" label="COLLECTIBLES" />
              <MobileNavLink href="#" label="BEAUTY" />
              <MobileNavLink href="#" label="HOME & TECH" />
              <MobileNavLink href="#" label="SALE" highlight />
            </nav>
            
            <div className="mt-6 pt-4 border-t border-hottopic-gray/30 flex flex-col space-y-3 font-futura">
              <a href="#" className="text-white hover:text-hottopic-red text-sm font-medium">Sign In / Create Account</a>
              <a href="#" className="text-white hover:text-hottopic-red text-sm font-medium">Find a Store</a>
              <a href="#" className="text-white hover:text-hottopic-red text-sm font-medium">Track Order</a>
              <a href="#" className="text-white hover:text-hottopic-red text-sm font-medium">Customer Service</a>
            </div>
          </div>
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
  highlight = false,
  hasDropdown = false
}: { 
  href: string; 
  label: string; 
  isActive?: boolean; 
  highlight?: boolean;
  hasDropdown?: boolean;
}) => {
  const classes = `font-futura font-bold text-sm py-3 px-5 hover:text-hottopic-red relative ${
    isActive ? "text-hottopic-red" : "text-white"
  } ${highlight ? "text-hottopic-red" : ""}`;
  
  return (
    <a href={href} className={classes}>
      <div className="flex items-center">
        {label}
        {hasDropdown && <ChevronDown size={14} className="ml-1" />}
      </div>
      {isActive && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-hottopic-red"></div>}
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
  const classes = `font-futura font-bold text-sm tracking-wider py-2 flex justify-between items-center ${
    isActive ? "text-hottopic-red" : "text-white"
  } ${highlight ? "text-hottopic-red" : ""}`;
  
  return (
    <a href={href} className={classes}>
      {label}
      <ChevronDown size={18} />
    </a>
  );
};

export default HotTopicHeader;
