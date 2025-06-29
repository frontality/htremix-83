
import { useState } from "react";
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    twoFactor: false,
    language: "en",
    autoSave: true,
    soundEffects: true,
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const SettingCard = ({ icon: Icon, title, children }: any) => (
    <div className="modern-card">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <SettingsIcon className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingCard icon={Bell} title="Notifications">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Push Notifications</span>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, notifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Sound Effects</span>
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
                <span>Two-Factor Authentication</span>
                <Switch
                  checked={settings.twoFactor}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, twoFactor: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Auto-Save</span>
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
                <span>Dark Mode</span>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, darkMode: checked })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Theme Color</label>
                <div className="flex space-x-2">
                  {['indigo', 'purple', 'pink', 'blue'].map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full bg-${color}-500 hover:scale-110 transition-transform`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </SettingCard>

          <SettingCard icon={Globe} title="Language & Region">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select className="modern-input w-full">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select className="modern-input w-full">
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
          <Button onClick={handleSave} className="modern-button flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
