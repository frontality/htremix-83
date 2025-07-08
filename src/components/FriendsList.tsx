
import { useState } from "react";
import { Users, UserPlus, Check, X, Trash2, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useFriends } from "@/contexts/FriendsContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import UserSearch from "./UserSearch";
import ProfileViewer from "./ProfileViewer";

const FriendsList = () => {
  const { currentTheme } = useTheme();
  const { friends, friendRequests, acceptFriendRequest, declineFriendRequest, removeFriend, sendFriendRequest } = useFriends();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [_sus, _ssus] = useState(false);
  const [_vp, _svp] = useState<string | null>(null);

  const _hsfr = (_uid: string) => {
    const _au = localStorage.getItem('registered_users');
    if (_au) {
      const _ul = JSON.parse(_au);
      const _tu = _ul.find((_u: any) => _u.id === _uid);
      if (_tu) {
        const _un = _tu.username || _tu.email.split('@')[0];
        sendFriendRequest(_uid);
        toast({
          title: "Friend Request Sent! 👋",
          description: `Friend request sent to @${_un}`
        });
      }
    }
  };

  const _har = (_rid: string) => {
    acceptFriendRequest(_rid);
    toast({
      title: "Friend Request Accepted! 🎉",
      description: "You have a new friend!"
    });
  };

  const _hdr = (_rid: string) => {
    declineFriendRequest(_rid);
    toast({
      title: "Friend Request Declined",
      description: "Request has been declined."
    });
  };

  const _hrf = (_fid: string, _fn: string) => {
    removeFriend(_fid);
    toast({
      title: "Friend Removed",
      description: `@${_fn} has been removed from your friends list.`
    });
  };

  const _hsc = (_uid: string) => {
    navigate(`/messages?user=${_uid}`);
  };

  return (
    <div className="space-y-6">
      <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${currentTheme.text} flex items-center gap-2`}>
            <UserPlus className="h-5 w-5" />
            Add Friends
          </h3>
          <Button
            onClick={() => _ssus(!_sus)}
            className={`${currentTheme.primary} text-white hover:scale-105 transition-transform`}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Find Users
          </Button>
        </div>
        
        {_sus && (
          <div className="mt-4">
            <UserSearch
              onSelectUser={_hsfr}
              onClose={() => _ssus(false)}
            />
          </div>
        )}
      </div>

      {friendRequests.length > 0 && (
        <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4`}>
          <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4 flex items-center gap-2`}>
            <UserPlus className="h-5 w-5" />
            Friend Requests ({friendRequests.length})
          </h3>
          <div className="space-y-3">
            {friendRequests.map((_req) => (
              <div key={_req.id} className={`flex items-center justify-between p-3 rounded-lg ${currentTheme.secondary}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    {_req.fromUsername[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className={`font-medium ${currentTheme.text}`}>
                      @{_req.fromUsername}
                    </p>
                    <p className={`text-sm ${currentTheme.muted}`}>
                      Sent you a friend request
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => _har(_req.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => _hdr(_req.id)}
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

      <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4`}>
        <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4 flex items-center gap-2`}>
          <Users className="h-5 w-5" />
          Your Friends ({friends.length})
        </h3>
        
        {friends.length > 0 ? (
          <div className="space-y-3">
            {friends.map((_fr) => (
              <div key={_fr.id} className={`flex items-center justify-between p-3 rounded-lg ${currentTheme.secondary}`}>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                    onClick={() => _svp(_fr.id)}
                  >
                    {_fr.username[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p 
                      className={`font-medium ${currentTheme.text} cursor-pointer hover:text-blue-400 transition-colors`}
                      onClick={() => _svp(_fr.id)}
                    >
                      @{_fr.username}
                    </p>
                    <p className={`text-sm ${currentTheme.muted} flex items-center gap-1`}>
                      <span className={`w-2 h-2 rounded-full ${_fr.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                      {_fr.status}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => _hsc(_fr.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => _hrf(_fr.id, _fr.username)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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

      {_vp && (
        <ProfileViewer
          userId={_vp}
          onClose={() => _svp(null)}
          onStartChat={_hsc}
        />
      )}
    </div>
  );
};

export default FriendsList;
