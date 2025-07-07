
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
    const { amount, currency = 'usd', payment_method_id, user_id } = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Stripe secret key from environment
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      throw new Error('Stripe secret key not found')
    }

    // Create payment intent with Stripe
    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: (amount * 100).toString(), // Stripe expects cents
        currency: currency,
        automatic_payment_methods: JSON.stringify({ enabled: true }),
        ...(payment_method_id && { payment_method: payment_method_id, confirm: 'true' })
      }),
    })

    const paymentIntent = await stripeResponse.json()

    if (!stripeResponse.ok) {
      throw new Error(paymentIntent.error?.message || 'Failed to create payment intent')
    }

    // Save transaction to database
    const { data: transaction, error: dbError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id,
        transaction_type: 'stripe',
        amount,
        currency: currency.toUpperCase(),
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
        external_transaction_id: paymentIntent.id,
        payment_method_details: {
          stripe_payment_intent_id: paymentIntent.id,
          payment_method_id
        }
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to save transaction')
    }

    return new Response(
      JSON.stringify({
        success: true,
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        transaction_id: transaction.id,
        status: paymentIntent.status
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
