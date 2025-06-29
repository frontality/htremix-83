
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-black">
      <SkidHavenHeader />
      
      <div className="container py-12">
        <div className="max-w-2xl mx-auto bg-gray-900/10 rounded-xl p-8 border border-red-500/30 shadow-lg">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            
            <h1 className="text-3xl font-bold text-white">Payment Cancelled</h1>
            
            <p className="text-gray-300">
              Your payment has been cancelled.
            </p>
            
            <p className="text-gray-400">
              No charges have been made to your account. Your order has not been processed.
            </p>
            
            <div className="flex gap-4 mt-6">
              <Button asChild variant="outline" className="border-gray-600 text-white hover:bg-gray-600/20">
                <Link to="/">Return to Home</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-600/90">
                <Link to="/">Try Again</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <SkidHavenFooter />
    </div>
  );
};

export default PaymentCancelled;
