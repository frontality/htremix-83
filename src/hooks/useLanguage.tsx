
import { useState, useEffect } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const availableLanguages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
];

// Simplified translation function that loads translations dynamically
const getTranslations = async (languageCode: string) => {
  try {
    // Dynamic import to avoid bundle size issues
    const translations = await import(`@/translations/${languageCode}.ts`);
    return translations.default || translations[languageCode];
  } catch (error) {
    console.warn(`Failed to load translations for ${languageCode}, falling back to English`);
    const fallback = await import('@/translations/en.ts');
    return fallback.en;
  }
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    return localStorage.getItem('language') || 'en';
  });
  const [translations, setTranslations] = useState<any>({});

  useEffect(() => {
    // Load translations for current language
    const loadTranslations = async () => {
      try {
        const currentTranslations = await getTranslations(currentLanguage);
        setTranslations(currentTranslations);
      } catch (error) {
        console.error('Error loading translations:', error);
      }
    };
    
    loadTranslations();
  }, [currentLanguage]);

  const changeLanguage = (languageCode: string) => {
    console.log('Changing language to:', languageCode);
    setCurrentLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: languageCode } 
    }));
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return {
    currentLanguage,
    changeLanguage,
    availableLanguages,
    t
  };
};
