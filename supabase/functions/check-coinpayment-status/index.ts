
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { txn_id } = await req.json();

    if (!txn_id) {
      return new Response(
        JSON.stringify({ error: 'Transaction ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // CoinPayments API credentials
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

    // Create URLSearchParams object for form data
    const params = new URLSearchParams();
    params.append('version', '1');
    params.append('key', COINPAYMENTS_API_KEY);
    params.append('cmd', 'get_tx_info');
    params.append('txid', txn_id);
    
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
    console.log("CoinPayments API raw response:", responseText);
    
    let statusData;
    try {
      statusData = JSON.parse(responseText);
      console.log("CoinPayments API parsed response:", JSON.stringify(statusData));
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
      const statusCode = parseInt(statusData.result.status);
      
      return new Response(
        JSON.stringify({
          success: true,
          statusCode: statusCode,
          status: getStatusLabel(statusCode),
          details: statusData.result,
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } else {
      console.error("CoinPayments API error:", statusData.error);
      return new Response(
        JSON.stringify({ error: statusData.error || 'Status check failed' }),
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

// Function to convert status code to human-readable label
function getStatusLabel(statusCode: number): string {
  switch (statusCode) {
    case -1:
      return "Expired";
    case 0:
      return "Pending";
    case 1: 
      return "Confirmed";
    case 100:
      return "Complete";
    default:
      return "Unknown";
  }
}
