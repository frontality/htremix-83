
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
  
  // Check if message is an image
  const isImageMessage = message.content.startsWith('[IMAGE:') && message.content.endsWith(']');
  const imageData = isImageMessage ? message.content.slice(7, -1) : null;

  // Get display name without showing email
  const getDisplayName = (participant: any) => {
    if (!participant) return 'User';
    return participant.username || 'Anonymous User';
  };

  const getSenderInitials = (participant: any) => {
    if (!participant) return 'U';
    const name = participant.username || 'User';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}>
      <div className="flex items-end space-x-3 max-w-[75%] animate-fade-in">
        {!isOwnMessage && (
          <Avatar className="h-10 w-10 mb-2 flex-shrink-0 ring-2 ring-white/10 group-hover:ring-white/20 transition-all">
            <AvatarImage
              src={otherParticipant?.avatar_url}
              alt={getDisplayName(otherParticipant)}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-semibold">
              {getSenderInitials(otherParticipant)}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex flex-col min-w-0">
          <div
            className={`rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:shadow-xl ${
              isOwnMessage
                ? `bg-gradient-to-r from-purple-500 to-pink-500 text-white ml-auto rounded-br-md shadow-purple-500/25 ${isImageMessage ? 'p-2' : 'px-5 py-3'}`
                : `${currentTheme.secondary} ${currentTheme.text} rounded-bl-md border border-white/10 ${isImageMessage ? 'p-2' : 'px-5 py-3'}`
            }`}
          >
            {isImageMessage ? (
              <div className="max-w-xs">
                <img
                  src={imageData}
                  alt="Shared image"
                  className="rounded-xl max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(imageData, '_blank')}
                  onError={(e) => {
                    console.log('Image load error');
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <p className="text-base leading-relaxed break-words whitespace-pre-wrap font-medium">
                {message.content}
              </p>
            )}
          </div>
          <p className={`text-xs mt-2 opacity-70 ${isOwnMessage ? 'text-right' : 'text-left'} ${currentTheme.muted} font-medium`}>
            {new Date(message.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </p>
        </div>

        {isOwnMessage && (
          <Avatar className="h-10 w-10 mb-2 flex-shrink-0 ring-2 ring-white/10 group-hover:ring-white/20 transition-all">
            <AvatarImage
              src={user?.user_metadata?.avatar_url}
              alt="You"
            />
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-sm font-semibold">
              {getSenderInitials({ username: user?.user_metadata?.username || 'You' })}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
