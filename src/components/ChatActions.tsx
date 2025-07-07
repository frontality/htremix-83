
import { useState } from "react";
import { Phone, Video, MoreVertical, UserPlus, Flag, Archive, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

interface ChatActionsProps {
  otherParticipant: any;
  onStartCall?: () => void;
  onStartVideoCall?: () => void;
  onAddFriend?: () => void;
  onArchiveChat?: () => void;
  onDeleteChat?: () => void;
  onReportUser?: () => void;
}

const ChatActions = ({ 
  otherParticipant, 
  onStartCall, 
  onStartVideoCall, 
  onAddFriend, 
  onArchiveChat, 
  onDeleteChat, 
  onReportUser 
}: ChatActionsProps) => {
  const { currentTheme } = useTheme();
  const { toast } = useToast();
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
      // Simulate call duration
      setTimeout(() => {
        if (isCallActive) {
          setIsCallActive(false);
          toast({
            title: "Call Ended",
            description: "Voice call ended automatically.",
          });
        }
      }, 30000);
    }
    onStartCall?.();
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
      // Simulate call duration
      setTimeout(() => {
        if (isVideoCallActive) {
          setIsVideoCallActive(false);
          toast({
            title: "Video Call Ended",
            description: "Video call ended automatically.",
          });
        }
      }, 30000);
    }
    onStartVideoCall?.();
  };

  const handleAddFriend = () => {
    toast({
      title: "Friend Request Sent! 👋",
      description: `Friend request sent to ${otherParticipant?.username || 'user'}`,
    });
    onAddFriend?.();
  };

  const handleArchiveChat = () => {
    toast({
      title: "Chat Archived 📁",
      description: "This conversation has been archived.",
    });
    onArchiveChat?.();
  };

  const handleDeleteChat = () => {
    toast({
      title: "Chat Deleted 🗑️",
      description: "This conversation has been deleted.",
      variant: "destructive",
    });
    onDeleteChat?.();
  };

  const handleReportUser = () => {
    toast({
      title: "User Reported 🚨",
      description: "Thank you for reporting. We'll review this user.",
      variant: "destructive",
    });
    onReportUser?.();
  };

  return (
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
          className={`${currentTheme.cardBg} ${currentTheme.text} border ${currentTheme.border} shadow-xl backdrop-blur-sm`}
        >
          <DropdownMenuItem onClick={handleAddFriend} className="cursor-pointer hover:bg-purple-500/10">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Friend
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className={currentTheme.border} />
          
          <DropdownMenuItem onClick={handleArchiveChat} className="cursor-pointer hover:bg-blue-500/10">
            <Archive className="h-4 w-4 mr-2" />
            Archive Chat
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleDeleteChat} className="cursor-pointer hover:bg-red-500/10 text-red-400">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Chat
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className={currentTheme.border} />
          
          <DropdownMenuItem onClick={handleReportUser} className="cursor-pointer hover:bg-red-500/10 text-red-400">
            <Flag className="h-4 w-4 mr-2" />
            Report User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatActions;
