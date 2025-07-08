
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { currentTheme } = useTheme();
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic client-side validation
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await signIn(email.trim(), password);
      
      if (error) {
        toast({
          title: "Login Error",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back! 🎉",
          description: "You have successfully logged in.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
            <CardHeader className="text-center">
              <CardTitle className={`text-2xl font-bold ${currentTheme.text}`}>
                Welcome Back
              </CardTitle>
              <CardDescription className={currentTheme.muted}>
                Sign in with your email and password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className={currentTheme.text}>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                    required
                    maxLength={254}
                    autoComplete="email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className={currentTheme.text}>Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${currentTheme.secondary} ${currentTheme.text} border-0 pr-10`}
                      required
                      maxLength={128}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${currentTheme.muted} hover:${currentTheme.text}`}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className={`w-full ${currentTheme.primary} text-white`}
                  disabled={loading}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
                
                <div className="text-center">
                  <Link to="/forgot-password" className={`text-sm ${currentTheme.accent} hover:underline`}>
                    Forgot your password?
                  </Link>
                </div>
                
                <div className="text-center">
                  <span className={`text-sm ${currentTheme.muted}`}>
                    Don't have an account?{" "}
                    <Link to="/signup" className={`${currentTheme.accent} hover:underline`}>
                      Sign up
                    </Link>
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <SkidHavenFooter />
    </div>
  );
};

export default Login;
