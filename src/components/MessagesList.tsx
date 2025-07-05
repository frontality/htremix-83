
import { useState, useEffect } from "react";
import { Search, MessageCircle, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import UserSearch from "@/components/UserSearch";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [userPresence, setUserPresence] = useState<Record<string, boolean>>({});

  const getOtherParticipant = (conversation: any) => {
    if (!user) return null;
    return conversation.participant1_id === user.id 
      ? conversation.participant2 
      : conversation.participant1;
  };

  // Track user presence using Supabase realtime
  useEffect(() => {
    if (!conversations.length) return;

    const participantIds = conversations.map(conv => {
      const participant = getOtherParticipant(conv);
      return participant?.id;
    }).filter(Boolean);

    if (participantIds.length === 0) return;

    // Create a presence channel to track online users
    const presenceChannel = supabase.channel('user-presence');

    // Subscribe to presence changes
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const onlineUsers: Record<string, boolean> = {};
        
        // Mark all tracked users as offline initially
        participantIds.forEach(id => {
          onlineUsers[id] = false;
        });

        // Update status for users who are present
        Object.keys(state).forEach(userId => {
          if (participantIds.includes(userId)) {
            onlineUsers[userId] = true;
          }
        });

        setUserPresence(onlineUsers);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        if (participantIds.includes(key)) {
          setUserPresence(prev => ({ ...prev, [key]: true }));
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (participantIds.includes(key)) {
          setUserPresence(prev => ({ ...prev, [key]: false }));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [conversations, user]);

  const filteredConversations = conversations.filter(conversation => {
    const participant = getOtherParticipant(conversation);
    return participant?.username?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="h-screen flex flex-col">
      {/* Compact Header */}
      <div className={`p-4 border-b ${currentTheme.border} bg-gradient-to-r from-purple-500/5 to-pink-500/5 backdrop-blur-sm flex-shrink-0`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg ${currentTheme.primary} bg-gradient-to-br from-purple-500 to-pink-500`}>
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${currentTheme.text} bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>
                Messages
              </h2>
              <p className={`text-xs ${currentTheme.muted}`}>
                {conversations.length} chat{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowUserSearch(!showUserSearch)}
            size="sm"
            className={`${currentTheme.primary} text-white rounded-full w-8 h-8 p-0 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {showUserSearch && (
          <div className="mb-3 animate-fade-in">
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-xl h-10 text-sm backdrop-blur-sm shadow-inner`}
          />
        </div>
      </div>
      
      {/* Conversations List - Scrollable */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className={`mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center`}>
                {searchTerm ? (
                  <Search className={`h-8 w-8 ${currentTheme.muted}`} />
                ) : (
                  <Users className={`h-8 w-8 ${currentTheme.muted}`} />
                )}
              </div>
              <p className={`${currentTheme.text} font-semibold mb-2`}>
                {searchTerm ? 'No matches' : 'No conversations'}
              </p>
              <p className={`${currentTheme.muted} text-sm`}>
                {searchTerm 
                  ? `No conversations match "${searchTerm}"`
                  : 'Start a new chat to connect'
                }
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const participant = getOtherParticipant(conversation);
              const isSelected = selectedChat === conversation.id;
              const isOnline = userPresence[participant?.id] || false;
              
              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectChat(conversation.id)}
                  className={`w-full p-3 rounded-xl mb-1 text-left transition-all duration-200 hover:scale-[1.01] group ${
                    isSelected 
                      ? `bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md` 
                      : `${currentTheme.text} hover:${currentTheme.secondary} hover:shadow-sm`
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10 ring-2 ring-white/20">
                        <AvatarImage
                          src={participant?.avatar_url}
                          alt={participant?.username || "User"}
                        />
                        <AvatarFallback className={`bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-semibold ${isSelected ? 'bg-white text-purple-500' : ''}`}>
                          {participant?.username?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${isSelected ? 'text-white' : currentTheme.text}`}>
                        {participant?.username || "Anonymous User"}
                      </p>
                      <p className={`text-sm truncate ${isSelected ? 'text-white/80' : currentTheme.muted}`}>
                        {isOnline ? 'Online' : 'Offline'} • Click to chat
                      </p>
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-white/60' : currentTheme.muted}`}>
                      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
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
