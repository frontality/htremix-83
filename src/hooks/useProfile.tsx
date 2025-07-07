
import { useState, useEffect, useCallback } from 'react';
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
}

export const useProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Loading profile for user:', user.id);
      
      // Load saved profile data from localStorage
      const savedProfile = localStorage.getItem(`profile_${user.id}`);
      const savedAvatar = localStorage.getItem('current_avatar');
      
      let profileData: Profile = {
        id: user.id,
        username: user.username || null,
        bio: null,
        avatar_url: savedAvatar || null,
        wallet_address: null,
        email_notifications: true,
        two_factor_enabled: false
      };

      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        profileData = { ...profileData, ...parsedProfile };
      }

      console.log('Profile loaded:', profileData);
      setProfile(profileData);
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
  }, [user, toast]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user || !profile) {
      console.log('No user or profile for update');
      return false;
    }

    try {
      console.log('Updating profile with:', updates);
      
      if (updates.username !== undefined) {
        const { error } = await updateUserProfile({ username: updates.username });
        if (error) {
          toast({
            title: "Error",
            description: error === 'Username already taken' ? "Username already taken" : "Failed to update profile. Please try again.",
            variant: "destructive",
          });
          return false;
        }
      }

      const updatedProfile = { ...profile, ...updates };
      
      // Save profile data to localStorage
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile));
      
      console.log('Profile updated successfully');
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
  }, [user, profile, updateUserProfile, toast]);

  const getDisplayName = useCallback((profileData?: Profile) => {
    const targetProfile = profileData || profile;
    
    if (targetProfile?.username) {
      return targetProfile.username;
    }
    
    if (targetProfile) {
      return 'Set your username';
    }
    
    return 'Loading...';
  }, [profile]);

  const getDisplayEmail = useCallback(() => {
    return null;
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { 
    profile, 
    loading, 
    updateProfile, 
    refetch: fetchProfile,
    getDisplayEmail,
    getDisplayName
  };
};
