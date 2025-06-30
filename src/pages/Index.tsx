
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import QuickActionsPanel from "@/components/QuickActionsPanel";
import MarketStats from "@/components/MarketStats";

const Index = () => {
  const { user } = useAuth();
  const { currentTheme } = useTheme();

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      
      <div className="container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className={`text-4xl md:text-5xl font-bold ${currentTheme.text} mb-4`}>
              Welcome to{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                $KID HAVEN
              </span>
            </h1>
            <p className={`text-xl ${currentTheme.muted} max-w-2xl mx-auto`}>
              The ultimate underground marketplace for digital assets, gaming accounts, Discord Nitro, gift cards, and exclusive online items.
            </p>
          </div>

          {/* Featured Digital Items */}
          <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-xl p-6`}>
            <h2 className={`text-2xl font-bold ${currentTheme.text} mb-4`}>
              🔥 Hot Digital Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${currentTheme.secondary} p-4 rounded-lg`}>
                <h3 className={`${currentTheme.text} font-semibold mb-2`}>🎮 Gaming Accounts</h3>
                <p className={`${currentTheme.muted} text-sm`}>Premium game accounts with rare items and high levels</p>
              </div>
              <div className={`${currentTheme.secondary} p-4 rounded-lg`}>
                <h3 className={`${currentTheme.text} font-semibold mb-2`}>💎 Discord Nitro</h3>
                <p className={`${currentTheme.muted} text-sm`}>Monthly and yearly Discord Nitro subscriptions</p>
              </div>
              <div className={`${currentTheme.secondary} p-4 rounded-lg`}>
                <h3 className={`${currentTheme.text} font-semibold mb-2`}>🎁 Gift Cards</h3>
                <p className={`${currentTheme.muted} text-sm`}>Steam, PlayStation, Xbox, and more digital gift cards</p>
              </div>
            </div>
          </div>

          {/* Market Stats */}
          <MarketStats />

          {/* Quick Actions for logged in users */}
          {user && (
            <div>
              <h2 className={`text-2xl font-bold ${currentTheme.text} mb-6`}>
                Quick Actions
              </h2>
              <QuickActionsPanel />
            </div>
          )}

          {/* Call to Action for non-logged in users */}
          {!user && (
            <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-xl p-8 text-center space-y-4`}>
              <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
                Ready to Start Trading Digital Assets?
              </h2>
              <p className={`${currentTheme.muted} text-lg`}>
                Join thousands of users buying and selling gaming accounts, Discord Nitro, gift cards, and digital items safely and securely.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/signup"
                  className={`${currentTheme.primary} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
                >
                  Get Started
                </a>
                <a
                  href="/marketplace"
                  className={`${currentTheme.secondary} ${currentTheme.text} px-6 py-3 rounded-lg font-semibold hover:${currentTheme.primary} transition-colors`}
                >
                  Browse Marketplace
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <SkidHavenFooter />
    </div>
  );
};

export default Index;
