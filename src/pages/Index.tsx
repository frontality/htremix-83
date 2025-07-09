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
  Gift,
  Gamepad2,
  Music,
  Code,
  TrendingUp,
  ArrowRight,
  Star,
  Lock,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimations } from "@/hooks/useAnimations";

const Index = () => {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const { isVisible, animationClasses, hoverClasses } = useAnimations();

  // Auto-show animation on mount
  useEffect(() => {
    setTimeout(() => {}, 100);
  }, []);

  const categories = [
    { icon: Gift, name: "Digital Products", description: "Software, licenses & more", color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: Gamepad2, name: "Gaming", description: "Accounts, items & cheats", color: "text-green-400", bg: "bg-green-500/10" },
    { icon: Music, name: "Entertainment", description: "Media & streaming", color: "text-purple-400", bg: "bg-purple-500/10" },
    { icon: Code, name: "Software", description: "Tools & applications", color: "text-orange-400", bg: "bg-orange-500/10" }
  ];

  const features = [
    { icon: Shield, title: "Secure Trading", description: "Protected transactions with escrow system" },
    { icon: Zap, title: "Instant Delivery", description: "Fast automated delivery for digital goods" },
    { icon: Users, title: "Trusted Community", description: "Verified sellers and buyer protection" },
    { icon: Globe, title: "Global Access", description: "Trade worldwide with multiple payment methods" }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bg} relative`}>
      <div className="container mx-auto px-4 py-16">
        
        {/* Hero Section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? animationClasses.fadeIn : 'opacity-0'}`}>
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tight">
              <span className={`bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent drop-shadow-2xl shadow-2xl`} style={{textShadow: '0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'}}>
                SKID
              </span>
              <span className={`mx-4 ${currentTheme.text} drop-shadow-2xl`} style={{textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'}}>×</span>
              <span className={`bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent drop-shadow-2xl shadow-2xl`} style={{textShadow: '0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'}}>
                HAVEN
              </span>
            </h1>
            <div className={`w-32 h-1 bg-gradient-to-r ${currentTheme.gradient} mx-auto rounded-full mb-8`}></div>
          </div>

          <h2 className={`text-2xl md:text-4xl ${currentTheme.text} mb-6 font-light max-w-4xl mx-auto leading-relaxed`}>
            The Premier Digital Marketplace
          </h2>
          <p className={`text-lg md:text-xl ${currentTheme.muted} mb-12 max-w-3xl mx-auto leading-relaxed`}>
            Buy, sell, and trade digital goods with confidence. Join thousands of traders in the most trusted marketplace for digital assets.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/marketplace">
              <Button className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-10 py-4 text-xl font-semibold rounded-xl ${hoverClasses.scale} shadow-2xl border-0 transition-all duration-300`}>
                <ShoppingBag className="mr-3 h-6 w-6" />
                Browse Marketplace
              </Button>
            </Link>
            <Link to="/sell">
              <Button className={`${currentTheme.cardBg} hover:opacity-90 ${currentTheme.text} px-10 py-4 text-xl font-semibold rounded-xl ${hoverClasses.scale} shadow-2xl border ${currentTheme.border} transition-all duration-300`}>
                <TrendingUp className="mr-3 h-6 w-6" />
                Start Selling
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-16">
            <Search className={`absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 ${currentTheme.muted}`} />
            <Input
              placeholder="Search digital products, accounts, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-16 py-6 text-lg ${currentTheme.cardBg} ${currentTheme.text} border ${currentTheme.border} rounded-2xl shadow-xl focus:ring-2 focus:ring-opacity-50 transition-all duration-300`}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-20">
          <h3 className={`text-4xl font-bold ${currentTheme.text} text-center mb-12`}>
            Popular Categories
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className={`${currentTheme.cardBg} border ${currentTheme.border} p-8 text-center ${hoverClasses.scale} cursor-pointer group transition-all duration-300`}
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className={`${category.bg} rounded-2xl p-4 mb-6 inline-block`}>
                  <category.icon className={`h-12 w-12 ${category.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <h4 className={`text-xl font-bold ${currentTheme.text} mb-2`}>{category.name}</h4>
                <p className={`text-sm ${currentTheme.muted}`}>{category.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h3 className={`text-4xl font-bold ${currentTheme.text} text-center mb-12`}>
            Why Choose SKID×HAVEN
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 text-center ${hoverClasses.scale} transition-all duration-300`}
                style={{animationDelay: `${index * 150}ms`}}
              >
                <feature.icon className={`h-12 w-12 ${currentTheme.accent} mx-auto mb-4`} />
                <h4 className={`text-lg font-bold ${currentTheme.text} mb-2`}>{feature.title}</h4>
                <p className={`text-sm ${currentTheme.muted}`}>{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA Section */}
        <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-16 text-center`}>
          <div className="max-w-4xl mx-auto">
            <h3 className={`text-4xl font-bold ${currentTheme.text} mb-6`}>
              Ready to Start Trading?
            </h3>
            <p className={`${currentTheme.muted} mb-10 text-xl leading-relaxed`}>
              Join our marketplace today and discover thousands of digital products from trusted sellers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/signup">
                <Button className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-10 py-4 text-xl font-semibold rounded-xl ${hoverClasses.scale} shadow-2xl`}>
                  Create Account
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" className={`${currentTheme.text} border-2 ${currentTheme.border} hover:${currentTheme.cardBg} px-10 py-4 text-xl font-semibold rounded-xl ${hoverClasses.scale}`}>
                  Explore Products
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
