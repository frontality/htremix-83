
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, TrendingUp, DollarSign, Shield, Settings, Users, Headphones } from "lucide-react";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/7f28697e-7fbb-4316-ba56-7074afdf6cc6.png" 
                alt="SkidHaven Logo" 
                className="h-16 w-16"
              />
              <h1 className={`text-5xl md:text-7xl font-bold ${currentTheme.text}`}>
                Skid<span className={currentTheme.accent}>Haven</span>
              </h1>
            </div>
            
            <p className={`text-xl md:text-2xl ${currentTheme.muted} mb-8`}>
              The Ultimate Marketplace for Buying & Selling Items
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                size="lg" 
                className={`${currentTheme.primary} text-white px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity`}
                onClick={() => navigate("/marketplace")}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Items
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className={`${currentTheme.secondary} ${currentTheme.text} border-0 px-8 py-4 text-lg font-semibold hover:opacity-80`}
                onClick={() => navigate("/sell")}
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Start Selling
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <span className={`${currentTheme.primary} text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider`}>
              BENEFITS
            </span>
            <h2 className={`text-4xl font-bold ${currentTheme.text} mt-4 mb-4`}>
              Why Choose SkidHaven?
            </h2>
            <p className={`text-lg ${currentTheme.muted} max-w-2xl mx-auto`}>
              Experience seamless buying and selling with our user-friendly platform designed for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={`${currentTheme.cardBg} rounded-xl p-8 border ${currentTheme.border}`}>
              <div className={`${currentTheme.primary} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-4`}>
                Affordable Prices
              </h3>
              <p className={`${currentTheme.muted} text-sm`}>
                Find great deals and affordable prices on quality items from trusted sellers.
              </p>
            </div>
            
            <div className={`${currentTheme.cardBg} rounded-xl p-8 border ${currentTheme.border}`}>
              <div className={`${currentTheme.primary} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-4`}>
                Real-Time Insights
              </h3>
              <p className={`${currentTheme.muted} text-sm`}>
                Track your purchases and sales with our intuitive dashboard and analytics.
              </p>
            </div>
            
            <div className={`${currentTheme.cardBg} rounded-xl p-8 border ${currentTheme.border}`}>
              <div className={`${currentTheme.primary} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-4`}>
                Trusted Community
              </h3>
              <p className={`${currentTheme.muted} text-sm`}>
                Connect with verified buyers and sellers in our growing marketplace community.
              </p>
            </div>
            
            <div className={`${currentTheme.cardBg} rounded-xl p-8 border ${currentTheme.border}`}>
              <div className={`${currentTheme.primary} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-4`}>
                Secure Transactions
              </h3>
              <p className={`${currentTheme.muted} text-sm`}>
                Shop with confidence using our secure payment system and buyer protection.
              </p>
            </div>
            
            <div className={`${currentTheme.cardBg} rounded-xl p-8 border ${currentTheme.border}`}>
              <div className={`${currentTheme.primary} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-4`}>
                Easy Management
              </h3>
              <p className={`${currentTheme.muted} text-sm`}>
                Manage your listings, orders, and communications all in one place.
              </p>
            </div>
            
            <div className={`${currentTheme.cardBg} rounded-xl p-8 border ${currentTheme.border}`}>
              <div className={`${currentTheme.primary} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                <Headphones className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-4`}>
                24/7 Support
              </h3>
              <p className={`${currentTheme.muted} text-sm`}>
                Get help when you need it with our dedicated customer support team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-16 ${currentTheme.secondary}/20`}>
        <div className="container">
          <h2 className={`text-3xl font-bold text-center ${currentTheme.text} mb-12`}>
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className={`${currentTheme.cardBg} rounded-xl p-6 border ${currentTheme.border}`}>
              <p className={`${currentTheme.text} italic mb-4`}>
                "SkidHaven made selling my electronics so easy. Great platform with amazing buyers!"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-semibold">A</span>
                </div>
                <div>
                  <h4 className={`font-semibold ${currentTheme.text}`}>
                    Alex Johnson
                  </h4>
                  <p className={`${currentTheme.muted} text-sm`}>
                    Active Seller
                  </p>
                </div>
              </div>
            </div>
            <div className={`${currentTheme.cardBg} rounded-xl p-6 border ${currentTheme.border}`}>
              <p className={`${currentTheme.text} italic mb-4`}>
                "Found exactly what I was looking for at a great price. Highly recommend SkidHaven!"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                  <span className="text-white font-semibold">S</span>
                </div>
                <div>
                  <h4 className={`font-semibold ${currentTheme.text}`}>
                    Sarah Chen
                  </h4>
                  <p className={`${currentTheme.muted} text-sm`}>
                    Happy Customer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SkidHavenFooter />
    </div>
  );
};

export default Index;
