
// CoinPayments API client for cryptocurrency payments
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface CoinPaymentTransaction {
  txn_id: string;
  status_url: string;
  checkout_url: string;
  status: number;
  address: string;
  amount: string;
  confirms_needed: string;
  timeout: number;
  qrcode_url: string;
}

interface CoinPaymentRequest {
  amount: number;
  currency1: string;
  currency2: string;
  buyer_email: string;
  buyer_name: string;
  item_name: string;
}

// Creates a new transaction and returns checkout details
export const createCoinPaymentTransaction = async (
  paymentDetails: {
    amount: number;
    customerName: string;
    customerEmail: string;
    giftCardValue: number;
    cryptoCurrency: string;
  }
): Promise<{
  success: boolean;
  transactionDetails?: CoinPaymentTransaction;
  error?: string;
}> => {
  try {
    // Ensure the amount is exactly 50% of the gift card value
    const discountedAmount = paymentDetails.giftCardValue * 0.5;
    
    console.log("Creating CoinPayment transaction with details:", {
      amount: discountedAmount,
      customerName: paymentDetails.customerName,
      email: paymentDetails.customerEmail,
      giftCardValue: paymentDetails.giftCardValue,
      cryptoCurrency: paymentDetails.cryptoCurrency
    });
    
    // Call Supabase Edge Function to create a CoinPayments transaction
    const { data, error } = await supabase.functions.invoke("create-coinpayment", {
      body: {
        amount: discountedAmount,
        customerName: paymentDetails.customerName,
        customerEmail: paymentDetails.customerEmail,
        itemName: `Hot Topic $${paymentDetails.giftCardValue} Gift Card`,
        cryptoCurrency: paymentDetails.cryptoCurrency
      },
    });

    if (error) {
      console.error("Error calling Edge Function:", error);
      return { 
        success: false, 
        error: "Unable to create payment transaction. Please try again." 
      };
    }

    console.log("CoinPayments response data:", data);
    
    if (!data || !data.txn_id) {
      console.error("Invalid response format:", data);
      return { 
        success: false, 
        error: "Invalid payment response format. Please try again." 
      };
    }

    return {
      success: true,
      transactionDetails: data as CoinPaymentTransaction,
    };
  } catch (err) {
    console.error("CoinPayments transaction error:", err);
    return { 
      success: false, 
      error: "Payment service is currently unavailable. Please try again later." 
    };
  }
};

// Get transaction status from CoinPayments
export const getCoinPaymentStatus = async (
  txnId: string
): Promise<{
  success: boolean;
  status?: string;
  statusCode?: number;
  error?: string;
}> => {
  try {
    console.log("Checking status for transaction:", txnId);
    
    const { data, error } = await supabase.functions.invoke("check-coinpayment-status", {
      body: { txn_id: txnId }
    });

    if (error) {
      console.error("Error checking payment status:", error);
      return { 
        success: false, 
        error: "Unable to check payment status. Please try again." 
      };
    }

    console.log("Status check response:", data);

    // More robust data validation
    if (!data) {
      return { 
        success: false, 
        error: "No response from payment gateway." 
      };
    }

    // Check if the status field exists
    if (data.status === undefined || data.status === null) {
      return { 
        success: false, 
        error: "Invalid status response format." 
      };
    }

    return {
      success: true,
      status: data.statusText || getStatusText(data.status),
      statusCode: data.status
    };
  } catch (err) {
    console.error("Payment status check error:", err);
    return { 
      success: false, 
      error: "Unable to check payment status. Please try again." 
    };
  }
};

// Helper function to get status text from status code
function getStatusText(statusCode: number): string {
  switch (statusCode) {
    case 0:
      return "Waiting for Payment";
    case 1:
      return "Payment Received (Confirming)";
    case 2:
      return "Payment Confirmed";
    case -1:
      return "Payment Cancelled/Timed Out";
    default:
      return "Unknown Status";
  }
}

// List of supported cryptocurrencies
export const SUPPORTED_CRYPTOCURRENCIES = [
  { code: "BTC", name: "Bitcoin", logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
  { code: "ETH", name: "Ethereum", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  { code: "BNB", name: "Binance Coin", logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
  { code: "LTC", name: "Litecoin", logo: "https://cryptologos.cc/logos/litecoin-ltc-logo.png" },
  { code: "SOL", name: "Solana", logo: "https://cryptologos.cc/logos/solana-sol-logo.png" },
  { code: "TRX", name: "TRON", logo: "https://cryptologos.cc/logos/tron-trx-logo.png" },
  { code: "USDT.ERC20", name: "USDT ERC20", logo: "https://cryptologos.cc/logos/tether-usdt-logo.png" },
  { code: "USDT.TRC20", name: "USDT TRC20", logo: "https://cryptologos.cc/logos/tether-usdt-logo.png" },
  { code: "XMR", name: "Monero", logo: "https://cryptologos.cc/logos/monero-xmr-logo.png" },
  { code: "DOGE", name: "Dogecoin", logo: "https://cryptologos.cc/logos/dogecoin-doge-logo.png" }
];

// Payment status codes from CoinPayments
export const PAYMENT_STATUS = {
  WAITING: 0, // Waiting for funds
  CONFIRMED: 1, // 1+ confirmation but below needed confirms
  COMPLETE: 2, // Complete with all needed confirms
  EXPIRED: -1, // Expired or cancelled
};
