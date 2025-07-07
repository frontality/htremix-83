
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
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageSelect = async (languageCode: string) => {
    console.log('Language selected:', languageCode);
    setIsChanging(true);
    
    try {
      changeLanguage(languageCode);
      
      setTimeout(() => {
        setIsChanging(false);
        onClose();
      }, 300);
    } catch (error) {
      console.error('Error changing language:', error);
      setIsChanging(false);
    }
  };

  return (
    <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg shadow-xl min-w-48 max-w-56 backdrop-blur-sm bg-opacity-95 z-50`}>
      <div className="p-3 border-b border-gray-700/50">
        <h3 className={`${currentTheme.text} font-semibold text-sm flex items-center gap-2`}>
          <Globe className="h-4 w-4" />
          Language
        </h3>
      </div>
      <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
        {availableLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageSelect(language.code)}
            disabled={isChanging}
            className={`w-full flex items-center justify-between p-2 rounded-md transition-all duration-200 text-sm ${
              currentLanguage === language.code 
                ? `${currentTheme.primary} text-white shadow-md` 
                : `hover:${currentTheme.secondary} ${currentTheme.text} hover:scale-102`
            } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
            </div>
            {currentLanguage === language.code && <Check className="h-4 w-4" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
