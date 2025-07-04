
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
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  return (
    <div className={`p-6 border-t ${currentTheme.border}`}>
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`flex-1 ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-full px-6 py-3`}
        />
        <Button 
          onClick={onSendMessage}
          disabled={!messageInput.trim()}
          className={`${currentTheme.primary} text-white rounded-full w-12 h-12`}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
