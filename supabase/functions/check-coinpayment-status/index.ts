
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const COINPAYMENTS_API_KEY = Deno.env.get('COINPAYMENTS_API_KEY');
    const COINPAYMENTS_API_SECRET = Deno.env.get('COINPAYMENTS_API_SECRET');
    
    if (!COINPAYMENTS_API_KEY || !COINPAYMENTS_API_SECRET) {
      console.error("Missing CoinPayments API credentials");
      return new Response(
        JSON.stringify({ error: 'Payment service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Extract transaction ID from the request
    const { txn_id } = await req.json();
    
    if (!txn_id) {
      return new Response(
        JSON.stringify({ error: 'Missing transaction ID' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create URLSearchParams object for form data
    const params = new URLSearchParams();
    params.append('version', '1');
    params.append('key', COINPAYMENTS_API_KEY);
    params.append('cmd', 'get_tx_info');
    params.append('txid', txn_id);
    params.append('full', '1');
    
    // Generate HMAC signature for the request
    const hmacSignature = await generateHmac(params.toString(), COINPAYMENTS_API_SECRET);
    
    console.log("Checking status for transaction:", txn_id);

    // Call CoinPayments API with proper content type
    const response = await fetch('https://www.coinpayments.net/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'HMAC': hmacSignature,
      },
      body: params.toString(),
    });

    const responseText = await response.text();
    console.log("CoinPayments status API raw response:", responseText);
    
    let statusData;
    try {
      statusData = JSON.parse(responseText);
      console.log("CoinPayments status API parsed response:", JSON.stringify(statusData));
    } catch (e) {
      console.error("Failed to parse CoinPayments API response:", e);
      return new Response(
        JSON.stringify({ error: 'Invalid response from payment gateway' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // CoinPayments uses "error":"ok" to indicate success
    if (statusData.error === "ok" && statusData.result) {
      // Map status number to text
      const statusText = getStatusText(statusData.result.status);
      
      // Return the payment status
      return new Response(
        JSON.stringify({
          status: statusData.result.status,
          statusText: statusText,
          received_amount: statusData.result.received_amount,
          received_confirms: statusData.result.received_confirms,
          time_created: statusData.result.time_created,
          time_expires: statusData.result.time_expires,
          payment_address: statusData.result.payment_address,
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } else {
      console.error("CoinPayments API error:", statusData.error);
      return new Response(
        JSON.stringify({ error: statusData.error || 'Payment status check failed' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Function to generate HMAC signature for CoinPayments API
async function generateHmac(paramString: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', 
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(paramString)
  );
  
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Function to convert status code to text
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
