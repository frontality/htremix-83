
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { useSettings } from "@/hooks/useSettings";
import ThemeSelector from "@/components/ThemeSelector";
import { useState } from "react";

const LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  ja: { name: '日本語', flag: '🇯🇵' },
  zh: { name: '中文', flag: '🇨🇳' }
};

const CURRENCIES = {
  usd: { name: 'USD ($)', symbol: '$' },
  eur: { name: 'EUR (€)', symbol: '€' },
  gbp: { name: 'GBP (£)', symbol: '£' },
  btc: { name: 'BTC (₿)', symbol: '₿' },
  eth: { name: 'ETH (Ξ)', symbol: 'Ξ' }
};

const Settings = () => {
  const { currentTheme } = useTheme();
  const { settings, loading, updateSettings } = useSettings();
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const handleSave = () => {
    updateSettings(settings);
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

  if (loading) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <SettingsIcon className="h-12 w-12 text-indigo-400 mx-auto mb-4 animate-pulse" />
          <p className={`${currentTheme.text} text-lg`}>Loading settings...</p>
        </div>
      </div>
    );
  }

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
                      updateSettings({ notifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={currentTheme.text}>Sound Effects</span>
                  <Switch
                    checked={settings.soundEffects}
                    onCheckedChange={(checked) =>
                      updateSettings({ soundEffects: checked })
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
                      updateSettings({ twoFactor: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={currentTheme.text}>Auto-Save</span>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) =>
                      updateSettings({ autoSave: checked })
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
                  <select 
                    value={settings.language}
                    onChange={(e) => updateSettings({ language: e.target.value })}
                    className={`w-full p-2 rounded-lg ${currentTheme.secondary} ${currentTheme.text} border-0`}
                  >
                    {Object.entries(LANGUAGES).map(([code, lang]) => (
                      <option key={code} value={code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${currentTheme.text}`}>Currency</label>
                  <select 
                    value={settings.currency}
                    onChange={(e) => updateSettings({ currency: e.target.value })}
                    className={`w-full p-2 rounded-lg ${currentTheme.secondary} ${currentTheme.text} border-0`}
                  >
                    {Object.entries(CURRENCIES).map(([code, currency]) => (
                      <option key={code} value={code}>
                        {currency.name}
                      </option>
                    ))}
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
