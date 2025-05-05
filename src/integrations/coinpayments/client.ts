import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

const COINPAYMENTS_API_URL =
  "https://api.coinpayments.net/api.php";

export const SUPPORTED_CRYPTOCURRENCIES = [
  { name: "Bitcoin", code: "BTC" },
  { name: "Ethereum", code: "ETH" },
  { name: "Litecoin", code: "LTC" },
  { name: "Dogecoin", code: "DOGE" },
  { name: "Bitcoin Cash", code: "BCH" },
  { name: "Tether (USDT)", code: "USDT" },
];

export interface TransactionDetails {
  amount: string;
  address: string;
  txn_id: string;
  confirms_needed: string;
  timeout: number;
  checkout_url: string;
  status_url: string;
  qrcode_url: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  error?: string;
  transactionDetails?: TransactionDetails;
}

export const createCoinPaymentTransaction = async ({
  amount,
  customerName,
  customerEmail,
  giftCardValue,
  cryptoCurrency,
}: {
  amount: number;
  customerName: string;
  customerEmail: string;
  giftCardValue: number;
  cryptoCurrency: string;
}): Promise<CreatePaymentResponse> => {
  try {
    const response = await fetch('/functions/v1/create-coinpayment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency1: 'USD',
        currency2: cryptoCurrency,
        buyer_email: customerEmail,
        buyer_name: customerName,
        item_name: `Hot Topic $${giftCardValue} Gift Card`,
        item_number: `GC-${giftCardValue}`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error creating transaction:', error);
      return { success: false, error: 'Failed to create payment transaction' };
    }

    const data = await response.json();
    return {
      success: true,
      transactionDetails: data,
    };
  } catch (error) {
    console.error('Error creating CoinPayments transaction:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
};

// Add a new function to send Telegram notifications
export const sendTelegramNotification = async (customerData: any): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/functions/v1/telegram-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: customerData
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error sending Telegram notification:', error);
      return { success: false, error: 'Failed to send notification' };
    }

    const data = await response.json();
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
};

export const useCoinPaymentStatus = (txn_id: string) => {
  const supabase = useSupabaseClient();

  return useQuery(
    ["coinpayment-status", txn_id],
    async () => {
      const response = await supabase.functions.invoke("check-coinpayment-status", {
        body: JSON.stringify({ txn_id }),
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    },
    {
      enabled: !!txn_id, // Only run the query if txn_id is not null
      refetchInterval: 5000, // Poll every 5 seconds
    }
  );
};
