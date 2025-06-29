
import { useState } from "react";
import { Search, Filter, Grid, List, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import { useTheme } from "@/contexts/ThemeContext";

const SAMPLE_ITEMS = [
  {
    id: 1,
    title: "Gaming Laptop RTX 4070",
    price: 899,
    image: "/placeholder.svg",
    seller: "TechDealer",
    rating: 4.8,
    category: "Electronics",
    description: "High-performance gaming laptop with RTX 4070 graphics card"
  },
  {
    id: 2,
    title: "Designer Sneakers",
    price: 299,
    image: "/placeholder.svg",
    seller: "SneakerHead",
    rating: 4.9,
    category: "Fashion",
    description: "Limited edition designer sneakers in excellent condition"
  },
  {
    id: 3,
    title: "Vintage Watch Collection",
    price: 1250,
    image: "/placeholder.svg",
    seller: "TimeKeeper",
    rating: 5.0,
    category: "Accessories",
    description: "Rare vintage watch collection from the 1980s"
  }
];

const Marketplace = () => {
  const { currentTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold ${currentTheme.text} mb-2`}>
            Marketplace
          </h1>
          <p className={`${currentTheme.muted} text-lg`}>
            Discover amazing items from verified sellers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${currentTheme.muted}`} />
            <Input
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 ${currentTheme.secondary} ${currentTheme.text} border-0`}
            />
          </div>
          <Button
            variant="outline"
            className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <div className="flex border rounded-lg p-1 bg-gray-800">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? currentTheme.primary + " text-white" : currentTheme.text}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? currentTheme.primary + " text-white" : currentTheme.text}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
          {SAMPLE_ITEMS.map((item) => (
            <Card key={item.id} className={`${currentTheme.cardBg} border ${currentTheme.border} hover:opacity-80 transition-opacity cursor-pointer`}>
              <CardHeader className="p-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className={`${currentTheme.secondary} ${currentTheme.text}`}>
                    {item.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className={`text-sm ${currentTheme.muted}`}>{item.rating}</span>
                  </div>
                </div>
                <CardTitle className={`${currentTheme.text} text-lg mb-2`}>
                  {item.title}
                </CardTitle>
                <CardDescription className={`${currentTheme.muted} mb-3`}>
                  {item.description}
                </CardDescription>
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-2xl font-bold ${currentTheme.accent}`}>
                      ${item.price}
                    </p>
                    <p className={`text-sm ${currentTheme.muted}`}>
                      by {item.seller}
                    </p>
                  </div>
                  <Button className={`${currentTheme.primary} text-white`}>
                    View Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" className={`${currentTheme.secondary} ${currentTheme.text} border-0`}>
            Load More Items
          </Button>
        </div>
      </div>

      <SkidHavenFooter />
    </div>
  );
};

export default Marketplace;
