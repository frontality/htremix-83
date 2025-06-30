
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

  return (
    <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4 shadow-xl min-w-56 backdrop-blur-sm`}>
      <h3 className={`${currentTheme.text} font-semibold mb-3 flex items-center gap-2`}>
        <Palette className="h-4 w-4" />
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
                : `hover:${currentTheme.secondary} ${currentTheme.text} hover:scale-105`
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                key === 'volcano' ? 'bg-red-500' :
                key === 'ocean' ? 'bg-blue-500' :
                key === 'forest' ? 'bg-green-500' :
                key === 'galaxy' ? 'bg-purple-500' :
                'bg-gray-500'
              }`} />
              <span className="font-medium">{theme.name}</span>
            </div>
            {currentTheme.name === theme.name && <Check className="h-4 w-4" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
