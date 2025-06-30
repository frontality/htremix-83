
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

const SellItems = () => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryMethod: "",
    images: [] as File[]
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
    
    // Simulate listing creation
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
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <div className="container mx-auto px-4 py-8">
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
            <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-6`}>
              <h2 className={`text-2xl font-semibold ${currentTheme.text} mb-6 flex items-center`}>
                <Info className="mr-3 h-6 w-6" />
                {t("Basic Information")}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <Label className={`${currentTheme.text} text-sm font-medium`}>
                    {t("Item Title")}
                  </Label>
                  <Input
                    placeholder={t("e.g., $50 Steam Gift Card, Netflix Premium Account, etc.")}
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={`mt-2 ${currentTheme.secondary} ${currentTheme.text} border-0`}
                    required
                  />
                </div>

                <div>
                  <Label className={`${currentTheme.text} text-sm font-medium`}>
                    {t("Category")}
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className={`mt-2 ${currentTheme.secondary} ${currentTheme.text} border-0`}>
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
                  <Label className={`${currentTheme.text} text-sm font-medium`}>
                    {t("Description")}
                  </Label>
                  <Textarea
                    placeholder={t("Describe your digital item in detail. Include any important information about delivery, validity, region restrictions, etc.")}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={`mt-2 ${currentTheme.secondary} ${currentTheme.text} border-0 min-h-32`}
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Pricing & Delivery */}
            <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-6`}>
              <h2 className={`text-2xl font-semibold ${currentTheme.text} mb-6 flex items-center`}>
                <DollarSign className="mr-3 h-6 w-6" />
                {t("Pricing & Delivery")}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className={`${currentTheme.text} text-sm font-medium`}>
                    {t("Price (USD)")}
                  </Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className={`mt-2 ${currentTheme.secondary} ${currentTheme.text} border-0`}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <Label className={`${currentTheme.text} text-sm font-medium`}>
                    {t("Delivery Method")}
                  </Label>
                  <Select value={formData.deliveryMethod} onValueChange={(value) => handleInputChange("deliveryMethod", value)}>
                    <SelectTrigger className={`mt-2 ${currentTheme.secondary} ${currentTheme.text} border-0`}>
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
            <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-6`}>
              <h2 className={`text-2xl font-semibold ${currentTheme.text} mb-6 flex items-center`}>
                <Upload className="mr-3 h-6 w-6" />
                {t("Images")}
              </h2>
              
              <div className={`border-2 border-dashed ${currentTheme.border} rounded-lg p-8 text-center`}>
                <Upload className={`h-12 w-12 mx-auto mb-4 ${currentTheme.muted}`} />
                <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>
                  {t("Upload Images")}
                </h3>
                <p className={`${currentTheme.muted} mb-4`}>
                  {t("Add screenshots or images of your digital item (optional but recommended)")}
                </p>
                <Button type="button" variant="outline" className={`${currentTheme.text} border-2`}>
                  {t("Choose Files")}
                </Button>
              </div>
            </Card>

            {/* Submit */}
            <div className="text-center">
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
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 mt-8`}>
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
