
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ShoppingCart, User, Settings, LogOut, Menu, X, MessageSquare, DollarSign, Package, Home, MessageCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const TopHeader = () => {
  const { user, signOut } = useAuth();
  const { currentTheme } = useTheme();
  const { getDisplayEmail } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayEmail = getDisplayEmail();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Marketplace", path: "/marketplace", icon: ShoppingCart },
    { label: "Forum", path: "/forum", icon: MessageCircle },
    { label: "Sell Items", path: "/sell", icon: Package },
    { label: "Crypto Exchange", path: "/crypto-exchange", icon: DollarSign },
    { label: "Messages", path: "/messages", icon: MessageSquare },
  ];

  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${currentTheme.cardBg} border-b ${currentTheme.border} backdrop-blur-md bg-opacity-90`}>
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-lg ${currentTheme.primary} flex items-center justify-center`}>
            <span className="text-white font-bold text-sm">KH</span>
          </div>
          <span className={`font-bold text-lg ${currentTheme.text} hidden sm:inline`}>
            Kid Haven
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
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActivePath(item.path)
                    ? `${currentTheme.primary} text-white`
                    : `${currentTheme.text} hover:${currentTheme.secondary}`
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.email || "User"} />
                      <AvatarFallback className={`${currentTheme.secondary} ${currentTheme.text}`}>
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`w-56 ${currentTheme.cardBg} border ${currentTheme.border}`} align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {displayEmail && (
                        <p className={`text-sm ${currentTheme.text}`}>{displayEmail}</p>
                      )}
                      <p className={`text-xs ${currentTheme.muted}`}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className={currentTheme.border} />
                  <DropdownMenuItem asChild className={`${currentTheme.text} hover:${currentTheme.secondary}`}>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className={`${currentTheme.text} hover:${currentTheme.secondary}`}>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className={currentTheme.border} />
                  <DropdownMenuItem onClick={handleSignOut} className={`${currentTheme.text} hover:${currentTheme.secondary}`}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild className={`${currentTheme.text} hover:${currentTheme.secondary}`}>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className={`${currentTheme.primary} text-white hover:opacity-90`}>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && user && (
        <div className={`md:hidden ${currentTheme.cardBg} border-t ${currentTheme.border}`}>
          <nav className="px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActivePath(item.path)
                      ? `${currentTheme.primary} text-white`
                      : `${currentTheme.text} hover:${currentTheme.secondary}`
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default TopHeader;
