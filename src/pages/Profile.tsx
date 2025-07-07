
import { useState, useEffect } from "react";
import { Camera, Edit, Mail, MessageCircle, User, Wallet, Heart, Sparkles, Settings, Users, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import ImageUpload from "@/components/ImageUpload";
import FriendsList from "@/components/FriendsList";
import { useTheme } from "@/contexts/ThemeContext";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/hooks/useLanguage";

// XSS Protection - Sanitize user input
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

const Profile = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatar_url: '',
    wallet_address: '',
    email_notifications: true,
    two_factor_enabled: false
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        wallet_address: profile.wallet_address || '',
        email_notifications: profile.email_notifications,
        two_factor_enabled: profile.two_factor_enabled
      });
    }
  }, [profile]);

  const handleSave = async () => {
    // Sanitize inputs before saving
    const sanitizedData = {
      ...formData,
      username: sanitizeInput(formData.username),
      bio: sanitizeInput(formData.bio),
      wallet_address: sanitizeInput(formData.wallet_address)
    };
    
    const success = await updateProfile(sanitizedData);
    if (success) {
      setFormData(sanitizedData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        wallet_address: profile.wallet_address || '',
        email_notifications: profile.email_notifications,
        two_factor_enabled: profile.two_factor_enabled
      });
    }
    setIsEditing(false);
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, avatar_url: imageUrl }));
    updateProfile({ avatar_url: imageUrl });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: sanitizeInput(value) }));
  };

  const getJoinDate = () => {
    if (!user?.created_at) return "Recently";
    return new Date(user.created_at).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDisplayName = () => {
    return formData.username || 'Set username';
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <Sparkles className={`h-12 w-12 ${currentTheme.accent} mx-auto mb-4 animate-pulse`} />
          <p className={`${currentTheme.text} text-lg`}>{t('Loading profile...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      
      <div className="container py-8 pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold ${currentTheme.text} mb-2 flex items-center justify-center gap-2`}>
              <User className="h-8 w-8" />
              {t('Profile Hub')}
            </h1>
          </div>

          <div className={`${currentTheme.cardBg} rounded-xl p-6 border ${currentTheme.border} shadow-lg`}>
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
              <ImageUpload
                currentImage={formData.avatar_url}
                onImageUpload={handleImageUpload}
              />
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h1 className={`text-2xl font-bold ${currentTheme.text} flex items-center gap-2`}>
                    @{getDisplayName()}
                  </h1>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0 hover:scale-105 transition-transform flex items-center gap-1`}
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    {isEditing ? t('Cancel') : t('Edit')}
                  </Button>
                </div>
                <p className={`${currentTheme.text} mb-2`}>
                  {formData.bio || t('Add your bio')}
                </p>
                <p className={`${currentTheme.muted} text-sm flex items-center gap-1`}>
                  <Sparkles className="h-3 w-3" />
                  {t('Member since')} {getJoinDate()}
                </p>
              </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className={`${currentTheme.secondary} ${currentTheme.text} rounded-lg`}>
                <TabsTrigger value="profile" className="rounded-md flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t('Profile')}
                </TabsTrigger>
                <TabsTrigger value="wallet" className="rounded-md flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  {t('Wallet')}
                </TabsTrigger>
                <TabsTrigger value="friends" className="rounded-md flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t('Friends')}
                </TabsTrigger>
                <TabsTrigger value="settings" className="rounded-md flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  {t('Settings')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      {t('Username')}
                    </label>
                    <Input
                      value={formData.username}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={`${currentTheme.secondary} ${currentTheme.text} border-0 ${isEditing ? 'ring-2 ring-purple-500' : ''}`}
                      placeholder={t('Your username')}
                      maxLength={50}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      {t('Bio')}
                    </label>
                    <Textarea
                      value={formData.bio}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className={`${currentTheme.secondary} ${currentTheme.text} border-0 min-h-20 ${isEditing ? 'ring-2 ring-purple-500' : ''}`}
                      placeholder={t('Tell us about yourself')}
                      maxLength={200}
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleSave} 
                      className={`${currentTheme.primary} text-white hover:scale-105 transition-transform flex items-center gap-2`}
                    >
                      <Save className="h-4 w-4" />
                      {t('Save')}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleCancel}
                      className={`${currentTheme.secondary} ${currentTheme.text} border-0 flex items-center gap-2`}
                    >
                      <X className="h-4 w-4" />
                      {t('Cancel')}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="wallet" className="space-y-6">
                <div className={`${currentTheme.secondary} p-6 rounded-lg border-2 border-dashed border-purple-300`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <Wallet className={`h-5 w-5 ${currentTheme.accent}`} />
                    <h3 className={`text-lg font-semibold ${currentTheme.text}`}>
                      {t('Crypto Wallet')}
                    </h3>
                  </div>
                  <Input
                    value={formData.wallet_address}
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('wallet_address', e.target.value)}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0 font-mono text-sm ${isEditing ? 'ring-2 ring-purple-500' : ''}`}
                    placeholder={t('0x... your wallet address')}
                    maxLength={100}
                  />
                </div>
              </TabsContent>

              <TabsContent value="friends" className="space-y-6">
                <FriendsList />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="space-y-6">
                  <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4 flex items-center gap-2`}>
                    <Settings className="h-5 w-5" />
                    {t('Account Settings')}
                  </h3>
                  
                  {/* Email Display */}
                  <div className={`p-4 rounded-lg ${currentTheme.secondary} border border-purple-200`}>
                    <h4 className={`font-medium ${currentTheme.text} flex items-center gap-2 mb-2`}>
                      <Mail className="h-4 w-4" />
                      {t('Account Email')}
                    </h4>
                    <Input
                      value={user?.email || t('Loading...')}
                      disabled
                      className={`${currentTheme.secondary} ${currentTheme.text} border-0 opacity-75`}
                    />
                    <p className={`text-xs ${currentTheme.muted} mt-1`}>
                      {t('Private - never shown to other users')}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className={`flex items-center justify-between p-4 rounded-lg ${currentTheme.secondary} border border-purple-200`}>
                      <div>
                        <h4 className={`font-medium ${currentTheme.text}`}>{t('Email Notifications')}</h4>
                        <p className={`text-sm ${currentTheme.muted}`}>{t('Updates about transactions and messages')}</p>
                      </div>
                      <Switch
                        checked={formData.email_notifications}
                        onCheckedChange={(checked) => {
                          setFormData({...formData, email_notifications: checked});
                          if (!isEditing) {
                            updateProfile({ email_notifications: checked });
                          }
                        }}
                      />
                    </div>
                    
                    <div className={`flex items-center justify-between p-4 rounded-lg ${currentTheme.secondary} border border-purple-200`}>
                      <div>
                        <h4 className={`font-medium ${currentTheme.text}`}>{t('Two-Factor Authentication')}</h4>
                        <p className={`text-sm ${currentTheme.muted}`}>{t('Extra security for your account')}</p>
                      </div>
                      <Switch
                        checked={formData.two_factor_enabled}
                        onCheckedChange={(checked) => {
                          setFormData({...formData, two_factor_enabled: checked});
                          if (!isEditing) {
                            updateProfile({ two_factor_enabled: checked });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <SkidHavenFooter />
    </div>
  );
};

export default Profile;
