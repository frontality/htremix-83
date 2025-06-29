
import { useTheme } from "@/contexts/ThemeContext";
import { Check } from "lucide-react";

interface ThemeSelectorProps {
  onClose: () => void;
}

const ThemeSelector = ({ onClose }: ThemeSelectorProps) => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  const handleThemeSelect = (themeName: string) => {
    setTheme(themeName);
    onClose();
  };

  return (
    <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4 shadow-lg min-w-48`}>
      <h3 className={`${currentTheme.text} font-semibold mb-3`}>Choose Theme</h3>
      <div className="space-y-2">
        {Object.entries(availableThemes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => handleThemeSelect(key)}
            className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
              currentTheme.name === theme.name 
                ? `${currentTheme.secondary} ${currentTheme.accent}` 
                : `hover:${currentTheme.secondary} ${currentTheme.text}`
            }`}
          >
            <span>{theme.name}</span>
            {currentTheme.name === theme.name && <Check className="h-4 w-4" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
