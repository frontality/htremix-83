
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
      <div className={`h-screen ${currentTheme.bg} flex items-center justify-center relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-red-500/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="text-center relative z-10">
          <MessageCircle className={`h-16 w-16 ${currentTheme.accent} mx-auto mb-6 animate-pulse`} />
          <p className={`${currentTheme.text} text-xl font-medium`}>Loading your conversations...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className={`w-2 h-2 ${currentTheme.primary} rounded-full animate-bounce`}></div>
            <div className={`w-2 h-2 ${currentTheme.primary} rounded-full animate-bounce`} style={{animationDelay: '0.1s'}}></div>
            <div className={`w-2 h-2 ${currentTheme.primary} rounded-full animate-bounce`} style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen ${currentTheme.bg} flex overflow-hidden relative`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-red-500/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className={`${currentTheme.cardBg} border-r ${currentTheme.border} flex h-full relative z-10 shadow-2xl backdrop-blur-sm`}>
        <MessagesList
          conversations={conversations}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          onSelectUser={handleSelectUser}
        />

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
  );
};

export default Messages;
