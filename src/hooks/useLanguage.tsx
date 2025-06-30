
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LanguageConfig {
  code: string;
  name: string;
  flag: string;
}

export const languages: LanguageConfig[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

// Simple translation function - returns the key as-is for now
const translate = (key: string): string => {
  return key;
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const { toast } = useToast();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('kid-haven-language');
    if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('kid-haven-language', languageCode);
      
      toast({
        title: "Language Changed! 🌍",
        description: `Switched to ${language.name}`,
      });
      
      console.log('Language changed to:', language.name);
      return true;
    }
    return false;
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  return {
    currentLanguage,
    changeLanguage,
    getCurrentLanguage,
    availableLanguages: languages,
    t: translate
  };
};
