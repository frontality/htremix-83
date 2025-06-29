
import { useState } from "react";
import { Camera, Edit, Mail, MessageCircle, User, Wallet, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import { useTheme } from "@/contexts/ThemeContext";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    wallet_address: '',
    email_notifications: true,
    two_factor_enabled: false
  });

  // Update form data when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        wallet_address: profile.wallet_address || '',
        email_notifications: profile.email_notifications,
        two_factor_enabled: profile.two_factor_enabled
      });
    }
  });

  const handleSave = async () => {
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        wallet_address: profile.wallet_address || '',
        email_notifications: profile.email_notifications,
        two_factor_enabled: profile.two_factor_enabled
      });
    }
    setIsEditing(false);
  };

  const getJoinDate = () => {
    if (!user?.created_at) return "Recently";
    return new Date(user.created_at).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <Sparkles className={`h-12 w-12 ${currentTheme.accent} mx-auto mb-4 animate-pulse`} />
          <p className={`${currentTheme.text} text-lg`}>Loading your awesome profile... ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Playful header */}
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold ${currentTheme.text} mb-2`}>
              Your Profile Hub 🎨
            </h1>
            <p className={`${currentTheme.muted} text-lg`}>
              Make it uniquely you! ✨
            </p>
          </div>

          <div className={`${currentTheme.cardBg} rounded-xl p-8 border ${currentTheme.border} shadow-lg`}>
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
              <div className="relative group">
                <img
                  src={profile?.avatar_url || "/placeholder.svg"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-500 shadow-lg transition-transform group-hover:scale-105"
                />
                <button className={`absolute bottom-0 right-0 p-2 rounded-full ${currentTheme.primary} text-white shadow-lg hover:scale-110 transition-transform`}>
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className={`text-2xl font-bold ${currentTheme.text}`}>
                    {profile?.username || user?.email || "Awesome User"} 
                    <Heart className="inline-block h-5 w-5 ml-2 text-red-500" />
                  </h1>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0 hover:scale-105 transition-transform`}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {isEditing ? "Cancel 😅" : "Edit ✏️"}
                  </Button>
                </div>
                <p className={`${currentTheme.muted} mb-2`}>{user?.email}</p>
                <p className={`${currentTheme.text} text-sm`}>
                  {profile?.bio || "Tell everyone about your awesome self! 🌟"}
                </p>
                <p className={`${currentTheme.muted} text-xs mt-2`}>
                  Member since {getJoinDate()} 🎉
                </p>
              </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className={`${currentTheme.secondary} ${currentTheme.text} rounded-lg`}>
                <TabsTrigger value="profile" className="rounded-md">Profile 👤</TabsTrigger>
                <TabsTrigger value="wallet" className="rounded-md">Wallet 💰</TabsTrigger>
                <TabsTrigger value="friends" className="rounded-md">Friends 👥</TabsTrigger>
                <TabsTrigger value="settings" className="rounded-md">Settings ⚙️</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                        Username ✨
                      </label>
                      <Input
                        value={formData.username}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className={`${currentTheme.secondary} ${currentTheme.text} border-0 ${isEditing ? 'ring-2 ring-purple-500' : ''}`}
                        placeholder="Your awesome username"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Bio 📝
                    </label>
                    <Textarea
                      value={formData.bio}
                      disabled={!isEditing}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className={`${currentTheme.secondary} ${currentTheme.text} border-0 min-h-24 ${isEditing ? 'ring-2 ring-purple-500' : ''}`}
                      placeholder="Tell everyone what makes you awesome! 🌟"
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleSave} 
                      className={`${currentTheme.primary} text-white hover:scale-105 transition-transform`}
                    >
                      Save Changes 🎉
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleCancel}
                      className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                    >
                      Cancel 😅
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="wallet" className="space-y-6">
                <div className={`${currentTheme.secondary} p-6 rounded-lg border-2 border-dashed border-purple-300`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <Wallet className={`h-6 w-6 ${currentTheme.accent}`} />
                    <h3 className={`text-lg font-semibold ${currentTheme.text}`}>
                      Crypto Wallet 💎
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <label className={`block text-sm font-medium ${currentTheme.text}`}>
                      Wallet Address 🔐
                    </label>
                    <Input
                      value={formData.wallet_address}
                      disabled={!isEditing}
                      onChange={(e) => setFormData({...formData, wallet_address: e.target.value})}
                      className={`${currentTheme.secondary} ${currentTheme.text} border-0 font-mono text-sm ${isEditing ? 'ring-2 ring-purple-500' : ''}`}
                      placeholder="0x... your wallet address"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="friends" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${currentTheme.text}`}>
                    Friends & Community 👥
                  </h3>
                  <Button className={`${currentTheme.primary} text-white hover:scale-105 transition-transform`}>
                    <User className="h-4 w-4 mr-2" />
                    Find Friends 🔍
                  </Button>
                </div>
                
                <div className={`${currentTheme.secondary} p-8 rounded-lg text-center border-2 border-dashed border-purple-300`}>
                  <Sparkles className={`h-12 w-12 ${currentTheme.muted} mx-auto mb-4`} />
                  <p className={`${currentTheme.text} text-lg font-medium mb-2`}>
                    Your friend list is waiting! 🌟
                  </p>
                  <p className={`${currentTheme.muted} text-sm`}>
                    Start connecting with other awesome users!
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>
                    Account Settings ⚙️
                  </h3>
                  
                  <div className="space-y-4">
                    <div className={`flex items-center justify-between p-4 rounded-lg ${currentTheme.secondary} border border-purple-200`}>
                      <div>
                        <h4 className={`font-medium ${currentTheme.text} flex items-center`}>
                          Email Notifications 📧
                          <Mail className="h-4 w-4 ml-2" />
                        </h4>
                        <p className={`text-sm ${currentTheme.muted} mt-1`}>
                          Get updates about your transactions and messages
                        </p>
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
                        <h4 className={`font-medium ${currentTheme.text} flex items-center`}>
                          Two-Factor Authentication 🔐
                          <Sparkles className="h-4 w-4 ml-2" />
                        </h4>
                        <p className={`text-sm ${currentTheme.muted} mt-1`}>
                          Extra security for your awesome account
                        </p>
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
