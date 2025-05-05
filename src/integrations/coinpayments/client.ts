import { useQuery } from "@tanstack/react-query";

const COINPAYMENTS_API_URL =
  "https://api.coinpayments.net/api.php";

export const SUPPORTED_CRYPTOCURRENCIES = [
  { name: "Bitcoin", code: "BTC", icon: "btc" },
  { name: "Ethereum", code: "ETH", icon: "eth" },
  { name: "Litecoin", code: "LTC", icon: "ltc" },
  { name: "Dogecoin", code: "DOGE", icon: "doge" },
  { name: "Bitcoin Cash", code: "BCH", icon: "bch" },
  { name: "Tether (USDT)", code: "USDT", icon: "usdt" },
  { name: "Ripple", code: "XRP", icon: "xrp" },
  { name: "Cardano", code: "ADA", icon: "ada" },
  { name: "Polkadot", code: "DOT", icon: "dot" },
  { name: "Solana", code: "SOL", icon: "sol" },
  { name: "Binance Coin", code: "BNB", icon: "bnb" },
  { name: "Avalanche", code: "AVAX", icon: "avax" },
  { name: "Chainlink", code: "LINK", icon: "link" },
  { name: "Polygon", code: "MATIC", icon: "matic" },
  { name: "Monero", code: "XMR", icon: "xmr" },
  { name: "Stellar Lumens", code: "XLM", icon: "xlm" },
  { name: "Uniswap", code: "UNI", icon: "uni" },
  { name: "Cosmos", code: "ATOM", icon: "atom" },
  { name: "Tron", code: "TRX", icon: "trx" },
  { name: "Dai", code: "DAI", icon: "dai" }
];

export const PAYMENT_STATUS = {
  PENDING: 0,
  CONFIRMED: 1,
  COMPLETE: 100,
  EXPIRED: -1
};

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
    console.log(`Creating CoinPayment transaction with: ${amount} ${cryptoCurrency}`);
    
    const response = await fetch('/api/create-coinpayment', {
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
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

// Add a new function to send Telegram notifications
export const sendTelegramNotification = async (customerData: any): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Sending notification to Telegram with data:', customerData);
    
    const response = await fetch('/api/telegram-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: customerData
      }),
    });

    // Log the complete response information for debugging
    console.log('Telegram notification response status:', response.status);
    console.log('Telegram notification response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error sending Telegram notification. Status:', response.status, 'Body:', errorText);
      return { success: false, error: `Failed to send notification: ${response.status} - ${errorText}` };
    }

    try {
      const data = await response.json();
      console.log('Telegram notification successful, response:', data);
      return { success: true };
    } catch (jsonError) {
      const textResponse = await response.text();
      console.error('Error parsing JSON response from Telegram notification:', jsonError, 'Raw response:', textResponse);
      return { success: false, error: 'Invalid JSON response from notification service' };
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const getCoinPaymentStatus = async (txn_id: string) => {
  try {
    const response = await fetch('/api/check-coinpayment-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txn_id }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error checking transaction status:', error);
      return { success: false, error: 'Failed to check payment status' };
    }

    const data = await response.json();
    return {
      success: true,
      statusCode: data.statusCode,
      status: data.status,
    };
  } catch (error) {
    console.error('Error checking CoinPayments status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const useCoinPaymentStatus = (txn_id: string) => {
  return useQuery({
    queryKey: ["coinpayment-status", txn_id],
    queryFn: async () => {
      const result = await getCoinPaymentStatus(txn_id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    enabled: !!txn_id, // Only run the query if txn_id is not null
    refetchInterval: 5000, // Poll every 5 seconds
  });
};
