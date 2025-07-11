
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Wallet, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CryptoPrice {
  symbol: string;
  price_usd: number;
  price_change_24h: number;
  market_cap: number;
  volume_24h: number;
  last_updated: string;
}

const CryptoExchangeWidget = () => {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("BITCOIN");
  const [toCurrency, setToCurrency] = useState("ETHEREUM");

  useEffect(() => {
    fetchCryptoPrices();
    // Set up real-time price updates every 30 seconds
    const interval = setInterval(fetchCryptoPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    calculateExchange();
  }, [fromAmount, fromCurrency, toCurrency, prices]);

  const fetchCryptoPrices = async () => {
    try {
      console.log('Fetching crypto prices...');
      const { data, error } = await supabase.functions.invoke('fetch-crypto-prices');
      
      if (error) throw error;
      
      if (data?.success && data?.data) {
        setPrices(data.data);
        console.log('Prices updated:', data.data);
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      toast({
        title: "Error",
        description: "Failed to fetch crypto prices.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateExchange = () => {
    if (!fromAmount || !prices.length) {
      setToAmount("");
      return;
    }

    const fromPrice = prices.find(p => p.symbol === fromCurrency)?.price_usd || 0;
    const toPrice = prices.find(p => p.symbol === toCurrency)?.price_usd || 0;

    if (fromPrice && toPrice) {
      const usdValue = parseFloat(fromAmount) * fromPrice;
      const toAmountCalculated = usdValue / toPrice;
      setToAmount(toAmountCalculated.toFixed(8));
    }
  };

  const handleSwapCurrencies = () => {
    const tempCurrency = fromCurrency;
    const tempAmount = fromAmount;
    
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleExchange = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to perform exchanges.",
        variant: "destructive",
      });
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to exchange.",
        variant: "destructive",
      });
      return;
    }

    setExchangeLoading(true);
    
    try {
      console.log('Creating exchange transaction...');
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'exchange',
          amount: parseFloat(fromAmount),
          currency: fromCurrency,
          from_currency: fromCurrency,
          to_currency: toCurrency,
          exchange_rate: parseFloat(toAmount) / parseFloat(fromAmount),
          status: 'processing',
          metadata: {
            from_amount: fromAmount,
            to_amount: toAmount,
            exchange_type: 'crypto_to_crypto'
          }
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Exchange Initiated",
        description: `Exchange of ${fromAmount} ${fromCurrency} to ${toAmount} ${toCurrency} has been started.`,
      });

      // Reset form
      setFromAmount("");
      setToAmount("");

    } catch (error) {
      console.error('Exchange error:', error);
      toast({
        title: "Exchange Failed",
        description: "Failed to process exchange. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExchangeLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price);
  };

  const formatChange = (change: number) => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-purple-500" />
            <span className={`ml-2 ${currentTheme.text}`}>Loading prices...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Price Ticker */}
      <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
        <CardHeader>
          <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
            <TrendingUp className="h-5 w-5" />
            Live Crypto Prices
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchCryptoPrices}
              className="ml-auto"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prices.map((price) => (
              <div
                key={price.symbol}
                className={`p-3 rounded-lg ${currentTheme.secondary} border ${currentTheme.border}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${currentTheme.text}`}>
                    {price.symbol}
                  </span>
                  <Badge
                    className={
                      price.price_change_24h >= 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {price.price_change_24h >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {formatChange(price.price_change_24h)}
                  </Badge>
                </div>
                <div className={`text-lg font-bold ${currentTheme.text}`}>
                  {formatPrice(price.price_usd)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exchange Widget */}
      <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
        <CardHeader>
          <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
            <ArrowUpDown className="h-5 w-5" />
            Crypto Exchange
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Currency */}
          <div className="space-y-2">
            <label className={`text-sm font-medium ${currentTheme.text}`}>
              From
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className={`flex-1 ${currentTheme.input}`}
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className={`w-32 ${currentTheme.input}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {prices.map((price) => (
                    <SelectItem key={price.symbol} value={price.symbol}>
                      {price.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwapCurrencies}
              className={`${currentTheme.secondary} border ${currentTheme.border}`}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <label className={`text-sm font-medium ${currentTheme.text}`}>
              To
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.00"
                value={toAmount}
                readOnly
                className={`flex-1 ${currentTheme.input} bg-gray-50`}
              />
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className={`w-32 ${currentTheme.input}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {prices.map((price) => (
                    <SelectItem key={price.symbol} value={price.symbol}>
                      {price.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Exchange Button */}
          <Button
            onClick={handleExchange}
            disabled={!user || !fromAmount || exchangeLoading}
            className={`w-full ${currentTheme.primary} text-white`}
          >
            {exchangeLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4 mr-2" />
            )}
            {exchangeLoading ? "Processing..." : "Exchange"}
          </Button>

          {!user && (
            <p className={`text-sm text-center ${currentTheme.muted}`}>
              Please log in to perform exchanges
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoExchangeWidget;
