
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
  CheckCircle,
  Star,
  ArrowRight
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
    { icon: Gift, name: "Digital Products", count: "2,500+", color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: Gamepad2, name: "Gaming", count: "1,200+", color: "text-green-400", bg: "bg-green-500/10" },
    { icon: Music, name: "Entertainment", count: "800+", color: "text-purple-400", bg: "bg-purple-500/10" },
    { icon: Code, name: "Software", count: "600+", color: "text-orange-400", bg: "bg-orange-500/10" }
  ];

  const stats = [
    { label: "Active Traders", value: "15,000+", icon: Users, color: "text-blue-400" },
    { label: "Products Listed", value: "35,000+", icon: ShoppingBag, color: "text-green-400" },
    { label: "Successful Trades", value: "75,000+", icon: CheckCircle, color: "text-purple-400" },
    { label: "Average Rating", value: "4.9/5", icon: Star, color: "text-yellow-400" }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bg} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        
        {/* Hero Section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? animationClasses.fadeIn : 'opacity-0'}`}>
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
                SKID
              </span>
              <span className="mx-4 text-white">×</span>
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-2xl">
                HAVEN
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-purple-500 mx-auto rounded-full mb-8"></div>
          </div>

          <h2 className={`text-2xl md:text-4xl ${currentTheme.text} mb-6 font-light max-w-4xl mx-auto leading-relaxed`}>
            The Ultimate Digital Marketplace Experience
          </h2>
          <p className={`text-lg md:text-xl ${currentTheme.muted} mb-12 max-w-3xl mx-auto leading-relaxed`}>
            Connect, trade, and thrive in the most advanced digital ecosystem. Your gateway to limitless possibilities.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/marketplace">
              <Button className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-xl font-semibold rounded-xl ${hoverClasses.scale} shadow-2xl border-0 transition-all duration-300`}>
                <ShoppingBag className="mr-3 h-6 w-6" />
                Browse Marketplace
              </Button>
            </Link>
            <Link to="/sell">
              <Button className={`bg-black hover:bg-gray-900 text-white px-10 py-4 text-xl font-semibold rounded-xl ${hoverClasses.scale} shadow-2xl border border-gray-700 transition-all duration-300`}>
                <TrendingUp className="mr-3 h-6 w-6" />
                Start Selling
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-16">
            <Search className={`absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 ${currentTheme.muted}`} />
            <Input
              placeholder="Search products, services, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-16 py-6 text-lg ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-2xl shadow-2xl backdrop-blur-md bg-white/10 focus:bg-white/20 transition-all duration-300`}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-20">
          <h3 className={`text-4xl font-bold ${currentTheme.text} text-center mb-12`}>
            Explore Categories
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className={`${currentTheme.cardBg} border ${currentTheme.border} p-8 text-center ${hoverClasses.scale} cursor-pointer group backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300`}
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className={`${category.bg} rounded-2xl p-4 mb-6 inline-block`}>
                  <category.icon className={`h-12 w-12 ${category.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <h4 className={`text-xl font-bold ${currentTheme.text} mb-3`}>{category.name}</h4>
                <p className={`text-lg ${currentTheme.muted}`}>{category.count} items</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <h3 className={`text-4xl font-bold ${currentTheme.text} text-center mb-12`}>
            Platform Statistics
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className={`${currentTheme.cardBg} border ${currentTheme.border} p-8 text-center ${hoverClasses.scale} backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300`}
                style={{animationDelay: `${index * 150}ms`}}
              >
                <stat.icon className={`h-12 w-12 ${stat.color} mx-auto mb-4`} />
                <div className={`text-3xl font-black ${currentTheme.text} mb-2`}>{stat.value}</div>
                <div className={`text-lg ${currentTheme.muted}`}>{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA Section */}
        <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-16 text-center backdrop-blur-md bg-white/5`}>
          <div className="max-w-4xl mx-auto">
            <h3 className={`text-4xl font-bold ${currentTheme.text} mb-6`}>
              Ready to Join the Revolution?
            </h3>
            <p className={`${currentTheme.muted} mb-10 text-xl leading-relaxed`}>
              Step into the future of digital trading. Create your account and start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/signup">
                <Button className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 text-xl font-semibold rounded-xl ${hoverClasses.scale} shadow-2xl`}>
                  Get Started Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/messages">
                <Button variant="outline" className={`${currentTheme.text} border-2 border-gray-600 hover:bg-gray-800/50 px-10 py-4 text-xl font-semibold rounded-xl ${hoverClasses.scale} backdrop-blur-md`}>
                  Learn More
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
