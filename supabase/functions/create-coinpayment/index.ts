
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

    // Format payload for CoinPayments API
    const formData = new FormData();
    formData.append('version', '1');
    formData.append('key', COINPAYMENTS_API_KEY);
    formData.append('cmd', 'create_transaction');
    formData.append('amount', amount.toString());
    formData.append('currency1', 'USD');
    formData.append('currency2', 'BTC');
    formData.append('buyer_email', customerEmail);
    formData.append('buyer_name', customerName || customerEmail);
    formData.append('item_name', itemName);
    
    const success_url = `${req.headers.get('origin') || ''}/payment-success`;
    const cancel_url = `${req.headers.get('origin') || ''}/payment-cancelled`;
    formData.append('success_url', success_url);
    formData.append('cancel_url', cancel_url);

    // Generate HMAC signature
    const hmacDigest = await generateHmac(formData, COINPAYMENTS_API_SECRET);

    // Call CoinPayments API
    const response = await fetch('https://www.coinpayments.net/api.php', {
      method: 'POST',
      headers: {
        'HMAC': hmacDigest,
      },
      body: formData,
    });

    const paymentData = await response.json();
    console.log("CoinPayments API response:", JSON.stringify(paymentData));
    
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
async function generateHmac(formData: FormData, secret: string): Promise<string> {
  // Convert FormData to a string with parameters in alphabetical order
  const params = new URLSearchParams();
  for (const [key, value] of formData.entries()) {
    params.append(key, value);
  }
  
  // Sort parameters alphabetically
  const sortedParams = new URLSearchParams([...params.entries()].sort());
  const paramString = sortedParams.toString();
  
  // Create HMAC signature
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
