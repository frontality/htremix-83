
import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/contexts/ThemeContext";

interface LanguageSelectorProps {
  onClose: () => void;
}

const LanguageSelector = ({ onClose }: LanguageSelectorProps) => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const { currentTheme } = useTheme();

  const handleLanguageSelect = (languageCode: string) => {
    console.log('Language selected:', languageCode);
    changeLanguage(languageCode);
    
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4 shadow-xl min-w-60 backdrop-blur-sm`}>
      <h3 className={`${currentTheme.text} font-semibold mb-4 flex items-center gap-2`}>
        <Globe className="h-5 w-5" />
        Language
      </h3>
      <div className="space-y-2">
        {availableLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageSelect(language.code)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              currentLanguage === language.code 
                ? `${currentTheme.primary} text-white shadow-lg` 
                : `hover:${currentTheme.secondary} ${currentTheme.text} hover:scale-102`
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
            </div>
            {currentLanguage === language.code && <Check className="h-5 w-5" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
