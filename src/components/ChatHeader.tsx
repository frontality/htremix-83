
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
    <div className={`p-6 border-b ${currentTheme.border} flex items-center justify-between ${currentTheme.cardBg} bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm`}>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar 
            className="h-14 w-14 cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all duration-200 ring-2 ring-white/20"
            onClick={() => onUserClick(otherParticipant)}
          >
            <AvatarImage
              src={otherParticipant.avatar_url}
              alt={otherParticipant.username || "User"}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg font-semibold">
              {otherParticipant.username?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h3 
            className={`font-bold ${currentTheme.text} cursor-pointer hover:text-purple-400 transition-colors text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}
            onClick={() => onUserClick(otherParticipant)}
          >
            {otherParticipant.username || "Anonymous User"}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary} rounded-full w-12 h-12 p-0 transition-all duration-200 hover:scale-110 hover:bg-purple-500/20`}>
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary} rounded-full w-12 h-12 p-0 transition-all duration-200 hover:scale-110 hover:bg-purple-500/20`}>
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary} rounded-full w-12 h-12 p-0 transition-all duration-200 hover:scale-110 hover:bg-purple-500/20`}>
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
