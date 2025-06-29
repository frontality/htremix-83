import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Marketplace from "./pages/Marketplace";
import SellItems from "./pages/SellItems";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import Payment from "./pages/Payment";
import ProcessingPayment from "./pages/ProcessingPayment";
import OTPVerification from "./pages/OTPVerification";
import CryptoExchange from "./pages/CryptoExchange";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import CursorBackground from "./components/CursorBackground";
import TopHeader from "./components/TopHeader";
import QuickActions from "./components/QuickActions";
import FixedUserSearch from "./components/FixedUserSearch";
import Settings from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen relative">
              <CursorBackground />
              <TopHeader />
              <div className="pt-20 relative z-10">
                <Toaster />
                <Sonner position="top-right" closeButton theme="dark" />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/sell" element={<SellItems />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/processing-payment" element={<ProcessingPayment />} />
                  <Route path="/otp-verification" element={<OTPVerification />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-cancelled" element={<PaymentCancelled />} />
                  <Route path="/crypto-exchange" element={<CryptoExchange />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <QuickActions />
                <FixedUserSearch />
              </div>
            </div>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
