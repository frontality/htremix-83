
import { useState, useEffect } from "react";
import { MessageCircle, Search, Send, User, Phone, Video, Plus, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import UserSearch from "@/components/UserSearch";
import { useTheme } from "@/contexts/ThemeContext";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";

const Messages = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectUser = async (userId: string) => {
    const existingConversation = conversations.find(conv => 
      (conv.participant1_id === user?.id && conv.participant2_id === userId) ||
      (conv.participant2_id === user?.id && conv.participant1_id === userId)
    );

    if (existingConversation) {
      handleSelectChat(existingConversation.id);
    } else {
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

  const selectedChatData = conversations.find(chat => chat.id === selectedChat);
  const otherParticipant = selectedChatData ? getOtherParticipant(selectedChatData) : null;

  if (loading) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <MessageCircle className={`h-12 w-12 ${currentTheme.accent} mx-auto mb-4 animate-pulse`} />
          <p className={`${currentTheme.text} text-lg`}>Loading your secure conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      
      <div className="container py-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className={`text-3xl font-bold ${currentTheme.text} mb-2 flex items-center justify-center gap-3`}>
            <MessageCircle className="h-8 w-8" />
            Secure Messages
          </h1>
          <p className={`${currentTheme.muted} flex items-center justify-center gap-2`}>
            <Shield className="h-4 w-4 text-green-500" />
            End-to-end encrypted conversations with complete anonymity
          </p>
        </div>

        <div className={`${currentTheme.cardBg} rounded-xl border ${currentTheme.border} overflow-hidden shadow-lg`} style={{ height: 'calc(100vh - 250px)' }}>
          <div className="flex h-full">
            {/* Chat List */}
            <div className={`w-1/3 border-r ${currentTheme.border} flex flex-col`}>
              <div className={`p-4 border-b ${currentTheme.border} bg-gradient-to-r from-purple-600/10 to-blue-600/10`}>
                <div className="flex items-center gap-2 mb-3">
                  <Button
                    onClick={() => setShowUserSearch(!showUserSearch)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    New Secure Chat
                  </Button>
                </div>
                
                {showUserSearch && (
                  <div className="mb-3">
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
                <div className="p-2">
                  {conversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageCircle className={`h-12 w-12 ${currentTheme.muted} mx-auto mb-4`} />
                      <p className={`${currentTheme.text} font-medium mb-2`}>No conversations yet</p>
                      <p className={`${currentTheme.muted} text-sm`}>Start a new secure chat to get started</p>
                    </div>
                  ) : (
                    conversations.map((conversation) => {
                      const participant = getOtherParticipant(conversation);
                      const isAnonymous = participant?.anonymous_mode;
                      return (
                        <button
                          key={conversation.id}
                          onClick={() => handleSelectChat(conversation.id)}
                          className={`w-full p-3 rounded-lg mb-2 text-left transition-all ${
                            selectedChat === conversation.id 
                              ? `${currentTheme.secondary} ring-2 ring-purple-400` 
                              : `hover:${currentTheme.secondary} ${currentTheme.text}`
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img
                                src={participant?.avatar_url || "/placeholder.svg"}
                                alt={participant?.username || "User"}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              {isAnonymous && (
                                <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-1">
                                  <User className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate flex items-center gap-2">
                                {participant?.username || "Anonymous User"}
                                {isAnonymous && (
                                  <Badge variant="secondary" className="text-xs">
                                    Anonymous
                                  </Badge>
                                )}
                              </p>
                              <p className="text-sm opacity-70 truncate flex items-center gap-1">
                                <Lock className="h-3 w-3 text-green-500" />
                                Encrypted chat
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
                  <div className={`p-4 border-b ${currentTheme.border} flex items-center justify-between bg-gradient-to-r from-purple-600/5 to-blue-600/5`}>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={otherParticipant.avatar_url || "/placeholder.svg"}
                          alt={otherParticipant.username || "User"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
                      </div>
                      <div>
                        <h3 className={`font-semibold ${currentTheme.text} flex items-center gap-2`}>
                          {otherParticipant.username || "Anonymous User"}
                          {otherParticipant.anonymous_mode && (
                            <Badge variant="secondary" className="text-xs">
                              Anonymous
                            </Badge>
                          )}
                        </h3>
                        <p className={`text-sm ${currentTheme.muted} flex items-center gap-1`}>
                          <Lock className="h-3 w-3 text-green-500" />
                          End-to-end encrypted
                        </p>
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
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center py-12">
                          <MessageCircle className={`h-12 w-12 ${currentTheme.muted} mx-auto mb-4`} />
                          <p className={`${currentTheme.text} font-medium mb-2`}>Start the conversation!</p>
                          <p className={`${currentTheme.muted} text-sm flex items-center justify-center gap-1`}>
                            <Lock className="h-3 w-3 text-green-500" />
                            All messages are encrypted
                          </p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                                message.sender_id === user?.id
                                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                                  : `${currentTheme.secondary} ${currentTheme.text}`
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs opacity-70">
                                  {new Date(message.created_at).toLocaleTimeString()}
                                </p>
                                {message.is_encrypted && (
                                  <Lock className="h-3 w-3 opacity-70" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className={`p-4 border-t ${currentTheme.border} bg-gradient-to-r from-purple-600/5 to-blue-600/5`}>
                    <div className="flex items-center space-x-3">
                      <Input
                        placeholder="Type a secure message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={`flex-1 ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-full px-4`}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full w-10 h-10"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className={`text-xs ${currentTheme.muted} mt-2 flex items-center gap-1`}>
                      <Shield className="h-3 w-3 text-green-500" />
                      Messages are encrypted and secure
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className={`h-16 w-16 ${currentTheme.muted} mx-auto mb-6`} />
                    <h3 className={`${currentTheme.text} text-xl font-semibold mb-2`}>
                      Select a conversation
                    </h3>
                    <p className={`${currentTheme.muted} flex items-center justify-center gap-1`}>
                      <Lock className="h-4 w-4 text-green-500" />
                      Choose a conversation to start secure messaging
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
