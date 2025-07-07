
import { useState } from "react";
import { Phone, Video, MoreVertical, Shield, UserPlus, Flag, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

interface ChatHeaderProps {
  otherParticipant: any;
  onUserClick: (participant: any) => void;
}

const ChatHeader = ({ otherParticipant, onUserClick }: ChatHeaderProps) => {
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  const [isOnline] = useState(false); // Realistic offline status
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  const handleVoiceCall = () => {
    if (isCallActive) {
      setIsCallActive(false);
      toast({
        title: "Call Ended",
        description: "Voice call ended.",
      });
    } else {
      setIsCallActive(true);
      toast({
        title: "Calling...",
        description: `Calling ${otherParticipant?.username || 'user'}...`,
      });
    }
  };

  const handleVideoCall = () => {
    if (isVideoCallActive) {
      setIsVideoCallActive(false);
      toast({
        title: "Video Call Ended",
        description: "Video call ended.",
      });
    } else {
      setIsVideoCallActive(true);
      toast({
        title: "Starting Video Call...",
        description: `Video calling ${otherParticipant?.username || 'user'}...`,
      });
    }
  };

  const handleAddFriend = () => {
    toast({
      title: "Friend Request Sent! 👋",
      description: `Friend request sent to ${otherParticipant?.username || 'user'}`,
    });
  };

  const handleArchiveChat = () => {
    toast({
      title: "Chat Archived 📁",
      description: "This conversation has been archived.",
    });
  };

  const handleDeleteChat = () => {
    toast({
      title: "Chat Deleted 🗑️",
      description: "This conversation has been deleted.",
      variant: "destructive",
    });
  };

  const handleReportUser = () => {
    toast({
      title: "User Reported 🚨",
      description: "Thank you for reporting. We'll review this user.",
      variant: "destructive",
    });
  };

  return (
    <div className={`p-4 border-b ${currentTheme.border} flex items-center justify-between ${currentTheme.cardBg} bg-gradient-to-r from-purple-500/5 to-pink-500/5 backdrop-blur-sm flex-shrink-0`}>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar 
            className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all duration-200 ring-2 ring-white/20"
            onClick={() => onUserClick(otherParticipant)}
          >
            <AvatarImage
              src={otherParticipant.avatar_url}
              alt={otherParticipant.username || "User"}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
              {otherParticipant.username?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
        </div>
        <div>
          <h3 
            className={`font-bold text-lg ${currentTheme.text} cursor-pointer hover:text-purple-400 transition-colors bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}
            onClick={() => onUserClick(otherParticipant)}
          >
            {otherParticipant.username || "Anonymous User"}
          </h3>
          <div className="flex items-center space-x-2 mt-0.5">
            <div className="flex items-center space-x-1">
              <div className={`w-1.5 h-1.5 rounded-full ${
                isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}></div>
              <p className={`text-sm ${currentTheme.muted} font-medium`}>
                {isOnline ? 'Online now' : 'Offline'}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className={`h-3 w-3 ${currentTheme.muted}`} />
              <p className={`text-xs ${currentTheme.muted}`}>
                Encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Voice Call Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleVoiceCall}
          className={`rounded-full w-10 h-10 p-0 transition-all duration-200 ${
            isCallActive 
              ? 'bg-green-500 text-white hover:bg-green-600 animate-pulse' 
              : `${currentTheme.secondary} hover:scale-110`
          }`}
          title={isCallActive ? "End Call" : "Voice Call"}
        >
          <Phone className={`h-4 w-4 ${isCallActive ? 'animate-bounce' : ''}`} />
        </Button>

        {/* Video Call Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleVideoCall}
          className={`rounded-full w-10 h-10 p-0 transition-all duration-200 ${
            isVideoCallActive 
              ? 'bg-blue-500 text-white hover:bg-blue-600 animate-pulse' 
              : `${currentTheme.secondary} hover:scale-110`
          }`}
          title={isVideoCallActive ? "End Video Call" : "Video Call"}
        >
          <Video className={`h-4 w-4 ${isVideoCallActive ? 'animate-bounce' : ''}`} />
        </Button>

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full w-10 h-10 p-0 ${currentTheme.secondary} hover:scale-110 transition-all duration-200`}
              title="More Actions"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className={`${currentTheme.cardBg} ${currentTheme.text} border ${currentTheme.border} shadow-xl backdrop-blur-sm bg-opacity-95`}
          >
            <DropdownMenuItem 
              onClick={handleAddFriend} 
              className="cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Friend
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className={currentTheme.border} />
            
            <DropdownMenuItem 
              onClick={handleArchiveChat} 
              className="cursor-pointer hover:bg-blue-500/10 focus:bg-blue-500/10"
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive Chat
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleDeleteChat} 
              className="cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Chat
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className={currentTheme.border} />
            
            <DropdownMenuItem 
              onClick={handleReportUser} 
              className="cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 text-red-400"
            >
              <Flag className="h-4 w-4 mr-2" />
              Report User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
