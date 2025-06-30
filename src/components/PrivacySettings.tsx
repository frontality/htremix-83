
import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Lock, Unlock, UserX, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PrivacySettings = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    hide_email: true,
    anonymous_mode: false,
    encrypted_messaging: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPrivacySettings();
  }, [user]);

  const fetchPrivacySettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('hide_email, anonymous_mode, encrypted_messaging')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching privacy settings:', error);
        return;
      }

      if (data) {
        setSettings({
          hide_email: data.hide_email ?? true,
          anonymous_mode: data.anonymous_mode ?? false,
          encrypted_messaging: data.encrypted_messaging ?? true,
        });
      }
    } catch (error) {
      console.error('Error in fetchPrivacySettings:', error);
    }
  };

  const updatePrivacySettings = async (newSettings: Partial<typeof settings>) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(newSettings)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating privacy settings:', error);
        toast({
          title: "Error",
          description: "Failed to update privacy settings. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setSettings(prev => ({ ...prev, ...newSettings }));
      toast({
        title: "Privacy settings updated! 🔒",
        description: "Your privacy preferences have been saved securely.",
      });
    } catch (error) {
      console.error('Error in updatePrivacySettings:', error);
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (setting: keyof typeof settings) => {
    const newValue = !settings[setting];
    updatePrivacySettings({ [setting]: newValue });
  };

  return (
    <Card className={`${currentTheme.cardBg} ${currentTheme.border}`}>
      <CardHeader>
        <CardTitle className={`${currentTheme.text} flex items-center gap-2`}>
          <Shield className="h-5 w-5 text-green-500" />
          Privacy & Security Settings
        </CardTitle>
        <CardDescription className={currentTheme.muted}>
          Control your privacy and security preferences for maximum anonymity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Privacy */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-opacity-50 border-gray-600">
          <div className="flex items-center space-x-3">
            {settings.hide_email ? (
              <EyeOff className="h-5 w-5 text-green-500" />
            ) : (
              <Eye className="h-5 w-5 text-yellow-500" />
            )}
            <div>
              <Label className={`${currentTheme.text} font-medium`}>
                Hide Email Address
              </Label>
              <p className={`text-sm ${currentTheme.muted}`}>
                Keep your email address private from other users
              </p>
            </div>
          </div>
          <Switch
            checked={settings.hide_email}
            onCheckedChange={() => handleToggle('hide_email')}
            disabled={loading}
          />
        </div>

        {/* Anonymous Mode */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-opacity-50 border-gray-600">
          <div className="flex items-center space-x-3">
            {settings.anonymous_mode ? (
              <UserX className="h-5 w-5 text-purple-500" />
            ) : (
              <User className="h-5 w-5 text-blue-500" />
            )}
            <div>
              <Label className={`${currentTheme.text} font-medium`}>
                Anonymous Mode
              </Label>
              <p className={`text-sm ${currentTheme.muted}`}>
                Hide your username and use anonymous identity
              </p>
            </div>
          </div>
          <Switch
            checked={settings.anonymous_mode}
            onCheckedChange={() => handleToggle('anonymous_mode')}
            disabled={loading}
          />
        </div>

        {/* Encrypted Messaging */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-opacity-50 border-gray-600">
          <div className="flex items-center space-x-3">
            {settings.encrypted_messaging ? (
              <Lock className="h-5 w-5 text-green-500" />
            ) : (
              <Unlock className="h-5 w-5 text-red-500" />
            )}
            <div>
              <Label className={`${currentTheme.text} font-medium`}>
                Encrypted Messaging
              </Label>
              <p className={`text-sm ${currentTheme.muted}`}>
                Encrypt all your messages for maximum security
              </p>
            </div>
          </div>
          <Switch
            checked={settings.encrypted_messaging}
            onCheckedChange={() => handleToggle('encrypted_messaging')}
            disabled={loading}
          />
        </div>

        {/* Privacy Status */}
        <div className={`p-4 rounded-lg ${currentTheme.secondary} border-l-4 border-green-500`}>
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span className={`font-medium ${currentTheme.text}`}>
              Privacy Status: 
              <span className="text-green-500 ml-2">
                {settings.hide_email && settings.encrypted_messaging ? 'Highly Secure' : 
                 settings.hide_email || settings.encrypted_messaging ? 'Moderate' : 'Basic'}
              </span>
            </span>
          </div>
          <p className={`text-sm ${currentTheme.muted}`}>
            {settings.anonymous_mode && settings.encrypted_messaging && settings.hide_email
              ? "🔒 Maximum privacy: You're browsing completely anonymously with encrypted communications."
              : settings.encrypted_messaging && settings.hide_email
              ? "🛡️ High privacy: Your communications are encrypted and email is hidden."
              : "⚠️ Consider enabling more privacy features for better protection."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
