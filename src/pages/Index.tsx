
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Shield,
  Zap,
  Users,
  Star,
  MessageCircle,
  CheckCircle,
  Globe,
  Rocket,
  Trophy,
  Lock
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimations } from "@/hooks/useAnimations";

const Index = () => {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const { isVisible, animationClasses, hoverClasses } = useAnimations();

  useEffect(() => {
    setTimeout(() => {}, 100);
  }, []);

  const features = [
    { 
      icon: Shield, 
      title: "Secure Trading", 
      description: "Military-grade encryption for all transactions",
      color: "text-green-400"
    },
    { 
      icon: Zap, 
      title: "Lightning Fast", 
      description: "Instant delivery for digital products",
      color: "text-yellow-400"
    },
    { 
      icon: Users, 
      title: "Trusted Community", 
      description: "Join thousands of verified traders",
      color: "text-blue-400"
    },
    { 
      icon: Lock, 
      title: "Privacy First", 
      description: "Your data stays protected, always",
      color: "text-purple-400"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: Users },
    { number: "1M+", label: "Transactions", icon: TrendingUp },
    { number: "99.9%", label: "Uptime", icon: CheckCircle },
    { number: "24/7", label: "Support", icon: MessageCircle }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bg} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/20"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        
        {/* Hero Section */}
        <div className={`text-center mb-24 transition-all duration-1000 ${isVisible ? animationClasses.fadeIn : 'opacity-0'}`}>
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight">
              <span className={`bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                SKID
              </span>
              <span className={`mx-3 ${currentTheme.text}`}>×</span>
              <span className={`bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                HAVEN
              </span>
            </h1>
            <div className={`w-24 h-1 bg-gradient-to-r ${currentTheme.gradient} mx-auto rounded-full mb-8`}></div>
            
            <h2 className={`text-xl md:text-3xl ${currentTheme.text} mb-6 font-light max-w-4xl mx-auto leading-relaxed`}>
              The Premier Digital Marketplace
            </h2>
            <p className={`text-lg ${currentTheme.muted} mb-8 max-w-2xl mx-auto leading-relaxed`}>
              Secure, fast, and reliable trading platform for digital assets and services. 
              Join our community of trusted traders worldwide.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/marketplace">
              <Button className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-8 py-4 text-lg font-semibold rounded-xl ${hoverClasses.scale} shadow-xl transition-all duration-300`}>
                <ShoppingBag className="mr-3 h-5 w-5" />
                Explore Marketplace
              </Button>
            </Link>
            <Link to="/sell">
              <Button variant="outline" className={`${currentTheme.text} border-2 ${currentTheme.border} hover:${currentTheme.cardBg} px-8 py-4 text-lg font-semibold rounded-xl ${hoverClasses.scale} transition-all duration-300`}>
                <TrendingUp className="mr-3 h-5 w-5" />
                Start Trading
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.muted}`} />
            <Input
              placeholder="Search for digital products and services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-12 py-4 text-lg ${currentTheme.cardBg} ${currentTheme.text} border ${currentTheme.border} rounded-xl shadow-lg focus:ring-2 focus:ring-opacity-50 transition-all duration-300`}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-24">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 text-center ${hoverClasses.scale} transition-all duration-300`}
              >
                <stat.icon className={`h-8 w-8 ${currentTheme.accent} mx-auto mb-4`} />
                <div className={`text-3xl font-bold ${currentTheme.text} mb-2`}>{stat.number}</div>
                <p className={`text-sm ${currentTheme.muted} uppercase tracking-wider`}>{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className={`text-4xl font-bold ${currentTheme.text} mb-4`}>
              Why Choose SKID×HAVEN?
            </h3>
            <p className={`text-lg ${currentTheme.muted} max-w-2xl mx-auto`}>
              Built for traders, by traders. Experience the future of digital commerce.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 ${hoverClasses.scale} transition-all duration-300 group`}
              >
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`} />
                <h4 className={`text-xl font-semibold ${currentTheme.text} mb-3`}>{feature.title}</h4>
                <p className={`text-sm ${currentTheme.muted} leading-relaxed`}>{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Discord Community Section */}
        <div className="mb-24">
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-12 text-center relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10"></div>
            <div className="relative z-10">
              <div className="flex justify-center items-center mb-6">
                <MessageCircle className={`h-16 w-16 text-[#5865F2] mr-4`} />
                <Users className={`h-12 w-12 ${currentTheme.text}`} />
              </div>
              <h3 className={`text-4xl font-bold ${currentTheme.text} mb-4`}>
                Join Our Community
              </h3>
              <p className={`${currentTheme.muted} mb-8 text-lg max-w-2xl mx-auto`}>
                Connect with fellow traders, get support, and stay updated with the latest features and announcements.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <span className={`px-4 py-2 ${currentTheme.secondary} rounded-full text-sm font-semibold flex items-center`}>
                  <Globe className="mr-2 h-4 w-4" />
                  Global Community
                </span>
                <span className={`px-4 py-2 ${currentTheme.secondary} rounded-full text-sm font-semibold flex items-center`}>
                  <Rocket className="mr-2 h-4 w-4" />
                  Instant Support
                </span>
                <span className={`px-4 py-2 ${currentTheme.secondary} rounded-full text-sm font-semibold flex items-center`}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Exclusive Updates
                </span>
              </div>
              <a 
                href="https://discord.gg/bY6TRDP4hV" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className={`bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-4 px-8 text-lg rounded-xl transition-all duration-300 ${hoverClasses.scale} shadow-xl`}>
                  <MessageCircle className="mr-3 h-5 w-5" />
                  Join Discord Server
                </Button>
              </a>
            </div>
          </Card>
        </div>

        {/* Final CTA Section */}
        <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-16 text-center`}>
          <div className="max-w-4xl mx-auto">
            <Star className={`h-12 w-12 ${currentTheme.accent} mx-auto mb-6`} />
            <h3 className={`text-4xl font-bold ${currentTheme.text} mb-6`}>
              Ready to Start Trading?
            </h3>
            <p className={`${currentTheme.muted} mb-10 text-xl leading-relaxed`}>
              Join thousands of successful traders on the most trusted digital marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/signup">
                <Button className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-10 py-4 text-xl font-semibold rounded-xl ${hoverClasses.scale} shadow-xl`}>
                  Get Started Today
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" className={`${currentTheme.text} border-2 ${currentTheme.border} hover:${currentTheme.cardBg} px-10 py-4 text-xl font-semibold rounded-xl ${hoverClasses.scale}`}>
                  Browse Marketplace
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
