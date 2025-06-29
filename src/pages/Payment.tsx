
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import { AlertCircle, CreditCard, LockIcon, Shield } from "lucide-react";

// Updated card types with PNG images
const CARD_TYPES = [
  { 
    name: "Visa", 
    icon: (
      <img 
        src="https://i.imgur.com/k2VBEzO.png" 
        alt="Visa" 
        className="h-8 object-contain"
      />
    )
  },
  { 
    name: "Mastercard", 
    icon: (
      <img 
        src="https://i.imgur.com/TTURFkf.png" 
        alt="Mastercard" 
        className="h-8 object-contain"
      />
    )
  },
  { 
    name: "American Express", 
    icon: (
      <img 
        src="https://i.imgur.com/GuC4cCk.png" 
        alt="American Express" 
        className="h-8 object-contain"
      />
    )
  },
  { 
    name: "Discover", 
    icon: (
      <img 
        src="https://i.imgur.com/LJWfn5T.png" 
        alt="Discover" 
        className="h-8 object-contain"
      />
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
  useEffect(() => {
    if (!orderDetails) {
      navigate("/");
      toast({
        title: "Error",
        description: "No order information found. Please start again.",
        variant: "destructive",
      });
    }
  }, [orderDetails, navigate]);

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
        const currentMonth = new Date().getMonth() + 1;
        
        if (Number(year) < currentYear || 
            (Number(year) === currentYear && Number(month) < currentMonth)) {
          return "Card has expired";
        }
        return "";
      case "cvv":
        if (!CVV_REGEX.test(value)) {
          return "Please enter a valid CVV";
        }
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
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const detectedType = detectCardType(cleaned);
    if (detectedType !== "Unknown") {
      setSelectedCardType(detectedType);
    }
    
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
    const cleaned = value.replace(/\D/g, '');
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
    
    const fieldNames = ["cardNumber", "cardName", "expiryDate", "cvv"];
    
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
    
    setIsSubmitting(true);
    
    try {
      console.log(`Processing payment using ${selectedCardType}`);
      
      // Navigate to processing page
      navigate("/processing-payment", { 
        state: { 
          orderDetails,
          giftCardValue,
          discountedAmount,
          paymentMethod: selectedCardType,
          lastFour: formData.cardNumber.slice(-4)
        } 
      });
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

  const selectedCardIcon = CARD_TYPES.find(card => card.name === selectedCardType)?.icon;

  return (
    <div className="min-h-screen bg-black">
      <SkidHavenHeader />
      
      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-gray-900/10 rounded-xl p-6 border border-gray-700/20">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
              Complete Your <span className="text-blue-600">Payment</span>
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center mb-4">
                  <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white">
                    1
                  </span>
                  Payment Method
                </h2>
                
                <div className="space-y-2">
                  <Label htmlFor="cardType" className="text-white">Card Type*</Label>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <Select
                      value={selectedCardType}
                      onValueChange={(value) => setSelectedCardType(value)}
                    >
                      <SelectTrigger 
                        className="bg-gray-800 border-gray-600 focus:border-blue-600 w-full sm:w-auto"
                        id="cardType"
                      >
                        <SelectValue placeholder="Select card type">
                          <div className="flex items-center gap-2">
                            <div className="w-10 flex items-center">
                              {selectedCardIcon}
                            </div>
                            <span>{selectedCardType}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {CARD_TYPES.map((card) => (
                          <SelectItem 
                            key={card.name} 
                            value={card.name}
                            className="text-white hover:bg-gray-700/30 focus:bg-gray-700/30"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-10 flex items-center">
                                {card.icon}
                              </div>
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
                  <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white">
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
                        className={`bg-gray-800 border-gray-600 focus:border-blue-600 pl-9 font-mono ${errors.cardNumber ? 'border-red-500' : ''}`}
                        placeholder="•••• •••• •••• ••••"
                        maxLength={selectedCardType === "American Express" ? 17 : 19}
                      />
                      <div className="absolute left-3 top-2.5 h-4 w-4 text-gray-400">
                        {selectedCardIcon ? (
                          <div className="scale-75 -ml-2.5 -mt-2">
                            {selectedCardIcon}
                          </div>
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
                      className={`bg-gray-800 border-gray-600 focus:border-blue-600 ${errors.cardName ? 'border-red-500' : ''}`}
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
                      className={`bg-gray-800 border-gray-600 focus:border-blue-600 ${errors.expiryDate ? 'border-red-500' : ''}`}
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
                        className={`bg-gray-800 border-gray-600 focus:border-blue-600 ${errors.cvv ? 'border-red-500' : ''}`}
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
              <div className="bg-gray-800/20 p-6 rounded-lg border border-gray-700/30 space-y-4">
                <h3 className="text-xl font-semibold text-white mb-2">Order Summary</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">${giftCardValue?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Delivery Method:</span>
                    <span className="text-white capitalize">{orderDetails?.deliveryMethod}</span>
                  </div>
                  <div className="border-t border-gray-700/30 my-2 pt-2 flex justify-between font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-blue-600">${discountedAmount?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-6 bg-blue-600 hover:bg-blue-600/90 text-white font-bold text-lg"
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
      
      <SkidHavenFooter />
    </div>
  );
};

export default Payment;
