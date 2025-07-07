
import { useState } from "react";
import { Users, UserPlus, Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useFriends } from "@/contexts/FriendsContext";
import { useToast } from "@/hooks/use-toast";
import UserSearch from "./UserSearch";

const FriendsList = () => {
  const { currentTheme } = useTheme();
  const { friends, friendRequests, acceptFriendRequest, declineFriendRequest, removeFriend, sendFriendRequest } = useFriends();
  const { toast } = useToast();
  const [showUserSearch, setShowUserSearch] = useState(false);

  const handleSendFriendRequest = (userId: string) => {
    // Get the user's info from registered users
    const allUsers = localStorage.getItem('registered_users');
    if (allUsers) {
      const userList = JSON.parse(allUsers);
      const targetUser = userList.find((u: any) => u.id === userId);
      if (targetUser) {
        const username = targetUser.username || targetUser.email.split('@')[0];
        sendFriendRequest(userId, username);
        toast({
          title: "Friend Request Sent! 👋",
          description: `Friend request sent to ${username}`
        });
      }
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    acceptFriendRequest(requestId);
    toast({
      title: "Friend Request Accepted! 🎉",
      description: "You have a new friend!"
    });
  };

  const handleDeclineRequest = (requestId: string) => {
    declineFriendRequest(requestId);
    toast({
      title: "Friend Request Declined",
      description: "Request has been declined."
    });
  };

  const handleRemoveFriend = (friendId: string, friendName: string) => {
    removeFriend(friendId);
    toast({
      title: "Friend Removed",
      description: `${friendName} has been removed from your friends list.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Friends Section */}
      <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${currentTheme.text} flex items-center gap-2`}>
            <UserPlus className="h-5 w-5" />
            Add Friends
          </h3>
          <Button
            onClick={() => setShowUserSearch(!showUserSearch)}
            className={`${currentTheme.primary} text-white hover:scale-105 transition-transform`}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Find Users
          </Button>
        </div>
        
        {showUserSearch && (
          <div className="mt-4">
            <UserSearch
              onSelectUser={handleSendFriendRequest}
              onClose={() => setShowUserSearch(false)}
            />
          </div>
        )}
      </div>

      {/* Friend Requests Section */}
      {friendRequests.length > 0 && (
        <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4`}>
          <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4 flex items-center gap-2`}>
            <UserPlus className="h-5 w-5" />
            Friend Requests ({friendRequests.length})
          </h3>
          <div className="space-y-3">
            {friendRequests.map((request) => (
              <div key={request.id} className={`flex items-center justify-between p-3 rounded-lg ${currentTheme.secondary}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    {request.fromUsername[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className={`font-medium ${currentTheme.text}`}>
                      {request.fromUsername}
                    </p>
                    <p className={`text-sm ${currentTheme.muted}`}>
                      Sent you a friend request
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptRequest(request.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeclineRequest(request.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List Section */}
      <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4`}>
        <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4 flex items-center gap-2`}>
          <Users className="h-5 w-5" />
          Your Friends ({friends.length})
        </h3>
        
        {friends.length > 0 ? (
          <div className="space-y-3">
            {friends.map((friend) => (
              <div key={friend.id} className={`flex items-center justify-between p-3 rounded-lg ${currentTheme.secondary}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {friend.username[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className={`font-medium ${currentTheme.text}`}>
                      {friend.username}
                    </p>
                    <p className={`text-sm ${currentTheme.muted} flex items-center gap-1`}>
                      <span className={`w-2 h-2 rounded-full ${friend.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                      {friend.status}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveFriend(friend.id, friend.username)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className={`h-12 w-12 ${currentTheme.muted} mx-auto mb-4`} />
            <p className={`${currentTheme.text} text-lg font-medium mb-2`}>
              No friends yet!
            </p>
            <p className={`${currentTheme.muted} text-sm`}>
              Start connecting with other users by searching for them above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
