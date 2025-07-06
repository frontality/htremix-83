
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, UserPlus, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const { currentTheme } = useTheme();
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setUsernameChecking(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows found - username is available
        setUsernameAvailable(true);
      } else if (data) {
        // Username already exists
        setUsernameAvailable(false);
      }
    } catch (error) {
      console.error('Error checking username:', error);
    } finally {
      setUsernameChecking(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    // Only allow alphanumeric characters and underscores
    const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setFormData(prev => ({ ...prev, username: sanitized }));
    
    // Debounce username check
    const timeoutId = setTimeout(() => {
      checkUsernameAvailability(sanitized);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (!usernameAvailable) {
      toast({
        title: "Username Error",
        description: "Please choose an available username",
        variant: "destructive",
      });
      return;
    }

    if (formData.username.length < 3) {
      toast({
        title: "Username Error",
        description: "Username must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // First create the account
    const { error: signUpError } = await signUp(formData.email, formData.password);
    
    if (signUpError) {
      setLoading(false);
      return;
    }

    // Then create the profile with username
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ username: formData.username.toLowerCase() })
          .eq('id', user.id);

        if (profileError) {
          console.error('Error setting username:', profileError);
          toast({
            title: "Profile Error",
            description: "Account created but username couldn't be set. Please contact support.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'username') {
      handleUsernameChange(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const getUsernameStatus = () => {
    if (!formData.username) return null;
    if (formData.username.length < 3) return { color: 'text-yellow-500', message: 'Username must be at least 3 characters' };
    if (usernameChecking) return { color: 'text-blue-500', message: 'Checking availability...' };
    if (usernameAvailable === true) return { color: 'text-green-500', message: 'Username is available!' };
    if (usernameAvailable === false) return { color: 'text-red-500', message: 'Username is already taken' };
    return null;
  };

  const usernameStatus = getUsernameStatus();

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
            <CardHeader className="text-center">
              <CardTitle className={`text-2xl font-bold ${currentTheme.text}`}>
                Join SkidHaven
              </CardTitle>
              <CardDescription className={currentTheme.muted}>
                Create your account to start buying and selling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className={currentTheme.text}>
                    <User className="inline w-4 h-4 mr-1" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                    required
                    minLength={3}
                    maxLength={20}
                  />
                  {usernameStatus && (
                    <p className={`text-xs ${usernameStatus.color}`}>
                      {usernameStatus.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={currentTheme.text}>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                    required
                  />
                  <p className={`text-xs ${currentTheme.muted}`}>
                    Your email will be kept private and never shown to other users
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className={currentTheme.text}>Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`${currentTheme.secondary} ${currentTheme.text} border-0 pr-10`}
                      required
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
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className={currentTheme.text}>Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`${currentTheme.secondary} ${currentTheme.text} border-0 pr-10`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${currentTheme.muted} hover:${currentTheme.text}`}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                    <p className="text-red-500 text-sm">Passwords don't match</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className={`w-full ${currentTheme.primary} text-white`}
                  disabled={loading || !usernameAvailable || formData.password !== formData.confirmPassword}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
                
                <div className="text-center">
                  <span className={`text-sm ${currentTheme.muted}`}>
                    Already have an account?{" "}
                    <Link to="/login" className={`${currentTheme.accent} hover:underline`}>
                      Sign in
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

export default Signup;
