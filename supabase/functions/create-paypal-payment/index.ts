
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency = 'USD', user_id, return_url, cancel_url } = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // PayPal API credentials (you'll need to set these in your Supabase secrets)
    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID')
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET')
    const paypalApiBase = Deno.env.get('PAYPAL_API_BASE') || 'https://api-m.sandbox.paypal.com' // Use sandbox for testing

    if (!paypalClientId || !paypalClientSecret) {
      throw new Error('PayPal credentials not found')
    }

    // Get PayPal access token
    const authResponse = await fetch(`${paypalApiBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${btoa(`${paypalClientId}:${paypalClientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    const authData = await authResponse.json()
    if (!authResponse.ok) {
      throw new Error('Failed to authenticate with PayPal')
    }

    // Create PayPal payment
    const paymentData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toString()
        }
      }],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
            brand_name: 'SkidHaven',
            locale: 'en-US',
            landing_page: 'LOGIN',
            user_action: 'PAY_NOW',
            return_url: return_url || 'https://your-app.com/payment-success',
            cancel_url: cancel_url || 'https://your-app.com/payment-cancelled'
          }
        }
      }
    }

    const paymentResponse = await fetch(`${paypalApiBase}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.access_token}`,
        'PayPal-Request-Id': crypto.randomUUID(),
      },
      body: JSON.stringify(paymentData),
    })

    const paymentResult = await paymentResponse.json()
    if (!paymentResponse.ok) {
      throw new Error(paymentResult.message || 'Failed to create PayPal payment')
    }

    // Save transaction to database
    const { data: transaction, error: dbError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id,
        transaction_type: 'paypal',
        amount,
        currency: currency,
        status: 'pending',
        external_transaction_id: paymentResult.id,
        payment_method_details: {
          paypal_order_id: paymentResult.id,
          approve_url: paymentResult.links.find((link: any) => link.rel === 'approve')?.href
        }
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to save transaction')
    }

    // Get the approval URL
    const approveUrl = paymentResult.links.find((link: any) => link.rel === 'approve')?.href

    return new Response(
      JSON.stringify({
        success: true,
        order_id: paymentResult.id,
        transaction_id: transaction.id,
        approve_url: approveUrl,
        status: paymentResult.status
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
