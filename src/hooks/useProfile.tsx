
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, bio, avatar_url, wallet_address, email_notifications, two_factor_enabled')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Profile loaded:', data);
      setProfile(data);
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
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Profile updated successfully');
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
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

  // Get display name - prioritize username, show helpful message if missing
  const getDisplayName = (profileData?: Profile) => {
    const targetProfile = profileData || profile;
    
    // If we have a username, use it
    if (targetProfile?.username) {
      return targetProfile.username;
    }
    
    // If no username but we have a profile, they need to set one
    if (targetProfile) {
      return 'Set your username';
    }
    
    // If no profile yet, show loading state
    return 'Loading...';
  };

  // Never return email for display - emails are private
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
