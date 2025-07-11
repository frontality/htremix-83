
import { useState, useEffect } from "react";
import { CreditCard, Bitcoin, DollarSign, Plus, CheckCircle, Clock, X, Wallet, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  from_currency?: string;
  to_currency?: string;
  status: string;
  created_at: string;
  payment_method_details?: any;
  metadata?: any;
}

interface WalletBalance {
  wallet_address: string;
  native_balance: {
    balance: number;
    symbol: string;
  };
  token_balances: Array<{
    symbol: string;
    balance: number;
    name: string;
  }>;
}

const EnhancedPaymentMethods = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("eth");

  useEffect(() => {
    if (user) {
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      console.log('Fetching enhanced transactions for user:', user.id);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      
      console.log('Enhanced transactions loaded:', data);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkWalletBalance = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Address Required",
        description: "Please enter a wallet address to check balance.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Checking wallet balance:', walletAddress);
      const { data, error } = await supabase.functions.invoke('check-wallet-balance', {
        body: {
          wallet_address: walletAddress,
          network: selectedNetwork
        }
      });

      if (error) throw error;

      if (data?.success) {
        setWalletBalance(data.data);
        toast({
          title: "Balance Retrieved",
          description: `Found ${data.data.native_balance.balance.toFixed(4)} ${data.data.native_balance.symbol}`,
        });
      }
    } catch (error) {
      console.error('Error checking wallet balance:', error);
      toast({
        title: "Error",
        description: "Failed to check wallet balance.",
        variant: "destructive",
      });
    }
  };

  const createTransaction = async (type: string, amount: number, currency: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to make transactions.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log(`Creating ${type} transaction for amount:`, amount);
      
      const transactionData = {
        user_id: user.id,
        transaction_type: type,
        amount,
        currency,
        status: 'pending',
        metadata: { 
          method: type,
          created_via: 'enhanced_payment_methods' 
        }
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) {
        console.error(`${type} transaction error:`, error);
        throw error;
      }

      toast({
        title: "Transaction Created",
        description: `${type} transaction for $${amount} has been initiated.`,
      });

      fetchTransactions();
    } catch (error) {
      console.error(`Error creating ${type} transaction:`, error);
      toast({
        title: "Error",
        description: `Failed to create ${type} transaction.`,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionDescription = (transaction: Transaction) => {
    if (transaction.transaction_type === 'exchange') {
      return `${transaction.from_currency} → ${transaction.to_currency}`;
    }
    return `${transaction.transaction_type} Transaction`;
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className={`${currentTheme.text} mb-4`}>Please log in to access enhanced payment methods.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance Checker */}
      <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
        <CardHeader>
          <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
            <Wallet className="h-5 w-5" />
            Wallet Balance Checker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter wallet address..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className={`flex-1 ${currentTheme.input}`}
            />
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger className={`w-32 ${currentTheme.input}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eth">Ethereum</SelectItem>
                <SelectItem value="bsc">BSC</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={checkWalletBalance}>
              Check Balance
            </Button>
          </div>

          {walletBalance && (
            <div className={`p-4 rounded-lg ${currentTheme.secondary} border ${currentTheme.border}`}>
              <h4 className={`font-medium ${currentTheme.text} mb-2`}>Balance Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={currentTheme.muted}>Native Balance:</span>
                  <span className={`font-medium ${currentTheme.text}`}>
                    {walletBalance.native_balance.balance.toFixed(4)} {walletBalance.native_balance.symbol}
                  </span>
                </div>
                {walletBalance.token_balances.length > 0 && (
                  <div>
                    <span className={`${currentTheme.muted} text-sm`}>Token Balances:</span>
                    <div className="mt-1 space-y-1">
                      {walletBalance.token_balances.slice(0, 5).map((token, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className={currentTheme.muted}>{token.symbol}:</span>
                          <span className={currentTheme.text}>{token.balance.toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Transaction Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`${currentTheme.cardBg} border ${currentTheme.border} hover:scale-105 transition-transform cursor-pointer`}>
          <CardHeader className="text-center">
            <CreditCard className={`h-8 w-8 ${currentTheme.accent} mx-auto mb-2`} />
            <CardTitle className={`${currentTheme.text}`}>Credit Card</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => createTransaction('payment', 50, 'USD')}
              className={`w-full ${currentTheme.primary} text-white`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Pay $50
            </Button>
          </CardContent>
        </Card>

        <Card className={`${currentTheme.cardBg} border ${currentTheme.border} hover:scale-105 transition-transform cursor-pointer`}>
          <CardHeader className="text-center">
            <Bitcoin className={`h-8 w-8 text-orange-500 mx-auto mb-2`} />
            <CardTitle className={`${currentTheme.text}`}>Crypto</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => createTransaction('crypto', 0.001, 'BTC')}
              className={`w-full bg-orange-500 hover:bg-orange-600 text-white`}
            >
              <Plus className="h-4 w-4 mr-2" />
              0.001 BTC
            </Button>
          </CardContent>
        </Card>

        <Card className={`${currentTheme.cardBg} border ${currentTheme.border} hover:scale-105 transition-transform cursor-pointer`}>
          <CardHeader className="text-center">
            <ArrowUpDown className={`h-8 w-8 text-purple-500 mx-auto mb-2`} />
            <CardTitle className={`${currentTheme.text}`}>Exchange</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => createTransaction('exchange', 100, 'USD')}
              className={`w-full bg-purple-500 hover:bg-purple-600 text-white`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Exchange $100
            </Button>
          </CardContent>
        </Card>

        <Card className={`${currentTheme.cardBg} border ${currentTheme.border} hover:scale-105 transition-transform cursor-pointer`}>
          <CardHeader className="text-center">
            <DollarSign className={`h-8 w-8 text-green-500 mx-auto mb-2`} />
            <CardTitle className={`${currentTheme.text}`}>Deposit</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => createTransaction('deposit', 200, 'USD')}
              className={`w-full bg-green-500 hover:bg-green-600 text-white`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Deposit $200
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Transaction History */}
      <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
        <CardHeader>
          <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
            <Clock className="h-5 w-5" />
            Enhanced Transaction History
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchTransactions}
              className="ml-auto"
            >
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              <p className={`${currentTheme.muted} mt-2`}>Loading transactions...</p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${currentTheme.secondary} border ${currentTheme.border}`}
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(transaction.status)}
                    <div>
                      <p className={`font-medium ${currentTheme.text} capitalize`}>
                        {getTransactionDescription(transaction)}
                      </p>
                      <p className={`text-sm ${currentTheme.muted}`}>
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className={`font-medium ${currentTheme.text}`}>
                        {transaction.amount} {transaction.currency}
                      </span>
                      {transaction.transaction_type === 'exchange' && transaction.to_currency && (
                        <p className={`text-sm ${currentTheme.muted}`}>
                          to {transaction.to_currency}
                        </p>
                      )}
                    </div>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className={`h-12 w-12 ${currentTheme.muted} mx-auto mb-4`} />
              <p className={`${currentTheme.muted}`}>No transactions yet</p>
              <p className={`text-sm ${currentTheme.muted}`}>
                Create your first transaction using one of the methods above
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPaymentMethods;
