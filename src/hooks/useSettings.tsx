
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Settings {
  language: string;
  currency: string;
  notifications: boolean;
  soundEffects: boolean;
  autoSave: boolean;
  twoFactor: boolean;
  privacyMode: boolean;
  darkMode: boolean;
  displayName: string;
  status: string;
  dataEncryption: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
  developerMode: boolean;
  betaFeatures: boolean;
  showEmailToPublic: boolean;
  hideEmail: boolean;
}

const defaultSettings: Settings = {
  language: 'en',
  currency: 'usd',
  notifications: true,
  soundEffects: true,
  autoSave: true,
  twoFactor: false,
  privacyMode: false,
  darkMode: true,
  displayName: '',
  status: 'online',
  dataEncryption: false,
  emailNotifications: true,
  marketingEmails: false,
  developerMode: false,
  betaFeatures: false,
  showEmailToPublic: false, // Email hidden by default
  hideEmail: true, // Always hide emails
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      console.log('Loading settings from localStorage...');
      const savedSettings = localStorage.getItem('kid-haven-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        // Always ensure emails are hidden
        parsedSettings.hideEmail = true;
        parsedSettings.showEmailToPublic = false;
        setSettings({ ...defaultSettings, ...parsedSettings });
        console.log('Settings loaded:', parsedSettings);
      } else {
        console.log('No saved settings found, using defaults');
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings(defaultSettings);
      toast({
        title: "Settings Error",
        description: "Failed to load settings. Using defaults.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Settings): Promise<boolean> => {
    try {
      console.log('Updating settings:', newSettings);
      // Always ensure emails remain hidden
      newSettings.hideEmail = true;
      newSettings.showEmailToPublic = false;
      
      localStorage.setItem('kid-haven-settings', JSON.stringify(newSettings));
      setSettings(newSettings);
      
      // Apply theme changes if dark mode setting changed
      if (newSettings.darkMode !== settings.darkMode) {
        document.documentElement.classList.toggle('dark', newSettings.darkMode);
      }
      
      console.log('Settings updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Save Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('kid-haven-settings');
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  // Always return false for email visibility to ensure emails are never shown
  const shouldShowEmail = () => {
    return false;
  };

  const updateSingleSetting = async (key: keyof Settings, value: any): Promise<boolean> => {
    const newSettings = { ...settings, [key]: value };
    // Prevent enabling email visibility
    if (key === 'showEmailToPublic' || key === 'hideEmail') {
      newSettings.showEmailToPublic = false;
      newSettings.hideEmail = true;
    }
    return await updateSettings(newSettings);
  };

  return {
    settings,
    loading,
    updateSettings,
    updateSingleSetting,
    resetSettings,
    shouldShowEmail,
  };
};
