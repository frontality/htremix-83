
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  wallet_address: string | null;
  email_notifications: boolean;
  two_factor_enabled: boolean;
  show_email_to_public: boolean;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const getStorageKey = (userId: string) => `profile_${userId}`;

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching profile for user:', user.id);
      
      const storageKey = getStorageKey(user.id);
      const savedProfile = localStorage.getItem(storageKey);
      
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        console.log('Profile loaded from localStorage:', parsedProfile);
        setProfile(parsedProfile);
      } else {
        console.log('Creating new profile...');
        // Generate username from email but never store the actual email
        const emailPrefix = user.email?.split('@')[0] || 'User';
        const randomSuffix = Math.floor(Math.random() * 1000);
        const safeUsername = `${emailPrefix}${randomSuffix}`;
        
        const newProfile: Profile = {
          id: user.id,
          username: safeUsername,
          bio: null,
          avatar_url: null,
          wallet_address: null,
          email_notifications: true,
          two_factor_enabled: false,
          show_email_to_public: false // Email always hidden
        };

        localStorage.setItem(storageKey, JSON.stringify(newProfile));
        console.log('New profile created and saved:', newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) {
      console.log('No user or profile for update');
      return false;
    }

    try {
      console.log('Updating profile with:', updates);
      const updatedProfile = { ...profile, ...updates };
      
      const storageKey = getStorageKey(user.id);
      localStorage.setItem(storageKey, JSON.stringify(updatedProfile));

      console.log('Profile updated successfully:', updatedProfile);
      setProfile(updatedProfile);
      
      toast({
        title: "Success! 🎉",
        description: "Your profile has been updated successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get display name that never includes email
  const getDisplayName = (profileData?: Profile) => {
    const targetProfile = profileData || profile;
    if (!targetProfile) return 'Anonymous User';
    return targetProfile.username || 'Anonymous User';
  };

  // Always return null for email - emails should never be displayed
  const getDisplayEmail = () => {
    return null;
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return { 
    profile, 
    loading, 
    updateProfile, 
    refetch: fetchProfile,
    getDisplayEmail,
    getDisplayName
  };
};
