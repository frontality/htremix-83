
import { useState } from "react";
import { User, UserPlus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTheme } from "@/contexts/ThemeContext";
import { useUserProfiles } from "@/hooks/useUserProfiles";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfileCardProps {
  userId: string;
  children: React.ReactNode;
}

const UserProfileCard = ({ userId, children }: UserProfileCardProps) => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { profiles, fetchUserProfile, sendFriendRequest } = useUserProfiles();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenProfile = async () => {
    if (!profiles[userId]) {
      setLoading(true);
      await fetchUserProfile(userId);
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async () => {
    const success = await sendFriendRequest(userId);
    if (success) {
      setIsOpen(false);
    }
  };

  const profile = profiles[userId];
  const isOwnProfile = user?.id === userId;

  const getDisplayName = () => {
    if (profile?.username) {
      return profile.username;
    }
    return `User ${userId.slice(0, 8)}`;
  };

  const getJoinDate = () => {
    if (profile?.created_at) {
      return new Date(profile.created_at).toLocaleDateString();
    }
    return 'Recently';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={handleOpenProfile}>
        <div className="cursor-pointer hover:opacity-80 transition-opacity">
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className={`${currentTheme.cardBg} border ${currentTheme.border} max-w-md`}>
        <DialogHeader>
          <DialogTitle className={currentTheme.text}>User Profile</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className={`${currentTheme.text}`}>Loading profile...</div>
          </div>
        ) : (
          <Card className={`${currentTheme.cardBg} border-0 shadow-none`}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full ${currentTheme.secondary} flex items-center justify-center flex-shrink-0`}>
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className={`h-8 w-8 ${currentTheme.text}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-xl font-semibold ${currentTheme.text} truncate`}>
                    {getDisplayName()}
                  </h3>
                  <p className={`text-sm ${currentTheme.muted}`}>
                    Member since {getJoinDate()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {profile?.bio && (
                <div className="mb-6">
                  <h4 className={`text-sm font-medium ${currentTheme.text} mb-2`}>About</h4>
                  <p className={`text-sm ${currentTheme.muted} leading-relaxed`}>{profile.bio}</p>
                </div>
              )}
              
              {!isOwnProfile && (
                <div className="flex space-x-3">
                  <Button
                    onClick={handleSendFriendRequest}
                    className={`${currentTheme.primary} text-white flex items-center gap-2 flex-1`}
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Friend
                  </Button>
                  <Button
                    variant="outline"
                    className={`${currentTheme.secondary} ${currentTheme.text} border ${currentTheme.border} flex items-center gap-2 flex-1`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileCard;
