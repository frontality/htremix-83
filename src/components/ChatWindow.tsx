
import { MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHeader from "@/components/ChatHeader";
import MessageBubble from "@/components/MessageBubble";
import MessageInput from "@/components/MessageInput";
import { useTheme } from "@/contexts/ThemeContext";

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

  if (!selectedChatData || !otherParticipant) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className={`h-20 w-20 ${currentTheme.muted} mx-auto mb-6`} />
          <h3 className={`${currentTheme.text} text-2xl font-semibold mb-2`}>
            Select a conversation
          </h3>
          <p className={`${currentTheme.muted} text-lg`}>
            Choose a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader 
        otherParticipant={otherParticipant}
        onUserClick={onUserClick}
      />

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6 max-w-full">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <MessageCircle className={`h-20 w-20 ${currentTheme.muted} mx-auto mb-6`} />
              <p className={`${currentTheme.text} font-medium mb-2 text-2xl`}>Start the conversation!</p>
              <p className={`${currentTheme.muted} text-lg`}>Send a message to break the ice</p>
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
