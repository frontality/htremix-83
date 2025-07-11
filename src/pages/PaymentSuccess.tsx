
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowRight, CreditCard, PartyPopper, Printer, Mail
} from "lucide-react";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const details = location.state?.orderDetails;
    
    if (!details) {
      const savedOrder = localStorage.getItem("skidhavenOrder");
      if (savedOrder) {
        setOrderDetails(JSON.parse(savedOrder));
      } else {
        navigate("/");
        return;
      }
    } else {
      setOrderDetails(details);
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Payment Successful!",
        description: "Your order has been completed.",
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const printReceipt = () => {
    window.print();
  };

  const emailReceipt = () => {
    toast({
      title: "Receipt Sent!",
      description: `Your receipt has been emailed to ${orderDetails?.email || 'your email address'}.`,
    });
  };

  if (isLoading || !orderDetails) {
    return (
      <div className="min-h-screen bg-black">
        <SkidHavenHeader />
        <div className="container py-8 md:py-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl text-white font-semibold mb-2">Processing Your Payment...</h2>
            <p className="text-gray-400">Please wait while we complete your order.</p>
          </div>
        </div>
        <SkidHavenFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <SkidHavenHeader />
      
      <div className="container py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6 text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-green-600/20 rounded-full flex items-center justify-center">
                <PartyPopper className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-gray-300">
              Your payment has been processed successfully.
            </p>
          </div>
          
          <div className="bg-gray-900/10 rounded-xl p-6 border border-gray-700/20 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-400">Order Date:</span>
                <span className="text-white">
                  {new Date(orderDetails.orderDate || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-400">Name:</span>
                <span className="text-white">{orderDetails.customerName}</span>
              </div>
              
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-400">Email:</span>
                <span className="text-white">{orderDetails.email}</span>
              </div>
              
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-400">Payment Method:</span>
                <div className="flex items-center text-white gap-1">
                  <CreditCard size={16} className="text-blue-600" />
                  <span>{orderDetails.paymentMethod} ****{orderDetails.lastFour}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold">
                <span className="text-white">Total Paid:</span>
                <span className="text-blue-600">${orderDetails.paymentAmount?.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={printReceipt}
              className="flex items-center justify-center gap-2 border-gray-600 text-white hover:bg-gray-600/20"
            >
              <Printer size={16} />
              Print Receipt
            </Button>
            <Button 
              variant="outline" 
              onClick={emailReceipt}
              className="flex items-center justify-center gap-2 border-gray-600 text-white hover:bg-gray-600/20"
            >
              <Mail size={16} />
              Email Receipt
            </Button>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-600/90 text-white px-8 py-6 text-lg font-bold"
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <SkidHavenFooter />
    </div>
  );
};

export default PaymentSuccess;
