
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ShoppingCart, 
  User, 
  MessageCircle, 
  Bell, 
  Settings,
  LogOut,
  Shield,
  Zap,
  TrendingUp,
  Star
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const SkidHavenHeader = () => {
  const { user, signOut } = useAuth();
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast({
      title: "Signed out successfully",
      description: "You have been logged out",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className={`${currentTheme.cardBg} border-b ${currentTheme.border} sticky top-0 z-50 backdrop-blur-sm bg-opacity-90`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/9c848e6b-b756-4e08-ba12-dde7ca4f3339.png" 
              alt="SkidHaven Volcano Logo" 
              className="h-10 w-10 object-contain rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            />
            <div className="flex flex-col">
              <span className={`text-xl font-bold ${currentTheme.text} bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent`}>
                SkidHaven
              </span>
              <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Secure & Anonymous
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-6">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${currentTheme.muted}`} />
              <Input
                placeholder="Search products, services, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${currentTheme.secondary} ${currentTheme.text} border-0 focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <Button type="submit" size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Navigation & User Menu */}
          <div className="flex items-center space-x-4">
            {/* Quick Stats */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">24/7 Online</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-500">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Instant Delivery</span>
              </div>
              <div className="flex items-center space-x-1 text-yellow-500">
                <Star className="h-4 w-4" />
                <span className="text-sm font-medium">5.0 Rating</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/marketplace")}
                className={`${currentTheme.text} hover:${currentTheme.secondary} relative`}
              >
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-5 h-5 rounded-full">
                  3
                </Badge>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/messages")}
                className={`${currentTheme.text} hover:${currentTheme.secondary} relative`}
              >
                <MessageCircle className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1 min-w-5 h-5 rounded-full">
                  2
                </Badge>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`${currentTheme.text} hover:${currentTheme.secondary} relative`}
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 min-w-5 h-5 rounded-full">
                  5
                </Badge>
              </Button>
            </div>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`w-56 ${currentTheme.cardBg} ${currentTheme.border}`} align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className={`font-medium ${currentTheme.text}`}>
                        {user.email?.split('@')[0] || 'Anonymous User'}
                      </p>
                      <p className={`text-xs ${currentTheme.muted}`}>
                        {user.email ? '••••••@••••.com' : 'anonymous@skidhaven.com'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/messages")}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className={`${currentTheme.text} hover:${currentTheme.secondary}`}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/signup")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${currentTheme.muted}`} />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${currentTheme.secondary} ${currentTheme.text} border-0`}
              />
            </div>
            <Button type="submit" size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default SkidHavenHeader;
