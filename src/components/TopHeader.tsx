import { useState } from "react";
import { DollarSign, User, Settings, LogOut, MessageCircle, ShoppingBag, TrendingUp, Home, Menu, X, Palette, Globe, Users } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/hooks/useLanguage";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";

const TopHeader = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile } = useProfile();
  const { currentTheme } = useTheme();
  const { getCurrentLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSignOut = async () => {
    console.log('Sign out button clicked');
    try {
      await signOut();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
    { icon: TrendingUp, label: "Sell Items", path: "/sell" },
    { icon: DollarSign, label: "Crypto Exchange", path: "/crypto-exchange" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
    { icon: Users, label: "Forum", path: "/forum" },
  ];

  const handleMenuClick = (path: string) => {
    console.log('Menu item clicked:', path);
    setShowMobileMenu(false);
    setShowUserMenu(false);
    setShowThemeSelector(false);
    setShowLanguageSelector(false);
    navigate(path);
  };

  const currentLanguage = getCurrentLanguage();

  return (
    <header className={`fixed top-0 left-0 right-0 h-12 ${currentTheme.headerBg} border-b ${currentTheme.border} z-50 backdrop-blur-sm bg-opacity-90 animate-fade-in`}>
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300 hover:scale-105 group">
          <div className="w-6 h-6 flex items-center justify-center animate-float">
            <img 
              src="/lovable-uploads/2a21bfaa-d803-4e5a-aa4e-e377ae6c835f.png" 
              alt="$KID HAVEN Logo" 
              className="w-5 h-5 object-contain group-hover:animate-pulse"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-inter transition-all duration-300">
              $KID HAVEN
            </span>
            <span className="text-xs text-gray-400 -mt-1 group-hover:text-gray-300 transition-colors">Digital Market</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleMenuClick(item.path)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all duration-300 font-medium cursor-pointer text-xs hover:scale-105 transform ${
                  isActive 
                    ? `${currentTheme.primary} text-white shadow-md animate-pulse-slow` 
                    : `${currentTheme.text} hover:${currentTheme.secondary} hover:shadow-lg`
                }`}
              >
                <item.icon size={14} className="transition-transform duration-200" />
                <span className="transition-all duration-200">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {user && !authLoading && (
            <>
              {/* Balance - Stake.com style */}
              <div className="flex items-center space-x-2 px-2 py-1 bg-gray-900/90 border border-gray-700/50 rounded-md hover:bg-gray-800/90 transition-all duration-300 hover:scale-105">
                <DollarSign size={12} className="text-green-400 animate-pulse" />
                <span className="text-white font-bold text-xs">$0.00</span>
              </div>

              {/* Profile Section */}
              <div className="flex items-center space-x-2">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => {
                      console.log('Language selector clicked');
                      setShowLanguageSelector(!showLanguageSelector);
                      setShowThemeSelector(false);
                      setShowUserMenu(false);
                    }}
                    className={`p-1.5 rounded-md ${currentTheme.secondary} hover:${currentTheme.primary} transition-all duration-300 cursor-pointer flex items-center space-x-1 hover:scale-110 transform`}
                  >
                    <Globe size={14} className={`${currentTheme.text} transition-transform duration-200`} />
                    <span className="text-xs font-medium">{currentLanguage.flag}</span>
                  </button>
                  {showLanguageSelector && (
                    <div className="absolute right-0 top-full mt-2 z-50 animate-scale-in">
                      <LanguageSelector onClose={() => setShowLanguageSelector(false)} />
                    </div>
                  )}
                </div>

                {/* Theme Selector */}
                <div className="relative">
                  <button
                    onClick={() => {
                      console.log('Theme selector clicked');
                      setShowThemeSelector(!showThemeSelector);
                      setShowLanguageSelector(false);
                      setShowUserMenu(false);
                    }}
                    className={`p-1.5 rounded-md ${currentTheme.secondary} hover:${currentTheme.primary} transition-all duration-300 cursor-pointer hover:scale-110 transform`}
                  >
                    <Palette size={14} className={`${currentTheme.text} transition-transform duration-200`} />
                  </button>
                  {showThemeSelector && (
                    <div className="absolute right-0 top-full mt-2 z-50 animate-scale-in">
                      <ThemeSelector onClose={() => setShowThemeSelector(false)} />
                    </div>
                  )}
                </div>

                {/* Settings */}
                <button
                  onClick={() => handleMenuClick('/settings')}
                  className={`p-1.5 rounded-md ${currentTheme.secondary} hover:${currentTheme.primary} transition-all duration-300 cursor-pointer hover:scale-110 transform`}
                >
                  <Settings size={14} className={`${currentTheme.text} hover:rotate-90 transition-transform duration-300`} />
                </button>

                {/* Profile */}
                <button
                  onClick={() => handleMenuClick('/profile')}
                  className={`p-1.5 rounded-md ${currentTheme.secondary} hover:${currentTheme.primary} transition-all duration-300 cursor-pointer hover:scale-110 transform`}
                >
                  <User size={14} className={`${currentTheme.text} transition-transform duration-200`} />
                </button>
                
                {/* User Avatar & Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      console.log('User menu clicked');
                      setShowUserMenu(!showUserMenu);
                      setShowThemeSelector(false);
                      setShowLanguageSelector(false);
                    }}
                    className="flex items-center space-x-1 p-1 rounded-md hover:bg-gray-800/50 transition-all duration-300 cursor-pointer hover:scale-105 transform"
                  >
                    <img
                      src={profile?.avatar_url || "/placeholder.svg"}
                      alt="Profile"
                      className="w-6 h-6 rounded-full object-cover border border-purple-500 transition-all duration-300 hover:border-purple-400 hover:shadow-lg"
                    />
                    <span className="text-xs font-medium text-white hidden md:block transition-colors duration-200">
                      {profile?.username || "User"}
                    </span>
                  </button>
                  
                  {showUserMenu && (
                    <div className={`absolute right-0 top-full mt-2 w-40 ${currentTheme.cardBg} border ${currentTheme.border} rounded-lg shadow-lg z-50 animate-scale-in`}>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 p-2 w-full text-left hover:bg-red-900/20 transition-all duration-300 text-red-400 cursor-pointer text-xs hover:scale-105 transform"
                      >
                        <LogOut size={14} className="transition-transform duration-200" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {!user && !authLoading && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleMenuClick('/login')}
                className={`px-3 py-1.5 rounded-md ${currentTheme.secondary} hover:${currentTheme.primary} transition-all duration-300 cursor-pointer ${currentTheme.text} text-xs font-medium hover:scale-105 transform hover:shadow-lg`}
              >
                Login
              </button>
              <button
                onClick={() => handleMenuClick('/signup')}
                className={`px-3 py-1.5 rounded-md ${currentTheme.primary} text-white hover:opacity-80 transition-all duration-300 cursor-pointer text-xs font-medium hover:scale-105 transform hover:shadow-lg`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              console.log('Mobile menu clicked');
              setShowMobileMenu(!showMobileMenu);
              setShowThemeSelector(false);
              setShowLanguageSelector(false);
              setShowUserMenu(false);
            }}
            className={`lg:hidden p-1.5 rounded-md ${currentTheme.secondary} hover:${currentTheme.primary} transition-all duration-300 cursor-pointer hover:scale-110 transform`}
          >
            {showMobileMenu ? <X size={14} className={`${currentTheme.text} transition-transform duration-200`} /> : <Menu size={14} className={`${currentTheme.text} transition-transform duration-200`} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className={`lg:hidden ${currentTheme.cardBg} border-t ${currentTheme.border} absolute top-full left-0 right-0 shadow-lg animate-slide-in-right`}>
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleMenuClick(item.path)}
                  className={`flex items-center space-x-2 p-2 rounded-md transition-all duration-300 w-full text-left cursor-pointer text-sm hover:scale-105 transform ${
                    isActive 
                      ? `${currentTheme.primary} text-white animate-pulse-slow` 
                      : `${currentTheme.text} hover:${currentTheme.secondary} hover:shadow-md`
                  }`}
                >
                  <item.icon size={16} className="transition-transform duration-200" />
                  <span className="font-medium transition-all duration-200">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default TopHeader;
