
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <HotTopicHeader />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-hottopic-dark to-black border-b border-hottopic-gray">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="relative w-full max-w-lg mb-6">
              <img 
                src="https://i.imgur.com/adJEpil.png" 
                alt="Hot Topic Gift Card" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute -top-3 -right-3 bg-hottopic-red text-white font-bold px-4 py-1 rounded-full transform rotate-12 shadow-lg">
                50% OFF!
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">
              Hot Topic <span className="text-hottopic-red">Gift Cards</span>
            </h1>
            <p className="text-center text-xl md:text-2xl text-white/80 mb-2">
              Get authentic Hot Topic gift cards at <span className="bg-hottopic-red px-2 py-1 rounded-md text-white font-bold">50% OFF</span>
            </p>
            <p className="text-center text-gray-400">Limited time offer - while supplies last!</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container py-8">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
          {/* Step 1: Select Gift Card Amount */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <span className="bg-hottopic-red w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white">
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
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <span className="bg-hottopic-red w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white">
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
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <span className="bg-hottopic-red w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white">
                3
              </span>
              Your Information
            </h2>
            
            <div className="bg-hottopic-gray/20 border border-hottopic-gray rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">First Name*</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red"
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
                    className="bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red"
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
                    className="bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red"
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
                    className="bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              {/* Conditional Shipping Address Fields */}
              {deliveryMethod === "physical" && (
                <div className="space-y-4 pt-2 border-t border-hottopic-gray/30">
                  <h3 className="text-lg font-medium text-white">Shipping Address</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-white">Street Address*</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red"
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
                        className="bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red"
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
                        className="bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red"
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
                        className="bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red"
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
            <div className="bg-hottopic-gray/20 border border-hottopic-gray rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Gift Card Value</span>
                  <span className="text-white">${selectedAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Discount (50%)</span>
                  <span className="text-hottopic-red">-${(selectedAmount * 0.5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery Method</span>
                  <span className="text-white capitalize">{deliveryMethod}</span>
                </div>
                <div className="border-t border-hottopic-gray/30 my-2 pt-2 flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-hottopic-red text-xl">${(selectedAmount * 0.5).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              type="submit" 
              disabled={isSubmitting || !selectedAmount}
              className="w-full md:w-auto px-8 py-6 bg-hottopic-red hover:bg-hottopic-red/90 text-white font-bold text-lg"
            >
              {isSubmitting ? "Processing..." : "Complete Purchase"}
            </Button>
          </div>
          
          <p className="text-center text-gray-400 text-sm">
            *By completing this purchase, you agree to our Terms & Conditions.
            <br />Gift cards are shipped within 3-5 business days. E-gift cards are delivered instantly.
          </p>
        </form>
      </div>
      
      {/* Footer */}
      <div className="border-t border-hottopic-gray py-6 mt-8">
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
