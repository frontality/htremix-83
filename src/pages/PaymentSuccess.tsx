
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HotTopicHeader from "@/components/HotTopicHeader";
import HotTopicFooter from "@/components/HotTopicFooter";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowRight, CreditCard, Gift, PartyPopper, Printer, Mail, Clock
} from "lucide-react";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [giftCardCode, setGiftCardCode] = useState("XXXX-XXXX-XXXX-XXXX");
  const [giftCardPin, setGiftCardPin] = useState("XXXX");
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Generate random gift card details
  const generateGiftCard = () => {
    const randomCode = () => {
      return Math.random().toString(36).substring(2, 10).toUpperCase();
    };
    
    const code = `${randomCode().substring(0, 4)}-${randomCode().substring(0, 4)}-${randomCode().substring(0, 4)}-${randomCode().substring(0, 4)}`;
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    
    setGiftCardCode(code);
    setGiftCardPin(pin);
  };

  useEffect(() => {
    const details = location.state?.orderDetails;
    
    if (!details) {
      // Try to get from localStorage as fallback
      const savedOrder = localStorage.getItem("hotTopicOrder");
      if (savedOrder) {
        setOrderDetails(JSON.parse(savedOrder));
      } else {
        navigate("/");
        return;
      }
    } else {
      setOrderDetails(details);
    }
    
    // Simulate loading time to generate gift card
    const timer = setTimeout(() => {
      generateGiftCard();
      setIsLoading(false);
      
      toast({
        title: "Payment Successful!",
        description: "Your Hot Topic gift card is ready to use.",
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const printGiftCard = () => {
    window.print();
  };

  const emailGiftCard = () => {
    toast({
      title: "Gift Card Sent!",
      description: `Your gift card has been emailed to ${orderDetails?.email || 'your email address'}.`,
    });
  };

  if (isLoading || !orderDetails) {
    return (
      <div className="min-h-screen bg-black">
        <HotTopicHeader />
        <div className="container py-8 md:py-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-hottopic-red mx-auto mb-6"></div>
            <h2 className="text-2xl text-white font-semibold mb-2">Processing Your Payment...</h2>
            <p className="text-gray-400">Please wait while we generate your Hot Topic gift card.</p>
          </div>
        </div>
        <HotTopicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <HotTopicHeader />
      
      <div className="container py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6 text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-green-600/20 rounded-full flex items-center justify-center">
                <PartyPopper className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-gray-300">
              Your payment has been processed and your Hot Topic gift card is ready.
            </p>
          </div>
          
          {/* Card Details */}
          <div className="bg-hottopic-gray/10 rounded-xl p-6 border border-hottopic-gray/20 shadow-lg mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Gift Card</h2>
              <div className="bg-hottopic-red text-white text-xs px-2 py-1 rounded uppercase font-bold">
                ${orderDetails.giftCardValue?.toFixed(2) || "0.00"}
              </div>
            </div>
            
            <div className="relative bg-gradient-to-r from-hottopic-red/80 to-black/90 p-6 rounded-lg shadow-lg mb-4">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://i.imgur.com/adJEpil.png')] bg-cover opacity-10 rounded-lg"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <img src="https://i.imgur.com/adJEpil.png" alt="Hot Topic Logo" className="h-10" />
                  <div className="text-white font-bold">${orderDetails.giftCardValue?.toFixed(2) || "0.00"}</div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-300 text-sm">Gift Card Code</p>
                  <p className="text-white font-mono text-xl font-bold tracking-wider">{giftCardCode}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-300 text-sm">PIN</p>
                  <p className="text-white font-mono text-xl font-bold tracking-wider">{giftCardPin}</p>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-gray-300 text-sm">Valid at all Hot Topic stores and hottopic.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={printGiftCard}
                className="flex items-center justify-center gap-2 border-hottopic-gray text-white hover:bg-hottopic-gray/20"
              >
                <Printer size={16} />
                Print Gift Card
              </Button>
              <Button 
                variant="outline" 
                onClick={emailGiftCard}
                className="flex items-center justify-center gap-2 border-hottopic-gray text-white hover:bg-hottopic-gray/20"
              >
                <Mail size={16} />
                Email Gift Card
              </Button>
            </div>
          </div>
          
          {/* Order Details */}
          <div className="bg-hottopic-gray/10 rounded-xl p-6 border border-hottopic-gray/20 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between border-b border-hottopic-gray/30 pb-2">
                <span className="text-gray-400">Order Date:</span>
                <span className="text-white">
                  {new Date(orderDetails.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex justify-between border-b border-hottopic-gray/30 pb-2">
                <span className="text-gray-400">Name:</span>
                <span className="text-white">{orderDetails.customerName}</span>
              </div>
              
              <div className="flex justify-between border-b border-hottopic-gray/30 pb-2">
                <span className="text-gray-400">Email:</span>
                <span className="text-white">{orderDetails.email}</span>
              </div>
              
              <div className="flex justify-between border-b border-hottopic-gray/30 pb-2">
                <span className="text-gray-400">Delivery Method:</span>
                <span className="text-white capitalize">{orderDetails.deliveryMethod}</span>
              </div>
              
              <div className="flex justify-between border-b border-hottopic-gray/30 pb-2">
                <span className="text-gray-400">Payment Method:</span>
                <div className="flex items-center text-white gap-1">
                  <CreditCard size={16} className="text-hottopic-red" />
                  <span>{orderDetails.paymentMethod} ****{orderDetails.lastFour}</span>
                </div>
              </div>
              
              <div className="flex justify-between border-b border-hottopic-gray/30 pb-2">
                <span className="text-gray-400">Gift Card Value:</span>
                <span className="text-white">${orderDetails.giftCardValue?.toFixed(2) || "0.00"}</span>
              </div>
              
              <div className="flex justify-between border-b border-hottopic-gray/30 pb-2">
                <span className="text-gray-400">Discount Applied:</span>
                <span className="text-hottopic-red">70% OFF</span>
              </div>
              
              <div className="flex justify-between font-bold">
                <span className="text-white">Total Paid:</span>
                <span className="text-hottopic-red">${orderDetails.paymentAmount?.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="bg-hottopic-gray/10 rounded-xl p-6 border border-hottopic-gray/20 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-white mb-4">How to Use Your Gift Card</h2>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-hottopic-red rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">In-Store</h3>
                  <p className="text-gray-400 text-sm">
                    Present your gift card code to the cashier at any Hot Topic store location.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-hottopic-red rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Online</h3>
                  <p className="text-gray-400 text-sm">
                    Enter your gift card code and PIN during checkout on hottopic.com.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-hottopic-red rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Balance Check</h3>
                  <p className="text-gray-400 text-sm">
                    Check your balance at any Hot Topic store or on hottopic.com/giftcards.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Return Home Button */}
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="bg-hottopic-red hover:bg-hottopic-red/90 text-white px-8 py-6 text-lg font-bold"
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <HotTopicFooter />
    </div>
  );
};

export default PaymentSuccess;
