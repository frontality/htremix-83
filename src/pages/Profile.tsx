
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { User, Edit, Save, X, Camera, Star, Shield, Calendar, MapPin, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio: string;
  location: string;
  phone: string;
  avatar: string;
  joinDate: string;
  rating: number;
  totalTrades: number;
  isVerified: boolean;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    publicProfile: boolean;
  };
}

const Profile = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadProfile();
  }, [user, navigate]);

  const loadProfile = () => {
    try {
      const savedProfile = localStorage.getItem(`user_profile_${user?.id}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        // Create default profile
        const defaultProfile: UserProfile = {
          id: user?.id || '',
          username: user?.email?.split('@')[0] || 'user',
          email: user?.email || '',
          fullName: '',
          bio: '',
          location: '',
          phone: '',
          avatar: '/placeholder.svg',
          joinDate: new Date().toLocaleDateString(),
          rating: 4.8,
          totalTrades: 0,
          isVerified: false,
          preferences: {
            emailNotifications: true,
            pushNotifications: true,
            publicProfile: true
          }
        };
        localStorage.setItem(`user_profile_${user?.id}`, JSON.stringify(defaultProfile));
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSaveProfile = () => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      ...editedProfile
    };

    try {
      localStorage.setItem(`user_profile_${user?.id}`, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      setEditedProfile({});
      setIsEditing(false);

      toast({
        title: "Profile updated! ✅",
        description: "Your profile has been saved successfully."
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setEditedProfile(prev => ({ ...prev, avatar: result }));
      toast({
        title: "Avatar updated! 📸",
        description: "Your new avatar has been set."
      });
    };
    reader.readAsDataURL(file);
  };

  if (!user || !profile) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} pt-20 flex items-center justify-center`}>
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-4">Loading profile...</h2>
        </div>
      </div>
    );
  }

  const displayProfile = { ...profile, ...editedProfile };

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} pt-20`}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg overflow-hidden`}>
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-8">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <img
                  src={displayProfile.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 rounded-full p-2 cursor-pointer transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="text-center md:text-left text-white flex-1">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <h1 className="text-2xl font-bold">{displayProfile.username}</h1>
                  {displayProfile.isVerified && (
                    <Shield className="w-6 h-6 text-blue-400" />
                  )}
                </div>
                <p className="text-purple-100 mb-2">{displayProfile.email}</p>
                <div className="flex items-center justify-center md:justify-start space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span>{displayProfile.rating}/5</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {displayProfile.joinDate}</span>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedProfile({});
                      }}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.fullName ?? displayProfile.fullName}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Enter your full name"
                        className={`${currentTheme.cardBg} border-gray-600 focus:border-purple-500`}
                      />
                    ) : (
                      <p className="text-gray-300">{displayProfile.fullName || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Location</span>
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.location ?? displayProfile.location}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter your location"
                        className={`${currentTheme.cardBg} border-gray-600 focus:border-purple-500`}
                      />
                    ) : (
                      <p className="text-gray-300">{displayProfile.location || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Phone</span>
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.phone ?? displayProfile.phone}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                        className={`${currentTheme.cardBg} border-gray-600 focus:border-purple-500`}
                      />
                    ) : (
                      <p className="text-gray-300">{displayProfile.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    {isEditing ? (
                      <Textarea
                        value={editedProfile.bio ?? displayProfile.bio}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        className={`${currentTheme.cardBg} border-gray-600 focus:border-purple-500 h-24`}
                      />
                    ) : (
                      <p className="text-gray-300">{displayProfile.bio || 'No bio provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Trading Stats */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Trading Stats</h3>
                <div className="space-y-4">
                  <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span className="font-semibold">{displayProfile.rating}/5</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${(displayProfile.rating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Total Trades</span>
                      <span className="font-semibold text-lg">{displayProfile.totalTrades}</span>
                    </div>
                  </div>

                  <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Verification Status</span>
                      <div className="flex items-center space-x-2">
                        <Shield className={`w-4 h-4 ${displayProfile.isVerified ? 'text-blue-400' : 'text-gray-400'}`} />
                        <span className={`font-semibold ${displayProfile.isVerified ? 'text-blue-400' : 'text-gray-400'}`}>
                          {displayProfile.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate('/marketplace')}
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      View Marketplace
                    </Button>
                    <Button 
                      onClick={() => navigate('/sell')}
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      List New Item
                    </Button>
                    <Button 
                      onClick={() => navigate('/settings')}
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      Account Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
