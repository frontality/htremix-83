
import { useState } from "react";
import { Upload, DollarSign, Package, Info, Gift, Gamepad2, Crown, Music, Video, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ImageUpload from "@/components/ImageUpload";

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

const SellItems = () => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryMethod: "",
    images: [] as string[]
  });

  const categories = [
    { value: "gift-cards", label: t("Gift Cards"), icon: Gift },
    { value: "game-accounts", label: t("Game Accounts"), icon: Gamepad2 },
    { value: "subscriptions", label: t("Premium Subscriptions"), icon: Crown },
    { value: "software", label: t("Software & Tools"), icon: Sparkles },
    { value: "streaming", label: t("Streaming Services"), icon: Video },
    { value: "digital-content", label: t("Digital Content"), icon: Music }
  ];

  const deliveryMethods = [
    { value: "instant", label: t("Instant Delivery") },
    { value: "manual", label: t("Manual Delivery (within 24h)") },
    { value: "code", label: t("Activation Code") },
    { value: "account", label: t("Account Transfer") }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: t("Login Required"),
        description: t("Please log in to list items."),
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!formData.title || !formData.description || !formData.category || !formData.price || !formData.deliveryMethod) {
      toast({
        title: t("Missing Information"),
        description: t("Please fill in all required fields."),
        variant: "destructive",
      });
      return;
    }

    try {
      const newItem: MarketplaceItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        deliveryMethod: formData.deliveryMethod,
        seller: user.email?.split('@')[0] || 'Anonymous',
        sellerId: user.id,
        images: formData.images,
        createdAt: new Date().toISOString(),
        views: 0
      };

      // Load existing items
      const existingItems = localStorage.getItem('marketplace_items');
      const items = existingItems ? JSON.parse(existingItems) : [];
      
      // Add new item
      items.push(newItem);
      
      // Save back to localStorage
      localStorage.setItem('marketplace_items', JSON.stringify(items));
      
      console.log('Item listed successfully:', newItem);
      
      toast({
        title: t("Item Listed Successfully!"),
        description: t("Your digital item has been added to the marketplace."),
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        deliveryMethod: "",
        images: []
      });

      // Navigate to marketplace after a short delay
      setTimeout(() => {
        navigate('/marketplace');
      }, 1500);
      
    } catch (error) {
      console.error('Error listing item:', error);
      toast({
        title: t("Error"),
        description: t("Failed to list item. Please try again."),
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
    
    toast({
      title: t("Image Added!"),
      description: t("Image has been added to your listing."),
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} pt-20`}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${currentTheme.text} mb-4`}>
            {t("Sell Digital Items")}
          </h1>
          <p className={`text-lg ${currentTheme.muted} max-w-2xl mx-auto`}>
            {t("List your digital items and start earning! Share gift cards, game accounts, subscriptions, and more.")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 shadow-lg`}>
              <h2 className={`text-2xl font-semibold ${currentTheme.text} mb-6 flex items-center`}>
                <Info className="mr-3 h-6 w-6" />
                {t("Basic Information")}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <Label className={`${currentTheme.text} text-sm font-medium mb-2 block`}>
                    {t("Item Title")} *
                  </Label>
                  <Input
                    placeholder={t("e.g., $50 Steam Gift Card, Netflix Premium Account, etc.")}
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                    required
                  />
                </div>

                <div>
                  <Label className={`${currentTheme.text} text-sm font-medium mb-2 block`}>
                    {t("Category")} *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className={`${currentTheme.secondary} ${currentTheme.text} border-0`}>
                      <SelectValue placeholder={t("Select a category")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center">
                            <category.icon className="mr-2 h-4 w-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className={`${currentTheme.text} text-sm font-medium mb-2 block`}>
                    {t("Description")} *
                  </Label>
                  <Textarea
                    placeholder={t("Describe your digital item in detail. Include any important information about delivery, validity, region restrictions, etc.")}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0 min-h-32`}
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Pricing & Delivery */}
            <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 shadow-lg`}>
              <h2 className={`text-2xl font-semibold ${currentTheme.text} mb-6 flex items-center`}>
                <DollarSign className="mr-3 h-6 w-6" />
                {t("Pricing & Delivery")}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className={`${currentTheme.text} text-sm font-medium mb-2 block`}>
                    {t("Price (USD)")} *
                  </Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <Label className={`${currentTheme.text} text-sm font-medium mb-2 block`}>
                    {t("Delivery Method")} *
                  </Label>
                  <Select value={formData.deliveryMethod} onValueChange={(value) => handleInputChange("deliveryMethod", value)}>
                    <SelectTrigger className={`${currentTheme.secondary} ${currentTheme.text} border-0`}>
                      <SelectValue placeholder={t("How will you deliver this item?")} />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Images */}
            <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 shadow-lg`}>
              <h2 className={`text-2xl font-semibold ${currentTheme.text} mb-6 flex items-center`}>
                <Upload className="mr-3 h-6 w-6" />
                {t("Images")}
              </h2>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Upload ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border-2 border-purple-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {formData.images.length < 5 && (
                    <div className="w-20 h-20 border-2 border-dashed border-gray-500 rounded flex items-center justify-center">
                      <ImageUpload 
                        onImageUpload={handleImageUpload}
                        className="w-full h-full"
                        currentImage={null}
                      />
                    </div>
                  )}
                </div>
                
                <p className={`text-sm ${currentTheme.muted}`}>
                  {t("Add up to 5 images of your digital item (optional but recommended)")}
                </p>
              </div>
            </Card>

            {/* Submit */}
            <div className="text-center py-8">
              <Button 
                type="submit" 
                className={`${currentTheme.primary} text-white px-12 py-4 text-lg font-semibold hover:scale-105 transition-transform shadow-lg`}
              >
                <Package className="mr-3 h-5 w-5" />
                {t("List Item for Sale")}
              </Button>
            </div>
          </form>

          {/* Information Card */}
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 mt-8 shadow-lg`}>
            <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>
              {t("Important Information")}
            </h3>
            <ul className={`${currentTheme.muted} space-y-2 text-sm`}>
              <li>• {t("Only list legitimate digital items that you own")}</li>
              <li>• {t("Ensure all account information is accurate and working")}</li>
              <li>• {t("Gift cards should be unused and valid")}</li>
              <li>• {t("Provide clear instructions for account transfers")}</li>
              <li>• {t("Be responsive to buyer messages and questions")}</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellItems;
