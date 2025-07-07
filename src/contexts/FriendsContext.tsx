
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Friend {
  id: string;
  username: string;
  avatar?: string;
  status: 'online' | 'offline';
}

interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  fromAvatar?: string;
  toUserId: string;
  toUsername: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

interface FriendsContextType {
  friends: Friend[];
  friendRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  sendFriendRequest: (toUserId: string, toUsername: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  removeFriend: (friendId: string) => void;
  areFriends: (userId: string) => boolean;
  hasPendingRequest: (userId: string) => boolean;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    if (user) {
      console.log('Loading friends data for user:', user.id);
      loadFriendsData();
    } else {
      // Clear data when user logs out
      setFriends([]);
      setFriendRequests([]);
      setSentRequests([]);
    }
  }, [user]);

  const loadFriendsData = () => {
    if (!user) return;

    try {
      const savedFriends = localStorage.getItem(`friends_${user.id}`);
      if (savedFriends) {
        const friendsList = JSON.parse(savedFriends);
        setFriends(friendsList);
        console.log('Loaded friends:', friendsList);
      }

      const savedRequests = localStorage.getItem('friend_requests');
      if (savedRequests) {
        const allRequests = JSON.parse(savedRequests);
        const incomingRequests = allRequests.filter((req: FriendRequest) => req.toUserId === user.id && req.status === 'pending');
        const outgoingRequests = allRequests.filter((req: FriendRequest) => req.fromUserId === user.id);
        
        setFriendRequests(incomingRequests);
        setSentRequests(outgoingRequests);
        console.log('Loaded friend requests:', incomingRequests);
        console.log('Loaded sent requests:', outgoingRequests);
      }
    } catch (error) {
      console.error('Error loading friends data:', error);
    }
  };

  const sendFriendRequest = (toUserId: string, toUsername: string) => {
    if (!user || toUserId === user.id) return;

    console.log('Sending friend request from', user.username, 'to', toUsername);

    const request: FriendRequest = {
      id: Date.now().toString(),
      fromUserId: user.id,
      fromUsername: user.username || user.email?.split('@')[0] || 'Anonymous',
      toUserId,
      toUsername,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const savedRequests = localStorage.getItem('friend_requests');
    const allRequests = savedRequests ? JSON.parse(savedRequests) : [];
    allRequests.push(request);
    localStorage.setItem('friend_requests', JSON.stringify(allRequests));

    setSentRequests(prev => [...prev, request]);
    console.log('Friend request sent:', request);
  };

  const acceptFriendRequest = (requestId: string) => {
    if (!user) return;

    console.log('Accepting friend request:', requestId);

    const savedRequests = localStorage.getItem('friend_requests');
    if (!savedRequests) return;

    const allRequests = JSON.parse(savedRequests);
    const request = allRequests.find((req: FriendRequest) => req.id === requestId);
    if (!request) return;

    // Update request status
    const updatedRequests = allRequests.map((req: FriendRequest) =>
      req.id === requestId ? { ...req, status: 'accepted' } : req
    );
    localStorage.setItem('friend_requests', JSON.stringify(updatedRequests));

    // Add to both users' friend lists
    const newFriend: Friend = {
      id: request.fromUserId,
      username: request.fromUsername,
      avatar: request.fromAvatar,
      status: 'offline'
    };

    const myFriends = [...friends, newFriend];
    setFriends(myFriends);
    localStorage.setItem(`friends_${user.id}`, JSON.stringify(myFriends));

    // Add me to their friend list
    const theirFriends = localStorage.getItem(`friends_${request.fromUserId}`);
    const theirFriendsList = theirFriends ? JSON.parse(theirFriends) : [];
    const meAsFriend: Friend = {
      id: user.id,
      username: user.username || user.email?.split('@')[0] || 'Anonymous',
      status: 'offline'
    };
    theirFriendsList.push(meAsFriend);
    localStorage.setItem(`friends_${request.fromUserId}`, JSON.stringify(theirFriendsList));

    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    console.log('Friend request accepted, new friend added:', newFriend);
  };

  const declineFriendRequest = (requestId: string) => {
    console.log('Declining friend request:', requestId);
    
    const savedRequests = localStorage.getItem('friend_requests');
    if (!savedRequests) return;

    const allRequests = JSON.parse(savedRequests);
    const updatedRequests = allRequests.map((req: FriendRequest) =>
      req.id === requestId ? { ...req, status: 'declined' } : req
    );
    localStorage.setItem('friend_requests', JSON.stringify(updatedRequests));

    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const removeFriend = (friendId: string) => {
    if (!user) return;

    console.log('Removing friend:', friendId);

    const updatedFriends = friends.filter(friend => friend.id !== friendId);
    setFriends(updatedFriends);
    localStorage.setItem(`friends_${user.id}`, JSON.stringify(updatedFriends));

    // Remove me from their friend list
    const theirFriends = localStorage.getItem(`friends_${friendId}`);
    if (theirFriends) {
      const theirFriendsList = JSON.parse(theirFriends);
      const updatedTheirFriends = theirFriendsList.filter((friend: Friend) => friend.id !== user.id);
      localStorage.setItem(`friends_${friendId}`, JSON.stringify(updatedTheirFriends));
    }
  };

  const areFriends = (userId: string) => {
    return friends.some(friend => friend.id === userId);
  };

  const hasPendingRequest = (userId: string) => {
    return sentRequests.some(req => req.toUserId === userId && req.status === 'pending');
  };

  return (
    <FriendsContext.Provider value={{
      friends,
      friendRequests,
      sentRequests,
      sendFriendRequest,
      acceptFriendRequest,
      declineFriendRequest,
      removeFriend,
      areFriends,
      hasPendingRequest
    }}>
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
