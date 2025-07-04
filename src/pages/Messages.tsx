
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
    console.log('Clicking user:', participant);
    console.log('Current user:', user?.id);
    if (participant?.id && participant.id !== user?.id) {
      console.log('Navigating to profile:', participant.id);
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
      </div>

      <SkidHavenFooter />
    </div>
  );
};

export default Messages;
