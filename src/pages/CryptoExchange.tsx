
import { useState } from "react";
import { ArrowUpDown, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HotTopicHeader from "@/components/HotTopicHeader";
import HotTopicFooter from "@/components/HotTopicFooter";
import { useTheme } from "@/contexts/ThemeContext";
import { SUPPORTED_CRYPTOCURRENCIES } from "@/integrations/coinpayments/client";

const CryptoExchange = () => {
  const { currentTheme } = useTheme();
  const [fromCurrency, setFromCurrency] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("ETH");
  const [amount, setAmount] = useState("");
  const [exchangeRate] = useState(0.065); // Mock exchange rate

  const convertedAmount = amount ? (parseFloat(amount) * exchangeRate).toFixed(6) : "0";

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <HotTopicHeader />
      
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className={`${currentTheme.cardBg} rounded-xl p-8 border ${currentTheme.border}`}>
            <div className="text-center mb-8">
              <h1 className={`text-4xl font-bold ${currentTheme.text} mb-2`}>
                Crypto <span className={currentTheme.accent}>Exchange</span>
              </h1>
              <p className={`${currentTheme.muted} text-lg`}>
                Exchange cryptocurrencies instantly with competitive rates
              </p>
            </div>

            {/* Exchange Form */}
            <div className="space-y-6">
              {/* From Currency */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>From</label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`${currentTheme.secondary} ${currentTheme.text} border-0 text-lg h-12`}
                    />
                  </div>
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className={`w-32 ${currentTheme.secondary} ${currentTheme.text} border-0 h-12`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_CRYPTOCURRENCIES.map((crypto) => (
                        <SelectItem key={crypto.code} value={crypto.code}>
                          <div className="flex items-center space-x-2">
                            <img src={crypto.logo} alt={crypto.name} className="w-4 h-4" />
                            <span>{crypto.code}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSwapCurrencies}
                  className={`p-2 rounded-full ${currentTheme.secondary} ${currentTheme.text} hover:opacity-80 transition-opacity`}
                >
                  <ArrowUpDown className="h-5 w-5" />
                </button>
              </div>

              {/* To Currency */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>To</label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={convertedAmount}
                      readOnly
                      className={`${currentTheme.secondary} ${currentTheme.text} border-0 text-lg h-12`}
                    />
                  </div>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className={`w-32 ${currentTheme.secondary} ${currentTheme.text} border-0 h-12`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_CRYPTOCURRENCIES.map((crypto) => (
                        <SelectItem key={crypto.code} value={crypto.code}>
                          <div className="flex items-center space-x-2">
                            <img src={crypto.logo} alt={crypto.name} className="w-4 h-4" />
                            <span>{crypto.code}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Exchange Rate */}
              <div className={`${currentTheme.secondary} p-4 rounded-lg flex items-center justify-between`}>
                <div className="flex items-center space-x-2">
                  <TrendingUp className={`h-4 w-4 ${currentTheme.accent}`} />
                  <span className={`text-sm ${currentTheme.text}`}>Exchange Rate</span>
                </div>
                <span className={`text-sm font-medium ${currentTheme.accent}`}>
                  1 {fromCurrency} = {exchangeRate} {toCurrency}
                </span>
              </div>

              {/* Exchange Button */}
              <Button 
                className={`w-full ${currentTheme.primary} text-white h-12 text-lg font-semibold`}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                <Wallet className="mr-2 h-5 w-5" />
                Exchange Now
              </Button>

              {/* Disclaimer */}
              <p className={`text-xs ${currentTheme.muted} text-center`}>
                Exchange rates are updated in real-time. Final rates may vary slightly at execution.
              </p>
            </div>
          </div>
        </div>
      </div>

      <HotTopicFooter />
    </div>
  );
};

export default CryptoExchange;
