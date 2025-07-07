
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
  Trophy,
  Star,
  Diamond,
  Flame
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useAnimations } from "@/hooks/useAnimations";

const Index = () => {
  const { currentTheme } = useTheme();
  const { t, currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const { isVisible, animationClasses, hoverClasses } = useAnimations();
  const [, forceUpdate] = useState({});

  // Listen for language changes to force re-render
  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const features = [
    { icon: Diamond, title: t("Premium Verified"), description: t("Elite sellers only"), color: "text-cyan-400" },
    { icon: Shield, title: t("Military Security"), description: t("Bank-level protection"), color: "text-green-400" },
    { icon: Flame, title: t("Instant Delivery"), description: t("Under 60 seconds"), color: "text-orange-400" },
    { icon: Crown, title: t("Exclusive Community"), description: t("Premium members"), color: "text-yellow-400" },
    { icon: Star, title: t("5-Star Support"), description: t("24/7 assistance"), color: "text-purple-400" },
    { icon: Trophy, title: t("Best Prices"), description: t("Guaranteed lowest"), color: "text-pink-400" }
  ];

  const categories = [
    { icon: Gift, name: t("Premium Cards"), count: t("Exclusive deals"), color: "text-pink-400" },
    { icon: Gamepad2, name: t("Elite Accounts"), count: t("Verified sellers"), color: "text-green-400" },
    { icon: Crown, name: t("Premium Subscriptions"), count: t("Best rates"), color: "text-yellow-400" },
    { icon: Music, name: t("Digital Assets"), count: t("Rare items"), color: "text-purple-400" }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bg} overflow-hidden`}>
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/10 via-transparent to-orange-900/10"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-orange-500/15 to-red-500/15 rounded-full blur-2xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          
          {/* Enhanced Hero Section */}
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? animationClasses.fadeIn : 'opacity-0'}`}>
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-6">
              <Diamond className="h-4 w-4 text-cyan-400" />
              <span className={`text-sm font-semibold ${currentTheme.text}`}>EXCLUSIVE PREMIUM MARKETPLACE</span>
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </div>

            <div className="flex items-center justify-center mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold flex items-center gap-6 hover:scale-105 transition-transform duration-300">
                <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-pulse-slow">
                  SKID
                </span>
                <div className={`animate-float ${hoverClasses.scale} relative`}>
                  <img 
                    src="/lovable-uploads/2a21bfaa-d803-4e5a-aa4e-e377ae6c835f.png" 
                    alt="Volcano Logo" 
                    className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain hover:rotate-12 transition-transform duration-300"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"></div>
                </div>
                <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-pulse-slow">
                  HAVEN
                </span>
              </h1>
            </div>

            <div className="relative">
              <p className={`text-xl md:text-2xl lg:text-3xl ${currentTheme.muted} mb-4 max-w-5xl mx-auto leading-relaxed font-medium`}>
                {t("The world's most exclusive digital marketplace")}
              </p>
              <p className={`text-lg md:text-xl ${currentTheme.text} mb-10 max-w-4xl mx-auto opacity-90`}>
                {t("Where premium meets security. Elite digital assets, verified sellers, instant delivery.")}
              </p>
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/marketplace">
                <Button className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-xl font-bold ${hoverClasses.scale} transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 border border-purple-400/50`}>
                  <Crown className="mr-3 h-6 w-6" />
                  {t("Enter Marketplace")}
                </Button>
              </Link>
              <Link to="/sell">
                <Button variant="outline" className={`${currentTheme.text} border-2 border-purple-400/50 px-12 py-4 text-xl font-bold ${hoverClasses.scale} transition-all duration-300 backdrop-blur-sm bg-purple-500/10 hover:bg-purple-500/20`}>
                  <Diamond className="mr-3 h-6 w-6" />
                  {t("Become Seller")}
                </Button>
              </Link>
            </div>

            {/* Enhanced Search Bar */}
            <div className="relative max-w-3xl mx-auto mb-20">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-25"></div>
              <div className="relative">
                <Search className={`absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 ${currentTheme.muted}`} />
                <Input
                  placeholder={t("Search exclusive digital items...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-16 py-6 text-xl ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 backdrop-blur-sm`}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    <Shield className="h-4 w-4 text-white" />
                    <span className="text-white text-sm font-semibold">Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            
            {/* Enhanced Features Grid */}
            <div>
              <h2 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-10 text-center lg:text-left flex items-center gap-3`}>
                <Crown className="h-8 w-8 text-yellow-400" />
                {t("Elite Experience")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className={`${currentTheme.cardBg} border-2 border-purple-500/30 p-8 text-center ${hoverClasses.scale} transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 group relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <feature.icon className={`h-16 w-16 mx-auto mb-6 ${feature.color} group-hover:scale-110 transition-all duration-300 relative z-10`} />
                    <h3 className={`text-xl font-bold ${currentTheme.text} mb-3 relative z-10`}>{feature.title}</h3>
                    <p className={`text-base ${currentTheme.muted} relative z-10`}>{feature.description}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Enhanced Categories & CTA */}
            <div>
              <h2 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-10 text-center lg:text-left flex items-center gap-3`}>
                <Diamond className="h-8 w-8 text-cyan-400" />
                {t("Premium Categories")}
              </h2>
              <div className="grid grid-cols-2 gap-8 mb-12">
                {categories.map((category, index) => (
                  <Card key={index} className={`${currentTheme.cardBg} border-2 border-purple-500/30 p-8 text-center ${hoverClasses.scale} transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:shadow-purple-500/25 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <category.icon className={`h-16 w-16 mx-auto mb-6 ${category.color} group-hover:scale-110 transition-all duration-300 relative z-10`} />
                    <h3 className={`text-xl font-bold ${currentTheme.text} mb-3 relative z-10`}>{category.name}</h3>
                    <p className={`text-base ${currentTheme.muted} relative z-10`}>{category.count}</p>
                  </Card>
                ))}
              </div>

              {/* Enhanced Final CTA */}
              <Card className={`${currentTheme.cardBg} border-2 border-purple-500/30 p-10 text-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
                <Crown className={`h-12 w-12 mx-auto mb-4 text-yellow-400 relative z-10`} />
                <h3 className={`text-2xl font-bold ${currentTheme.text} mb-4 relative z-10`}>
                  {t("Join The Elite")}
                </h3>
                <p className={`${currentTheme.muted} mb-8 text-lg relative z-10`}>
                  {t("Exclusive access to premium digital marketplace")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                  <Link to="/signup">
                    <Button className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-bold ${hoverClasses.scale} transition-all duration-300 shadow-xl`}>
                      <Heart className="mr-2 h-5 w-5" />
                      {t("Get Premium Access")}
                    </Button>
                  </Link>
                  <Link to="/messages">
                    <Button variant="outline" className={`${currentTheme.text} border-2 border-purple-400/50 px-8 py-3 text-lg font-bold ${hoverClasses.scale} transition-all duration-300 backdrop-blur-sm`}>
                      <MessageCircle className="mr-2 h-5 w-5" />
                      {t("Premium Support")}
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>

          {/* Enhanced Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: t("Elite Members"), value: "Premium", icon: Crown },
              { label: t("Premium Items"), value: "∞", icon: Diamond },
              { label: t("Success Rate"), value: "100%", icon: Trophy },
              { label: t("Security Level"), value: "MAX", icon: Shield }
            ].map((stat, index) => (
              <Card key={index} className={`${currentTheme.cardBg} border-2 border-purple-500/30 p-8 text-center ${hoverClasses.scale} transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <stat.icon className={`h-10 w-10 mx-auto mb-4 ${currentTheme.accent} relative z-10`} />
                <div className={`text-3xl font-bold ${currentTheme.text} mb-2 relative z-10`}>{stat.value}</div>
                <div className={`text-sm ${currentTheme.muted} relative z-10`}>{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
