
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Gamepad2,
  Zap,
  Coffee,
  Pizza,
  Cat,
  Rocket,
  Sparkles,
  Trophy,
  PartyPopper,
  Laugh,
  Crown,
  Diamond
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

  const funFacts = [
    { icon: Cat, text: "Our servers are powered by cat purrs", color: "text-orange-400" },
    { icon: Pizza, text: "99.9% of trades happen during pizza breaks", color: "text-red-400" },
    { icon: Coffee, text: "Coffee consumption = Server performance", color: "text-amber-400" },
    { icon: Rocket, text: "We literally launched to the moon once", color: "text-blue-400" }
  ];

  const funStats = [
    { icon: Trophy, number: "42", label: "Memes Created Daily" },
    { icon: PartyPopper, number: "∞", label: "Fun Factor" },
    { icon: Laugh, number: "9001", label: "Jokes Told" },
    { icon: Crown, number: "1", label: "Supreme Overlord Cats" }
  ];

  const randomMessages = [
    "Definitely not a front for intergalactic traders 👽",
    "Warning: May cause excessive happiness",
    "Side effects include: Better mood, more money",
    "Powered by pure chaos energy ⚡",
    "Your mom approves of this marketplace"
  ];

  const [currentMessage, setCurrentMessage] = useState(randomMessages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(randomMessages[Math.floor(Math.random() * randomMessages.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
          <p className={`text-lg md:text-xl ${currentTheme.muted} mb-6 max-w-3xl mx-auto leading-relaxed`}>
            Buy, sell, and trade digital goods with confidence. Join thousands of traders in the most trusted marketplace for digital assets.
          </p>
          
          {/* Fun rotating message */}
          <div className={`text-lg ${currentTheme.accent} mb-12 h-8 flex items-center justify-center transition-all duration-500`}>
            <Sparkles className="mr-2 h-5 w-5" />
            {currentMessage}
            <Sparkles className="ml-2 h-5 w-5" />
          </div>
          
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

        {/* Fun Facts Section */}
        <div className="mb-20">
          <h3 className={`text-4xl font-bold ${currentTheme.text} text-center mb-12`}>
            Totally Legit Fun Facts™
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {funFacts.map((fact, index) => (
              <Card 
                key={index} 
                className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 text-center ${hoverClasses.scale} cursor-pointer group transition-all duration-300`}
              >
                <fact.icon className={`h-12 w-12 ${fact.color} mx-auto mb-4 group-hover:animate-bounce`} />
                <p className={`text-sm ${currentTheme.text} font-medium`}>{fact.text}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Fun Stats Section */}
        <div className="mb-20">
          <h3 className={`text-4xl font-bold ${currentTheme.text} text-center mb-12`}>
            Absolutely Real Statistics
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {funStats.map((stat, index) => (
              <Card 
                key={index} 
                className={`${currentTheme.cardBg} border ${currentTheme.border} p-8 text-center ${hoverClasses.scale} transition-all duration-300`}
              >
                <stat.icon className={`h-10 w-10 ${currentTheme.accent} mx-auto mb-4`} />
                <div className={`text-4xl font-black ${currentTheme.text} mb-2`}>{stat.number}</div>
                <p className={`text-sm ${currentTheme.muted} uppercase tracking-wider`}>{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Chaotic Gaming Zone */}
        <div className="mb-20">
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-12 text-center relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
            <div className="relative z-10">
              <div className="flex justify-center items-center mb-6">
                <Gamepad2 className={`h-16 w-16 ${currentTheme.accent} mr-4 animate-pulse`} />
                <Diamond className={`h-12 w-12 ${currentTheme.text} animate-spin`} style={{animationDuration: '3s'}} />
                <Zap className={`h-16 w-16 ${currentTheme.accent} ml-4 animate-bounce`} />
              </div>
              <h3 className={`text-5xl font-bold ${currentTheme.text} mb-4`}>
                Epic Gaming Zone Activated
              </h3>
              <p className={`${currentTheme.muted} mb-8 text-xl max-w-2xl mx-auto`}>
                Where legends are born, noobs get rekt, and your wallet gets lighter (but your inventory gets heavier)
              </p>
              <div className="flex justify-center gap-4">
                <span className={`px-4 py-2 ${currentTheme.secondary} rounded-full text-sm font-semibold`}>
                  🔥 MLG Pro Mode
                </span>
                <span className={`px-4 py-2 ${currentTheme.secondary} rounded-full text-sm font-semibold`}>
                  ⚡ 360 No Scope
                </span>
                <span className={`px-4 py-2 ${currentTheme.secondary} rounded-full text-sm font-semibold`}>
                  🏆 Achievement Unlocked
                </span>
              </div>
            </div>
          </Card>
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
