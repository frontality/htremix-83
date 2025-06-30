
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
              The ultimate underground marketplace for digital assets, gaming accounts, and exclusive items.
            </p>
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
                Ready to Start Trading?
              </h2>
              <p className={`${currentTheme.muted} text-lg`}>
                Join thousands of users buying and selling digital assets safely and securely.
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
