
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
  onUserClick: (participant: any) => void;
}

const ChatWindow = ({
  selectedChatData,
  otherParticipant,
  messages,
  messageInput,
  onMessageChange,
  onSendMessage,
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
      <div className="flex-1 flex items-center justify-center relative">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="text-center relative z-10 max-w-md mx-auto p-8">
          <div className={`mx-auto mb-8 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center`}>
            <MessageCircle className={`h-12 w-12 ${currentTheme.muted}`} />
          </div>
          <h3 className={`${currentTheme.text} text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>
            Select a conversation
          </h3>
          <p className={`${currentTheme.muted} text-lg leading-relaxed`}>
            Choose a conversation from the left to start messaging, or create a new one
          </p>
          <div className="mt-8 flex items-center justify-center space-x-2">
            <Sparkles className={`h-5 w-5 ${currentTheme.accent} animate-pulse`} />
            <span className={`${currentTheme.muted} text-sm`}>Your messages are end-to-end encrypted</span>
            <Sparkles className={`h-5 w-5 ${currentTheme.accent} animate-pulse`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full backdrop-blur-sm">
      <ChatHeader 
        otherParticipant={otherParticipant}
        onUserClick={onUserClick}
      />

      <ScrollArea className="flex-1 p-6 relative">
        {/* Chat background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20"></div>
        </div>
        
        <div className="space-y-6 max-w-full relative z-10">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className={`mx-auto mb-8 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center`}>
                <MessageCircle className={`h-10 w-10 ${currentTheme.muted}`} />
              </div>
              <p className={`${currentTheme.text} font-semibold mb-3 text-2xl`}>Start the conversation!</p>
              <p className={`${currentTheme.muted} text-lg`}>Send a message to break the ice with {otherParticipant.username}</p>
              <div className="mt-6 flex items-center justify-center space-x-2">
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
      />
    </div>
  );
};

export default ChatWindow;
