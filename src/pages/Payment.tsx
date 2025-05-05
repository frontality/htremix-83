
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import HotTopicHeader from "@/components/HotTopicHeader";
import HotTopicFooter from "@/components/HotTopicFooter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CoinPaymentTransaction, getCoinPaymentStatus, PAYMENT_STATUS, SUPPORTED_CRYPTOCURRENCIES } from "@/integrations/coinpayments/client";
import { AlertCircle, Copy, QrCode, Wallet } from "lucide-react";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<CoinPaymentTransaction | null>(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    statusCode: number;
    statusText: string;
  } | null>(null);
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  // Get transaction details from location state
  useEffect(() => {
    const txnDetails = location.state?.transactionDetails;
    if (txnDetails) {
      setTransaction(txnDetails);
      
      // Calculate time left in minutes
      if (txnDetails.timeout) {
        const expiryTimeInMinutes = Math.floor(txnDetails.timeout / 60);
        setTimeLeft(expiryTimeInMinutes);
      }
    } else {
      // If no transaction details, redirect to home
      toast({
        title: "Error",
        description: "No payment information found.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [location, navigate]);

  // Set up status check interval
  useEffect(() => {
    if (transaction?.txn_id) {
      // Initial status check
      checkPaymentStatus();
      
      // Set up interval to check status every 30 seconds
      const intervalId = window.setInterval(() => {
        checkPaymentStatus();
      }, 30000);
      
      setStatusCheckInterval(intervalId);
      
      // Countdown timer
      const countdownId = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(countdownId);
            return 0;
          }
          return prev - 0.5;
        });
      }, 30000);
      
      // Cleanup on component unmount
      return () => {
        if (statusCheckInterval) window.clearInterval(statusCheckInterval);
        window.clearInterval(countdownId);
      };
    }
  }, [transaction?.txn_id]);

  // Check payment status
  const checkPaymentStatus = async () => {
    if (!transaction?.txn_id) return;
    
    setLoading(true);
    
    try {
      const result = await getCoinPaymentStatus(transaction.txn_id);
      
      if (result.success && result.statusCode !== undefined) {
        setPaymentStatus({
          statusCode: result.statusCode,
          statusText: result.status || "Unknown",
        });
        
        // If payment is confirmed or completed, redirect to success page
        if (
          result.statusCode === PAYMENT_STATUS.CONFIRMED || 
          result.statusCode === PAYMENT_STATUS.COMPLETE
        ) {
          if (statusCheckInterval) window.clearInterval(statusCheckInterval);
          toast({
            title: "Payment Successful",
            description: "Your payment has been received and confirmed!",
          });
          navigate("/payment-success", { state: { txnId: transaction.txn_id } });
        }
        
        // If payment is expired or cancelled, redirect to cancelled page
        if (result.statusCode === PAYMENT_STATUS.EXPIRED) {
          if (statusCheckInterval) window.clearInterval(statusCheckInterval);
          toast({
            title: "Payment Expired",
            description: "Your payment has expired or been cancelled.",
            variant: "destructive",
          });
          navigate("/payment-cancelled");
        }
      } else if (result.error) {
        console.error("Payment status check failed:", result.error);
        toast({
          title: "Status Check Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment status check error:", error);
      toast({
        title: "Status Check Error",
        description: "An unexpected error occurred while checking payment status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Copy address to clipboard
  const copyAddressToClipboard = () => {
    if (transaction?.address) {
      navigator.clipboard.writeText(transaction.address);
      toast({
        title: "Address Copied",
        description: "Cryptocurrency address copied to clipboard",
      });
    }
  };

  // Get cryptocurrency details
  const getCryptoCurrency = () => {
    if (!transaction) return null;
    
    // Extract currency code from the transaction
    // The address is for the specific cryptocurrency, so we can determine the currency from the transaction
    const currencyCode = location.state?.cryptoCurrency || "BTC";
    
    return SUPPORTED_CRYPTOCURRENCIES.find(c => c.code === currencyCode) || {
      code: currencyCode,
      name: currencyCode,
      logo: null
    };
  };
  
  const cryptoCurrency = getCryptoCurrency();

  // Render loading state
  if (!transaction) {
    return (
      <div className="min-h-screen bg-black">
        <HotTopicHeader />
        <div className="container py-12 flex justify-center items-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hottopic-red mx-auto mb-4"></div>
            <p>Loading payment details...</p>
          </div>
        </div>
        <HotTopicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <HotTopicHeader />
      
      <div className="container py-8">
        <div className="max-w-3xl mx-auto bg-hottopic-gray/10 rounded-xl p-6 border border-hottopic-gray/20 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Complete Your Payment</h1>
            <p className="text-gray-300">
              Pay with {cryptoCurrency?.name || "cryptocurrency"} to receive your Hot Topic gift card
            </p>
          </div>
          
          {/* Payment Status Banner */}
          <div className={`mb-6 p-4 rounded-lg border ${
            paymentStatus?.statusCode === PAYMENT_STATUS.CONFIRMED 
            ? "bg-green-900/20 border-green-600/30 text-green-400" 
            : "bg-yellow-900/20 border-yellow-600/30 text-yellow-400"
          }`}>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                paymentStatus?.statusCode === PAYMENT_STATUS.CONFIRMED 
                ? "bg-green-400 animate-pulse" 
                : "bg-yellow-400 animate-pulse"
              }`}></div>
              <span className="font-medium">
                {paymentStatus?.statusText || "Waiting for Payment"}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* QR Code Section */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
                {transaction.qrcode_url ? (
                  <img 
                    src={transaction.qrcode_url} 
                    alt="Payment QR Code" 
                    className="w-64 h-64 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/400x400/black/white?text=QR+Code+Unavailable";
                    }}
                  />
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center bg-gray-100">
                    <QrCode size={64} className="text-gray-400" />
                    <span className="text-gray-400">QR Code Unavailable</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-400 text-center mb-4">
                Scan this QR code with your {cryptoCurrency?.name || "cryptocurrency"} wallet
              </p>
              
              <div className="flex flex-col items-center w-full">
                <Button
                  variant="outline"
                  onClick={checkPaymentStatus}
                  disabled={loading}
                  className="mb-2 border-hottopic-gray text-white hover:bg-hottopic-gray/20 w-full sm:w-auto"
                >
                  {loading ? "Checking..." : "Check Payment Status"}
                </Button>
                
                <Button 
                  variant="link" 
                  onClick={() => setShowInfoDialog(true)}
                  className="text-hottopic-red"
                >
                  Need help with payment?
                </Button>
              </div>
            </div>
            
            {/* Payment Details Section */}
            <div className="flex flex-col">
              <div className="bg-hottopic-gray/20 p-6 rounded-lg border border-hottopic-gray/30 mb-4">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Wallet className="mr-2 text-hottopic-red" size={20} />
                  Payment Instructions
                </h3>
                
                <div className="space-y-4">
                  {/* Amount */}
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Send exactly:</p>
                    <div className="font-bold text-2xl text-white">
                      {transaction.amount} {cryptoCurrency?.code || ""}
                    </div>
                  </div>
                  
                  {/* Address */}
                  <div>
                    <p className="text-gray-400 text-sm mb-1">To this address:</p>
                    <div className="flex items-center bg-hottopic-gray/30 border border-hottopic-gray/40 rounded p-2 gap-2">
                      <div className="text-sm text-white break-all font-mono flex-1">
                        {transaction.address}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={copyAddressToClipboard}
                        className="hover:bg-hottopic-gray/20"
                      >
                        <Copy size={16} className="text-hottopic-red" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Time Remaining */}
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Time remaining:</p>
                    <div className="font-semibold text-white">
                      {timeLeft !== null && timeLeft > 0 
                        ? `${Math.ceil(timeLeft)} minutes`
                        : "Payment expired"}
                    </div>
                  </div>
                  
                  {/* Confirmations */}
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Required confirmations:</p>
                    <div className="font-semibold text-white">
                      {transaction.confirms_needed} network confirmations
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="bg-hottopic-gray/20 p-6 rounded-lg border border-hottopic-gray/30">
                <h3 className="text-lg font-semibold text-white mb-3 border-b border-hottopic-gray/30 pb-2">
                  Order Summary
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Item:</span>
                    <span className="text-white">{location.state?.itemName || "Hot Topic Gift Card"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gift Card Value:</span>
                    <span className="text-white">${location.state?.giftCardValue?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Discount:</span>
                    <span className="text-hottopic-red">50% OFF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Method:</span>
                    <div className="flex items-center">
                      {cryptoCurrency?.logo && (
                        <img 
                          src={cryptoCurrency.logo} 
                          alt={cryptoCurrency.name} 
                          className="w-4 h-4 mr-1"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <span className="text-white">{cryptoCurrency?.name || "Cryptocurrency"}</span>
                    </div>
                  </div>
                  <div className="border-t border-hottopic-gray/30 my-2 pt-2 flex justify-between font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-hottopic-red">${location.state?.amount?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-400 flex items-center">
                  <AlertCircle size={12} className="mr-1 text-gray-400" />
                  Transaction ID: {transaction.txn_id?.substring(0, 12)}...
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => window.open(transaction.status_url, '_blank')}
              className="border-hottopic-gray text-white hover:bg-hottopic-gray/20"
            >
              View on CoinPayments
            </Button>
            <Button
              variant="default"
              onClick={() => navigate('/')}
              className="bg-hottopic-red hover:bg-hottopic-red/90"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
      
      {/* Help Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="bg-hottopic-dark border-hottopic-gray text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">How to Pay with {cryptoCurrency?.name || "Cryptocurrency"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Follow these steps to complete your payment:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Open your {cryptoCurrency?.name || "cryptocurrency"} wallet app</li>
              <li>Scan the QR code or copy the payment address</li>
              <li>Send <strong>exactly</strong> {transaction.amount} {cryptoCurrency?.code || ""}</li>
              <li>Wait for the network confirmations ({transaction.confirms_needed} required)</li>
              <li>Once confirmed, your payment will be automatically processed</li>
              <li>You'll receive your Hot Topic gift card details shortly after</li>
            </ol>
            <div className="bg-yellow-900/20 border border-yellow-600/30 text-yellow-400 p-3 rounded-md mt-4">
              <p className="text-sm flex items-center">
                <AlertCircle size={16} className="mr-2" />
                Payment must be completed within {Math.ceil(timeLeft || 0)} minutes or it will expire.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <HotTopicFooter />
    </div>
  );
};

export default Payment;
