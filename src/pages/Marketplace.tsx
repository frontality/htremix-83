
import { useState } from "react";
import { Search, Filter, Grid, List, SlidersHorizontal, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { Link } from "react-router-dom";

const Marketplace = () => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = [
    { value: "all", label: t("All Categories") },
    { value: "gift-cards", label: t("Gift Cards") },
    { value: "game-accounts", label: t("Game Accounts") },
    { value: "subscriptions", label: t("Premium Subscriptions") },
    { value: "software", label: t("Software & Tools") },
    { value: "streaming", label: t("Streaming Services") },
    { value: "digital-content", label: t("Digital Content") }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold ${currentTheme.text} mb-4`}>
            {t("Digital Marketplace")}
          </h1>
          <p className={`text-lg ${currentTheme.muted}`}>
            {t("Discover amazing digital items from trusted sellers")}
          </p>
        </div>

        {/* Search and Filters */}
        <div className={`${currentTheme.cardBg} rounded-xl border ${currentTheme.border} p-6 mb-8`}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${currentTheme.muted}`} />
              <Input
                placeholder={t("Search for digital items...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${currentTheme.secondary} ${currentTheme.text} border-0`}
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className={`w-48 ${currentTheme.secondary} ${currentTheme.text} border-0`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className={`w-40 ${currentTheme.secondary} ${currentTheme.text} border-0`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("Newest")}</SelectItem>
                  <SelectItem value="price-low">{t("Price: Low to High")}</SelectItem>
                  <SelectItem value="price-high">{t("Price: High to Low")}</SelectItem>
                  <SelectItem value="popular">{t("Most Popular")}</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* No Items Message */}
        <div className="text-center py-16">
          <Gift className={`h-24 w-24 ${currentTheme.muted} mx-auto mb-6`} />
          <h2 className={`text-2xl font-semibold ${currentTheme.text} mb-4`}>
            {t("No Items Listed Yet")}
          </h2>
          <p className={`text-lg ${currentTheme.muted} mb-8 max-w-2xl mx-auto`}>
            {t("The marketplace is waiting for amazing digital items! Be the first to list your gift cards, game accounts, or premium subscriptions.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sell">
              <Button className={`${currentTheme.primary} text-white px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform`}>
                {t("List Your Items")}
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className={`${currentTheme.text} border-2 px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform`}>
                {t("Back to Home")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Categories Preview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
          {categories.slice(1).map((category, index) => (
            <Card key={index} className={`${currentTheme.cardBg} border ${currentTheme.border} p-4 text-center hover:scale-105 transition-transform cursor-pointer`}>
              <Gift className={`h-8 w-8 mx-auto mb-3 ${currentTheme.accent}`} />
              <h3 className={`font-medium ${currentTheme.text} text-sm mb-1`}>
                {category.label}
              </h3>
              <p className={`text-xs ${currentTheme.muted}`}>
                {t("0 items")}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
