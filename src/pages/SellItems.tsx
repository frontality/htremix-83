
import { useState } from "react";
import { Upload, DollarSign, Package, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import ImageUpload from "@/components/ImageUpload";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports & Outdoors",
  "Automotive",
  "Books & Media",
  "Toys & Games",
  "Health & Beauty",
  "Other"
];

const SellItems = () => {
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    images: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Item listing data:", formData);
    toast({
      title: "Item Listed!",
      description: "Your item has been successfully listed for sale.",
    });
    // Reset form
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      condition: "",
      images: []
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className={`text-4xl font-bold ${currentTheme.text} mb-2`}>
              Sell Your Items
            </h1>
            <p className={`${currentTheme.muted} text-lg`}>
              List your items and reach thousands of potential buyers
            </p>
          </div>

          <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
            <CardHeader>
              <CardTitle className={`${currentTheme.text} flex items-center space-x-2`}>
                <Package className="h-5 w-5" />
                <span>Create New Listing</span>
              </CardTitle>
              <CardDescription className={currentTheme.muted}>
                Fill in the details below to create your item listing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Item Images */}
                <div className="space-y-4">
                  <Label className={currentTheme.text}>Item Images</Label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-purple-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {formData.images.length < 5 && (
                      <div className="w-full h-32">
                        <ImageUpload
                          onImageUpload={handleImageUpload}
                          bucket="product-images"
                          className="w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-sm ${currentTheme.muted}`}>
                    Upload up to 5 images (PNG, JPG up to 5MB each)
                  </p>
                </div>

                {/* Item Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className={currentTheme.text}>Item Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Gaming Laptop RTX 4070"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label className={currentTheme.text}>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className={`${currentTheme.secondary} ${currentTheme.text} border-0`}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Condition */}
                <div className="space-y-2">
                  <Label className={currentTheme.text}>Condition</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                    <SelectTrigger className={`${currentTheme.secondary} ${currentTheme.text} border-0`}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like-new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className={currentTheme.text}>Price (USD)</Label>
                  <div className="relative">
                    <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${currentTheme.muted}`} />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      className={`pl-10 ${currentTheme.secondary} ${currentTheme.text} border-0`}
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className={currentTheme.text}>Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item in detail..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={`min-h-32 ${currentTheme.secondary} ${currentTheme.text} border-0`}
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" className={`w-full ${currentTheme.primary} text-white h-12 text-lg font-semibold`}>
                  <Package className="mr-2 h-5 w-5" />
                  List Item for Sale
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <SkidHavenFooter />
    </div>
  );
};

export default SellItems;
