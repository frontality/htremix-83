
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user.id,
          username: user.email || 'User',
          bio: null,
          avatar_url: null,
          wallet_address: null,
          email_notifications: true,
          two_factor_enabled: false
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (!insertError) {
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Error 😅",
          description: "Couldn't save your awesome changes! Try again?",
          variant: "destructive",
        });
        return false;
      }

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Woohoo! 🎉",
        description: "Your profile looks amazing!",
      });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return { profile, loading, updateProfile, refetch: fetchProfile };
};
