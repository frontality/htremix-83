
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';

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
  const { shouldShowEmail } = useSettings();
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
        const newProfile: Profile = {
          id: user.id,
          username: user.email?.split('@')[0] || 'User',
          bio: null,
          avatar_url: null,
          wallet_address: null,
          email_notifications: true,
          two_factor_enabled: false,
          show_email_to_public: false
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

  const getDisplayEmail = () => {
    if (!user) return null;
    
    console.log('getDisplayEmail check:', {
      shouldShowEmailResult: shouldShowEmail(),
      userEmail: user.email
    });
    
    // Only show email if settings allow it
    return shouldShowEmail() ? user.email : null;
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return { 
    profile, 
    loading, 
    updateProfile, 
    refetch: fetchProfile,
    getDisplayEmail
  };
};
