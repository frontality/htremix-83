
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const TELEGRAM_CHANNEL_ID = Deno.env.get("TELEGRAM_CHANNEL_ID");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderDetails {
  customerName: string;
  email: string;
  phone: string;
  giftCardValue: number;
  paymentAmount: number;
  deliveryMethod: string;
  cryptoCurrency: string;
  transactionId: string;
}

function formatTelegramMessage(orderDetails: OrderDetails): string {
  return `
🛒 *NEW HOT TOPIC GIFT CARD ORDER* 🛒

👤 *Customer*: ${orderDetails.customerName}
📧 *Email*: ${orderDetails.email}
📱 *Phone*: ${orderDetails.phone}

💳 *Gift Card Value*: $${orderDetails.giftCardValue.toFixed(2)}
💰 *Payment Amount*: $${orderDetails.paymentAmount.toFixed(2)}
🪙 *Cryptocurrency*: ${orderDetails.cryptoCurrency}

🚚 *Delivery Method*: ${orderDetails.deliveryMethod}
🔢 *Transaction ID*: \`${orderDetails.transactionId}\`

📆 *Date*: ${new Date().toLocaleString()}
`;
}

async function sendTelegramNotification(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
    console.error("Missing Telegram configuration");
    return false;
  }

  try {
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHANNEL_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const data = await response.json();
    
    if (!data.ok) {
      console.error("Telegram API error:", data);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderDetails: OrderDetails = await req.json();
    console.log("Received order details for Telegram notification:", orderDetails);
    
    // Format the message for Telegram
    const message = formatTelegramMessage(orderDetails);
    
    // Send the notification
    const success = await sendTelegramNotification(message);
    
    if (!success) {
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send Telegram notification" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
