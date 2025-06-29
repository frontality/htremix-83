
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, Palette, MessageCircle, User, LogIn, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ThemeSelector from "@/components/ThemeSelector";
import { useTheme } from "@/contexts/ThemeContext";

const SkidHavenHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  return (
    <header className={`${currentTheme.headerBg} border-b ${currentTheme.border} sticky top-0 z-50`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/7f28697e-7fbb-4316-ba56-7074afdf6cc6.png" 
                alt="SkidHaven Logo" 
                className="h-10 w-10"
              />
              <div className="flex flex-col">
                <span className={`text-xl font-bold ${currentTheme.accent}`}>SkidHaven</span>
                <span className="text-xs text-gray-400">Buy & Sell Marketplace</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/marketplace" className={`${currentTheme.text} hover:${currentTheme.accent} transition-colors`}>
              Marketplace
            </Link>
            <Link to="/sell" className={`${currentTheme.text} hover:${currentTheme.accent} transition-colors`}>
              Sell Items
            </Link>
            <Link to="/crypto-exchange" className={`${currentTheme.text} hover:${currentTheme.accent} transition-colors`}>
              Crypto Exchange
            </Link>
            {isLoggedIn && (
              <>
                <Link to="/messages" className={`${currentTheme.text} hover:${currentTheme.accent} transition-colors flex items-center space-x-1`}>
                  <MessageCircle className="h-4 w-4" />
                  <span>Messages</span>
                </Link>
                <Link to="/profile" className={`${currentTheme.text} hover:${currentTheme.accent} transition-colors flex items-center space-x-1`}>
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className={`p-2 rounded-lg ${currentTheme.secondary} ${currentTheme.text} hover:opacity-80 transition-opacity relative`}
            >
              <Palette className="h-5 w-5" />
            </button>
            
            {showThemeSelector && (
              <div className="absolute top-16 right-4 z-50">
                <ThemeSelector onClose={() => setShowThemeSelector(false)} />
              </div>
            )}

            {!isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline"
                  className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button 
                  className={`${currentTheme.primary} text-white hover:opacity-90`}
                  onClick={() => navigate("/signup")}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </div>
            ) : (
              <Button className={`${currentTheme.primary} text-white hover:opacity-90`}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Shop Now
              </Button>
            )}

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className={`h-6 w-6 ${currentTheme.text}`} />
              ) : (
                <Menu className={`h-6 w-6 ${currentTheme.text}`} />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={`md:hidden ${currentTheme.cardBg} border-t ${currentTheme.border} py-4`}>
            <nav className="flex flex-col space-y-4">
              <Link to="/marketplace" className={`${currentTheme.text} hover:${currentTheme.accent}`}>Marketplace</Link>
              <Link to="/sell" className={`${currentTheme.text} hover:${currentTheme.accent}`}>Sell Items</Link>
              <Link to="/crypto-exchange" className={`${currentTheme.text} hover:${currentTheme.accent}`}>Crypto Exchange</Link>
              {isLoggedIn && (
                <>
                  <Link to="/messages" className={`${currentTheme.text} hover:${currentTheme.accent}`}>Messages</Link>
                  <Link to="/profile" className={`${currentTheme.text} hover:${currentTheme.accent}`}>Profile</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default SkidHavenHeader;
