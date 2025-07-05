
import { useState, useRef, useEffect } from "react";
import { Send, Image, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

interface MessageInputProps {
  messageInput: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onSendImage?: (imageData: string) => void;
}

const MessageInput = ({ 
  messageInput, 
  onMessageChange, 
  onSendMessage,
  onSendImage 
}: MessageInputProps) => {
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [messageInput]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (messageInput.trim()) {
        onSendMessage();
      }
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          await handleImageFile(file);
        }
      }
    }
  };

  const handleImageFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        if (onSendImage) {
          onSendImage(base64String);
          toast({
            title: "Image sent! 📸",
            description: "Your image has been sent",
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        await handleImageFile(file);
      }
    }
  };

  return (
    <div className={`p-4 border-t ${currentTheme.border} ${currentTheme.cardBg} backdrop-blur-sm flex-shrink-0`}>
      <div 
        className={`relative rounded-xl border-2 transition-all duration-200 ${
          isDragging 
            ? 'border-purple-500 border-dashed bg-purple-500/10' 
            : `border-transparent ${currentTheme.secondary}`
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-purple-500/20 z-10">
            <div className="text-center">
              <Image className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-purple-500 font-medium">Drop image to send</p>
            </div>
          </div>
        )}
        
        <div className="flex items-end space-x-3 p-3">
          <div className="flex-1 min-w-0">
            <Textarea
              ref={textareaRef}
              value={messageInput}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyPress={handleKeyPress}
              onPaste={handlePaste}
              placeholder="Type a message... (Paste or drop images to share)"
              className={`resize-none border-0 focus:ring-0 focus:outline-none ${currentTheme.text} bg-transparent placeholder:text-gray-400 min-h-[40px] max-h-[120px]`}
              rows={1}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className={`${currentTheme.text} hover:${currentTheme.secondary} rounded-full w-10 h-10 p-0 transition-all duration-200 hover:scale-110`}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={onSendMessage}
              disabled={!messageInput.trim()}
              size="sm"
              className={`rounded-full w-10 h-10 p-0 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0`}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <p className={`text-xs ${currentTheme.muted} mt-2 text-center`}>
        Press Enter to send • Shift+Enter for new line • Paste or drag images to share
      </p>
    </div>
  );
};

export default MessageInput;
