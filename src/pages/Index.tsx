
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
  Diamond,
  MessageCircle,
  Users,
  Star,
  Heart,
  Gift,
  Flame,
  Moon,
  Sun,
  Skull,
  Ghost
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

  const weirdFacts = [
    { icon: Ghost, text: "Our CEO is actually three raccoons in a trench coat 🦝", color: "text-purple-400" },
    { icon: Moon, text: "We operate exclusively during lunar eclipses", color: "text-blue-300" },
    { icon: Skull, text: "100% of our users are secretly ninjas 🥷", color: "text-gray-400" },
    { icon: Flame, text: "Our servers run on pure vibes and energy drinks", color: "text-orange-500" }
  ];

  const chaosStats = [
    { icon: Trophy, number: "∞+1", label: "Chaos Level", emoji: "🌪️" },
    { icon: PartyPopper, number: "404", label: "Braincells Found", emoji: "🧠" },
    { icon: Laugh, number: "69", label: "Memes Per Second", emoji: "😂" },
    { icon: Crown, number: "42", label: "Answer to Everything", emoji: "🌌" }
  ];

  const randomChaos = [
    "Probably not run by aliens... probably 👽",
    "Warning: Side effects may include spontaneous dancing 💃",
    "Powered by hamsters on espresso ☕🐹",
    "Your local FBI agent recommends us 👨‍💻",
    "Certified by the International Meme Council 📜",
    "100% organic, free-range pixels 🌱",
    "Endorsed by time travelers from 2087 ⏰",
    "Built with pure chaotic neutral energy ⚡"
  ];

  const [currentChaos, setCurrentChaos] = useState(randomChaos[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentChaos(randomChaos[Math.floor(Math.random() * randomChaos.length)]);
    }, 2500);
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
            Where Digital Dreams Come True ✨
          </h2>
          <p className={`text-lg md:text-xl ${currentTheme.muted} mb-6 max-w-3xl mx-auto leading-relaxed`}>
            The most unhinged marketplace on the internet. Buy stuff, sell stuff, question reality. We've got it all! 🎭
          </p>
          
          {/* Rotating chaos message */}
          <div className={`text-lg ${currentTheme.accent} mb-8 h-8 flex items-center justify-center transition-all duration-500`}>
            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
            {currentChaos}
            <Sparkles className="ml-2 h-5 w-5 animate-pulse" />
          </div>

          {/* Discord Section */}
          <div className="mb-12">
            <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 max-w-md mx-auto ${hoverClasses.scale} transition-all duration-300`}>
              <div className="flex items-center justify-center mb-4">
                <MessageCircle className={`h-8 w-8 ${currentTheme.accent} mr-3`} />
                <Users className={`h-6 w-6 ${currentTheme.text}`} />
              </div>
              <h3 className={`text-xl font-bold ${currentTheme.text} mb-2`}>
                Join the Chaos! 🎮
              </h3>
              <p className={`${currentTheme.muted} mb-4 text-sm`}>
                Connect with fellow digital traders, share memes, and witness pure chaos unfold in real-time
              </p>
              <a 
                href="https://discord.gg/bY6TRDP4hV" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button className={`w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 rounded-lg transition-all duration-300 ${hoverClasses.scale}`}>
                  Join Discord Server 🚀
                </Button>
              </a>
            </Card>
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
              placeholder="Search for digital treasures... or cursed items 🔮"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-16 py-6 text-lg ${currentTheme.cardBg} ${currentTheme.text} border ${currentTheme.border} rounded-2xl shadow-xl focus:ring-2 focus:ring-opacity-50 transition-all duration-300`}
            />
          </div>
        </div>

        {/* Weird Facts Section */}
        <div className="mb-20">
          <h3 className={`text-4xl font-bold ${currentTheme.text} text-center mb-4`}>
            Absolutely True Facts™
          </h3>
          <p className={`text-center ${currentTheme.muted} mb-12`}>
            *Fact-checkers hate this one simple trick 📰
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {weirdFacts.map((fact, index) => (
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

        {/* Chaos Stats Section */}
        <div className="mb-20">
          <h3 className={`text-4xl font-bold ${currentTheme.text} text-center mb-4`}>
            Statistical Impossibilities
          </h3>
          <p className={`text-center ${currentTheme.muted} mb-12`}>
            Our mathematicians are very confused 🤔
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {chaosStats.map((stat, index) => (
              <Card 
                key={index} 
                className={`${currentTheme.cardBg} border ${currentTheme.border} p-8 text-center ${hoverClasses.scale} transition-all duration-300 group`}
              >
                <div className="flex items-center justify-center mb-4">
                  <stat.icon className={`h-10 w-10 ${currentTheme.accent} mr-2 group-hover:animate-pulse`} />
                  <span className="text-2xl">{stat.emoji}</span>
                </div>
                <div className={`text-4xl font-black ${currentTheme.text} mb-2`}>{stat.number}</div>
                <p className={`text-sm ${currentTheme.muted} uppercase tracking-wider`}>{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Interdimensional Trading Zone */}
        <div className="mb-20">
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-12 text-center relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10"></div>
            <div className="relative z-10">
              <div className="flex justify-center items-center mb-6">
                <Rocket className={`h-16 w-16 ${currentTheme.accent} mr-4 animate-bounce`} />
                <Diamond className={`h-12 w-12 ${currentTheme.text} animate-spin`} style={{animationDuration: '4s'}} />
                <Star className={`h-14 w-14 ${currentTheme.accent} ml-4 animate-pulse`} />
              </div>
              <h3 className={`text-5xl font-bold ${currentTheme.text} mb-4`}>
                Interdimensional Trading Portal 🌌
              </h3>
              <p className={`${currentTheme.muted} mb-8 text-xl max-w-2xl mx-auto`}>
                Where reality bends, wallets empty, and digital dreams become slightly more real. Proceed with caution! ⚠️
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className={`px-4 py-2 ${currentTheme.secondary} rounded-full text-sm font-semibold`}>
                  🔥 Chaos Certified
                </span>
                <span className={`px-4 py-2 ${currentTheme.secondary} rounded-full text-sm font-semibold`}>
                  ⚡ Reality Optional
                </span>
                <span className={`px-4 py-2 ${currentTheme.secondary} rounded-full text-sm font-semibold`}>
                  🏆 Meme Approved
                </span>
                <span className={`px-4 py-2 ${currentTheme.secondary} rounded-full text-sm font-semibold`}>
                  🎭 Drama Included
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Final CTA Section */}
        <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-16 text-center`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center items-center mb-6">
              <Heart className={`h-8 w-8 ${currentTheme.accent} mr-2 animate-pulse`} />
              <Gift className={`h-10 w-10 ${currentTheme.text}`} />
              <Heart className={`h-8 w-8 ${currentTheme.accent} ml-2 animate-pulse`} />
            </div>
            <h3 className={`text-4xl font-bold ${currentTheme.text} mb-6`}>
              Ready to Embrace the Chaos? 🎪
            </h3>
            <p className={`${currentTheme.muted} mb-10 text-xl leading-relaxed`}>
              Join thousands of digital nomads, meme lords, and questionable characters in the wildest marketplace adventure! 🎢
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/signup">
                <Button className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-10 py-4 text-xl font-semibold rounded-xl ${hoverClasses.scale} shadow-2xl`}>
                  Join the Madness 🎯
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" className={`${currentTheme.text} border-2 ${currentTheme.border} hover:${currentTheme.cardBg} px-10 py-4 text-xl font-semibold rounded-xl ${hoverClasses.scale}`}>
                  Explore the Unknown 🔍
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
