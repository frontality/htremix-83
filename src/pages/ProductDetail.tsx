
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, DollarSign, Star, Share2, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Mock product data - in real app this would come from your database
const MOCK_PRODUCTS = [
  {
    id: "1",
    title: "Gaming Laptop RTX 4070",
    description: "High-performance gaming laptop with RTX 4070 graphics card, perfect for gaming and content creation. Excellent condition, barely used.",
    price: 1299.99,
    category: "Electronics",
    condition: "like-new",
    images: ["/placeholder.svg", "/placeholder.svg"],
    seller: {
      id: "seller1",
      username: "TechGuru2024",
      avatar: "/placeholder.svg",
      rating: 4.8,
      totalSales: 127
    },
    createdAt: "2024-01-15"
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [offerAmount, setOfferAmount] = useState("");
  const [message, setMessage] = useState("");
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);

  useEffect(() => {
    // In real app, fetch product by ID from database
    const foundProduct = MOCK_PRODUCTS.find(p => p.id === id);
    setProduct(foundProduct);
  }, [id]);

  const handleSendMessage = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to message sellers",
        variant: "destructive",
      });
      return;
    }

    // In real app, send message to seller
    console.log("Sending message:", message);
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the seller",
    });
    
    setMessage("");
    setShowMessageDialog(false);
  };

  const handleMakeOffer = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to make offers",
        variant: "destructive",
      });
      return;
    }

    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      toast({
        title: "Invalid Offer",
        description: "Please enter a valid offer amount",
        variant: "destructive",
      });
      return;
    }

    // In real app, send offer to seller
    console.log("Making offer:", offerAmount);
    
    toast({
      title: "Offer Sent",
      description: `Your offer of $${offerAmount} has been sent to the seller`,
    });
    
    setOfferAmount("");
    setShowOfferDialog(false);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase items",
        variant: "destructive",
      });
      return;
    }

    // In real app, redirect to payment
    navigate("/payment");
  };

  if (!product) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${currentTheme.text} mb-4`}>Product Not Found</h2>
          <Button onClick={() => navigate("/marketplace")} className={`${currentTheme.primary} text-white`}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <div className="container py-6">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className={`mb-6 ${currentTheme.text} hover:${currentTheme.secondary}`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className={`${currentTheme.cardBg} rounded-lg p-4 border ${currentTheme.border}`}>
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      index === currentImageIndex 
                        ? `border-purple-500` 
                        : `border-gray-300`
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className={`text-3xl font-bold ${currentTheme.text} mb-2`}>
                {product.title}
              </h1>
              <div className="flex items-center space-x-3 mb-4">
                <Badge variant="secondary" className={`${currentTheme.secondary}`}>
                  {product.category}
                </Badge>
                <Badge variant="outline" className={`${currentTheme.border}`}>
                  {product.condition}
                </Badge>
              </div>
              <p className={`text-4xl font-bold ${currentTheme.accent} mb-4`}>
                ${product.price}
              </p>
            </div>

            {/* Seller Info */}
            <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={product.seller.avatar} />
                    <AvatarFallback>{product.seller.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${currentTheme.text}`}>
                      {product.seller.username}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className={`text-sm ${currentTheme.text} ml-1`}>
                          {product.seller.rating}
                        </span>
                      </div>
                      <span className={`text-sm ${currentTheme.muted}`}>
                        {product.seller.totalSales} sales
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleBuyNow}
                className={`w-full ${currentTheme.primary} text-white h-12 text-lg font-semibold`}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Buy Now
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className={`${currentTheme.secondary} ${currentTheme.text} border-0`}>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Make Offer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={`${currentTheme.cardBg} ${currentTheme.text}`}>
                    <DialogHeader>
                      <DialogTitle>Make an Offer</DialogTitle>
                      <DialogDescription className={currentTheme.muted}>
                        Send an offer to the seller for this item
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        type="number"
                        placeholder="Enter your offer amount"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                      />
                      <Button onClick={handleMakeOffer} className={`w-full ${currentTheme.primary} text-white`}>
                        Send Offer
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className={`${currentTheme.secondary} ${currentTheme.text} border-0`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={`${currentTheme.cardBg} ${currentTheme.text}`}>
                    <DialogHeader>
                      <DialogTitle>Message Seller</DialogTitle>
                      <DialogDescription className={currentTheme.muted}>
                        Send a message to {product.seller.username}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                      />
                      <Button onClick={handleSendMessage} className={`w-full ${currentTheme.primary} text-white`}>
                        Send Message
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Product Description */}
            <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
              <CardHeader>
                <CardTitle className={currentTheme.text}>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`${currentTheme.text} leading-relaxed`}>
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
