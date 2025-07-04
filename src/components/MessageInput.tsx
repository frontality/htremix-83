
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";

interface MessageInputProps {
  messageInput: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

const MessageInput = ({ messageInput, onMessageChange, onSendMessage }: MessageInputProps) => {
  const { currentTheme } = useTheme();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className={`p-4 border-t ${currentTheme.border}`}>
      <div className="flex items-end space-x-3">
        <Input
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`flex-1 ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-3xl px-4 py-3 min-h-[48px] resize-none`}
          style={{ minHeight: '48px' }}
        />
        <Button 
          onClick={onSendMessage}
          disabled={!messageInput.trim()}
          className={`${currentTheme.primary} text-white rounded-full w-12 h-12 p-0 flex-shrink-0`}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
