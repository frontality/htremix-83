
import { useState } from "react";
import { Search, MessageCircle, Plus, Users } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");

  const getOtherParticipant = (conversation: any) => {
    if (!user) return null;
    return conversation.participant1_id === user.id 
      ? conversation.participant2 
      : conversation.participant1;
  };

  const filteredConversations = conversations.filter(conversation => {
    const participant = getOtherParticipant(conversation);
    return participant?.username?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-80 flex flex-col h-full backdrop-blur-sm">
      {/* Enhanced Header */}
      <div className={`p-6 border-b ${currentTheme.border} bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${currentTheme.primary} bg-gradient-to-br from-purple-500 to-pink-500`}>
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${currentTheme.text} bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>
                Messages
              </h2>
              <p className={`text-sm ${currentTheme.muted}`}>
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowUserSearch(!showUserSearch)}
            size="sm"
            className={`${currentTheme.primary} text-white rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600`}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        {showUserSearch && (
          <div className="mb-4 animate-fade-in">
            <UserSearch 
              onSelectUser={onSelectUser}
              onClose={() => setShowUserSearch(false)}
            />
          </div>
        )}
        
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.muted}`} />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-12 pr-4 ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-2xl h-12 text-base backdrop-blur-sm shadow-inner`}
          />
        </div>
      </div>
      
      {/* Enhanced Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {filteredConversations.length === 0 ? (
            <div className="p-12 text-center">
              <div className={`mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center`}>
                {searchTerm ? (
                  <Search className={`h-10 w-10 ${currentTheme.muted}`} />
                ) : (
                  <Users className={`h-10 w-10 ${currentTheme.muted}`} />
                )}
              </div>
              <p className={`${currentTheme.text} font-semibold mb-3 text-lg`}>
                {searchTerm ? 'No matches found' : 'No conversations yet'}
              </p>
              <p className={`${currentTheme.muted} text-sm leading-relaxed`}>
                {searchTerm 
                  ? `No conversations match "${searchTerm}"`
                  : 'Start a new chat to connect with someone'
                }
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const participant = getOtherParticipant(conversation);
              const isSelected = selectedChat === conversation.id;
              
              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectChat(conversation.id)}
                  className={`w-full p-4 rounded-2xl mb-2 text-left transition-all duration-200 hover:scale-[1.02] group ${
                    isSelected 
                      ? `bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg` 
                      : `${currentTheme.text} hover:${currentTheme.secondary} hover:shadow-md`
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-14 w-14 flex-shrink-0 ring-2 ring-white/20">
                        <AvatarImage
                          src={participant?.avatar_url}
                          alt={participant?.username || "User"}
                        />
                        <AvatarFallback className={`bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg font-semibold ${isSelected ? 'bg-white text-purple-500' : ''}`}>
                          {participant?.username?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isSelected ? 'bg-green-400' : 'bg-green-500'}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate text-base ${isSelected ? 'text-white' : currentTheme.text}`}>
                        {participant?.username || "Anonymous User"}
                      </p>
                      <p className={`text-sm truncate mt-1 ${isSelected ? 'text-white/80' : currentTheme.muted}`}>
                        Tap to start chatting
                      </p>
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-white/60' : currentTheme.muted}`}>
                      Online
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
