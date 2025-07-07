
import { useState, useEffect } from "react";
import { User, MessageCircle, Calendar, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProfileViewerProps {
  userId: string;
  onClose: () => void;
  onStartChat?: (userId: string) => void;
}

interface PublicProfile {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

const ProfileViewer = ({ userId, onClose, onStartChat }: ProfileViewerProps) => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Get user data from localStorage instead of Supabase
      const allUsers = localStorage.getItem('registered_users');
      if (!allUsers) {
        console.log('No registered users found');
        setProfile(null);
        setLoading(false);
        return;
      }

      const userList = JSON.parse(allUsers);
      const foundUser = userList.find((u: any) => u.id === userId);

      if (!foundUser) {
        console.log('User not found:', userId);
        setProfile(null);
        setLoading(false);
        return;
      }

      // Create public profile (no email for privacy)
      const publicProfile: PublicProfile = {
        id: foundUser.id,
        username: foundUser.username || foundUser.email.split('@')[0],
        email: foundUser.email, // Keep for internal use but don't display
        created_at: foundUser.created_at || new Date().toISOString()
      };

      setProfile(publicProfile);
      console.log('Profile loaded:', publicProfile);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = () => {
    if (onStartChat) {
      onStartChat(userId);
      onClose();
    }
  };

  const getJoinDate = () => {
    if (!profile?.created_at) return "Recently";
    return new Date(profile.created_at).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDisplayName = () => {
    return profile?.username || 'Anonymous User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className={`${currentTheme.cardBg} rounded-xl p-8 max-w-md w-full mx-4`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className={`${currentTheme.text}`}>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className={`${currentTheme.cardBg} rounded-xl p-8 max-w-md w-full mx-4`}>
          <div className="text-center">
            <User className={`h-12 w-12 ${currentTheme.muted} mx-auto mb-4`} />
            <p className={`${currentTheme.text} mb-4`}>Profile not found</p>
            <Button onClick={onClose} variant="outline">Close</Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === userId;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${currentTheme.cardBg} rounded-xl p-6 max-w-md w-full border ${currentTheme.border} shadow-2xl`}>
        <div className="flex justify-between items-start mb-6">
          <h2 className={`text-xl font-bold ${currentTheme.text}`}>Profile</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full w-8 h-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center mb-6">
          <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-purple-500/20">
            <AvatarImage
              src="/placeholder.svg"
              alt={getDisplayName()}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          <h3 className={`text-xl font-bold ${currentTheme.text} mb-2`}>
            @{getDisplayName()}
          </h3>
          
          <div className="flex items-center justify-center space-x-2 text-xs">
            <Calendar className={`h-3 w-3 ${currentTheme.muted}`} />
            <span className={`${currentTheme.muted}`}>
              Member since {getJoinDate()}
            </span>
          </div>
        </div>

        {!isOwnProfile && (
          <div className="space-y-3">
            <Button
              onClick={handleStartChat}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Send Message
            </Button>
            
            <div className="flex items-center justify-center space-x-2 text-xs">
              <Shield className={`h-3 w-3 ${currentTheme.muted}`} />
              <span className={`${currentTheme.muted}`}>
                All personal information is kept private
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileViewer;
