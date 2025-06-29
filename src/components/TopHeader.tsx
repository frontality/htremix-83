
import { useState } from "react";
import { DollarSign, User, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useProfile } from "@/hooks/useProfile";

const TopHeader = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 ${currentTheme.headerBg} border-b ${currentTheme.border} z-50 backdrop-blur-sm bg-opacity-90`}>
      <div className="flex items-center justify-between h-full px-6">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SH</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              SkidHaven
            </span>
            <span className="text-xs text-gray-400">Marketplace</span>
          </div>
        </Link>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 rounded-full">
              <DollarSign size={16} className="text-white" />
              <span className="text-white font-medium">$2,450.00</span>
            </div>
            
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: '75%' }}
              />
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <img
                  src={profile?.avatar_url || "/placeholder.svg"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-white">
                    {profile?.username || "User"}
                  </span>
                  <span className="text-xs text-gray-400">Level 12</span>
                </div>
              </button>
              
              {showUserMenu && (
                <div className={`absolute right-0 top-full mt-2 w-48 ${currentTheme.cardBg} border ${currentTheme.border} rounded-lg shadow-lg`}>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 p-3 hover:bg-gray-800 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 p-3 hover:bg-gray-800 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setShowUserMenu(false);
                    }}
                    className="flex items-center space-x-2 p-3 w-full text-left hover:bg-gray-800 transition-colors text-red-400"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopHeader;
