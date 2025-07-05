
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
      <div className={`min-h-screen pt-12 ${currentTheme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <MessageCircle className={`h-12 w-12 ${currentTheme.accent} mx-auto mb-4 animate-pulse`} />
          <p className={`${currentTheme.text} text-lg font-medium`}>Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen pt-12 ${currentTheme.bg} flex overflow-hidden`}>
      {/* Messages List - Fixed width sidebar */}
      <div className={`${currentTheme.cardBg} border-r ${currentTheme.border} flex-shrink-0 w-80 shadow-xl h-full`}>
        <MessagesList
          conversations={conversations}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          onSelectUser={handleSelectUser}
        />
      </div>

      {/* Chat Window - Takes remaining space */}
      <div className="flex-1 min-w-0 h-full">
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
