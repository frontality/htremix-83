
// CoinPayments API client for cryptocurrency payments
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CoinPaymentTransaction {
  txn_id: string;
  status_url: string;
  checkout_url: string;
  status: number;
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
    cryptoCurrency: string; // Added cryptocurrency parameter
  }
): Promise<{
  success: boolean;
  checkoutUrl?: string;
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
      cryptoCurrency: paymentDetails.cryptoCurrency // Log the selected cryptocurrency
    });
    
    // Call Supabase Edge Function to create a CoinPayments transaction
    const { data, error } = await supabase.functions.invoke("create-coinpayment", {
      body: {
        amount: discountedAmount, // Pass the discounted amount (50%)
        customerName: paymentDetails.customerName,
        customerEmail: paymentDetails.customerEmail,
        itemName: `Hot Topic $${paymentDetails.giftCardValue} Gift Card`,
        cryptoCurrency: paymentDetails.cryptoCurrency // Pass the selected cryptocurrency
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
    
    if (!data || !data.checkout_url) {
      console.error("Invalid response format:", data);
      return { 
        success: false, 
        error: "Invalid payment response format. Please try again." 
      };
    }

    return {
      success: true,
      checkoutUrl: data.checkout_url,
    };
  } catch (err) {
    console.error("CoinPayments transaction error:", err);
    return { 
      success: false, 
      error: "Payment service is currently unavailable. Please try again later." 
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

