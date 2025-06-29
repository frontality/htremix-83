
import { useState, useEffect } from "react";
import { MessageCircle, Search, Send, User, Phone, Video, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import { useTheme } from "@/contexts/ThemeContext";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";

const Messages = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { conversations, messages, loading, fetchMessages, sendMessage } = useMessages();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");

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
          <p className={`${currentTheme.text} text-lg`}>Loading your conversations... 💬</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      
      <div className="container py-4">
        {/* Playful header */}
        <div className="text-center mb-6">
          <h1 className={`text-3xl font-bold ${currentTheme.text} mb-2 flex items-center justify-center`}>
            <MessageCircle className="h-8 w-8 mr-3" />
            Messages Hub 💬
            <Heart className="h-6 w-6 ml-3 text-red-500" />
          </h1>
          <p className={`${currentTheme.muted} text-lg`}>
            Connect and chat with awesome people! ✨
          </p>
        </div>

        <div className={`${currentTheme.cardBg} rounded-xl border ${currentTheme.border} overflow-hidden shadow-lg`} style={{ height: 'calc(100vh - 250px)' }}>
          <div className="flex h-full">
            {/* Chat List */}
            <div className={`w-1/3 border-r ${currentTheme.border} flex flex-col`}>
              <div className="p-4 border-b border-gray-700">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${currentTheme.muted}`} />
                  <Input
                    placeholder="Search conversations... 🔍"
                    className={`pl-10 ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-lg`}
                  />
                </div>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {conversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <Sparkles className={`h-12 w-12 ${currentTheme.muted} mx-auto mb-4`} />
                      <p className={`${currentTheme.text} font-medium mb-2`}>No conversations yet! 🌟</p>
                      <p className={`${currentTheme.muted} text-sm`}>Start chatting to see them here</p>
                    </div>
                  ) : (
                    conversations.map((conversation) => {
                      const participant = getOtherParticipant(conversation);
                      return (
                        <button
                          key={conversation.id}
                          onClick={() => handleSelectChat(conversation.id)}
                          className={`w-full p-3 rounded-lg mb-2 text-left transition-all hover:scale-[1.02] ${
                            selectedChat === conversation.id 
                              ? `${currentTheme.secondary} ${currentTheme.accent} ring-2 ring-purple-400` 
                              : `hover:${currentTheme.secondary} ${currentTheme.text}`
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={participant?.avatar_url || "/placeholder.svg"}
                              alt={participant?.username || "User"}
                              className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium truncate flex items-center">
                                  {participant?.username || "Anonymous User"}
                                  <Heart className="h-3 w-3 ml-1 text-red-400" />
                                </p>
                                <span className="text-xs opacity-70">
                                  {new Date(conversation.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm opacity-70 truncate">
                                Click to start chatting! 💬
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
                  <div className={`p-4 border-b ${currentTheme.border} flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-pink-500/10`}>
                    <div className="flex items-center space-x-3">
                      <img
                        src={otherParticipant.avatar_url || "/placeholder.svg"}
                        alt={otherParticipant.username || "User"}
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-400"
                      />
                      <div>
                        <h3 className={`font-semibold ${currentTheme.text} flex items-center`}>
                          {otherParticipant.username || "Anonymous User"}
                          <Sparkles className="h-4 w-4 ml-2 text-yellow-400" />
                        </h3>
                        <p className={`text-sm ${currentTheme.muted}`}>Online & Ready to Chat! 🟢</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary} hover:scale-110 transition-transform`}>
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary} hover:scale-110 transition-transform`}>
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
                          <p className={`${currentTheme.text} font-medium mb-2`}>Start the conversation! 🎉</p>
                          <p className={`${currentTheme.muted} text-sm`}>Send a message to break the ice ❄️</p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl transition-all hover:scale-[1.02] ${
                                message.sender_id === user?.id
                                  ? `${currentTheme.primary} text-white shadow-lg`
                                  : `${currentTheme.secondary} ${currentTheme.text} border border-purple-200`
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <p className={`text-xs mt-2 opacity-70 flex items-center`}>
                                {new Date(message.created_at).toLocaleTimeString()}
                                <Heart className="h-3 w-3 ml-1" />
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className={`p-4 border-t ${currentTheme.border} bg-gradient-to-r from-purple-500/5 to-pink-500/5`}>
                    <div className="flex items-center space-x-3">
                      <Input
                        placeholder="Type something awesome... ✨"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className={`flex-1 ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-full px-6 py-3 focus:ring-2 focus:ring-purple-400`}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className={`${currentTheme.primary} text-white rounded-full w-12 h-12 hover:scale-110 transition-transform shadow-lg`}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-500/5 to-pink-500/5">
                  <div className="text-center">
                    <MessageCircle className={`h-16 w-16 ${currentTheme.muted} mx-auto mb-6 animate-pulse`} />
                    <h3 className={`${currentTheme.text} text-xl font-semibold mb-2`}>
                      Ready to Chat? 💬
                    </h3>
                    <p className={`${currentTheme.muted} text-lg mb-4`}>
                      Select a conversation to start messaging! ✨
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                      <span className={`${currentTheme.muted} text-sm`}>Your next great conversation awaits</span>
                      <Heart className="h-4 w-4 text-red-400" />
                    </div>
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
