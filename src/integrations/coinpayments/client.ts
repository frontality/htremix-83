
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

    if (!data || !data.status) {
      return { 
        success: false, 
        error: "Invalid status response format." 
      };
    }

    return {
      success: true,
      status: data.statusText,
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

// List of supported cryptocurrencies
export const SUPPORTED_CRYPTOCURRENCIES = [
  { code: "BTC", name: "Bitcoin" },
  { code: "ETH", name: "Ethereum" },
  { code: "LTC", name: "Litecoin" },
  { code: "DOGE", name: "Dogecoin" },
  { code: "USDT", name: "Tether (ERC20)" },
  { code: "USDC", name: "USD Coin" },
  { code: "XRP", name: "XRP" },
  { code: "SOL", name: "Solana" },
  { code: "ADA", name: "Cardano" },
  { code: "DOT", name: "Polkadot" }
];

// Payment status codes from CoinPayments
export const PAYMENT_STATUS = {
  WAITING: 0, // Waiting for funds
  CONFIRMED: 1, // 1+ confirmation but below needed confirms
  COMPLETE: 2, // Complete with all needed confirms
  EXPIRED: -1, // Expired or cancelled
};
