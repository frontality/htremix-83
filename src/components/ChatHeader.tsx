
import { Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/contexts/ThemeContext";

interface ChatHeaderProps {
  otherParticipant: any;
  onUserClick: (participant: any) => void;
}

const ChatHeader = ({ otherParticipant, onUserClick }: ChatHeaderProps) => {
  const { currentTheme } = useTheme();

  return (
    <div className={`p-4 border-b ${currentTheme.border} flex items-center justify-between ${currentTheme.cardBg}`}>
      <div className="flex items-center space-x-3">
        <Avatar 
          className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
          onClick={() => onUserClick(otherParticipant)}
        >
          <AvatarImage
            src={otherParticipant.avatar_url}
            alt={otherParticipant.username || "User"}
          />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
            {otherParticipant.username?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 
            className={`font-semibold ${currentTheme.text} cursor-pointer hover:text-blue-400 transition-colors text-lg`}
            onClick={() => onUserClick(otherParticipant)}
          >
            {otherParticipant.username || "Anonymous User"}
          </h3>
          <p className={`text-sm ${currentTheme.muted}`}>
            Online
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary} rounded-full w-10 h-10 p-0`}>
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary} rounded-full w-10 h-10 p-0`}>
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary} rounded-full w-10 h-10 p-0`}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
