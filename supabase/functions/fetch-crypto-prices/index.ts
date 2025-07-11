
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const coingeckoApiKey = Deno.env.get('COINGECKO_API_KEY')
    if (!coingeckoApiKey) {
      throw new Error('CoinGecko API key not configured')
    }

    // Fetch prices for major cryptocurrencies
    const symbols = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana', 'polygon', 'chainlink']
    const coingeckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(',')}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`

    console.log('Fetching crypto prices from CoinGecko...')
    const response = await fetch(coingeckoUrl, {
      headers: {
        'X-CG-Demo-API-Key': coingeckoApiKey,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const priceData = await response.json()
    console.log('Received price data:', priceData)

    // Update prices in database
    const updates = []
    for (const [coinId, data] of Object.entries(priceData)) {
      const symbol = coinId.toUpperCase()
      const updateData = {
        symbol,
        price_usd: data.usd,
        price_change_24h: data.usd_24h_change || 0,
        market_cap: data.usd_market_cap || 0,
        volume_24h: data.usd_24h_vol || 0,
        last_updated: new Date().toISOString()
      }

      const { error } = await supabaseClient
        .from('crypto_prices')
        .upsert(updateData, { 
          onConflict: 'symbol',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error(`Error updating ${symbol}:`, error)
      } else {
        updates.push(symbol)
      }
    }

    console.log('Successfully updated prices for:', updates)

    // Fetch updated prices to return
    const { data: updatedPrices, error: fetchError } = await supabaseClient
      .from('crypto_prices')
      .select('*')
      .order('last_updated', { ascending: false })

    if (fetchError) {
      throw fetchError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: updatedPrices,
        updated_count: updates.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in fetch-crypto-prices:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
