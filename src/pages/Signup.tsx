
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import { useTheme } from "@/contexts/ThemeContext";

const Signup = () => {
  const { currentTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Signup logic would go here
    console.log("Signup attempted with:", formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
                  <Label htmlFor="username" className={currentTheme.text}>Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                    required
                  />
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
                </div>
                
                <Button type="submit" className={`w-full ${currentTheme.primary} text-white`}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
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
