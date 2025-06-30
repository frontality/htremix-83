
import { useState } from "react";
import { DollarSign, User, Settings, LogOut, MessageCircle, ShoppingBag, TrendingUp, Home, Menu, X, Palette } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useProfile } from "@/hooks/useProfile";
import ThemeSelector from "./ThemeSelector";

const TopHeader = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile } = useProfile();
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
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
  ];

  const handleMenuClick = (path: string) => {
    console.log('Menu item clicked:', path);
    setShowMobileMenu(false);
    setShowUserMenu(false);
    navigate(path);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 h-14 ${currentTheme.headerBg} border-b ${currentTheme.border} z-50 backdrop-blur-sm bg-opacity-90`}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src="/lovable-uploads/6f091ee3-6e28-4f39-b494-edd3050aa7e2.png" 
              alt="$KID HAVEN Logo" 
              className="w-7 h-7 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-inter">
              $KID HAVEN
            </span>
            <span className="text-xs text-gray-400 -mt-1">Underground Market</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleMenuClick(item.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium cursor-pointer text-sm ${
                  isActive 
                    ? `${currentTheme.primary} text-white shadow-md` 
                    : `${currentTheme.text} hover:${currentTheme.secondary}`
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {user && !authLoading && (
            <>
              {/* Balance - Stake.com style */}
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-900/90 border border-gray-700/50 rounded-md">
                <DollarSign size={14} className="text-green-400" />
                <span className="text-white font-bold text-sm">$0.00</span>
              </div>

              {/* Profile Section */}
              <div className="flex items-center space-x-3">
                {/* Theme Selector */}
                <div className="relative">
                  <button
                    onClick={() => {
                      console.log('Theme selector clicked');
                      setShowThemeSelector(!showThemeSelector);
                      setShowUserMenu(false);
                    }}
                    className={`p-2 rounded-lg ${currentTheme.secondary} hover:${currentTheme.primary} transition-colors cursor-pointer`}
                  >
                    <Palette size={16} className={currentTheme.text} />
                  </button>
                  {showThemeSelector && (
                    <div className="absolute right-0 top-full mt-2 z-50">
                      <ThemeSelector onClose={() => setShowThemeSelector(false)} />
                    </div>
                  )}
                </div>

                {/* Settings */}
                <button
                  onClick={() => handleMenuClick('/settings')}
                  className={`p-2 rounded-lg ${currentTheme.secondary} hover:${currentTheme.primary} transition-colors cursor-pointer`}
                >
                  <Settings size={16} className={currentTheme.text} />
                </button>

                {/* Profile */}
                <button
                  onClick={() => handleMenuClick('/profile')}
                  className={`p-2 rounded-lg ${currentTheme.secondary} hover:${currentTheme.primary} transition-colors cursor-pointer`}
                >
                  <User size={16} className={currentTheme.text} />
                </button>
                
                {/* User Avatar & Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      console.log('User menu clicked');
                      setShowUserMenu(!showUserMenu);
                      setShowThemeSelector(false);
                    }}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <img
                      src={profile?.avatar_url || "/placeholder.svg"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                    />
                    <span className="text-sm font-medium text-white hidden md:block">
                      {profile?.username || "User"}
                    </span>
                  </button>
                  
                  {showUserMenu && (
                    <div className={`absolute right-0 top-full mt-2 w-48 ${currentTheme.cardBg} border ${currentTheme.border} rounded-lg shadow-lg z-50`}>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 p-3 w-full text-left hover:bg-red-900/20 transition-colors text-red-400 cursor-pointer"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          )}

          {!user && !authLoading && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleMenuClick('/login')}
                className={`px-4 py-2 rounded-lg ${currentTheme.secondary} hover:${currentTheme.primary} transition-colors cursor-pointer ${currentTheme.text} text-sm font-medium`}
              >
                Login
              </button>
              <button
                onClick={() => handleMenuClick('/signup')}
                className={`px-4 py-2 rounded-lg ${currentTheme.primary} text-white hover:opacity-80 transition-opacity cursor-pointer text-sm font-medium`}
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
              setShowUserMenu(false);
            }}
            className={`lg:hidden p-2 rounded-lg ${currentTheme.secondary} hover:${currentTheme.primary} transition-colors cursor-pointer`}
          >
            {showMobileMenu ? <X size={16} className={currentTheme.text} /> : <Menu size={16} className={currentTheme.text} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className={`lg:hidden ${currentTheme.cardBg} border-t ${currentTheme.border} absolute top-full left-0 right-0 shadow-lg`}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleMenuClick(item.path)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all w-full text-left cursor-pointer ${
                    isActive 
                      ? `${currentTheme.primary} text-white` 
                      : `${currentTheme.text} hover:${currentTheme.secondary}`
                  }`}
                >
                  <item.icon size={18} />
                  <span className="font-medium">{item.label}</span>
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
