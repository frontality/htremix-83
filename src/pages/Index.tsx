
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Shield, 
  Zap, 
  Users, 
  ShoppingBag,
  DollarSign,
  MessageCircle,
  Gift,
  Gamepad2,
  Music,
  Crown,
  Sparkles,
  Heart,
  Lock,
  Wallet,
  Trophy
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useAnimations } from "@/hooks/useAnimations";

const Index = () => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const { isVisible, animationClasses, hoverClasses } = useAnimations();
  const navigate = useNavigate();

  const features = [
    { icon: Shield, title: t("Secure Trading"), description: t("Protected transactions"), color: "text-green-400" },
    { icon: Zap, title: t("Instant Delivery"), description: t("Digital items in minutes"), color: "text-yellow-400" },
    { icon: Users, title: t("Trusted Community"), description: t("Verified traders"), color: "text-blue-400" },
    { icon: Lock, title: t("Privacy First"), description: t("Encrypted & secure"), color: "text-purple-400" },
    { icon: Wallet, title: t("Multiple Payments"), description: t("Crypto, PayPal & more"), color: "text-orange-400" },
    { icon: Trophy, title: t("Reputation System"), description: t("Verified sellers"), color: "text-pink-400" }
  ];

  const categories = [
    { icon: Gift, name: t("Gift Cards"), count: "12 items", color: "text-pink-400", path: "/marketplace?category=gift-cards" },
    { icon: Gamepad2, name: t("Game Accounts"), count: "8 items", color: "text-green-400", path: "/marketplace?category=games" },
    { icon: Crown, name: t("Premium Subs"), count: "5 items", color: "text-yellow-400", path: "/marketplace?category=subscriptions" },
    { icon: Music, name: t("Digital Content"), count: "15 items", color: "text-purple-400", path: "/marketplace?category=digital" }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} overflow-x-hidden`}>
      {/* Subtle Background Animation */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          
          {/* Hero Section */}
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? animationClasses.fadeIn : 'opacity-0'}`}>
            <div className="flex items-center justify-center mb-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent animate-pulse-slow">
                  SKID
                </span>
                <div className={`animate-float ${hoverClasses.scale}`}>
                  <img 
                    src="/lovable-uploads/2a21bfaa-d803-4e5a-aa4e-e377ae6c835f.png" 
                    alt="Volcano Logo" 
                    className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain hover:rotate-12 transition-transform duration-300"
                  />
                </div>
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent animate-pulse-slow">
                  HAVEN
                </span>
              </h1>
            </div>
            <p className={`text-lg md:text-xl lg:text-2xl ${currentTheme.muted} mb-8 max-w-4xl mx-auto leading-relaxed`}>
              {t("The premier digital marketplace for gift cards, game accounts, and premium subscriptions")}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/marketplace">
                <Button className={`${currentTheme.primary} text-white px-8 py-3 text-lg font-semibold ${hoverClasses.scale} transition-all duration-300 shadow-lg hover:shadow-xl`}>
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {t("Browse Marketplace")}
                </Button>
              </Link>
              <Link to="/sell">
                <Button variant="outline" className={`${currentTheme.text} border-2 px-8 py-3 text-lg font-semibold ${hoverClasses.scale} transition-all duration-300`}>
                  <DollarSign className="mr-2 h-5 w-5" />
                  {t("Start Selling")}
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-12">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.muted}`} />
              <Input
                placeholder={t("Search digital items...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-12 py-4 text-lg ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-full shadow-md hover:shadow-lg transition-all duration-300`}
              />
            </form>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            
            {/* Features Grid */}
            <div>
              <h2 className={`text-2xl md:text-3xl font-bold ${currentTheme.text} mb-8 text-center lg:text-left`}>
                {t("Why Choose SKID HAVEN?")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 text-center ${hoverClasses.scale} transition-all duration-300 hover:shadow-lg group`}>
                    <feature.icon className={`h-10 w-10 mx-auto mb-4 ${feature.color} group-hover:scale-110 transition-all duration-300`} />
                    <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>{feature.title}</h3>
                    <p className={`text-sm ${currentTheme.muted}`}>{feature.description}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Categories & CTA */}
            <div>
              <h2 className={`text-2xl md:text-3xl font-bold ${currentTheme.text} mb-8 text-center lg:text-left`}>
                {t("Popular Categories")}
              </h2>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {categories.map((category, index) => (
                  <Card 
                    key={index} 
                    className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 text-center ${hoverClasses.scale} transition-all duration-300 cursor-pointer group hover:shadow-lg`}
                    onClick={() => handleCategoryClick(category.path)}
                  >
                    <category.icon className={`h-10 w-10 mx-auto mb-4 ${category.color} group-hover:scale-110 transition-all duration-300`} />
                    <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>{category.name}</h3>
                    <p className={`text-sm ${currentTheme.muted}`}>{category.count}</p>
                  </Card>
                ))}
              </div>

              {/* Final CTA */}
              <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-8 text-center`}>
                <h3 className={`text-xl font-bold ${currentTheme.text} mb-3`}>
                  {t("Ready to Start Trading?")}
                </h3>
                <p className={`${currentTheme.muted} mb-6`}>
                  {t("Join our community of digital traders")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup">
                    <Button className={`${currentTheme.primary} text-white px-6 py-3 font-semibold ${hoverClasses.scale} transition-all duration-300`}>
                      <Heart className="mr-2 h-4 w-4" />
                      {t("Join Community")}
                    </Button>
                  </Link>
                  <Link to="/messages">
                    <Button variant="outline" className={`${currentTheme.text} border-2 px-6 py-3 font-semibold ${hoverClasses.scale} transition-all duration-300`}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {t("Start Chatting")}
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: t("Active Users"), value: "1,247", icon: Users },
              { label: t("Items Sold"), value: "2,891", icon: ShoppingBag },
              { label: t("Transactions"), value: "$89,432", icon: DollarSign },
              { label: t("Success Rate"), value: "99.8%", icon: Trophy }
            ].map((stat, index) => (
              <Card key={index} className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 text-center ${hoverClasses.scale} transition-all duration-300`}>
                <stat.icon className={`h-8 w-8 mx-auto mb-3 ${currentTheme.accent}`} />
                <div className={`text-xl font-bold ${currentTheme.text} mb-2`}>{stat.value}</div>
                <div className={`text-sm ${currentTheme.muted}`}>{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
