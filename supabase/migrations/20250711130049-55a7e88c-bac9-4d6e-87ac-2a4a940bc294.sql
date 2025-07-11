
-- Create a comprehensive transactions table to store all transaction types
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('crypto', 'exchange', 'payment', 'withdrawal', 'deposit')),
  amount DECIMAL(20, 8) NOT NULL,
  currency TEXT NOT NULL,
  from_currency TEXT,
  to_currency TEXT,
  exchange_rate DECIMAL(20, 8),
  fees DECIMAL(20, 8) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  transaction_hash TEXT,
  blockchain_network TEXT,
  wallet_address TEXT,
  recipient_address TEXT,
  payment_method_details JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Create user wallets table for storing wallet information
CREATE TABLE IF NOT EXISTS public.user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  wallet_type TEXT NOT NULL CHECK (wallet_type IN ('ethereum', 'bitcoin', 'binance_smart_chain', 'polygon')),
  wallet_address TEXT NOT NULL,
  private_key_encrypted TEXT,
  balance DECIMAL(20, 8) DEFAULT 0,
  currency TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, wallet_address)
);

-- Create crypto prices cache table
CREATE TABLE IF NOT EXISTS public.crypto_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  price_usd DECIMAL(20, 8) NOT NULL,
  price_change_24h DECIMAL(10, 4),
  market_cap BIGINT,
  volume_24h BIGINT,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(symbol)
);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_prices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_wallets
CREATE POLICY "Users can view own wallets" ON public.user_wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own wallets" ON public.user_wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallets" ON public.user_wallets
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for crypto_prices (public read access)
CREATE POLICY "Anyone can view crypto prices" ON public.crypto_prices
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage crypto prices" ON public.crypto_prices
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_type ON public.transactions(transaction_type);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_user_wallets_user_id ON public.user_wallets(user_id);
CREATE INDEX idx_user_wallets_address ON public.user_wallets(wallet_address);
CREATE INDEX idx_crypto_prices_symbol ON public.crypto_prices(symbol);
CREATE INDEX idx_crypto_prices_updated ON public.crypto_prices(last_updated DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_wallets_updated_at BEFORE UPDATE ON public.user_wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
