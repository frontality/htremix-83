
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
    <div className={`w-1/3 border-r ${currentTheme.border} flex flex-col`}>
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Button
            onClick={() => setShowUserSearch(!showUserSearch)}
            className={`${currentTheme.primary} text-white flex items-center gap-2`}
            size="sm"
          >
            <Plus className="h-4 w-4" />
            New Chat
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
            className={`pl-10 ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-lg`}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className={`h-12 w-12 ${currentTheme.muted} mx-auto mb-4`} />
              <p className={`${currentTheme.text} font-medium mb-2`}>No conversations yet</p>
              <p className={`${currentTheme.muted} text-sm`}>Start a new chat to get started</p>
            </div>
          ) : (
            conversations.map((conversation) => {
              const participant = getOtherParticipant(conversation);
              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectChat(conversation.id)}
                  className={`w-full p-4 rounded-lg mb-3 text-left transition-all ${
                    selectedChat === conversation.id 
                      ? `${currentTheme.secondary} ring-2 ring-blue-400` 
                      : `hover:${currentTheme.secondary} ${currentTheme.text}`
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={participant?.avatar_url}
                        alt={participant?.username || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                        {participant?.username?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-base">
                        {participant?.username || "Anonymous User"}
                      </p>
                      <p className="text-sm opacity-70 truncate">
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
