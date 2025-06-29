
import { useState } from "react";
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import ThemeSelector from "@/components/ThemeSelector";

const Settings = () => {
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: true,
    twoFactor: false,
    autoSave: true,
    soundEffects: true,
  });
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const SettingCard = ({ icon: Icon, title, children }: any) => (
    <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-xl p-6 shadow-lg`}>
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="h-5 w-5 text-indigo-400" />
        <h3 className={`text-lg font-semibold ${currentTheme.text}`}>{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <SettingsIcon className="h-8 w-8 text-indigo-400" />
            <h1 className={`text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent`}>Settings</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingCard icon={Bell} title="Notifications">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={currentTheme.text}>Push Notifications</span>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, notifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={currentTheme.text}>Sound Effects</span>
                  <Switch
                    checked={settings.soundEffects}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, soundEffects: checked })
                    }
                  />
                </div>
              </div>
            </SettingCard>

            <SettingCard icon={Shield} title="Security">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={currentTheme.text}>Two-Factor Authentication</span>
                  <Switch
                    checked={settings.twoFactor}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, twoFactor: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={currentTheme.text}>Auto-Save</span>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, autoSave: checked })
                    }
                  />
                </div>
              </div>
            </SettingCard>

            <SettingCard icon={Palette} title="Appearance">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={currentTheme.text}>Current Theme</span>
                  <Button
                    onClick={() => setShowThemeSelector(!showThemeSelector)}
                    className={`${currentTheme.primary} text-white`}
                    size="sm"
                  >
                    Change Theme
                  </Button>
                </div>
                {showThemeSelector && (
                  <div className="mt-4">
                    <ThemeSelector onClose={() => setShowThemeSelector(false)} />
                  </div>
                )}
              </div>
            </SettingCard>

            <SettingCard icon={Globe} title="Language & Region">
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${currentTheme.text}`}>Language</label>
                  <select className={`w-full p-2 rounded-lg ${currentTheme.secondary} ${currentTheme.text} border-0`}>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${currentTheme.text}`}>Currency</label>
                  <select className={`w-full p-2 rounded-lg ${currentTheme.secondary} ${currentTheme.text} border-0`}>
                    <option value="usd">USD ($)</option>
                    <option value="eur">EUR (€)</option>
                    <option value="gbp">GBP (£)</option>
                    <option value="btc">BTC (₿)</option>
                  </select>
                </div>
              </div>
            </SettingCard>
          </div>

          <div className="flex justify-end mt-8">
            <Button onClick={handleSave} className={`${currentTheme.primary} text-white flex items-center space-x-2`}>
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
