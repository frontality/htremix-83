
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, Palette, MessageCircle, User, LogIn, UserPlus, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ThemeSelector from "@/components/ThemeSelector";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const SkidHavenHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className={`${currentTheme.headerBg} border-b ${currentTheme.border} sticky top-0 z-50`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex flex-col">
                <span className={`text-2xl font-bold ${currentTheme.accent} tracking-tight`}>SkidHaven</span>
                <span className="text-xs text-gray-400 font-medium">Marketplace</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/marketplace" className={`${currentTheme.text} hover:${currentTheme.accent} transition-colors font-medium`}>
              Marketplace
            </Link>
            <Link to="/sell" className={`${currentTheme.text} hover:${currentTheme.accent} transition-colors font-medium`}>
              Sell Items
            </Link>
            <Link to="/crypto-exchange" className={`${currentTheme.text} hover:${currentTheme.accent} transition-colors font-medium`}>
              Crypto Exchange
            </Link>
            {user && (
              <>
                <Link to="/messages" className={`${currentTheme.text} hover:${currentTheme.accent} transition-colors flex items-center space-x-1 font-medium`}>
                  <MessageCircle className="h-4 w-4" />
                  <span>Messages</span>
                </Link>
                <Link to="/profile" className={`${currentTheme.text} hover:${currentTheme.accent} transition-colors flex items-center space-x-1 font-medium`}>
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

            {!user ? (
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
              <div className="flex items-center space-x-2">
                <Button 
                  className={`${currentTheme.primary} text-white hover:opacity-90`}
                  onClick={() => navigate("/marketplace")}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Shop Now
                </Button>
                <Button
                  variant="outline"
                  className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
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
              <Link to="/marketplace" className={`${currentTheme.text} hover:${currentTheme.accent} font-medium`}>Marketplace</Link>
              <Link to="/sell" className={`${currentTheme.text} hover:${currentTheme.accent} font-medium`}>Sell Items</Link>
              <Link to="/crypto-exchange" className={`${currentTheme.text} hover:${currentTheme.accent} font-medium`}>Crypto Exchange</Link>
              {user && (
                <>
                  <Link to="/messages" className={`${currentTheme.text} hover:${currentTheme.accent} font-medium`}>Messages</Link>
                  <Link to="/profile" className={`${currentTheme.text} hover:${currentTheme.accent} font-medium`}>Profile</Link>
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
