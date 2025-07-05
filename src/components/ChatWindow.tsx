
import { MessageCircle, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHeader from "@/components/ChatHeader";
import MessageBubble from "@/components/MessageBubble";
import MessageInput from "@/components/MessageInput";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useRef } from "react";

interface ChatWindowProps {
  selectedChatData: any;
  otherParticipant: any;
  messages: any[];
  messageInput: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onSendImage?: (imageData: string) => void;
  onUserClick: (participant: any) => void;
}

const ChatWindow = ({
  selectedChatData,
  otherParticipant,
  messages,
  messageInput,
  onMessageChange,
  onSendMessage,
  onSendImage,
  onUserClick
}: ChatWindowProps) => {
  const { currentTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!selectedChatData || !otherParticipant) {
    return (
      <div className="h-full flex items-center justify-center relative">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="text-center relative z-10 max-w-md mx-auto p-6">
          <div className={`mx-auto mb-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center`}>
            <MessageCircle className={`h-8 w-8 ${currentTheme.muted}`} />
          </div>
          <h3 className={`${currentTheme.text} text-xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>
            Select a conversation
          </h3>
          <p className={`${currentTheme.muted} leading-relaxed`}>
            Choose a conversation from the left to start messaging
          </p>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <Sparkles className={`h-4 w-4 ${currentTheme.accent} animate-pulse`} />
            <span className={`${currentTheme.muted} text-sm`}>End-to-end encrypted</span>
            <Sparkles className={`h-4 w-4 ${currentTheme.accent} animate-pulse`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ChatHeader 
        otherParticipant={otherParticipant}
        onUserClick={onUserClick}
      />

      <ScrollArea className="flex-1 p-4 relative">
        {/* Chat background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20"></div>
        </div>
        
        <div className="space-y-4 max-w-full relative z-10">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className={`mx-auto mb-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center`}>
                <MessageCircle className={`h-8 w-8 ${currentTheme.muted}`} />
              </div>
              <p className={`${currentTheme.text} font-semibold mb-2 text-lg`}>Start the conversation!</p>
              <p className={`${currentTheme.muted}`}>Send a message to {otherParticipant.username}</p>
              <div className="mt-4 flex items-center justify-center space-x-1">
                <div className={`w-2 h-2 ${currentTheme.primary} rounded-full animate-pulse`}></div>
                <div className={`w-2 h-2 ${currentTheme.primary} rounded-full animate-pulse`} style={{animationDelay: '0.5s'}}></div>
                <div className={`w-2 h-2 ${currentTheme.primary} rounded-full animate-pulse`} style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                otherParticipant={otherParticipant}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <MessageInput
        messageInput={messageInput}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onSendImage={onSendImage}
      />
    </div>
  );
};

export default ChatWindow;
