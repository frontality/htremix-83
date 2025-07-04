
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
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
      <div className={`min-h-screen ${currentTheme.bg}`}>
        <SkidHavenHeader />
        <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="text-center">
            <MessageCircle className={`h-12 w-12 ${currentTheme.accent} mx-auto mb-4 animate-pulse`} />
            <p className={`${currentTheme.text} text-lg`}>Loading your conversations...</p>
          </div>
        </div>
        <SkidHavenFooter />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} flex flex-col`}>
      <SkidHavenHeader />
      
      {/* Telegram-style layout - full height container */}
      <div className="flex-1 flex">
        <div className={`${currentTheme.cardBg} border-r ${currentTheme.border} flex h-full`} style={{ height: 'calc(100vh - 140px)' }}>
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

      <SkidHavenFooter />
    </div>
  );
};

export default Messages;
