
import { useState, useEffect } from "react";
import { CreditCard, Bitcoin, DollarSign, Plus, CheckCircle, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  payment_method_details?: any;
}

const PaymentMethods = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createStripePayment = async (amount: number) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          transaction_type: 'stripe',
          amount,
          currency: 'USD',
          status: 'pending',
          payment_method_details: { method: 'stripe' }
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Payment Created",
        description: "Stripe payment has been initiated.",
      });

      fetchTransactions();
    } catch (error) {
      console.error('Error creating Stripe payment:', error);
      toast({
        title: "Error",
        description: "Failed to create payment.",
        variant: "destructive",
      });
    }
  };

  const createCryptoPayment = async (amount: number) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          transaction_type: 'crypto',
          amount,
          currency: 'USD',
          status: 'pending',
          payment_method_details: { method: 'crypto', type: 'bitcoin' }
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Crypto Payment Created",
        description: "Bitcoin payment has been initiated.",
      });

      fetchTransactions();
    } catch (error) {
      console.error('Error creating crypto payment:', error);
      toast({
        title: "Error",
        description: "Failed to create crypto payment.",
        variant: "destructive",
      });
    }
  };

  const createPayPalPayment = async (amount: number) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          transaction_type: 'paypal',
          amount,
          currency: 'USD',
          status: 'pending',
          payment_method_details: { method: 'paypal' }
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "PayPal Payment Created",
        description: "PayPal payment has been initiated.",
      });

      fetchTransactions();
    } catch (error) {
      console.error('Error creating PayPal payment:', error);
      toast({
        title: "Error",
        description: "Failed to create PayPal payment.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold ${currentTheme.text} mb-2`}>
          Payment Methods
        </h2>
        <p className={`${currentTheme.muted}`}>
          Manage your payments and transactions
        </p>
      </div>

      {/* Payment Method Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className={`${currentTheme.cardBg} border ${currentTheme.border} hover:scale-105 transition-transform cursor-pointer`}>
          <CardHeader className="text-center">
            <CreditCard className={`h-8 w-8 ${currentTheme.accent} mx-auto mb-2`} />
            <CardTitle className={`${currentTheme.text}`}>Stripe</CardTitle>
            <p className={`text-sm ${currentTheme.muted}`}>Credit/Debit Cards</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => createStripePayment(10)}
              className={`w-full ${currentTheme.primary} text-white`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Test $10 Payment
            </Button>
          </CardContent>
        </Card>

        <Card className={`${currentTheme.cardBg} border ${currentTheme.border} hover:scale-105 transition-transform cursor-pointer`}>
          <CardHeader className="text-center">
            <Bitcoin className={`h-8 w-8 text-orange-500 mx-auto mb-2`} />
            <CardTitle className={`${currentTheme.text}`}>Crypto</CardTitle>
            <p className={`text-sm ${currentTheme.muted}`}>Bitcoin, Ethereum, etc.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => createCryptoPayment(25)}
              className={`w-full bg-orange-500 hover:bg-orange-600 text-white`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Test $25 Payment
            </Button>
          </CardContent>
        </Card>

        <Card className={`${currentTheme.cardBg} border ${currentTheme.border} hover:scale-105 transition-transform cursor-pointer`}>
          <CardHeader className="text-center">
            <DollarSign className={`h-8 w-8 text-blue-500 mx-auto mb-2`} />
            <CardTitle className={`${currentTheme.text}`}>PayPal</CardTitle>
            <p className={`text-sm ${currentTheme.muted}`}>PayPal Account</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => createPayPalPayment(15)}
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Test $15 Payment
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
        <CardHeader>
          <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
            <Clock className="h-5 w-5" />
            Recent Transactions
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
                  className={`flex items-center justify-between p-3 rounded-lg ${currentTheme.secondary} border ${currentTheme.border}`}
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(transaction.status)}
                    <div>
                      <p className={`font-medium ${currentTheme.text} capitalize`}>
                        {transaction.transaction_type} Payment
                      </p>
                      <p className={`text-sm ${currentTheme.muted}`}>
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`font-medium ${currentTheme.text}`}>
                      ${transaction.amount}
                    </span>
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
                Create your first payment using one of the methods above
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethods;
