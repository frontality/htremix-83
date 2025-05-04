
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || ''
    );

    // Extract payment details from the request
    const { amount, customerName, customerEmail, itemName } = await req.json();

    if (!amount || !customerEmail || !itemName) {
      return new Response(
        JSON.stringify({ error: 'Missing required payment information' }),
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

    console.log("Creating CoinPayments transaction with amount:", amount);

    // Create URLSearchParams object for form data
    const params = new URLSearchParams();
    params.append('version', '1');
    params.append('key', COINPAYMENTS_API_KEY);
    params.append('cmd', 'create_transaction');
    params.append('amount', amount.toString());
    params.append('currency1', 'USD');
    params.append('currency2', 'BTC');
    params.append('buyer_email', customerEmail);
    params.append('buyer_name', customerName || customerEmail);
    params.append('item_name', itemName);
    
    const success_url = `${req.headers.get('origin') || ''}/payment-success`;
    const cancel_url = `${req.headers.get('origin') || ''}/payment-cancelled`;
    params.append('success_url', success_url);
    params.append('cancel_url', cancel_url);

    // Generate HMAC signature for the request
    const hmacSignature = await generateHmac(params.toString(), COINPAYMENTS_API_SECRET);
    
    console.log("Sending request to CoinPayments with params:", params.toString());

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
    
    let paymentData;
    try {
      paymentData = JSON.parse(responseText);
      console.log("CoinPayments API parsed response:", JSON.stringify(paymentData));
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
    
    if (!paymentData.error && paymentData.result) {
      // Return the payment checkout URL
      return new Response(
        JSON.stringify({
          txn_id: paymentData.result.txn_id,
          status_url: paymentData.result.status_url,
          checkout_url: paymentData.result.checkout_url,
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } else {
      console.error("CoinPayments API error:", paymentData.error);
      return new Response(
        JSON.stringify({ error: paymentData.error || 'Payment creation failed' }),
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
