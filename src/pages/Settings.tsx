import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Bell, Globe, Shield, Save, RefreshCw, Palette, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeSelector from "@/components/ThemeSelector";
import { useAnimations } from "@/hooks/useAnimations";

const Settings = () => {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const { getCurrentLanguage } = useLanguage();
  const { toast } = useToast();
  const { animationClasses, hoverClasses } = useAnimations();
  
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    soundEffects: true,
    autoSave: true,
    twoFactor: false,
    privacyMode: false,
    hideEmail: true, // Email hidden by default
    language: 'en',
    currency: 'usd',
    theme: 'volcano',
    showEmailToPublic: false // New setting for email visibility
  });

  useEffect(() => {
    if (user) {
      // Load settings from localStorage
      const savedSettings = localStorage.getItem(`settings_${user.id}`);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
        console.log('Settings loaded:', parsed);
      }
    }
  }, [user]);

  const handleSaveSettings = () => {
    if (!user) return;
    
    try {
      localStorage.setItem(`settings_${user.id}`, JSON.stringify(settings));
      console.log('Settings saved:', settings);
      
      toast({
        title: "Settings Saved! ✅",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      emailNotifications: true,
      marketingEmails: false,
      soundEffects: true,
      autoSave: true,
      twoFactor: false,
      privacyMode: false,
      hideEmail: true,
      language: 'en',
      currency: 'usd',
      theme: 'volcano',
      showEmailToPublic: false
    };
    
    setSettings(defaultSettings);
    if (user) {
      localStorage.setItem(`settings_${user.id}`, JSON.stringify(defaultSettings));
    }
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    console.log(`Setting ${key} updated to:`, value);
  };

  if (!user) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center`}>
        <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-8 ${animationClasses.scaleIn}`}>
          <h2 className={`${currentTheme.text} text-xl font-bold mb-4`}>Access Denied</h2>
          <p className={`${currentTheme.muted}`}>Please log in to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} pt-16`}>
      <div className={`container max-w-4xl mx-auto py-8 space-y-8 ${animationClasses.fadeIn}`}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <SettingsIcon className={`h-8 w-8 ${currentTheme.accent} ${animationClasses.float}`} />
          <div>
            <h1 className={`text-3xl font-bold ${currentTheme.text} ${hoverClasses.scale} transition-transform duration-300`}>Settings</h1>
            <p className={`${currentTheme.muted}`}>Manage your account preferences and settings</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Privacy & Security */}
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} ${hoverClasses.lift} transition-all duration-300`}>
            <CardHeader>
              <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription className={currentTheme.muted}>
                Control your privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={currentTheme.text}>Show Email to Other Users</Label>
                  <p className={`text-sm ${currentTheme.muted}`}>Allow other users to see your email address</p>
                </div>
                <Switch
                  checked={settings.showEmailToPublic}
                  onCheckedChange={(checked) => updateSetting('showEmailToPublic', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={currentTheme.text}>Two-Factor Authentication</Label>
                  <p className={`text-sm ${currentTheme.muted}`}>Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={settings.twoFactor}
                  onCheckedChange={(checked) => updateSetting('twoFactor', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={currentTheme.text}>Privacy Mode</Label>
                  <p className={`text-sm ${currentTheme.muted}`}>Hide your online status and activity</p>
                </div>
                <Switch
                  checked={settings.privacyMode}
                  onCheckedChange={(checked) => updateSetting('privacyMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={currentTheme.text}>Auto-save</Label>
                  <p className={`text-sm ${currentTheme.muted}`}>Automatically save your progress and settings</p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} ${hoverClasses.lift} transition-all duration-300`}>
            <CardHeader>
              <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription className={currentTheme.muted}>
                Customize the look and feel of your interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={currentTheme.text}>Theme</Label>
                  <p className={`text-sm ${currentTheme.muted}`}>Choose your preferred color scheme</p>
                </div>
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => setShowThemeSelector(!showThemeSelector)}
                    className={`${currentTheme.secondary} ${currentTheme.text} border ${currentTheme.border} ${hoverClasses.scale} transition-all duration-300`}
                  >
                    Change Theme
                  </Button>
                  {showThemeSelector && (
                    <div className="absolute right-0 top-full mt-2 z-50">
                      <ThemeSelector onClose={() => setShowThemeSelector(false)} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={currentTheme.text}>Language</Label>
                  <p className={`text-sm ${currentTheme.muted}`}>Select your preferred language</p>
                </div>
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                    className={`${currentTheme.secondary} ${currentTheme.text} border ${currentTheme.border} flex items-center gap-2 ${hoverClasses.scale} transition-all duration-300`}
                  >
                    <Globe className="h-4 w-4" />
                    {getCurrentLanguage().flag} {getCurrentLanguage().name}
                  </Button>
                  {showLanguageSelector && (
                    <div className="absolute right-0 top-full mt-2 z-50">
                      <LanguageSelector onClose={() => setShowLanguageSelector(false)} />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className={currentTheme.text}>Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => updateSetting('currency', value)}>
                  <SelectTrigger className={`${currentTheme.cardBg} border ${currentTheme.border} ${currentTheme.text}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
                    <SelectItem value="usd" className={currentTheme.text}>USD ($)</SelectItem>
                    <SelectItem value="eur" className={currentTheme.text}>EUR (€)</SelectItem>
                    <SelectItem value="gbp" className={currentTheme.text}>GBP (£)</SelectItem>
                    <SelectItem value="btc" className={currentTheme.text}>BTC (₿)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} ${hoverClasses.lift} transition-all duration-300`}>
            <CardHeader>
              <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription className={currentTheme.muted}>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={currentTheme.text}>Email Notifications</Label>
                  <p className={`text-sm ${currentTheme.muted}`}>Receive important updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={currentTheme.text}>Marketing Emails</Label>
                  <p className={`text-sm ${currentTheme.muted}`}>Receive promotional content and updates</p>
                </div>
                <Switch
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => updateSetting('marketingEmails', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={currentTheme.text}>Sound Effects</Label>
                  <p className={`text-sm ${currentTheme.muted}`}>Play sounds for notifications and actions</p>
                </div>
                <Switch
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleResetSettings}
              className={`${currentTheme.secondary} ${currentTheme.text} border ${currentTheme.border} flex items-center gap-2 ${hoverClasses.scale} transition-all duration-300`}
            >
              <RefreshCw className="h-4 w-4" />
              Reset to Defaults
            </Button>
            
            <Button
              onClick={handleSaveSettings}
              className={`${currentTheme.primary} text-white flex items-center gap-2 ${hoverClasses.scale} transition-all duration-300 ${animationClasses.pulseGlow}`}
            >
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
