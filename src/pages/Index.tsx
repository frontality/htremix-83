
import { useState } from "react";
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
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/hooks/useLanguage";
import QuickActionsPanel from "@/components/QuickActionsPanel";
import MarketStats from "@/components/MarketStats";

const Index = () => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const features = [
    {
      icon: Shield,
      title: t("Secure Trading"),
      description: t("Protected transactions with escrow system")
    },
    {
      icon: Zap,
      title: t("Instant Delivery"),
      description: t("Digital items delivered within minutes")
    },
    {
      icon: Users,
      title: t("Trusted Community"),
      description: t("Join thousands of verified traders")
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

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-10`}></div>
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <img 
                  src="/lovable-uploads/6f091ee3-6e28-4f39-b494-edd3050aa7e2.png" 
                  alt="$KID HAVEN Logo" 
                  className="w-12 h-12 object-contain mr-4"
                />
                <h1 className="text-5xl md:text-7xl font-bold">
                  <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    $KID HAVEN
                  </span>
                </h1>
              </div>
              <p className={`text-xl md:text-2xl ${currentTheme.muted} mb-8 leading-relaxed`}>
                {t("The premier digital marketplace for gift cards, game accounts, and premium subscriptions")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/marketplace">
                  <Button className={`${currentTheme.primary} text-white px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform shadow-lg`}>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    {t("Browse Marketplace")}
                  </Button>
                </Link>
                <Link to="/sell">
                  <Button variant="outline" className={`${currentTheme.text} border-2 px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform`}>
                    <DollarSign className="mr-2 h-5 w-5" />
                    {t("Start Selling")}
                  </Button>
                </Link>
              </div>

              <div className="relative max-w-2xl mx-auto mb-16">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.muted}`} />
                <Input
                  placeholder={t("Search for digital items, gift cards, accounts...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-12 py-4 text-lg ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-full shadow-lg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <MarketStats />

      {/* Categories */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-4`}>
            {t("Popular Categories")}
          </h2>
          <p className={`text-lg ${currentTheme.muted} max-w-2xl mx-auto`}>
            {t("Discover amazing digital items across various categories")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 text-center hover:scale-105 transition-transform cursor-pointer group`}>
              <category.icon className={`h-12 w-12 mx-auto mb-4 ${category.color} group-hover:scale-110 transition-transform`} />
              <h3 className={`font-semibold ${currentTheme.text} mb-2`}>{category.name}</h3>
              <p className={`text-sm ${currentTheme.muted}`}>{category.count}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className={`${currentTheme.secondary} py-16`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-4`}>
              {t("Why Choose $KID HAVEN?")}
            </h2>
            <p className={`text-lg ${currentTheme.muted} max-w-2xl mx-auto`}>
              {t("Experience the future of digital trading with our cutting-edge platform")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`${currentTheme.cardBg} border ${currentTheme.border} p-8 text-center hover:scale-105 transition-transform`}>
                <feature.icon className={`h-16 w-16 mx-auto mb-6 ${currentTheme.accent}`} />
                <h3 className={`text-xl font-semibold ${currentTheme.text} mb-4`}>{feature.title}</h3>
                <p className={`${currentTheme.muted} leading-relaxed`}>{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Items Section - Empty for now */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className={`text-3xl font-bold ${currentTheme.text} mb-2`}>
              {t("Featured Items")}
            </h2>
            <p className={`${currentTheme.muted}`}>
              {t("Coming soon - amazing digital items will be featured here")}
            </p>
          </div>
          <Link to="/marketplace">
            <Button variant="outline" className={`${currentTheme.text} border-2 hover:scale-105 transition-transform`}>
              {t("View All")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 text-center`}>
              <div className={`h-32 ${currentTheme.secondary} rounded-lg mb-4 flex items-center justify-center`}>
                <Gift className={`h-12 w-12 ${currentTheme.muted}`} />
              </div>
              <h3 className={`font-semibold ${currentTheme.text} mb-2`}>
                {t("No items listed yet")}
              </h3>
              <p className={`text-sm ${currentTheme.muted} mb-4`}>
                {t("Be the first to list your digital items!")}
              </p>
              <Link to="/sell">
                <Button size="sm" className={`${currentTheme.primary} text-white`}>
                  {t("List Item")}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActionsPanel />

      {/* CTA Section */}
      <div className={`${currentTheme.cardBg} border-t ${currentTheme.border} py-16`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-4`}>
            {t("Ready to Start Trading?")}
          </h2>
          <p className={`text-lg ${currentTheme.muted} mb-8 max-w-2xl mx-auto`}>
            {t("Join our community of digital traders and discover amazing deals on premium digital items")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className={`${currentTheme.primary} text-white px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform shadow-lg`}>
                <Heart className="mr-2 h-5 w-5" />
                {t("Join Community")}
              </Button>
            </Link>
            <Link to="/messages">
              <Button variant="outline" className={`${currentTheme.text} border-2 px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform`}>
                <MessageCircle className="mr-2 h-5 w-5" />
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
