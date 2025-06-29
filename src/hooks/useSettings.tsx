
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Settings {
  notifications: boolean;
  twoFactor: boolean;
  autoSave: boolean;
  soundEffects: boolean;
  language: string;
  currency: string;
  theme: string;
  privacyMode: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  notifications: true,
  twoFactor: false,
  autoSave: true,
  soundEffects: true,
  language: 'en',
  currency: 'usd',
  theme: 'dark',
  privacyMode: false
};

export const useSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      console.log('Loading settings from localStorage...');
      const saved = localStorage.getItem('skidhaven-settings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        console.log('Settings loaded:', parsedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      console.log('Updating settings with:', newSettings);
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem('skidhaven-settings', JSON.stringify(updatedSettings));
      
      console.log('Settings saved successfully:', updatedSettings);
      toast({
        title: "Settings Saved! ⚙️",
        description: "Your preferences have been updated successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { settings, loading, updateSettings };
};
