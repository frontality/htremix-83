
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
  const isOwnMessage = message.sender_id === user?.id;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-end space-x-3 max-w-[75%]">
        {!isOwnMessage && (
          <Avatar className="h-10 w-10 mb-2 flex-shrink-0">
            <AvatarImage
              src={otherParticipant?.avatar_url}
              alt={otherParticipant?.username || "User"}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm">
              {otherParticipant?.username?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex flex-col min-w-0">
          <div
            className={`px-4 py-3 rounded-2xl ${
              isOwnMessage
                ? `${currentTheme.primary} text-white ml-auto rounded-br-md`
                : `${currentTheme.secondary} ${currentTheme.text} rounded-bl-md`
            }`}
          >
            <p className="text-base leading-relaxed break-words whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <p className={`text-xs mt-1 opacity-70 ${isOwnMessage ? 'text-right' : 'text-left'} ${currentTheme.muted}`}>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {isOwnMessage && (
          <Avatar className="h-10 w-10 mb-2 flex-shrink-0">
            <AvatarImage
              src={user?.user_metadata?.avatar_url}
              alt="You"
            />
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-sm">
              {user?.user_metadata?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "Y"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
