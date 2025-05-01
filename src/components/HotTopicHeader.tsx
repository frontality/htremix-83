
import { useState } from 'react';
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const HotTopicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black border-b border-hottopic-gray">
      <div className="container mx-auto">
        {/* Top banner */}
        <div className="bg-hottopic-red text-white text-center py-1 px-4 text-sm">
          <p className="font-medium">LIMITED TIME! Buy Gift Cards at 50% OFF! EXCLUSIVE ONLINE OFFER!</p>
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
              <h1 className="text-2xl font-bold tracking-widest text-white">
                HOT TOPIC
              </h1>
            </a>
          </div>
          
          {/* Desktop navigation - hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            <NavLink href="#" label="NEW" />
            <NavLink href="#" label="GIFTS" isActive />
            <NavLink href="#" label="APPAREL" />
            <NavLink href="#" label="ACCESSORIES" />
            <NavLink href="#" label="COLLECTIBLES" />
            <NavLink href="#" label="SALE" highlight />
          </nav>
          
          {/* Header actions */}
          <div className="flex items-center space-x-3 text-white">
            <button className="hidden md:block hover:text-hottopic-red" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="hidden md:block hover:text-hottopic-red" aria-label="Account">
              <User size={20} />
            </button>
            <button className="relative hover:text-hottopic-red" aria-label="Cart">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-hottopic-red text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-hottopic-dark border-t border-hottopic-gray">
          <nav className="container py-4 px-6 flex flex-col space-y-2">
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
  const classes = `font-bold text-sm tracking-wider hover:text-hottopic-red ${
    isActive ? "text-hottopic-red" : "text-white"
  } ${highlight ? "text-hottopic-red" : ""}`;
  
  return (
    <a href={href} className={classes}>
      {label}
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
  const classes = `font-bold text-sm tracking-wider py-2 ${
    isActive ? "text-hottopic-red" : "text-white"
  } ${highlight ? "text-hottopic-red" : ""}`;
  
  return (
    <a href={href} className={classes}>
      {label}
    </a>
  );
};

export default HotTopicHeader;
