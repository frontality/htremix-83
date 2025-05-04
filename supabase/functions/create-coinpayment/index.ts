
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

    // Validate the user is authenticated (optional, depends on your requirements)
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { 
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

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
      return new Response(
        JSON.stringify({ error: 'Payment service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create HMAC signature for CoinPayments API
    const createHmacSignature = async (payload: string, secret: string): Promise<string> => {
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
        encoder.encode(payload)
      );
      
      return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    };

    // Prepare request to CoinPayments API
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const payload = JSON.stringify({
      version: 1,
      key: COINPAYMENTS_API_KEY,
      cmd: 'create_transaction',
      amount: amount.toString(),
      currency1: 'USD',
      currency2: 'BTC',  // Default to Bitcoin, but can be changed
      buyer_email: customerEmail,
      buyer_name: customerName || customerEmail,
      item_name: itemName,
      ipn_url: `${Deno.env.get('SUPABASE_URL') || ''}/functions/v1/coinpayments-webhook`,
      success_url: `${req.headers.get('origin') || ''}/payment-success`,
      cancel_url: `${req.headers.get('origin') || ''}/payment-cancelled`,
    });

    const signature = await createHmacSignature(payload, COINPAYMENTS_API_SECRET);

    // Call CoinPayments API
    const response = await fetch('https://www.coinpayments.net/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'HMAC': signature,
      },
      body: payload,
    });

    const paymentData = await response.json();
    
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
      return new Response(
        JSON.stringify({ error: paymentData.error || 'Payment creation failed' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
