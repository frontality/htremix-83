
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
  MessageCircle,
  Gift,
  Gamepad2,
  Music,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Globe,
  ArrowRight,
  Star
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
    { icon: Shield, title: "Secure Trading", description: "Safe & encrypted transactions", color: "text-blue-400" },
    { icon: Zap, title: "Fast Delivery", description: "Instant digital transfers", color: "text-yellow-400" },
    { icon: Users, title: "Community", description: "Join thousands of traders", color: "text-green-400" },
    { icon: CheckCircle, title: "Verified", description: "Trusted marketplace", color: "text-purple-400" }
  ];

  const categories = [
    { icon: Gift, name: "Digital Products", count: "1,000+", color: "text-blue-400" },
    { icon: Gamepad2, name: "Gaming", count: "500+", color: "text-green-400" },
    { icon: Music, name: "Entertainment", count: "300+", color: "text-purple-400" },
    { icon: Sparkles, name: "Software", count: "200+", color: "text-yellow-400" }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bg} relative`}>
      {/* Clean Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          
          {/* Hero Section */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? animationClasses.fadeIn : 'opacity-0'}`}>
            <div className="flex items-center justify-center mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold flex items-center gap-6">
                <span className="bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                  SKID
                </span>
                <div className="animate-float relative">
                  <img 
                    src="/lovable-uploads/2a21bfaa-d803-4e5a-aa4e-e377ae6c835f.png" 
                    alt="Logo" 
                    className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
                  />
                </div>
                <span className="bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                  HAVEN
                </span>
              </h1>
            </div>

            <h2 className={`text-2xl md:text-3xl ${currentTheme.text} mb-6 font-light`}>
              Digital Marketplace & Community
            </h2>
            <p className={`text-lg ${currentTheme.muted} mb-12 max-w-3xl mx-auto`}>
              Buy, sell, and trade digital products in a secure environment. Connect with traders worldwide.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/marketplace">
                <Button className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg ${hoverClasses.scale} shadow-lg`}>
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Marketplace
                </Button>
              </Link>
              <Link to="/sell">
                <Button variant="outline" className={`${currentTheme.text} border-2 px-8 py-3 text-lg ${hoverClasses.scale} backdrop-blur-sm`}>
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Start Selling
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.muted}`} />
              <Input
                placeholder="Search products, services, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-12 py-3 text-lg ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-xl shadow-lg backdrop-blur-sm`}
              />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 text-center ${hoverClasses.scale} group`}>
                <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>{feature.title}</h3>
                <p className={`text-sm ${currentTheme.muted}`}>{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Categories & Stats */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            
            {/* Categories */}
            <div>
              <h3 className={`text-3xl font-bold ${currentTheme.text} mb-8 flex items-center gap-3`}>
                <Globe className="h-8 w-8 text-blue-400" />
                Popular Categories
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category, index) => (
                  <Card key={index} className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 text-center ${hoverClasses.scale} cursor-pointer group`}>
                    <category.icon className={`h-10 w-10 mx-auto mb-4 ${category.color} group-hover:scale-110 transition-transform duration-300`} />
                    <h4 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>{category.name}</h4>
                    <p className={`text-sm ${currentTheme.muted}`}>{category.count} items</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div>
              <h3 className={`text-3xl font-bold ${currentTheme.text} mb-8 flex items-center gap-3`}>
                <Users className="h-8 w-8 text-green-400" />
                Community
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Active Traders", value: "12,000+", icon: Users },
                  { label: "Products Listed", value: "25,000+", icon: ShoppingBag },
                  { label: "Successful Trades", value: "50,000+", icon: CheckCircle },
                  { label: "Community Score", value: "4.9/5", icon: Star }
                ].map((stat, index) => (
                  <Card key={index} className={`${currentTheme.cardBg} border ${currentTheme.border} p-4 flex items-center gap-4 ${hoverClasses.scale}`}>
                    <stat.icon className={`h-8 w-8 ${currentTheme.accent}`} />
                    <div className="flex-1">
                      <div className={`text-xl font-bold ${currentTheme.text}`}>{stat.value}</div>
                      <div className={`text-sm ${currentTheme.muted}`}>{stat.label}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-12 text-center`}>
            <MessageCircle className={`h-12 w-12 mx-auto mb-6 text-blue-400`} />
            <h3 className={`text-3xl font-bold ${currentTheme.text} mb-4`}>
              Ready to Start Trading?
            </h3>
            <p className={`${currentTheme.muted} mb-8 text-lg`}>
              Join our community of digital traders and start your journey today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button className={`bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg ${hoverClasses.scale}`}>
                  Join Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/messages">
                <Button variant="outline" className={`${currentTheme.text} border-2 px-8 py-3 text-lg ${hoverClasses.scale}`}>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Get Support
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
