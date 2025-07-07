
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, DollarSign, Star, Share2, Heart, ShoppingCart, CreditCard, Banknote, Wallet } from "lucide-react";
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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<MarketplaceItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [offerAmount, setOfferAmount] = useState("");
  const [message, setMessage] = useState("");
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  useEffect(() => {
    // Load product from localStorage marketplace items
    const savedItems = localStorage.getItem('marketplace_items');
    if (savedItems) {
      const items = JSON.parse(savedItems);
      const foundProduct = items.find((item: MarketplaceItem) => item.id === id);
      setProduct(foundProduct || null);
    }
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

    console.log("Making offer:", offerAmount);
    
    toast({
      title: "Offer Sent",
      description: `Your offer of $${offerAmount} has been sent to the seller`,
    });
    
    setOfferAmount("");
    setShowOfferDialog(false);
  };

  const handlePurchase = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase items",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPaymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    // Simulate purchase process
    console.log("Processing purchase with:", selectedPaymentMethod);
    
    toast({
      title: "Purchase Initiated",
      description: `Processing payment of $${product?.price.toFixed(2)} via ${selectedPaymentMethod}`,
    });
    
    setShowPaymentDialog(false);
    
    // Redirect to processing page after a delay
    setTimeout(() => {
      navigate("/processing-payment");
    }, 1000);
  };

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "crypto", name: "Cryptocurrency", icon: Wallet },
    { id: "paypal", name: "PayPal", icon: Banknote },
  ];

  if (!product) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center pt-20`}>
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
    <div className={`min-h-screen ${currentTheme.bg} pt-20`}>
      <div className="container py-6 max-w-6xl mx-auto px-4">
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
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-800">
                <img
                  src={product.images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-12 rounded-lg border-2 overflow-hidden flex-shrink-0 ${
                      index === currentImageIndex 
                        ? `border-purple-500` 
                        : `border-gray-300`
                    }`}
                  >
                    <img 
                      src={image} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
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
                  {product.deliveryMethod}
                </Badge>
              </div>
              <p className={`text-4xl font-bold ${currentTheme.accent} mb-4`}>
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Seller Info */}
            <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{product.seller[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${currentTheme.text}`}>
                      {product.seller}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className={`text-sm ${currentTheme.text} ml-1`}>
                          4.8
                        </span>
                      </div>
                      <span className={`text-sm ${currentTheme.muted}`}>
                        {product.views} views
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogTrigger asChild>
                  <Button
                    className={`w-full ${currentTheme.primary} text-white h-12 text-lg font-semibold`}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Buy Now - ${product.price.toFixed(2)}
                  </Button>
                </DialogTrigger>
                <DialogContent className={`${currentTheme.cardBg} ${currentTheme.text}`}>
                  <DialogHeader>
                    <DialogTitle>Choose Payment Method</DialogTitle>
                    <DialogDescription className={currentTheme.muted}>
                      Select how you'd like to pay for {product.title}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <Card 
                        key={method.id}
                        className={`cursor-pointer transition-colors ${
                          selectedPaymentMethod === method.id 
                            ? `border-purple-500 ${currentTheme.secondary}` 
                            : `${currentTheme.cardBg} border-gray-300 hover:border-purple-300`
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <method.icon className="h-6 w-6" />
                            <span className="font-medium">{method.name}</span>
                            {selectedPaymentMethod === method.id && (
                              <div className="ml-auto w-4 h-4 bg-purple-500 rounded-full"></div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button 
                      onClick={handlePurchase} 
                      className={`w-full ${currentTheme.primary} text-white`}
                      disabled={!selectedPaymentMethod}
                    >
                      Complete Purchase
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
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
                        Send a message to {product.seller}
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
                <p className={`${currentTheme.text} leading-relaxed whitespace-pre-wrap`}>
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
