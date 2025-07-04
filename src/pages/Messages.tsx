
import { useState, useEffect } from "react";
import { MessageCircle, Search, Send, User, Phone, Video, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import UserSearch from "@/components/UserSearch";
import { useTheme } from "@/contexts/ThemeContext";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { conversations, messages, loading, fetchMessages, sendMessage, createConversation } = useMessages();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [showUserSearch, setShowUserSearch] = useState(false);

  const handleSelectChat = async (conversationId: string) => {
    setSelectedChat(conversationId);
    await fetchMessages(conversationId);
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() && selectedChat) {
      const success = await sendMessage(selectedChat, messageInput);
      if (success) {
        setMessageInput("");
      }
    }
  };

  const handleSelectUser = async (userId: string) => {
    // Check if conversation already exists
    const existingConversation = conversations.find(conv => 
      (conv.participant1_id === user?.id && conv.participant2_id === userId) ||
      (conv.participant2_id === user?.id && conv.participant1_id === userId)
    );

    if (existingConversation) {
      handleSelectChat(existingConversation.id);
    } else {
      // Create new conversation
      const conversationId = await createConversation(userId);
      if (conversationId) {
        handleSelectChat(conversationId);
      }
    }
  };

  const getOtherParticipant = (conversation: any) => {
    if (!user) return null;
    return conversation.participant1_id === user.id 
      ? conversation.participant2 
      : conversation.participant1;
  };

  const handleUserClick = (participant: any) => {
    if (participant?.id && participant.id !== user?.id) {
      navigate(`/profile?userId=${participant.id}`);
    }
  };

  const selectedChatData = conversations.find(chat => chat.id === selectedChat);
  const otherParticipant = selectedChatData ? getOtherParticipant(selectedChatData) : null;

  if (loading) {
    return (
      <div className={`min-h-screen ${currentTheme.bg}`}>
        <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="text-center">
            <MessageCircle className={`h-12 w-12 ${currentTheme.accent} mx-auto mb-4 animate-pulse`} />
            <p className={`${currentTheme.text} text-lg`}>Loading your conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      
      <div className="container py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${currentTheme.text} mb-2 flex items-center justify-center gap-3`}>
            <MessageCircle className="h-8 w-8" />
            Messages
          </h1>
          <p className={`${currentTheme.muted}`}>
            Connect with people around the world
          </p>
        </div>

        <div className={`${currentTheme.cardBg} rounded-xl border ${currentTheme.border} overflow-hidden shadow-lg`} style={{ height: 'calc(100vh - 280px)' }}>
          <div className="flex h-full">
            {/* Chat List */}
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
                      onSelectUser={handleSelectUser}
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
                          onClick={() => handleSelectChat(conversation.id)}
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

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
              {selectedChatData && otherParticipant ? (
                <>
                  {/* Chat Header */}
                  <div className={`p-6 border-b ${currentTheme.border} flex items-center justify-between`}>
                    <div className="flex items-center space-x-4">
                      <Avatar 
                        className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                        onClick={() => handleUserClick(otherParticipant)}
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
                          onClick={() => handleUserClick(otherParticipant)}
                        >
                          {otherParticipant.username || "Anonymous User"}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary}`}>
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary}`}>
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-8">
                      {messages.length === 0 ? (
                        <div className="text-center py-12">
                          <MessageCircle className={`h-12 w-12 ${currentTheme.muted} mx-auto mb-4`} />
                          <p className={`${currentTheme.text} font-medium mb-2`}>Start the conversation!</p>
                          <p className={`${currentTheme.muted} text-sm`}>Send a message to break the ice</p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className="flex items-end space-x-3 max-w-lg">
                              {message.sender_id !== user?.id && (
                                <Avatar className="h-10 w-10 mb-1">
                                  <AvatarImage
                                    src={otherParticipant?.avatar_url}
                                    alt={otherParticipant?.username || "User"}
                                  />
                                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm">
                                    {otherParticipant?.username?.charAt(0)?.toUpperCase() || "U"}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={`px-5 py-4 rounded-2xl ${
                                  message.sender_id === user?.id
                                    ? `${currentTheme.primary} text-white ml-auto`
                                    : `${currentTheme.secondary} ${currentTheme.text}`
                                }`}
                              >
                                <p className="text-base leading-relaxed">{message.content}</p>
                                <p className="text-xs mt-2 opacity-70">
                                  {new Date(message.created_at).toLocaleTimeString()}
                                </p>
                              </div>
                              {message.sender_id === user?.id && (
                                <Avatar className="h-10 w-10 mb-1">
                                  <AvatarImage
                                    src={user?.user_metadata?.avatar_url}
                                    alt="You"
                                  />
                                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-sm">
                                    {user?.email?.charAt(0)?.toUpperCase() || "Y"}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className={`p-6 border-t ${currentTheme.border}`}>
                    <div className="flex items-center space-x-4">
                      <Input
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className={`flex-1 ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-full px-6 py-3`}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className={`${currentTheme.primary} text-white rounded-full w-12 h-12`}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className={`h-16 w-16 ${currentTheme.muted} mx-auto mb-6`} />
                    <h3 className={`${currentTheme.text} text-xl font-semibold mb-2`}>
                      Select a conversation
                    </h3>
                    <p className={`${currentTheme.muted}`}>
                      Choose a conversation to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SkidHavenFooter />
    </div>
  );
};

export default Messages;
