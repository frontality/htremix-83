
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

interface MessageBubbleProps {
  message: any;
  otherParticipant: any;
}

const MessageBubble = ({ message, otherParticipant }: MessageBubbleProps) => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div
      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
    >
      <div className="flex items-end space-x-3 max-w-[70%]">
        {message.sender_id !== user?.id && (
          <Avatar className="h-8 w-8 mb-1 flex-shrink-0">
            <AvatarImage
              src={otherParticipant?.avatar_url}
              alt={otherParticipant?.username || "User"}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
              {otherParticipant?.username?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={`px-4 py-3 rounded-2xl min-w-0 ${
            message.sender_id === user?.id
              ? `${currentTheme.primary} text-white ml-auto`
              : `${currentTheme.secondary} ${currentTheme.text}`
          }`}
        >
          <p className="text-base leading-relaxed break-words">{message.content}</p>
          <p className="text-xs mt-2 opacity-70">
            {new Date(message.created_at).toLocaleTimeString()}
          </p>
        </div>
        {message.sender_id === user?.id && (
          <Avatar className="h-8 w-8 mb-1 flex-shrink-0">
            <AvatarImage
              src={user?.user_metadata?.avatar_url}
              alt="You"
            />
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-xs">
              {user?.user_metadata?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "Y"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
