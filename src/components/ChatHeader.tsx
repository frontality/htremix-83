
import { Phone, Video, MoreVertical, Shield } from "lucide-react";
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
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h3 
            className={`font-bold ${currentTheme.text} cursor-pointer hover:text-purple-400 transition-colors bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}
            onClick={() => onUserClick(otherParticipant)}
          >
            {otherParticipant.username || "Anonymous User"}
          </h3>
          <div className="flex items-center space-x-2 mt-0.5">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <p className={`text-sm ${currentTheme.muted} font-medium`}>
                Online now
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
      
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary} rounded-full w-9 h-9 p-0 transition-all duration-200 hover:scale-110 hover:bg-purple-500/20`}>
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary} rounded-full w-9 h-9 p-0 transition-all duration-200 hover:scale-110 hover:bg-purple-500/20`}>
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary} rounded-full w-9 h-9 p-0 transition-all duration-200 hover:scale-110 hover:bg-purple-500/20`}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
