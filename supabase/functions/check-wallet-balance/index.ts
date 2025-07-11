
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
    const { wallet_address, network = 'eth' } = await req.json()
    
    if (!wallet_address) {
      throw new Error('Wallet address is required')
    }

    const moralisApiKey = Deno.env.get('MORALIS_API_KEY')
    if (!moralisApiKey) {
      throw new Error('Moralis API key not configured')
    }

    console.log(`Checking balance for wallet: ${wallet_address} on ${network}`)

    // Check native balance
    const nativeBalanceUrl = `https://deep-index.moralis.io/api/v2.2/${wallet_address}/balance?chain=${network}`
    const nativeResponse = await fetch(nativeBalanceUrl, {
      headers: {
        'X-API-Key': moralisApiKey,
        'Accept': 'application/json'
      }
    })

    if (!nativeResponse.ok) {
      throw new Error(`Moralis API error: ${nativeResponse.status}`)
    }

    const nativeBalance = await nativeResponse.json()

    // Check ERC-20 token balances
    const tokenBalanceUrl = `https://deep-index.moralis.io/api/v2.2/${wallet_address}/erc20?chain=${network}`
    const tokenResponse = await fetch(tokenBalanceUrl, {
      headers: {
        'X-API-Key': moralisApiKey,
        'Accept': 'application/json'
      }
    })

    let tokenBalances = []
    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json()
      tokenBalances = tokenData.result || []
    }

    // Convert balance from wei to ETH (for Ethereum)
    const ethBalance = network === 'eth' 
      ? parseFloat(nativeBalance.balance) / Math.pow(10, 18)
      : parseFloat(nativeBalance.balance)

    const result = {
      wallet_address,
      network,
      native_balance: {
        balance: ethBalance,
        symbol: network === 'eth' ? 'ETH' : network.toUpperCase(),
        raw_balance: nativeBalance.balance
      },
      token_balances: tokenBalances.map(token => ({
        token_address: token.token_address,
        name: token.name,
        symbol: token.symbol,
        balance: parseFloat(token.balance) / Math.pow(10, parseInt(token.decimals)),
        raw_balance: token.balance,
        decimals: token.decimals
      })),
      total_tokens: tokenBalances.length
    }

    console.log('Balance check result:', result)

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in check-wallet-balance:', error)
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
