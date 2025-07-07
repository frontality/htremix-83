
import { useState } from "react";
import { 
  Home, 
  ShoppingBag, 
  MessageCircle, 
  User, 
  DollarSign, 
  Settings,
  TrendingUp,
  Star,
  Menu,
  X,
  Terminal
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const MainSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { currentTheme } = useTheme();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
    { icon: TrendingUp, label: "Sell Items", path: "/sell" },
    { icon: DollarSign, label: "Crypto Exchange", path: "/crypto-exchange" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
    { icon: Terminal, label: "Booting Tool", path: "/booting-tool" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <>
      <div className={`fixed right-0 top-0 h-full ${isOpen ? 'w-64' : 'w-16'} ${currentTheme.cardBg} border-l ${currentTheme.border} transition-all duration-300 z-40 backdrop-blur-sm bg-opacity-90`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg ${currentTheme.secondary} hover:opacity-80 transition-opacity`}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    isActive 
                      ? `${currentTheme.primary} text-white shadow-lg` 
                      : `${currentTheme.secondary} hover:${currentTheme.primary} hover:text-white`
                  }`}
                >
                  <item.icon size={20} />
                  {isOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
          
          {isOpen && (
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Star size={16} />
                <span>Premium Features</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className={`${isOpen ? 'mr-64' : 'mr-16'} transition-all duration-300`} />
    </>
  );
};

export default MainSidebar;
