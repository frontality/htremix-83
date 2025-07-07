
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import MessagesList from "@/components/MessagesList";
import ChatWindow from "@/components/ChatWindow";
import ProfileViewer from "@/components/ProfileViewer";
import { useTheme } from "@/contexts/ThemeContext";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";

const Messages = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { conversations, messages, loading, fetchMessages, sendMessage, createConversation } = useMessages();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);

  // Handle user parameter from URL
  useEffect(() => {
    const userId = searchParams.get('user');
    const conversationId = searchParams.get('conversation');
    
    if (userId && user) {
      // Find existing conversation or create new one
      handleSelectUser(userId);
    } else if (conversationId) {
      setSelectedChat(conversationId);
      fetchMessages(conversationId);
    }
  }, [searchParams, conversations, user]);

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

  const handleSendImage = async (imageData: string) => {
    if (selectedChat) {
      const success = await sendMessage(selectedChat, `[IMAGE:${imageData}]`);
      if (success) {
        console.log('Image sent successfully');
      }
    }
  };

  const handleSendVideo = async (videoData: string) => {
    if (selectedChat) {
      const success = await sendMessage(selectedChat, `[VIDEO:${videoData}]`);
      if (success) {
        console.log('Video sent successfully');
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
      setViewingProfile(participant.id);
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
    <>
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
            onSendImage={handleSendImage}
            onSendVideo={handleSendVideo}
            onUserClick={handleUserClick}
          />
        </div>
      </div>

      {/* Profile Viewer Modal */}
      {viewingProfile && (
        <ProfileViewer
          userId={viewingProfile}
          onClose={() => setViewingProfile(null)}
          onStartChat={handleSelectUser}
        />
      )}
    </>
  );
};

export default Messages;
