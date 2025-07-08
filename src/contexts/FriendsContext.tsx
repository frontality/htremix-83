
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Friend {
  id: string;
  username: string;
  email: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
}

interface FriendsContextType {
  friends: Friend[];
  pendingRequests: Friend[];
  sentRequests: Friend[];
  sendFriendRequest: (userId: string) => Promise<boolean>;
  acceptFriendRequest: (requestId: string) => Promise<boolean>;
  rejectFriendRequest: (requestId: string) => Promise<boolean>;
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  loading: boolean;
  refreshFriends: () => Promise<void>;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);

  const getUserList = () => {
    try {
      const allUsers = localStorage.getItem('registered_users');
      return allUsers ? JSON.parse(allUsers) : [];
    } catch (error) {
      console.error('Error parsing user list:', error);
      return [];
    }
  };

  const getFriendsList = () => {
    try {
      const friendsData = localStorage.getItem('friends');
      return friendsData ? JSON.parse(friendsData) : [];
    } catch (error) {
      console.error('Error parsing friends list:', error);
      return [];
    }
  };

  const saveFriendsList = (friendsData: any[]) => {
    try {
      localStorage.setItem('friends', JSON.stringify(friendsData));
    } catch (error) {
      console.error('Error saving friends list:', error);
    }
  };

  const refreshFriends = async () => {
    if (!user) {
      setFriends([]);
      setPendingRequests([]);
      setSentRequests([]);
      return;
    }

    setLoading(true);
    try {
      const friendsData = getFriendsList();
      const userList = getUserList();

      const userFriends = friendsData.filter((f: any) => 
        (f.user1_id === user.id || f.user2_id === user.id) && f.status === 'accepted'
      );

      const userPendingRequests = friendsData.filter((f: any) => 
        f.user2_id === user.id && f.status === 'pending'
      );

      const userSentRequests = friendsData.filter((f: any) => 
        f.user1_id === user.id && f.status === 'pending'
      );

      const mapFriendData = (friendRequests: any[]) => {
        return friendRequests.map((f: any) => {
          const friendId = f.user1_id === user.id ? f.user2_id : f.user1_id;
          const friendData = userList.find((u: any) => u.id === friendId);
          
          return {
            id: friendId,
            username: friendData?.username || friendData?.email?.split('@')[0] || 'Unknown User',
            email: friendData?.email || '',
            status: f.status,
            created_at: f.created_at || new Date().toISOString()
          };
        });
      };

      setFriends(mapFriendData(userFriends));
      setPendingRequests(mapFriendData(userPendingRequests));
      setSentRequests(mapFriendData(userSentRequests));
    } catch (error) {
      console.error('Error refreshing friends:', error);
      setFriends([]);
      setPendingRequests([]);
      setSentRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId: string): Promise<boolean> => {
    if (!user || userId === user.id) return false;

    try {
      const friendsData = getFriendsList();
      
      // Check if request already exists
      const existingRequest = friendsData.find((f: any) => 
        (f.user1_id === user.id && f.user2_id === userId) ||
        (f.user1_id === userId && f.user2_id === user.id)
      );

      if (existingRequest) return false;

      const newRequest = {
        id: Date.now().toString(),
        user1_id: user.id,
        user2_id: userId,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      friendsData.push(newRequest);
      saveFriendsList(friendsData);
      await refreshFriends();
      return true;
    } catch (error) {
      console.error('Error sending friend request:', error);
      return false;
    }
  };

  const acceptFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      const friendsData = getFriendsList();
      const requestIndex = friendsData.findIndex((f: any) => 
        f.user1_id === requestId && f.user2_id === user?.id && f.status === 'pending'
      );

      if (requestIndex === -1) return false;

      friendsData[requestIndex].status = 'accepted';
      saveFriendsList(friendsData);
      await refreshFriends();
      return true;
    } catch (error) {
      console.error('Error accepting friend request:', error);
      return false;
    }
  };

  const rejectFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      const friendsData = getFriendsList();
      const filteredData = friendsData.filter((f: any) => 
        !(f.user1_id === requestId && f.user2_id === user?.id && f.status === 'pending')
      );

      saveFriendsList(filteredData);
      await refreshFriends();
      return true;
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      return false;
    }
  };

  const blockUser = async (userId: string): Promise<boolean> => {
    if (!user || userId === user.id) return false;

    try {
      const friendsData = getFriendsList();
      
      // Remove existing friendship/request
      const filteredData = friendsData.filter((f: any) => 
        !((f.user1_id === user.id && f.user2_id === userId) ||
          (f.user1_id === userId && f.user2_id === user.id))
      );

      // Add block entry
      const blockEntry = {
        id: Date.now().toString(),
        user1_id: user.id,
        user2_id: userId,
        status: 'blocked',
        created_at: new Date().toISOString()
      };

      filteredData.push(blockEntry);
      saveFriendsList(filteredData);
      await refreshFriends();
      return true;
    } catch (error) {
      console.error('Error blocking user:', error);
      return false;
    }
  };

  const unblockUser = async (userId: string): Promise<boolean> => {
    try {
      const friendsData = getFriendsList();
      const filteredData = friendsData.filter((f: any) => 
        !(f.user1_id === user?.id && f.user2_id === userId && f.status === 'blocked')
      );

      saveFriendsList(filteredData);
      await refreshFriends();
      return true;
    } catch (error) {
      console.error('Error unblocking user:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      refreshFriends();
    }
  }, [user]);

  const contextValue = {
    friends,
    pendingRequests,
    sentRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    blockUser,
    unblockUser,
    loading,
    refreshFriends
  };

  return (
    <FriendsContext.Provider value={contextValue}>
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (context === undefined) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }
  return context;
};
