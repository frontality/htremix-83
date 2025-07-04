
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import MessagesList from "@/components/MessagesList";
import ChatWindow from "@/components/ChatWindow";
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

  const handleUserClick = (participant: any) => {
    if (participant?.id && participant.id !== user?.id) {
      navigate(`/profile?userId=${participant.id}`);
    }
  };

  const selectedChatData = conversations.find(chat => chat.id === selectedChat);
  const otherParticipant = selectedChatData ? getOtherParticipant(selectedChatData) : null;

  if (loading) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center relative overflow-hidden`}>
        {/* Subtle Background Animation */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="text-center relative z-10">
          <MessageCircle className={`h-12 w-12 ${currentTheme.accent} mx-auto mb-4 animate-pulse`} />
          <p className={`${currentTheme.text} text-lg font-medium`}>Loading conversations...</p>
          <div className="mt-3 flex justify-center space-x-1">
            <div className={`w-2 h-2 ${currentTheme.primary} rounded-full animate-bounce`}></div>
            <div className={`w-2 h-2 ${currentTheme.primary} rounded-full animate-bounce`} style={{animationDelay: '0.1s'}}></div>
            <div className={`w-2 h-2 ${currentTheme.primary} rounded-full animate-bounce`} style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} relative overflow-hidden`}>
      {/* Subtle Background Animation */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Container - Full Viewport */}
      <div className="relative z-10 h-screen flex">
        {/* Messages List - Responsive Width */}
        <div className={`${currentTheme.cardBg} border-r ${currentTheme.border} flex-shrink-0 w-full sm:w-80 md:w-96 lg:w-80 xl:w-96 shadow-xl backdrop-blur-sm`}>
          <MessagesList
            conversations={conversations}
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}
            onSelectUser={handleSelectUser}
          />
        </div>

        {/* Chat Window - Takes Remaining Space */}
        <div className="flex-1 min-w-0">
          <ChatWindow
            selectedChatData={selectedChatData}
            otherParticipant={otherParticipant}
            messages={messages}
            messageInput={messageInput}
            onMessageChange={setMessageInput}
            onSendMessage={handleSendMessage}
            onUserClick={handleUserClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Messages;
