
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
  Flame,
  TrendingUp,
  CheckCircle,
  Globe
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
    { icon: Shield, title: t("Military Grade Security"), description: t("Advanced encryption protocols"), color: "text-emerald-400" },
    { icon: TrendingUp, title: t("Instant Transactions"), description: t("Lightning fast delivery"), color: "text-blue-400" },
    { icon: CheckCircle, title: t("Verified Sellers"), description: t("Trusted marketplace"), color: "text-green-400" },
    { icon: Globe, title: t("Global Network"), description: t("Worldwide community"), color: "text-purple-400" },
    { icon: Star, title: t("Premium Support"), description: t("24/7 professional assistance"), color: "text-yellow-400" },
    { icon: Flame, title: t("Competitive Rates"), description: t("Best market prices"), color: "text-orange-400" }
  ];

  const categories = [
    { icon: Gift, name: t("Digital Assets"), count: t("Secure trading"), color: "text-blue-400" },
    { icon: Gamepad2, name: t("Premium Accounts"), count: t("Authenticated sellers"), color: "text-green-400" },
    { icon: Music, name: t("Subscriptions"), count: t("Verified services"), color: "text-purple-400" },
    { icon: Crown, name: t("Exclusive Items"), count: t("Limited availability"), color: "text-yellow-400" }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bg} overflow-hidden`}>
      {/* Sophisticated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900/20 via-transparent to-slate-800/20"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          
          {/* Professional Hero Section */}
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? animationClasses.fadeIn : 'opacity-0'}`}>
            {/* Professional Badge */}
            <div className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-full border border-slate-600/30 mb-8 backdrop-blur-sm">
              <Shield className="h-5 w-5 text-emerald-400" />
              <span className={`text-sm font-medium ${currentTheme.text} tracking-wide`}>SECURE DIGITAL MARKETPLACE</span>
              <CheckCircle className="h-5 w-5 text-blue-400" />
            </div>

            <div className="flex items-center justify-center mb-8">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold flex items-center gap-8 hover:scale-105 transition-transform duration-300">
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                  SKID
                </span>
                <div className={`animate-float ${hoverClasses.scale} relative`}>
                  <img 
                    src="/lovable-uploads/2a21bfaa-d803-4e5a-aa4e-e377ae6c835f.png" 
                    alt="Volcano Logo" 
                    className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:rotate-12 transition-transform duration-300"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                  HAVEN
                </span>
              </h1>
            </div>

            <div className="relative">
              <p className={`text-2xl md:text-3xl lg:text-4xl ${currentTheme.text} mb-6 max-w-6xl mx-auto leading-relaxed font-light`}>
                {t("Professional Digital Marketplace")}
              </p>
              <p className={`text-lg md:text-xl ${currentTheme.muted} mb-12 max-w-4xl mx-auto opacity-90`}>
                {t("Secure transactions, verified sellers, instant delivery. Your trusted platform for digital commerce.")}
              </p>
            </div>
            
            {/* Professional CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/marketplace">
                <Button className={`bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-14 py-5 text-xl font-medium ${hoverClasses.scale} transition-all duration-300 shadow-2xl hover:shadow-slate-500/25 border border-slate-600/50 rounded-xl`}>
                  <ShoppingBag className="mr-3 h-6 w-6" />
                  {t("Browse Marketplace")}
                </Button>
              </Link>
              <Link to="/sell">
                <Button variant="outline" className={`${currentTheme.text} border-2 border-slate-600/50 px-14 py-5 text-xl font-medium ${hoverClasses.scale} transition-all duration-300 backdrop-blur-sm bg-slate-800/20 hover:bg-slate-800/40 rounded-xl`}>
                  <TrendingUp className="mr-3 h-6 w-6" />
                  {t("Start Selling")}
                </Button>
              </Link>
            </div>

            {/* Professional Search Bar */}
            <div className="relative max-w-4xl mx-auto mb-20">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-700 to-slate-600 rounded-2xl blur opacity-20"></div>
              <div className="relative">
                <Search className={`absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 ${currentTheme.muted}`} />
                <Input
                  placeholder={t("Search digital products and services...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-16 py-7 text-xl ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-2xl shadow-2xl hover:shadow-slate-500/25 transition-all duration-300 backdrop-blur-sm bg-slate-800/30`}
                />
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl">
                    <Shield className="h-4 w-4 text-white" />
                    <span className="text-white text-sm font-medium">Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            
            {/* Features Grid */}
            <div>
              <h2 className={`text-4xl md:text-5xl font-bold ${currentTheme.text} mb-12 text-center lg:text-left flex items-center gap-4`}>
                <Shield className="h-10 w-10 text-emerald-400" />
                {t("Why Choose Us")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className={`${currentTheme.cardBg} border-2 border-slate-700/50 p-8 text-center ${hoverClasses.scale} transition-all duration-300 hover:shadow-2xl hover:shadow-slate-500/25 group relative overflow-hidden rounded-xl`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800/10 to-slate-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <feature.icon className={`h-16 w-16 mx-auto mb-6 ${feature.color} group-hover:scale-110 transition-all duration-300 relative z-10`} />
                    <h3 className={`text-xl font-bold ${currentTheme.text} mb-3 relative z-10`}>{feature.title}</h3>
                    <p className={`text-base ${currentTheme.muted} relative z-10`}>{feature.description}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Categories & CTA */}
            <div>
              <h2 className={`text-4xl md:text-5xl font-bold ${currentTheme.text} mb-12 text-center lg:text-left flex items-center gap-4`}>
                <Globe className="h-10 w-10 text-blue-400" />
                {t("Categories")}
              </h2>
              <div className="grid grid-cols-2 gap-8 mb-12">
                {categories.map((category, index) => (
                  <Card key={index} className={`${currentTheme.cardBg} border-2 border-slate-700/50 p-8 text-center ${hoverClasses.scale} transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:shadow-slate-500/25 relative overflow-hidden rounded-xl`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800/10 to-slate-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <category.icon className={`h-16 w-16 mx-auto mb-6 ${category.color} group-hover:scale-110 transition-all duration-300 relative z-10`} />
                    <h3 className={`text-xl font-bold ${currentTheme.text} mb-3 relative z-10`}>{category.name}</h3>
                    <p className={`text-base ${currentTheme.muted} relative z-10`}>{category.count}</p>
                  </Card>
                ))}
              </div>

              {/* Professional Final CTA */}
              <Card className={`${currentTheme.cardBg} border-2 border-slate-700/50 p-12 text-center relative overflow-hidden rounded-xl`}>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800/20 to-slate-700/20"></div>
                <Globe className={`h-12 w-12 mx-auto mb-6 text-blue-400 relative z-10`} />
                <h3 className={`text-3xl font-bold ${currentTheme.text} mb-6 relative z-10`}>
                  {t("Join Our Community")}
                </h3>
                <p className={`${currentTheme.muted} mb-10 text-lg relative z-10`}>
                  {t("Connect with verified sellers and buyers in our secure marketplace")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                  <Link to="/signup">
                    <Button className={`bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-10 py-4 text-lg font-medium ${hoverClasses.scale} transition-all duration-300 shadow-xl rounded-xl`}>
                      <Users className="mr-2 h-5 w-5" />
                      {t("Create Account")}
                    </Button>
                  </Link>
                  <Link to="/messages">
                    <Button variant="outline" className={`${currentTheme.text} border-2 border-slate-600/50 px-10 py-4 text-lg font-medium ${hoverClasses.scale} transition-all duration-300 backdrop-blur-sm rounded-xl`}>
                      <MessageCircle className="mr-2 h-5 w-5" />
                      {t("Contact Support")}
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>

          {/* Professional Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: t("Active Users"), value: "50K+", icon: Users },
              { label: t("Products"), value: "1M+", icon: ShoppingBag },
              { label: t("Success Rate"), value: "99.8%", icon: Trophy },
              { label: t("Security"), value: "A+", icon: Shield }
            ].map((stat, index) => (
              <Card key={index} className={`${currentTheme.cardBg} border-2 border-slate-700/50 p-8 text-center ${hoverClasses.scale} transition-all duration-300 hover:shadow-2xl hover:shadow-slate-500/25 relative overflow-hidden group rounded-xl`}>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800/10 to-slate-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
