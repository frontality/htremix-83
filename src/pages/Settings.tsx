
import React from "react";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import PrivacySettings from "@/components/PrivacySettings";
import { useTheme } from "@/contexts/ThemeContext";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const { currentTheme } = useTheme();

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${currentTheme.text} mb-2 flex items-center justify-center gap-3`}>
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
          <p className={`${currentTheme.muted}`}>
            Manage your privacy, security, and account preferences
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <PrivacySettings />
        </div>
      </div>
      <SkidHavenFooter />
    </div>
  );
};

export default Settings;
