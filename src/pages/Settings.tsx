
import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, Bell, Shield, Globe, Palette, Volume2, Download, Trash2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import { useTheme } from "@/contexts/ThemeContext";
import { useSettings } from "@/hooks/useSettings";

const Settings = () => {
  const { currentTheme } = useTheme();
  const { settings, loading, updateSettings } = useSettings();
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
  };

  const handleSave = async () => {
    console.log('Saving settings:', localSettings);
    const success = await updateSettings(localSettings);
    if (success) {
      setHasChanges(false);
    }
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
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
              Customize your $SKID HAVEN experience
            </p>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className={`${currentTheme.secondary} ${currentTheme.text} grid w-full grid-cols-4`}>
              <TabsTrigger value="general">General</TabsTrigger>
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
                      <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                        Language
                      </label>
                      <Select 
                        value={localSettings.language} 
                        onValueChange={(value) => handleSettingChange('language', value)}
                      >
                        <SelectTrigger className={`${currentTheme.secondary} ${currentTheme.text} border-0`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                          <SelectItem value="ru">Русский</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                        Currency
                      </label>
                      <Select 
                        value={localSettings.currency} 
                        onValueChange={(value) => handleSettingChange('currency', value)}
                      >
                        <SelectTrigger className={`${currentTheme.secondary} ${currentTheme.text} border-0`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="btc">BTC (₿)</SelectItem>
                          <SelectItem value="eth">ETH (Ξ)</SelectItem>
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
                    Audio & Visual
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
                    <Button variant="outline" className={`${currentTheme.secondary} ${currentTheme.text} border-0`}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save/Reset Buttons */}
          {hasChanges && (
            <div className={`fixed bottom-6 right-6 flex space-x-3 p-4 ${currentTheme.cardBg} rounded-lg shadow-lg border ${currentTheme.border}`}>
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
