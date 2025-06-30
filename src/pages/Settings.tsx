
import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, Bell, Shield, Globe, Palette, Volume2, Download, Trash2, User, Zap, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import { useTheme } from "@/contexts/ThemeContext";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { currentTheme } = useTheme();
  const { settings, loading, updateSettings } = useSettings();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (key: string, value: any) => {
    console.log(`Changing ${key} to:`, value);
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    setHasChanges(true);
    
    // Apply language change immediately for better UX
    if (key === 'language') {
      toast({
        title: "Language Updated! 🌍",
        description: `Language changed to ${getLanguageName(value)}`,
      });
    }
  };

  const getLanguageName = (code: string) => {
    const languages = {
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'zh': '中文',
      'ja': '日本語',
      'ru': 'Русский',
      'pt': 'Português',
      'it': 'Italiano',
      'ko': '한국어'
    };
    return languages[code as keyof typeof languages] || code;
  };

  const handleSave = async () => {
    console.log('Saving settings:', localSettings);
    const success = await updateSettings(localSettings);
    if (success) {
      setHasChanges(false);
      toast({
        title: "Settings Saved! ✅",
        description: "Your preferences have been updated successfully.",
      });
    }
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
    toast({
      title: "Settings Reset",
      description: "All changes have been discarded.",
      variant: "destructive",
    });
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(localSettings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'kid-haven-settings.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data Exported! 📥",
      description: "Your settings have been downloaded.",
    });
  };

  const handleClearCache = () => {
    localStorage.clear();
    toast({
      title: "Cache Cleared! 🧹",
      description: "All cached data has been removed.",
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <SettingsIcon className={`h-12 w-12 ${currentTheme.accent} mx-auto mb-4 animate-pulse`} />
          <p className={`${currentTheme.text} text-lg`}>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className={`text-4xl font-bold ${currentTheme.text} mb-2 flex items-center gap-3`}>
              <SettingsIcon className="h-10 w-10" />
              Settings Hub
            </h1>
            <p className={`${currentTheme.muted} text-lg`}>
              Customize your $KID HAVEN experience
            </p>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className={`${currentTheme.secondary} ${currentTheme.text} grid w-full grid-cols-5`}>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
                <CardHeader>
                  <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                    <Globe className="h-5 w-5" />
                    Language & Region
                  </CardTitle>
                  <CardDescription className={currentTheme.muted}>
                    Set your preferred language and currency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className={`text-sm font-medium ${currentTheme.text} mb-2`}>
                        Language
                      </Label>
                      <Select 
                        value={localSettings.language} 
                        onValueChange={(value) => handleSettingChange('language', value)}
                      >
                        <SelectTrigger className={`${currentTheme.secondary} ${currentTheme.text} border-0`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                          <SelectItem value="es">🇪🇸 Español</SelectItem>
                          <SelectItem value="fr">🇫🇷 Français</SelectItem>
                          <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                          <SelectItem value="zh">🇨🇳 中文</SelectItem>
                          <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                          <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                          <SelectItem value="pt">🇵🇹 Português</SelectItem>
                          <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                          <SelectItem value="ko">🇰🇷 한국어</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className={`text-sm font-medium ${currentTheme.text} mb-2`}>
                        Currency
                      </Label>
                      <Select 
                        value={localSettings.currency} 
                        onValueChange={(value) => handleSettingChange('currency', value)}
                      >
                        <SelectTrigger className={`${currentTheme.secondary} ${currentTheme.text} border-0`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
                          <SelectItem value="usd">💵 USD ($)</SelectItem>
                          <SelectItem value="eur">💶 EUR (€)</SelectItem>
                          <SelectItem value="btc">₿ BTC</SelectItem>
                          <SelectItem value="eth">Ξ ETH</SelectItem>
                          <SelectItem value="gbp">💷 GBP (£)</SelectItem>
                          <SelectItem value="jpy">💴 JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
                <CardHeader>
                  <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                    <Volume2 className="h-5 w-5" />
                    Experience Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${currentTheme.text}`}>Sound Effects</h4>
                      <p className={`text-sm ${currentTheme.muted}`}>Play sounds for notifications and interactions</p>
                    </div>
                    <Switch
                      checked={localSettings.soundEffects}
                      onCheckedChange={(checked) => handleSettingChange('soundEffects', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${currentTheme.text}`}>Auto-save</h4>
                      <p className={`text-sm ${currentTheme.muted}`}>Automatically save your work</p>
                    </div>
                    <Switch
                      checked={localSettings.autoSave}
                      onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${currentTheme.text}`}>Dark Mode</h4>
                      <p className={`text-sm ${currentTheme.muted}`}>Use dark theme everywhere</p>
                    </div>
                    <Switch
                      checked={localSettings.darkMode}
                      onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
                <CardHeader>
                  <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                    <User className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className={`text-sm font-medium ${currentTheme.text} mb-2`}>
                        Display Name
                      </Label>
                      <Input 
                        value={localSettings.displayName || ''} 
                        onChange={(e) => handleSettingChange('displayName', e.target.value)}
                        className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                        placeholder="Enter your display name"
                      />
                    </div>
                    <div>
                      <Label className={`text-sm font-medium ${currentTheme.text} mb-2`}>
                        Status
                      </Label>
                      <Select 
                        value={localSettings.status || 'online'} 
                        onValueChange={(value) => handleSettingChange('status', value)}
                      >
                        <SelectTrigger className={`${currentTheme.secondary} ${currentTheme.text} border-0`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
                          <SelectItem value="online">🟢 Online</SelectItem>
                          <SelectItem value="away">🟡 Away</SelectItem>
                          <SelectItem value="busy">🔴 Busy</SelectItem>
                          <SelectItem value="invisible">⚫ Invisible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
                <CardHeader>
                  <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                    <Shield className="h-5 w-5" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${currentTheme.text}`}>Two-Factor Authentication</h4>
                      <p className={`text-sm ${currentTheme.muted}`}>Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={localSettings.twoFactor}
                      onCheckedChange={(checked) => handleSettingChange('twoFactor', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${currentTheme.text}`}>Privacy Mode</h4>
                      <p className={`text-sm ${currentTheme.muted}`}>Hide your online status and activity</p>
                    </div>
                    <Switch
                      checked={localSettings.privacyMode}
                      onCheckedChange={(checked) => handleSettingChange('privacyMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${currentTheme.text}`}>Data Encryption</h4>
                      <p className={`text-sm ${currentTheme.muted}`}>Encrypt your personal data</p>
                    </div>
                    <Switch
                      checked={localSettings.dataEncryption}
                      onCheckedChange={(checked) => handleSettingChange('dataEncryption', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
                <CardHeader>
                  <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${currentTheme.text}`}>Push Notifications</h4>
                      <p className={`text-sm ${currentTheme.muted}`}>Receive notifications about messages and transactions</p>
                    </div>
                    <Switch
                      checked={localSettings.notifications}
                      onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${currentTheme.text}`}>Email Notifications</h4>
                      <p className={`text-sm ${currentTheme.muted}`}>Get updates via email</p>
                    </div>
                    <Switch
                      checked={localSettings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${currentTheme.text}`}>Marketing Emails</h4>
                      <p className={`text-sm ${currentTheme.muted}`}>Receive promotional content</p>
                    </div>
                    <Switch
                      checked={localSettings.marketingEmails}
                      onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
                <CardHeader>
                  <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
                    <SettingsIcon className="h-5 w-5" />
                    Advanced Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Button 
                      onClick={handleExportData}
                      variant="outline" 
                      className={`${currentTheme.secondary} ${currentTheme.text} border-0 hover:${currentTheme.primary}`}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button 
                      onClick={handleClearCache}
                      variant="destructive" 
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${currentTheme.text}`}>Developer Mode</h4>
                      <p className={`text-sm ${currentTheme.muted}`}>Enable advanced debugging features</p>
                    </div>
                    <Switch
                      checked={localSettings.developerMode}
                      onCheckedChange={(checked) => handleSettingChange('developerMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${currentTheme.text}`}>Beta Features</h4>
                      <p className={`text-sm ${currentTheme.muted}`}>Access experimental features</p>
                    </div>
                    <Switch
                      checked={localSettings.betaFeatures}
                      onCheckedChange={(checked) => handleSettingChange('betaFeatures', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save/Reset Buttons */}
          {hasChanges && (
            <div className={`fixed bottom-6 right-6 flex space-x-3 p-4 ${currentTheme.cardBg} rounded-lg shadow-lg border ${currentTheme.border} z-40`}>
              <Button 
                onClick={handleReset}
                variant="outline"
                className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
              >
                Reset
              </Button>
              <Button 
                onClick={handleSave}
                className={`${currentTheme.primary} text-white`}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <SkidHavenFooter />
    </div>
  );
};

export default Settings;
