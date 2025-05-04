
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import HotTopicHeader from "@/components/HotTopicHeader";
import HotTopicFooter from "@/components/HotTopicFooter";

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-black">
      <HotTopicHeader />
      
      <div className="container py-12">
        <div className="max-w-2xl mx-auto bg-hottopic-gray/10 rounded-xl p-8 border border-red-500/30 shadow-lg">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            
            <h1 className="text-3xl font-bold text-white">Payment Cancelled</h1>
            
            <p className="text-gray-300">
              Your cryptocurrency payment for the Hot Topic gift card has been cancelled.
            </p>
            
            <p className="text-gray-400">
              No charges have been made to your account. Your order has not been processed.
            </p>
            
            <div className="flex gap-4 mt-6">
              <Button asChild variant="outline" className="border-hottopic-gray text-white hover:bg-hottopic-gray/20">
                <Link to="/">Return to Home</Link>
              </Button>
              <Button asChild className="bg-hottopic-red hover:bg-hottopic-red/90">
                <Link to="/">Try Again</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <HotTopicFooter />
    </div>
  );
};

export default PaymentCancelled;
