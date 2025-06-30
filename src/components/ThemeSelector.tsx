
import { useTheme } from "@/contexts/ThemeContext";
import { Check, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ThemeSelectorProps {
  onClose: () => void;
}

const ThemeSelector = ({ onClose }: ThemeSelectorProps) => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const { toast } = useToast();

  const handleThemeSelect = (themeName: string) => {
    console.log('Theme selected:', themeName);
    setTheme(themeName);
    
    toast({
      title: "Theme Changed! 🎨",
      description: `Switched to ${availableThemes[themeName].name} theme`,
    });
    
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const getThemeColor = (key: string) => {
    switch (key) {
      case 'volcano': return 'bg-gradient-to-r from-red-500 to-orange-500';
      case 'ocean': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'forest': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'galaxy': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'dark': return 'bg-gradient-to-r from-gray-500 to-gray-700';
      default: return 'bg-gray-500';
    }
  };

  const getThemeEmoji = (key: string) => {
    switch (key) {
      case 'volcano': return '🌋';
      case 'ocean': return '🌊';
      case 'forest': return '🌲';
      case 'galaxy': return '🌌';
      case 'dark': return '🌑';
      default: return '🎨';
    }
  };

  return (
    <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4 shadow-xl min-w-64 backdrop-blur-sm`}>
      <h3 className={`${currentTheme.text} font-semibold mb-4 flex items-center gap-2`}>
        <Palette className="h-5 w-5" />
        Choose Theme
      </h3>
      <div className="space-y-2">
        {Object.entries(availableThemes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => handleThemeSelect(key)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              currentTheme.name === theme.name 
                ? `${currentTheme.primary} text-white shadow-lg` 
                : `hover:${currentTheme.secondary} ${currentTheme.text} hover:scale-102`
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full ${getThemeColor(key)} shadow-sm`} />
              <span className="font-medium flex items-center gap-2">
                {getThemeEmoji(key)} {theme.name}
              </span>
            </div>
            {currentTheme.name === theme.name && <Check className="h-5 w-5" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
