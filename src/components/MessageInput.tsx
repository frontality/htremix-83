
import { Send, Paperclip, Smile } from "lucide-react";
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
    <div className={`p-4 border-t ${currentTheme.border} bg-gradient-to-r from-purple-500/5 to-pink-500/5 backdrop-blur-sm flex-shrink-0`}>
      <div className="flex items-end space-x-3">
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${currentTheme.text} hover:${currentTheme.secondary} rounded-full w-8 h-8 p-0 transition-all duration-200 hover:scale-110`}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${currentTheme.text} hover:${currentTheme.secondary} rounded-full w-8 h-8 p-0 transition-all duration-200 hover:scale-110`}
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>
        
        <Input
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`flex-1 ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-2xl px-4 py-2.5 h-10 text-sm shadow-inner backdrop-blur-sm border border-white/10 focus:ring-2 focus:ring-purple-500/50 transition-all duration-200`}
        />
        
        <Button 
          onClick={onSendMessage}
          disabled={!messageInput.trim()}
          className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full w-10 h-10 p-0 flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
