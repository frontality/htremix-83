import { useState } from "react";
import { Camera, Edit, Mail, MessageCircle, User, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import { useTheme } from "@/contexts/ThemeContext";

const Profile = () => {
  const { currentTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: "SkidTrader123",
    email: "trader@example.com",
    bio: "Marketplace enthusiast and collector. Always looking for good deals!",
    avatar: "/placeholder.svg",
    walletAddress: "0x1234...5678",
    joinDate: "January 2024"
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save profile logic would go here
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className={`${currentTheme.cardBg} rounded-xl p-8 border ${currentTheme.border}`}>
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-600"
                />
                <button className={`absolute bottom-0 right-0 p-2 rounded-full ${currentTheme.primary} text-white`}>
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className={`text-2xl font-bold ${currentTheme.text}`}>{profile.username}</h1>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
                <p className={`${currentTheme.muted} mb-2`}>{profile.email}</p>
                <p className={`${currentTheme.text} text-sm`}>{profile.bio}</p>
              </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className={`${currentTheme.secondary} ${currentTheme.text}`}>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="friends">Friends</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                        Username
                      </label>
                      <Input
                        value={profile.username}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({...profile, username: e.target.value})}
                        className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                        Email
                      </label>
                      <Input
                        value={profile.email}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Bio
                    </label>
                    <Textarea
                      value={profile.bio}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className={`${currentTheme.secondary} ${currentTheme.text} border-0 min-h-24`}
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <Button onClick={handleSave} className={`${currentTheme.primary} text-white`}>
                    Save Changes
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="wallet" className="space-y-6">
                <div className={`${currentTheme.secondary} p-6 rounded-lg`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <Wallet className={`h-6 w-6 ${currentTheme.accent}`} />
                    <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Crypto Wallet</h3>
                  </div>
                  <p className={`${currentTheme.muted} text-sm mb-2`}>Wallet Address:</p>
                  <p className={`${currentTheme.text} font-mono text-sm`}>{profile.walletAddress}</p>
                </div>
              </TabsContent>

              <TabsContent value="friends" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Friends & Requests</h3>
                  <Button className={`${currentTheme.primary} text-white`}>
                    <User className="h-4 w-4 mr-2" />
                    Find Friends
                  </Button>
                </div>
                
                <div className={`${currentTheme.secondary} p-6 rounded-lg text-center`}>
                  <User className={`h-12 w-12 ${currentTheme.muted} mx-auto mb-4`} />
                  <p className={`${currentTheme.muted}`}>No friends added yet</p>
                  <p className={`${currentTheme.muted} text-sm`}>Start connecting with other users!</p>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Account Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <h4 className={`font-medium ${currentTheme.text}`}>Email Notifications</h4>
                        <p className={`text-sm ${currentTheme.muted}`}>Receive updates about your transactions</p>
                      </div>
                      <Button variant="outline" size="sm" className={`${currentTheme.secondary} ${currentTheme.text} border-0`}>
                        Enable
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <h4 className={`font-medium ${currentTheme.text}`}>Two-Factor Authentication</h4>
                        <p className={`text-sm ${currentTheme.muted}`}>Secure your account with 2FA</p>
                      </div>
                      <Button variant="outline" size="sm" className={`${currentTheme.secondary} ${currentTheme.text} border-0`}>
                        Setup
                      </Button>
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
