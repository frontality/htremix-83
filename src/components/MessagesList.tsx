
import { useState } from "react";
import { Search, MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import UserSearch from "@/components/UserSearch";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

interface MessagesListProps {
  conversations: any[];
  selectedChat: string | null;
  onSelectChat: (conversationId: string) => void;
  onSelectUser: (userId: string) => void;
}

const MessagesList = ({ conversations, selectedChat, onSelectChat, onSelectUser }: MessagesListProps) => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const [showUserSearch, setShowUserSearch] = useState(false);

  const getOtherParticipant = (conversation: any) => {
    if (!user) return null;
    return conversation.participant1_id === user.id 
      ? conversation.participant2 
      : conversation.participant1;
  };

  return (
    <div className="w-80 flex flex-col h-full">
      {/* Header */}
      <div className={`p-4 border-b ${currentTheme.border}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-semibold ${currentTheme.text}`}>Messages</h2>
          <Button
            onClick={() => setShowUserSearch(!showUserSearch)}
            size="sm"
            className={`${currentTheme.primary} text-white rounded-full w-10 h-10 p-0`}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        {showUserSearch && (
          <div className="mb-4">
            <UserSearch 
              onSelectUser={onSelectUser}
              onClose={() => setShowUserSearch(false)}
            />
          </div>
        )}
        
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${currentTheme.muted}`} />
          <Input
            placeholder="Search conversations..."
            className={`pl-10 ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-lg h-10`}
          />
        </div>
      </div>
      
      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className={`h-12 w-12 ${currentTheme.muted} mx-auto mb-4`} />
              <p className={`${currentTheme.text} font-medium mb-2`}>No conversations yet</p>
              <p className={`${currentTheme.muted} text-sm`}>Start a new chat to get started</p>
            </div>
          ) : (
            conversations.map((conversation) => {
              const participant = getOtherParticipant(conversation);
              const isSelected = selectedChat === conversation.id;
              
              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectChat(conversation.id)}
                  className={`w-full p-3 rounded-lg mb-1 text-left transition-all hover:${currentTheme.secondary} ${
                    isSelected 
                      ? `${currentTheme.primary} text-white` 
                      : `${currentTheme.text}`
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage
                        src={participant?.avatar_url}
                        alt={participant?.username || "User"}
                      />
                      <AvatarFallback className={`bg-gradient-to-br from-purple-500 to-blue-500 text-white ${isSelected ? 'bg-white text-primary' : ''}`}>
                        {participant?.username?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isSelected ? 'text-white' : currentTheme.text}`}>
                        {participant?.username || "Anonymous User"}
                      </p>
                      <p className={`text-sm truncate ${isSelected ? 'text-white/80' : currentTheme.muted}`}>
                        Click to start chatting
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessagesList;
