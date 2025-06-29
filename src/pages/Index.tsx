import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, TrendingUp } from "lucide-react";
import HotTopicHeader from "@/components/HotTopicHeader";
import HotTopicFooter from "@/components/HotTopicFooter";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <HotTopicHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
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
              Premium Gift Cards & Crypto Exchange Platform
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                size="lg" 
                className={`${currentTheme.primary} text-white px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity`}
                onClick={() => navigate("/payment")}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Gift Cards
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className={`${currentTheme.secondary} ${currentTheme.text} border-0 px-8 py-4 text-lg font-semibold hover:opacity-80`}
                onClick={() => navigate("/crypto-exchange")}
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Exchange Crypto
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Card Options */}
      <section className="py-12">
        <div className="container">
          <h2 className={`text-3xl font-bold text-center ${currentTheme.text} mb-8`}>
            Explore Our Gift Card Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Example Gift Card */}
            <div className={`${currentTheme.cardBg} rounded-xl p-6 border ${currentTheme.border} shadow-md hover:scale-105 transition-transform`}>
              <img
                src="https://i.imgur.com/FTVk2Gl.png"
                alt="Hot Topic Gift Card"
                className="w-full h-32 object-cover rounded-md mb-4"
              />
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                Hot Topic Gift Card
              </h3>
              <p className={`${currentTheme.muted} text-sm mb-4`}>
                Get your favorite band merch, clothing, and accessories.
              </p>
              <Button className={`${currentTheme.primary} text-white w-full`}>
                Buy Now
              </Button>
            </div>
            {/* Add more gift card options here */}
            <div className={`${currentTheme.cardBg} rounded-xl p-6 border ${currentTheme.border} shadow-md hover:scale-105 transition-transform`}>
              <img
                src="https://i.imgur.com/FTVk2Gl.png"
                alt="Hot Topic Gift Card"
                className="w-full h-32 object-cover rounded-md mb-4"
              />
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                Hot Topic Gift Card
              </h3>
              <p className={`${currentTheme.muted} text-sm mb-4`}>
                Get your favorite band merch, clothing, and accessories.
              </p>
              <Button className={`${currentTheme.primary} text-white w-full`}>
                Buy Now
              </Button>
            </div>
            <div className={`${currentTheme.cardBg} rounded-xl p-6 border ${currentTheme.border} shadow-md hover:scale-105 transition-transform`}>
              <img
                src="https://i.imgur.com/FTVk2Gl.png"
                alt="Hot Topic Gift Card"
                className="w-full h-32 object-cover rounded-md mb-4"
              />
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                Hot Topic Gift Card
              </h3>
              <p className={`${currentTheme.muted} text-sm mb-4`}>
                Get your favorite band merch, clothing, and accessories.
              </p>
              <Button className={`${currentTheme.primary} text-white w-full`}>
                Buy Now
              </Button>
            </div>
            <div className={`${currentTheme.cardBg} rounded-xl p-6 border ${currentTheme.border} shadow-md hover:scale-105 transition-transform`}>
              <img
                src="https://i.imgur.com/FTVk2Gl.png"
                alt="Hot Topic Gift Card"
                className="w-full h-32 object-cover rounded-md mb-4"
              />
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                Hot Topic Gift Card
              </h3>
              <p className={`${currentTheme.muted} text-sm mb-4`}>
                Get your favorite band merch, clothing, and accessories.
              </p>
              <Button className={`${currentTheme.primary} text-white w-full`}>
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-12 bg-black/20">
        <div className="container">
          <h2 className={`text-3xl font-bold text-center ${currentTheme.text} mb-8`}>
            Unlock Exclusive Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <TrendingUp className={`h-12 w-12 mx-auto ${currentTheme.accent} mb-4`} />
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                Real-Time Crypto Exchange
              </h3>
              <p className={`${currentTheme.muted} text-sm`}>
                Trade cryptocurrencies with live rates and instant transactions.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="text-center">
              <ShoppingBag className={`h-12 w-12 mx-auto ${currentTheme.accent} mb-4`} />
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                Premium Gift Card Selection
              </h3>
              <p className={`${currentTheme.muted} text-sm`}>
                Access exclusive gift cards from top brands at unbeatable prices.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="text-center">
              <User className={`h-12 w-12 mx-auto ${currentTheme.accent} mb-4`} />
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                Personalized User Profiles
              </h3>
              <p className={`${currentTheme.muted} text-sm`}>
                Customize your profile, track transactions, and manage your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <div className="container">
          <h2 className={`text-3xl font-bold text-center ${currentTheme.text} mb-8`}>
            What Our Users Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className={`${currentTheme.cardBg} rounded-xl p-6 border ${currentTheme.border}`}>
              <p className={`${currentTheme.text} italic mb-4`}>
                "SkidHaven has revolutionized the way I trade crypto and buy gift cards. The platform is seamless and the rates are unbeatable!"
              </p>
              <div className="flex items-center space-x-3">
                <img
                  src="/placeholder.svg"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className={`font-semibold ${currentTheme.text}`}>
                    Alice Johnson
                  </h4>
                  <p className={`${currentTheme.muted} text-sm`}>
                    Crypto Trader
                  </p>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className={`${currentTheme.cardBg} rounded-xl p-6 border ${currentTheme.border}`}>
              <p className={`${currentTheme.text} italic mb-4`}>
                "I love the variety of gift cards available on SkidHaven. It's my go-to platform for all my gifting needs."
              </p>
              <div className="flex items-center space-x-3">
                <img
                  src="/placeholder.svg"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className={`font-semibold ${currentTheme.text}`}>
                    Bob Williams
                  </h4>
                  <p className={`${currentTheme.muted} text-sm`}>
                    Gift Card Enthusiast
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-black/20">
        <div className="container">
          <h2 className={`text-3xl font-bold text-center ${currentTheme.text} mb-8`}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className={`${currentTheme.cardBg} rounded-xl p-6 border ${currentTheme.border}`}>
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                How do I exchange crypto on SkidHaven?
              </h3>
              <p className={`${currentTheme.muted} text-sm`}>
                Simply navigate to the Crypto Exchange page, select the currencies you want to trade, enter the amount, and confirm the transaction.
              </p>
            </div>
            {/* FAQ 2 */}
            <div className={`${currentTheme.cardBg} rounded-xl p-6 border ${currentTheme.border}`}>
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                Are the gift cards on SkidHaven authentic?
              </h3>
              <p className={`${currentTheme.muted} text-sm`}>
                Yes, we source our gift cards directly from authorized retailers to ensure authenticity and validity.
              </p>
            </div>
            {/* FAQ 3 */}
            <div className={`${currentTheme.cardBg} rounded-xl p-6 border ${currentTheme.border}`}>
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                How do I contact customer support?
              </h3>
              <p className={`${currentTheme.muted} text-sm`}>
                You can reach our customer support team via email or live chat. Visit the Contact Us page for more information.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <HotTopicFooter />
    </div>
  );
};

export default Index;
