
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Sparkles, CreditCard, Mail, Truck, Shield } from "lucide-react";
import GiftCardOption from "@/components/GiftCardOption";
import DeliveryMethodSelector from "@/components/DeliveryMethodSelector";
import HotTopicHeader from "@/components/HotTopicHeader";

const GIFT_CARD_VALUES = [100, 500, 1000, 5000];

const Index = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"e-gift" | "physical">("e-gift");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAmount) {
      toast({
        title: "Error",
        description: "Please select a gift card amount",
        variant: "destructive",
      });
      return;
    }
    
    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "phone"];
    if (deliveryMethod === "physical") {
      requiredFields.push("address", "city", "state", "zipCode");
    }
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Show success message (in a real app, this would submit to a backend)
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Order submitted successfully!",
        description: `Your $${selectedAmount} Hot Topic gift card will be ${deliveryMethod === "e-gift" ? "emailed to you shortly" : "shipped to your address"}`,
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <HotTopicHeader />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-black to-background border-b border-hottopic-teal/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,229,0.1)_0,transparent_70%)]"></div>
        <div className="container py-10 md:py-16 relative">
          <div className="flex flex-col items-center justify-center mb-8 relative">
            <div className="relative w-full max-w-lg mb-8 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-hottopic-teal via-hottopic-purple to-hottopic-pink rounded-lg opacity-70 blur-md group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-card rounded-lg p-1 overflow-hidden">
                <img 
                  src="https://i.imgur.com/KnxncmZ.png" 
                  alt="Hot Topic Gift Card" 
                  className="w-full h-auto rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute -top-3 -right-3 bg-hottopic-teal text-white font-bold px-4 py-1 rounded-full transform rotate-12 shadow-teal-glow animate-pulse">
                  50% OFF!
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-2 relative">
              <span className="relative inline-block">
                Hot Topic <span className="text-hottopic-teal glow-text">Gift Cards</span>
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-hottopic-teal to-transparent"></span>
              </span>
            </h1>
            
            <p className="text-center text-xl md:text-2xl text-white/80 mb-4">
              Get authentic Hot Topic gift cards at{" "}
              <span className="bg-gradient-to-r from-hottopic-teal to-hottopic-purple px-2 py-1 rounded-md text-white font-bold shadow-teal-glow">
                50% OFF
              </span>
            </p>
            
            <p className="text-center text-gray-400 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-hottopic-teal" />
              Limited time offer - while supplies last!
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full border border-hottopic-teal/20">
                <Shield className="h-4 w-4 mr-2 text-hottopic-teal" />
                <span className="text-sm">Secure Checkout</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full border border-hottopic-teal/20">
                <CreditCard className="h-4 w-4 mr-2 text-hottopic-teal" />
                <span className="text-sm">Authentic Cards</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full border border-hottopic-teal/20">
                <Mail className="h-4 w-4 mr-2 text-hottopic-teal" />
                <span className="text-sm">Instant E-Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container py-10">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
          {/* Step 1: Select Gift Card Amount */}
          <div className="space-y-4 glass-panel p-6 relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-hottopic-teal/10 rounded-full blur-3xl -z-10"></div>
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <span className="bg-gradient-to-r from-hottopic-teal to-hottopic-purple w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white shadow-teal-glow">
                1
              </span>
              Select Gift Card Amount
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {GIFT_CARD_VALUES.map(value => (
                <GiftCardOption
                  key={value}
                  value={value}
                  isSelected={selectedAmount === value}
                  originalPrice={value}
                  discountedPrice={value * 0.5}
                  onClick={() => setSelectedAmount(value)}
                />
              ))}
            </div>
          </div>
          
          {/* Step 2: Delivery Method */}
          <div className="space-y-4 glass-panel p-6 relative">
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-hottopic-purple/10 rounded-full blur-3xl -z-10"></div>
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <span className="bg-gradient-to-r from-hottopic-teal to-hottopic-purple w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white shadow-teal-glow">
                2
              </span>
              Choose Delivery Method
            </h2>
            
            <DeliveryMethodSelector 
              selectedMethod={deliveryMethod} 
              onSelect={setDeliveryMethod} 
            />
          </div>
          
          {/* Step 3: Customer Information */}
          <div className="space-y-4 glass-panel p-6 relative">
            <div className="absolute top-10 right-10 w-40 h-40 bg-hottopic-pink/5 rounded-full blur-3xl -z-10"></div>
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <span className="bg-gradient-to-r from-hottopic-teal to-hottopic-purple w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white shadow-teal-glow">
                3
              </span>
              Your Information
            </h2>
            
            <div className="bg-card/40 backdrop-blur-sm border border-hottopic-teal/10 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">First Name*</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-black/30 border-hottopic-teal/30 focus:border-hottopic-teal"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Last Name*</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-black/30 border-hottopic-teal/30 focus:border-hottopic-teal"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address*</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-black/30 border-hottopic-teal/30 focus:border-hottopic-teal"
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone Number*</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-black/30 border-hottopic-teal/30 focus:border-hottopic-teal"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              {/* Conditional Shipping Address Fields */}
              {deliveryMethod === "physical" && (
                <div className="space-y-4 pt-4 border-t border-hottopic-teal/10">
                  <h3 className="text-lg font-medium text-hottopic-teal">Shipping Address</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-white">Street Address*</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-black/30 border-hottopic-teal/30 focus:border-hottopic-teal"
                      placeholder="Enter street address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-white">City*</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="bg-black/30 border-hottopic-teal/30 focus:border-hottopic-teal"
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-white">State*</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="bg-black/30 border-hottopic-teal/30 focus:border-hottopic-teal"
                        placeholder="Enter state"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-white">ZIP Code*</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="bg-black/30 border-hottopic-teal/30 focus:border-hottopic-teal"
                        placeholder="Enter ZIP code"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Order Summary */}
          {selectedAmount && (
            <div className="bg-card/40 backdrop-blur-sm border border-hottopic-teal/20 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-hottopic-teal/5 to-transparent -z-10"></div>
              
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-1 h-6 bg-hottopic-teal rounded mr-2"></span>
                Order Summary
              </h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Gift Card Value</span>
                  <span className="text-white">${selectedAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Discount (50%)</span>
                  <span className="text-hottopic-teal">-${(selectedAmount * 0.5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery Method</span>
                  <span className="text-white capitalize">{deliveryMethod}</span>
                </div>
                <div className="border-t border-hottopic-teal/20 my-2 pt-2 flex justify-between items-center">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-hottopic-teal to-hottopic-purple glow-text">
                    ${(selectedAmount * 0.5).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-hottopic-teal to-hottopic-purple rounded-lg opacity-70 group-hover:opacity-100 blur group-hover:blur-md transition duration-500"></div>
              <Button 
                type="submit" 
                disabled={isSubmitting || !selectedAmount}
                className="relative w-full md:w-auto px-8 py-6 bg-black text-white font-bold text-lg group-hover:bg-black/90 border-0"
              >
                {isSubmitting ? "Processing..." : "Complete Purchase"}
              </Button>
            </div>
          </div>
          
          <p className="text-center text-gray-400 text-sm">
            *By completing this purchase, you agree to our Terms & Conditions.
            <br />
            Gift cards are shipped within 3-5 business days. E-gift cards are delivered instantly.
          </p>
        </form>
      </div>
      
      {/* Footer */}
      <div className="border-t border-hottopic-teal/20 py-6 mt-8 bg-black/50 backdrop-blur-md">
        <div className="container">
          <p className="text-center text-gray-400 text-sm">
            Hot Topic is a registered trademark. This website is not affiliated with Hot Topic Inc.
            <br />
            © {new Date().getFullYear()} Discounted Gift Cards - All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
