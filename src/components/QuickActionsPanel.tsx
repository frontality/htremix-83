
import { useState } from "react";
import { Search, Bell, Calculator, Bookmark, Clock, TrendingUp, Shield, Zap } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QuickActionsPanel = () => {
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [calculatorValue, setCalculatorValue] = useState("");

  const quickActions = [
    {
      icon: Search,
      title: "Quick Search",
      description: "Search marketplace instantly",
      action: () => {
        if (searchQuery.trim()) {
          toast({
            title: "Search Started! 🔍",
            description: `Searching for "${searchQuery}"...`,
          });
        }
      }
    },
    {
      icon: Calculator,
      title: "Price Calculator",
      description: "Calculate profits & fees",
      action: () => {
        if (calculatorValue) {
          const result = parseFloat(calculatorValue) * 0.95; // 5% fee
          toast({
            title: "Calculation Complete! 💰",
            description: `After fees: $${result.toFixed(2)}`,
          });
        }
      }
    },
    {
      icon: Bell,
      title: "Price Alerts",
      description: "Set up notifications",
      action: () => {
        toast({
          title: "Alert Set! 🔔",
          description: "You'll be notified of price changes",
        });
      }
    },
    {
      icon: Bookmark,
      title: "Saved Items",
      description: "Quick access to bookmarks",
      action: () => {
        toast({
          title: "Bookmarks Opened! 📑",
          description: "Viewing your saved items",
        });
      }
    },
    {
      icon: Clock,
      title: "Recent Activity",
      description: "View transaction history",
      action: () => {
        toast({
          title: "History Loaded! ⏰",
          description: "Showing recent transactions",
        });
      }
    },
    {
      icon: TrendingUp,
      title: "Market Trends",
      description: "Live market analysis",
      action: () => {
        toast({
          title: "Trends Updated! 📈",
          description: "Latest market data loaded",
        });
      }
    },
    {
      icon: Shield,
      title: "Security Check",
      description: "Verify account safety",
      action: () => {
        toast({
          title: "Security Verified! 🛡️",
          description: "Your account is secure",
        });
      }
    },
    {
      icon: Zap,
      title: "Quick Sell",
      description: "Instant listing tool",
      action: () => {
        toast({
          title: "Quick Sell Ready! ⚡",
          description: "Create listing in seconds",
        });
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Search */}
      <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
        <CardHeader className="pb-3">
          <CardTitle className={`${currentTheme.text} text-lg flex items-center gap-2`}>
            <Search className="h-5 w-5" />
            Quick Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${currentTheme.secondary} ${currentTheme.text} border-0 flex-1`}
            />
            <Button
              onClick={quickActions[0].action}
              className={`${currentTheme.primary} text-white px-4`}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Price Calculator */}
      <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
        <CardHeader className="pb-3">
          <CardTitle className={`${currentTheme.text} text-lg flex items-center gap-2`}>
            <Calculator className="h-5 w-5" />
            Price Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter amount..."
              value={calculatorValue}
              onChange={(e) => setCalculatorValue(e.target.value)}
              type="number"
              className={`${currentTheme.secondary} ${currentTheme.text} border-0 flex-1`}
            />
            <Button
              onClick={quickActions[1].action}
              className={`${currentTheme.primary} text-white px-4`}
            >
              <Calculator className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickActions.slice(2).map((action, index) => (
          <Card
            key={index}
            className={`${currentTheme.cardBg} border ${currentTheme.border} hover:${currentTheme.secondary} transition-all cursor-pointer group`}
            onClick={action.action}
          >
            <CardContent className="p-4 text-center">
              <action.icon className={`h-8 w-8 ${currentTheme.accent} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
              <h3 className={`${currentTheme.text} font-semibold text-sm mb-1`}>
                {action.title}
              </h3>
              <p className={`${currentTheme.muted} text-xs`}>
                {action.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPanel;
