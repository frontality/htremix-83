
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at?: string;
}

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  friend_profile?: UserProfile;
}

export const useUserProfiles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    if (profiles[userId]) {
      return profiles[userId];
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, bio, avatar_url, created_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      const profile = data || {
        id: userId,
        username: `User ${userId.slice(0, 8)}`,
        bio: null,
        avatar_url: null,
      };

      setProfiles(prev => ({ ...prev, [userId]: profile }));
      return profile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const fetchMultipleProfiles = async (userIds: string[]) => {
    const missingIds = userIds.filter(id => !profiles[id]);
    if (missingIds.length === 0) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, bio, avatar_url, created_at')
        .in('id', missingIds);

      if (error) {
        console.error('Error fetching multiple profiles:', error);
        return;
      }

      const profilesMap: Record<string, UserProfile> = {};
      
      // Add existing profiles
      data?.forEach(profile => {
        profilesMap[profile.id] = profile;
      });

      // Add fallback profiles for missing ones
      missingIds.forEach(id => {
        if (!profilesMap[id]) {
          profilesMap[id] = {
            id,
            username: `User ${id.slice(0, 8)}`,
            bio: null,
            avatar_url: null,
          };
        }
      });

      setProfiles(prev => ({ ...prev, ...profilesMap }));
    } catch (error) {
      console.error('Error in fetchMultipleProfiles:', error);
    }
  };

  const sendFriendRequest = async (friendId: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to send friend requests.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Check if friendship already exists (using raw SQL for complex OR query)
      const { data: existing, error: checkError } = await supabase.rpc('check_friendship', {
        user1: user.id,
        user2: friendId
      });

      // If RPC doesn't exist, fallback to regular query
      if (checkError) {
        const { data: existingData } = await supabase
          .from('friendships')
          .select('*')
          .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`)
          .single();

        if (existingData) {
          toast({
            title: 'Friend Request Exists',
            description: 'You already have a connection with this user.',
            variant: 'destructive',
          });
          return false;
        }
      }

      const { error } = await supabase
        .from('friendships')
        .insert([
          {
            user_id: user.id,
            friend_id: friendId,
            status: 'pending',
          },
        ]);

      if (error) {
        console.error('Error sending friend request:', error);
        toast({
          title: 'Error',
          description: 'Failed to send friend request. Please try again.',
          variant: 'destructive',
        });
        return false;
      }

      toast({
        title: 'Friend Request Sent! 🎉',
        description: 'Your friend request has been sent successfully!',
      });

      return true;
    } catch (error) {
      console.error('Error in sendFriendRequest:', error);
      return false;
    }
  };

  const getUserDisplayName = (userId: string): string => {
    const profile = profiles[userId];
    return profile?.username || `User ${userId.slice(0, 8)}`;
  };

  return {
    profiles,
    friends,
    loading,
    fetchUserProfile,
    fetchMultipleProfiles,
    sendFriendRequest,
    getUserDisplayName,
  };
};
