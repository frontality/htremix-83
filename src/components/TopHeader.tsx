
import { useState } from "react";
import { Home, ShoppingCart, DollarSign, MessageSquare, MessageCircle, User, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";

const TopHeader = () => {
  const { user, signOut } = useAuth();
  const { currentTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/marketplace", icon: ShoppingCart, label: "Marketplace" },
    { path: "/sell", icon: DollarSign, label: "Sell Items" },
    { path: "/crypto-exchange", icon: DollarSign, label: "Crypto Exchange" },
    { path: "/forum", icon: MessageCircle, label: "Forum" },
    { path: "/messages", icon: MessageSquare, label: "Messages" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${currentTheme.cardBg} border-b ${currentTheme.border} backdrop-blur-sm`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SH</span>
            </div>
            <span className={`font-bold text-xl ${currentTheme.text} hidden sm:block tracking-tight`}>
              SKID HAVEN
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                    isActive(item.path)
                      ? `${currentTheme.primary} text-white`
                      : `${currentTheme.text} hover:${currentTheme.secondary}`
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Theme and Language selectors - desktop only */}
            <div className="hidden lg:flex items-center space-x-2">
              <div className="relative">
                <Button
                  onClick={() => setShowThemeSelector(!showThemeSelector)}
                  variant="ghost"
                  size="sm"
                  className={`${currentTheme.text} hover:${currentTheme.secondary} text-sm`}
                >
                  Theme
                </Button>
                {showThemeSelector && (
                  <div className="absolute top-full right-0 mt-2 z-50">
                    <ThemeSelector onClose={() => setShowThemeSelector(false)} />
                  </div>
                )}
              </div>
              <div className="relative">
                <Button
                  onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                  variant="ghost"
                  size="sm"
                  className={`${currentTheme.text} hover:${currentTheme.secondary} text-sm`}
                >
                  Language
                </Button>
                {showLanguageSelector && (
                  <div className="absolute top-full right-0 mt-2 z-50">
                    <LanguageSelector onClose={() => setShowLanguageSelector(false)} />
                  </div>
                )}
              </div>
            </div>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${currentTheme.text} hover:${currentTheme.secondary}`}
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:block">Profile</span>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className={`${currentTheme.text} hover:${currentTheme.secondary}`}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:block ml-2">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary}`}>
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className={`${currentTheme.primary} text-white`}>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              size="sm"
              className={`md:hidden ${currentTheme.text}`}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={`md:hidden ${currentTheme.cardBg} border-t ${currentTheme.border} py-4`}>
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? `${currentTheme.primary} text-white`
                        : `${currentTheme.text} hover:${currentTheme.secondary}`
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Theme and Language selectors */}
              <div className="flex items-center space-x-2 px-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Button
                    onClick={() => setShowThemeSelector(!showThemeSelector)}
                    variant="ghost"
                    size="sm"
                    className={`${currentTheme.text} hover:${currentTheme.secondary}`}
                  >
                    Theme
                  </Button>
                  {showThemeSelector && (
                    <div className="absolute top-full left-0 mt-2 z-50">
                      <ThemeSelector onClose={() => setShowThemeSelector(false)} />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Button
                    onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                    variant="ghost"
                    size="sm"
                    className={`${currentTheme.text} hover:${currentTheme.secondary}`}
                  >
                    Language
                  </Button>
                  {showLanguageSelector && (
                    <div className="absolute top-full left-0 mt-2 z-50">
                      <LanguageSelector onClose={() => setShowLanguageSelector(false)} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopHeader;
