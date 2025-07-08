
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Friend {
  id: string;
  username: string;
  email: string;
  status: 'online' | 'offline';
  created_at: string;
}

interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  created_at: string;
}

interface FriendsContextType {
  friends: Friend[];
  friendRequests: FriendRequest[];
  pendingRequests: Friend[];
  sentRequests: Friend[];
  sendFriendRequest: (userId: string, username?: string) => Promise<boolean>;
  acceptFriendRequest: (requestId: string) => Promise<boolean>;
  rejectFriendRequest: (requestId: string) => Promise<boolean>;
  declineFriendRequest: (requestId: string) => Promise<boolean>;
  removeFriend: (friendId: string) => Promise<boolean>;
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  areFriends: (userId: string) => boolean;
  hasPendingRequest: (userId: string) => boolean;
  loading: boolean;
  refreshFriends: () => Promise<void>;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
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

  const getFriendRequestsList = () => {
    try {
      const requestsData = localStorage.getItem('friend_requests');
      return requestsData ? JSON.parse(requestsData) : [];
    } catch (error) {
      console.error('Error parsing friend requests:', error);
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

  const saveFriendRequestsList = (requestsData: any[]) => {
    try {
      localStorage.setItem('friend_requests', JSON.stringify(requestsData));
    } catch (error) {
      console.error('Error saving friend requests:', error);
    }
  };

  const areFriends = (userId: string): boolean => {
    if (!user) return false;
    return friends.some(friend => friend.id === userId);
  };

  const hasPendingRequest = (userId: string): boolean => {
    if (!user) return false;
    const requests = getFriendRequestsList();
    return requests.some((req: any) => 
      (req.fromUserId === user.id && req.toUserId === userId) ||
      (req.fromUserId === userId && req.toUserId === user.id)
    );
  };

  const refreshFriends = async () => {
    if (!user) {
      setFriends([]);
      setFriendRequests([]);
      setPendingRequests([]);
      setSentRequests([]);
      return;
    }

    setLoading(true);
    try {
      const friendsData = getFriendsList();
      const requestsData = getFriendRequestsList();
      const userList = getUserList();

      // Get accepted friends
      const userFriends = friendsData.filter((f: any) => 
        (f.user1_id === user.id || f.user2_id === user.id) && f.status === 'accepted'
      );

      // Get incoming friend requests
      const incomingRequests = requestsData.filter((req: any) => 
        req.toUserId === user.id
      );

      // Get outgoing friend requests
      const outgoingRequests = requestsData.filter((req: any) => 
        req.fromUserId === user.id
      );

      const mapFriendData = (friendRequests: any[]) => {
        return friendRequests.map((f: any) => {
          const friendId = f.user1_id === user.id ? f.user2_id : f.user1_id;
          const friendData = userList.find((u: any) => u.id === friendId);
          
          return {
            id: friendId,
            username: friendData?.username || friendData?.email?.split('@')[0] || 'Unknown User',
            email: friendData?.email || '',
            status: 'offline' as const, // Default status
            created_at: f.created_at || new Date().toISOString()
          };
        });
      };

      const mapRequestData = (requests: any[]) => {
        return requests.map((req: any) => {
          const fromUser = userList.find((u: any) => u.id === req.fromUserId);
          return {
            id: req.id,
            fromUserId: req.fromUserId,
            fromUsername: fromUser?.username || fromUser?.email?.split('@')[0] || 'Unknown User',
            toUserId: req.toUserId,
            created_at: req.created_at || new Date().toISOString()
          };
        });
      };

      setFriends(mapFriendData(userFriends));
      setFriendRequests(mapRequestData(incomingRequests));
      setPendingRequests(mapFriendData([])); // Legacy support
      setSentRequests(mapFriendData(outgoingRequests));
    } catch (error) {
      console.error('Error refreshing friends:', error);
      setFriends([]);
      setFriendRequests([]);
      setPendingRequests([]);
      setSentRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId: string, username?: string): Promise<boolean> => {
    if (!user || userId === user.id) return false;

    try {
      const requestsData = getFriendRequestsList();
      
      // Check if request already exists
      const existingRequest = requestsData.find((req: any) => 
        (req.fromUserId === user.id && req.toUserId === userId) ||
        (req.fromUserId === userId && req.toUserId === user.id)
      );

      if (existingRequest) return false;

      const newRequest = {
        id: Date.now().toString(),
        fromUserId: user.id,
        toUserId: userId,
        created_at: new Date().toISOString()
      };

      requestsData.push(newRequest);
      saveFriendRequestsList(requestsData);
      await refreshFriends();
      return true;
    } catch (error) {
      console.error('Error sending friend request:', error);
      return false;
    }
  };

  const acceptFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      const requestsData = getFriendRequestsList();
      const request = requestsData.find((req: any) => req.id === requestId);
      
      if (!request || !user) return false;

      // Add to friends list
      const friendsData = getFriendsList();
      const newFriend = {
        id: Date.now().toString(),
        user1_id: request.fromUserId,
        user2_id: request.toUserId,
        status: 'accepted',
        created_at: new Date().toISOString()
      };
      friendsData.push(newFriend);
      saveFriendsList(friendsData);

      // Remove from requests
      const updatedRequests = requestsData.filter((req: any) => req.id !== requestId);
      saveFriendRequestsList(updatedRequests);

      await refreshFriends();
      return true;
    } catch (error) {
      console.error('Error accepting friend request:', error);
      return false;
    }
  };

  const rejectFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      const requestsData = getFriendRequestsList();
      const updatedRequests = requestsData.filter((req: any) => req.id !== requestId);
      saveFriendRequestsList(updatedRequests);
      await refreshFriends();
      return true;
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      return false;
    }
  };

  const declineFriendRequest = async (requestId: string): Promise<boolean> => {
    return rejectFriendRequest(requestId);
  };

  const removeFriend = async (friendId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const friendsData = getFriendsList();
      const updatedFriends = friendsData.filter((f: any) => 
        !((f.user1_id === user.id && f.user2_id === friendId) ||
          (f.user1_id === friendId && f.user2_id === user.id))
      );
      saveFriendsList(updatedFriends);
      await refreshFriends();
      return true;
    } catch (error) {
      console.error('Error removing friend:', error);
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
    friendRequests,
    pendingRequests,
    sentRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    declineFriendRequest,
    removeFriend,
    blockUser,
    unblockUser,
    areFriends,
    hasPendingRequest,
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
