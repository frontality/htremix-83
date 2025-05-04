
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import HotTopicHeader from "@/components/HotTopicHeader";
import HotTopicFooter from "@/components/HotTopicFooter";

interface OrderDetails {
  customerName: string;
  email: string;
  giftCardValue: number;
  paymentAmount: number;
  deliveryMethod: string;
  orderDate: string;
}

const PaymentSuccess = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Retrieve order details from localStorage
    const savedOrder = localStorage.getItem("hotTopicOrder");
    if (savedOrder) {
      setOrderDetails(JSON.parse(savedOrder));
    }
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <HotTopicHeader />
      
      <div className="container py-12">
        <div className="max-w-2xl mx-auto bg-hottopic-gray/10 rounded-xl p-8 border border-green-500/30 shadow-lg">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-bold text-white">Payment Successful!</h1>
            
            <p className="text-gray-300">
              Your cryptocurrency payment for Hot Topic gift card has been processed successfully.
            </p>
            
            {orderDetails ? (
              <div className="w-full mt-6 space-y-4">
                <h2 className="text-xl font-semibold text-white">Order Summary</h2>
                
                <div className="bg-hottopic-dark/50 rounded-lg p-4 border border-hottopic-gray/30">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gift Card Value</span>
                      <span className="text-white">${orderDetails.giftCardValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment Amount</span>
                      <span className="text-hottopic-red">${orderDetails.paymentAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Delivery Method</span>
                      <span className="text-white capitalize">{orderDetails.deliveryMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Order Date</span>
                      <span className="text-white">{new Date(orderDetails.orderDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-hottopic-dark/50 rounded-lg p-4 border border-hottopic-gray/30">
                  <p className="text-sm text-gray-300">
                    {orderDetails.deliveryMethod === "e-gift" 
                      ? "Your gift card will be emailed to you shortly." 
                      : "Your physical gift card will be shipped to the provided address."}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-yellow-500">Order details not found. Your payment was still processed successfully.</p>
            )}
            
            <div className="flex gap-4 mt-6">
              <Button asChild className="bg-hottopic-red hover:bg-hottopic-red/90">
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <HotTopicFooter />
    </div>
  );
};

export default PaymentSuccess;
