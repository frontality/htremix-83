
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  ArrowRight,
  Star,
  ShoppingBag,
  DollarSign,
  MessageCircle,
  Gift,
  Gamepad2,
  Music,
  Video,
  Crown,
  Sparkles,
  ChevronRight,
  Heart,
  Lock,
  Wallet,
  Trophy,
  Clock,
  CreditCard,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/hooks/useLanguage";
import QuickActionsPanel from "@/components/QuickActionsPanel";
import MarketStats from "@/components/MarketStats";
import { useAnimations } from "@/hooks/useAnimations";

const Index = () => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const { isVisible, animationClasses, hoverClasses } = useAnimations();

  const features = [
    {
      icon: Shield,
      title: t("Secure Trading"),
      description: t("Protected transactions with escrow system"),
      color: "text-green-400"
    },
    {
      icon: Zap,
      title: t("Instant Delivery"),
      description: t("Digital items delivered within minutes"),
      color: "text-yellow-400"
    },
    {
      icon: Users,
      title: t("Trusted Community"),
      description: t("Join thousands of verified traders"),
      color: "text-blue-400"
    },
    {
      icon: Lock,
      title: t("Privacy First"),
      description: t("Your data is encrypted and secure"),
      color: "text-purple-400"
    },
    {
      icon: Wallet,
      title: t("Multiple Payment Options"),
      description: t("Crypto, PayPal, and more payment methods"),
      color: "text-orange-400"
    },
    {
      icon: Trophy,
      title: t("Reputation System"),
      description: t("Build trust with our verified seller program"),
      color: "text-pink-400"
    }
  ];

  const categories = [
    { icon: Gift, name: t("Gift Cards"), count: "0 items", color: "text-pink-400" },
    { icon: Gamepad2, name: t("Game Accounts"), count: "0 items", color: "text-green-400" },
    { icon: Crown, name: t("Premium Subscriptions"), count: "0 items", color: "text-yellow-400" },
    { icon: Music, name: t("Digital Content"), count: "0 items", color: "text-purple-400" },
    { icon: Video, name: t("Streaming Services"), count: "0 items", color: "text-blue-400" },
    { icon: Sparkles, name: t("Software & Tools"), count: "0 items", color: "text-orange-400" }
  ];

  const additionalFeatures = [
    {
      icon: Clock,
      title: t("24/7 Support"),
      description: t("Round-the-clock customer assistance"),
      color: "text-cyan-400"
    },
    {
      icon: CreditCard,
      title: t("Escrow Protection"),
      description: t("Funds held securely until delivery confirmation"),
      color: "text-indigo-400"
    },
    {
      icon: Globe,
      title: t("Global Marketplace"),
      description: t("Trade with users worldwide in multiple currencies"),
      color: "text-emerald-400"
    }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-10`}></div>
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-16">
            <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? animationClasses.fadeIn : 'opacity-0'}`}>
              <div className="flex items-center justify-center mb-6">
                <h1 className="text-5xl md:text-7xl font-bold flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                  <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent animate-pulse-slow">
                    SKID
                  </span>
                  <div className={`animate-float ${hoverClasses.scale}`}>
                    <img 
                      src="/lovable-uploads/2a21bfaa-d803-4e5a-aa4e-e377ae6c835f.png" 
                      alt="Volcano Logo" 
                      className="w-16 h-16 md:w-20 md:h-20 object-contain hover:rotate-12 transition-transform duration-300"
                    />
                  </div>
                  <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent animate-pulse-slow">
                    HAVEN
                  </span>
                </h1>
              </div>
              <p className={`text-xl md:text-2xl ${currentTheme.muted} mb-8 leading-relaxed ${animationClasses.fadeIn} transition-all duration-500 delay-300`}>
                {t("The premier digital marketplace for gift cards, game accounts, and premium subscriptions")}
              </p>
              
              <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 ${animationClasses.fadeIn} transition-all duration-700 delay-500`}>
                <Link to="/marketplace">
                  <Button className={`${currentTheme.primary} text-white px-8 py-4 text-lg font-semibold ${hoverClasses.scale} transition-all duration-300 shadow-lg hover:shadow-xl ${animationClasses.pulseGlow}`}>
                    <ShoppingBag className="mr-2 h-5 w-5 transition-transform duration-200" />
                    {t("Browse Marketplace")}
                  </Button>
                </Link>
                <Link to="/sell">
                  <Button variant="outline" className={`${currentTheme.text} border-2 px-8 py-4 text-lg font-semibold ${hoverClasses.scale} transition-all duration-300 hover:shadow-lg`}>
                    <DollarSign className="mr-2 h-5 w-5 transition-transform duration-200" />
                    {t("Start Selling")}
                  </Button>
                </Link>
              </div>

              <div className={`relative max-w-2xl mx-auto mb-16 ${animationClasses.fadeIn} transition-all duration-900 delay-700`}>
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.muted} transition-colors duration-200`} />
                <Input
                  placeholder={t("Search for digital items, gift cards, accounts...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-12 py-4 text-lg ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:scale-105`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <div className={`${animationClasses.fadeIn} transition-all duration-1000 delay-1000`}>
        <MarketStats />
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-16">
        <div className={`text-center mb-12 ${animationClasses.fadeIn}`}>
          <h2 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-4 ${hoverClasses.scale} transition-transform duration-300`}>
            {t("Popular Categories")}
          </h2>
          <p className={`text-lg ${currentTheme.muted} max-w-2xl mx-auto`}>
            {t("Discover amazing digital items across various categories")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 text-center ${hoverClasses.scale} transition-all duration-300 cursor-pointer group hover:shadow-xl ${animationClasses.fadeIn}`} style={{animationDelay: `${index * 100}ms`}}>
              <category.icon className={`h-12 w-12 mx-auto mb-4 ${category.color} group-hover:scale-110 transition-all duration-300 group-hover:animate-pulse`} />
              <h3 className={`font-semibold ${currentTheme.text} mb-2 transition-colors duration-200`}>{category.name}</h3>
              <p className={`text-sm ${currentTheme.muted} transition-colors duration-200`}>{category.count}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Enhanced Features */}
      <div className={`${currentTheme.secondary} py-16`}>
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 ${animationClasses.fadeIn}`}>
            <h2 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-4 ${hoverClasses.scale} transition-transform duration-300`}>
              {t("Why Choose SKID HAVEN?")}
            </h2>
            <p className={`text-lg ${currentTheme.muted} max-w-2xl mx-auto`}>
              {t("Experience the future of digital trading with our cutting-edge platform")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`${currentTheme.cardBg} border ${currentTheme.border} p-8 text-center ${hoverClasses.scale} transition-all duration-300 hover:shadow-xl ${animationClasses.fadeIn} group`} style={{animationDelay: `${index * 200}ms`}}>
                <feature.icon className={`h-16 w-16 mx-auto mb-6 ${feature.color} group-hover:scale-110 transition-all duration-300 group-hover:animate-pulse`} />
                <h3 className={`text-xl font-semibold ${currentTheme.text} mb-4 transition-colors duration-200`}>{feature.title}</h3>
                <p className={`${currentTheme.muted} leading-relaxed transition-colors duration-200`}>{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Additional Features Row */}
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className={`${currentTheme.cardBg} border ${currentTheme.border} p-8 text-center ${hoverClasses.scale} transition-all duration-300 hover:shadow-xl ${animationClasses.fadeIn} group`} style={{animationDelay: `${(index + 6) * 200}ms`}}>
                <feature.icon className={`h-16 w-16 mx-auto mb-6 ${feature.color} group-hover:scale-110 transition-all duration-300 group-hover:animate-pulse`} />
                <h3 className={`text-xl font-semibold ${currentTheme.text} mb-4 transition-colors duration-200`}>{feature.title}</h3>
                <p className={`${currentTheme.muted} leading-relaxed transition-colors duration-200`}>{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Items Section - Empty for now */}
      <div className="container mx-auto px-4 py-16">
        <div className={`flex justify-between items-center mb-8 ${animationClasses.fadeIn}`}>
          <div>
            <h2 className={`text-3xl font-bold ${currentTheme.text} mb-2 ${hoverClasses.scale} transition-transform duration-300`}>
              {t("Featured Items")}
            </h2>
            <p className={`${currentTheme.muted}`}>
              {t("Coming soon - amazing digital items will be featured here")}
            </p>
          </div>
          <Link to="/marketplace">
            <Button variant="outline" className={`${currentTheme.text} border-2 ${hoverClasses.scale} transition-all duration-300 hover:shadow-lg`}>
              {t("View All")}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 text-center ${hoverClasses.scale} transition-all duration-300 hover:shadow-xl ${animationClasses.fadeIn} group`} style={{animationDelay: `${i * 100}ms`}}>
              <div className={`h-32 ${currentTheme.secondary} rounded-lg mb-4 flex items-center justify-center group-hover:bg-opacity-80 transition-all duration-300`}>
                <Gift className={`h-12 w-12 ${currentTheme.muted} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              <h3 className={`font-semibold ${currentTheme.text} mb-2 transition-colors duration-200`}>
                {t("No items listed yet")}
              </h3>
              <p className={`text-sm ${currentTheme.muted} mb-4 transition-colors duration-200`}>
                {t("Be the first to list your digital items!")}
              </p>
              <Link to="/sell">
                <Button size="sm" className={`${currentTheme.primary} text-white ${hoverClasses.scale} transition-all duration-300`}>
                  {t("List Item")}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={animationClasses.fadeIn}>
        <QuickActionsPanel />
      </div>

      {/* CTA Section */}
      <div className={`${currentTheme.cardBg} border-t ${currentTheme.border} py-16`}>
        <div className={`container mx-auto px-4 text-center ${animationClasses.fadeIn}`}>
          <h2 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-4 ${hoverClasses.scale} transition-transform duration-300`}>
            {t("Ready to Start Trading?")}
          </h2>
          <p className={`text-lg ${currentTheme.muted} mb-8 max-w-2xl mx-auto transition-colors duration-200`}>
            {t("Join our community of digital traders and discover amazing deals on premium digital items")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className={`${currentTheme.primary} text-white px-8 py-4 text-lg font-semibold ${hoverClasses.scale} transition-all duration-300 shadow-lg hover:shadow-xl ${animationClasses.pulseGlow}`}>
                <Heart className="mr-2 h-5 w-5 transition-transform duration-200" />
                {t("Join Community")}
              </Button>
            </Link>
            <Link to="/messages">
              <Button variant="outline" className={`${currentTheme.text} border-2 px-8 py-4 text-lg font-semibold ${hoverClasses.scale} transition-all duration-300 hover:shadow-lg`}>
                <MessageCircle className="mr-2 h-5 w-5 transition-transform duration-200" />
                {t("Start Chatting")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
