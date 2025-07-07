import { useState, useEffect } from "react";
import { Search, Filter, Grid, List, SlidersHorizontal, Gift, DollarSign, User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryMethod: string;
  seller: string;
  sellerId: string;
  images: string[];
  createdAt: string;
  views: number;
}

const Marketplace = () => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("all");
  const [items, setItems] = useState<MarketplaceItem[]>([]);

  const categories = [
    { value: "all", label: t("All Categories") },
    { value: "gift-cards", label: t("Gift Cards") },
    { value: "game-accounts", label: t("Game Accounts") },
    { value: "subscriptions", label: t("Premium Subscriptions") },
    { value: "software", label: t("Software & Tools") },
    { value: "streaming", label: t("Streaming Services") },
    { value: "digital-content", label: t("Digital Content") }
  ];

  // Track viewed items per user session to prevent multiple views
  const [viewedItems, setViewedItems] = useState<Set<string>>(new Set());

  // Load items from localStorage on component mount
  useEffect(() => {
    const loadItems = () => {
      try {
        const savedItems = localStorage.getItem('marketplace_items');
        console.log('Loading marketplace items:', savedItems);
        
        if (savedItems) {
          const parsedItems = JSON.parse(savedItems);
          if (Array.isArray(parsedItems)) {
            console.log('Loaded marketplace items successfully:', parsedItems.length);
            setItems(parsedItems);
            return;
          }
        }
        
        console.log('No marketplace items found');
        setItems([]);
      } catch (error) {
        console.error('Error loading marketplace items:', error);
        setItems([]);
      }
    };

    loadItems();
  }, []);

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    localStorage.setItem('marketplace_items', JSON.stringify(updatedItems));
    
    toast({
      title: "Item Deleted! 🗑️",
      description: "Your marketplace item has been removed successfully."
    });
  };

  // Filter and sort items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "popular":
        return b.views - a.views;
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleItemClick = (item: MarketplaceItem) => {
    // Only increment view count once per session per item
    if (!viewedItems.has(item.id)) {
      const updatedItems = items.map(existingItem =>
        existingItem.id === item.id ? { ...existingItem, views: existingItem.views + 1 } : existingItem
      );
      setItems(updatedItems);
      localStorage.setItem('marketplace_items', JSON.stringify(updatedItems));
      
      // Track that this item has been viewed in this session
      setViewedItems(prev => new Set(prev).add(item.id));
    }
    
    // Navigate to product detail page
    navigate(`/product/${item.id}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "gift-cards":
        return <Gift className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} pt-20`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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
        <div className={`${currentTheme.cardBg} rounded-xl border ${currentTheme.border} p-6 mb-8 shadow-lg`}>
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
            
            <div className="flex gap-3 flex-wrap">
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

        {/* Items Grid/List */}
        {sortedItems.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {sortedItems.map((item) => (
              <Card 
                key={item.id} 
                className={`${currentTheme.cardBg} border ${currentTheme.border} hover:border-purple-500/50 transition-all cursor-pointer shadow-lg ${
                  viewMode === "list" ? "p-4" : "overflow-hidden"
                } relative group hover:scale-105`}
                onClick={() => handleItemClick(item)}
              >
                {/* Delete button for own items */}
                {user && user.id === item.sellerId && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    🗑️
                  </Button>
                )}

                {viewMode === "grid" ? (
                  <>
                    {/* Image */}
                    <div className="aspect-video bg-gray-800 flex items-center justify-center overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            console.log('Image failed to load:', item.images[0]);
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div className="text-center p-4">
                          {getCategoryIcon(item.category)}
                          <p className={`text-sm ${currentTheme.muted} mt-2`}>No Image</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {categories.find(c => c.value === item.category)?.label || item.category}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-400">
                          <Eye className="h-3 w-3 mr-1" />
                          {item.views}
                        </div>
                      </div>
                      
                      <h3 className={`font-semibold ${currentTheme.text} mb-2 line-clamp-2`}>
                        {item.title}
                      </h3>
                      
                      <p className={`text-sm ${currentTheme.muted} mb-3 line-clamp-2`}>
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-lg font-bold text-green-400">
                          <DollarSign className="h-4 w-4" />
                          {item.price.toFixed(2)}
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <User className="h-3 w-3 mr-1" />
                          {item.seller}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex space-x-4">
                    <div className="w-24 h-16 bg-gray-800 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            console.log('Image failed to load:', item.images[0]);
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        getCategoryIcon(item.category)
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${currentTheme.text}`}>
                          {item.title}
                        </h3>
                        <div className="flex items-center text-lg font-bold text-green-400">
                          <DollarSign className="h-4 w-4" />
                          {item.price.toFixed(2)}
                        </div>
                      </div>
                      
                      <p className={`text-sm ${currentTheme.muted} mb-2 line-clamp-2`}>
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary" className="text-xs">
                            {categories.find(c => c.value === item.category)?.label || item.category}
                          </Badge>
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {item.seller}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {item.views}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          /* No Items Message */
          <div className="text-center py-16">
            <Gift className={`h-24 w-24 ${currentTheme.muted} mx-auto mb-6`} />
            <h2 className={`text-2xl font-semibold ${currentTheme.text} mb-4`}>
              {sortedItems.length === 0 && items.length > 0 
                ? t("No items match your search")
                : t("No Items Listed Yet")
              }
            </h2>
            <p className={`text-lg ${currentTheme.muted} mb-8 max-w-2xl mx-auto`}>
              {sortedItems.length === 0 && items.length > 0
                ? t("Try adjusting your search or filters to find what you're looking for.")
                : t("The marketplace is waiting for amazing digital items! Be the first to list your gift cards, game accounts, or premium subscriptions.")
              }
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
        )}

        {/* Categories Preview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
          {categories.slice(1).map((category, index) => {
            const categoryItemCount = items.filter(item => item.category === category.value).length;
            return (
              <Card 
                key={index} 
                className={`${currentTheme.cardBg} border ${currentTheme.border} p-4 text-center hover:scale-105 transition-transform cursor-pointer shadow-lg`}
                onClick={() => setFilterCategory(category.value)}
              >
                <Gift className={`h-8 w-8 mx-auto mb-3 ${currentTheme.accent}`} />
                <h3 className={`font-medium ${currentTheme.text} text-sm mb-1`}>
                  {category.label}
                </h3>
                <p className={`text-xs ${currentTheme.muted}`}>
                  {categoryItemCount} {t("items")}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
