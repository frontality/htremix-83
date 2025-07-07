
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available for profile fetch');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Loading profile for user:', user.id);
      
      // Get profiles from localStorage
      const existingProfiles = localStorage.getItem('user_profiles');
      const profiles = existingProfiles ? JSON.parse(existingProfiles) : [];
      
      // Find existing profile
      let userProfile = profiles.find((p: any) => p.user_id === user.id);
      
      if (userProfile) {
        console.log('Profile loaded:', userProfile);
        setProfile(userProfile);
      } else {
        console.log('No profile found, creating new one');
        // Create new profile if it doesn't exist
        const newProfile: Profile = {
          id: Date.now().toString(),
          user_id: user.id,
          username: user.username || user.email?.split('@')[0] || null,
          bio: null,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        profiles.push(newProfile);
        localStorage.setItem('user_profiles', JSON.stringify(profiles));
        
        console.log('Profile created:', newProfile);
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
  }, [user?.id, user?.email, user?.username, toast]);

  const updateProfile = useCallback(async (updates: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user?.id) {
      console.log('No user ID for profile update');
      toast({
        title: "Error",
        description: "Please log in to update your profile.",
        variant: "destructive",
      });
      return false;
    }

    if (!profile?.id) {
      console.log('No profile ID for update');
      toast({
        title: "Error", 
        description: "Profile not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('Updating profile with:', updates);
      
      // Get existing profiles
      const existingProfiles = localStorage.getItem('user_profiles');
      const profiles = existingProfiles ? JSON.parse(existingProfiles) : [];
      
      // Find and update the profile
      const profileIndex = profiles.findIndex((p: any) => p.user_id === user.id);
      if (profileIndex === -1) {
        toast({
          title: "Error",
          description: "Profile not found. Please refresh the page.",
          variant: "destructive",
        });
        return false;
      }

      const updatedProfile = {
        ...profiles[profileIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };

      profiles[profileIndex] = updatedProfile;
      localStorage.setItem('user_profiles', JSON.stringify(profiles));

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
  }, [user?.id, profile?.id, toast]);

  const getDisplayName = useCallback((profileData?: Profile) => {
    const targetProfile = profileData || profile;
    
    if (targetProfile?.username) {
      return targetProfile.username;
    }
    
    if (user?.username) {
      return user.username;
    }
    
    if (user?.email) {
      return user.email.split('@')[0];
    }
    
    return 'Set your username';
  }, [profile?.username, user?.username, user?.email]);

  const getDisplayEmail = useCallback(() => {
    return user?.email || null;
  }, [user?.email]);

  // Only fetch profile when user changes
  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user?.id]);

  return { 
    profile, 
    loading, 
    updateProfile, 
    refetch: fetchProfile,
    getDisplayEmail,
    getDisplayName
  };
};
