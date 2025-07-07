
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (data) {
        console.log('Profile loaded:', data);
        setProfile(data);
      } else {
        console.log('No profile found, creating new one');
        // Create new profile if it doesn't exist
        const newProfile = {
          user_id: user.id,
          username: user.email?.split('@')[0] || null,
          bio: null,
          avatar_url: null
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          throw createError;
        }

        console.log('Profile created:', createdProfile);
        setProfile(createdProfile);
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
  }, [user?.id, user?.email, toast]);

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
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Profile updated successfully:', data);
      setProfile(data);
      
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
    
    if (user?.email) {
      return user.email.split('@')[0];
    }
    
    return 'Set your username';
  }, [profile?.username, user?.email]);

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
