
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={handleOpenProfile}>
        <div className="cursor-pointer hover:opacity-80 transition-opacity">
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
        <DialogHeader>
          <DialogTitle className={currentTheme.text}>User Profile</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className={`${currentTheme.text}`}>Loading profile...</div>
          </div>
        ) : (
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full ${currentTheme.secondary} flex items-center justify-center`}>
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className={`h-6 w-6 ${currentTheme.text}`} />
                  )}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${currentTheme.text}`}>
                    {profile?.username || `User ${userId.slice(0, 8)}`}
                  </h3>
                  <p className={`text-sm ${currentTheme.muted}`}>
                    Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {profile?.bio && (
                <div className="mb-4">
                  <h4 className={`text-sm font-medium ${currentTheme.text} mb-2`}>Bio</h4>
                  <p className={`text-sm ${currentTheme.muted}`}>{profile.bio}</p>
                </div>
              )}
              
              {!isOwnProfile && (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSendFriendRequest}
                    className={`${currentTheme.primary} text-white flex items-center gap-2`}
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Friend
                  </Button>
                  <Button
                    variant="outline"
                    className={`${currentTheme.secondary} ${currentTheme.text} border ${currentTheme.border} flex items-center gap-2`}
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
