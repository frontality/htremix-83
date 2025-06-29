import { useState } from "react";
import { MessageCircle, Search, Send, User, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import { useTheme } from "@/contexts/ThemeContext";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const Messages = () => {
  const { currentTheme } = useTheme();
  const [selectedChat, setSelectedChat] = useState<string | null>("1");
  const [messageInput, setMessageInput] = useState("");

  const [chats] = useState<Chat[]>([
    {
      id: "1",
      name: "CryptoMaster",
      avatar: "/placeholder.svg",
      lastMessage: "Hey, interested in that BTC exchange?",
      timestamp: "2m ago",
      unread: 2
    },
    {
      id: "2",
      name: "GiftCardPro",
      avatar: "/placeholder.svg",
      lastMessage: "Thanks for the quick transaction!",
      timestamp: "1h ago",
      unread: 0
    },
    {
      id: "3",
      name: "TradingExpert",
      avatar: "/placeholder.svg",
      lastMessage: "Let me check the rates...",
      timestamp: "3h ago",
      unread: 1
    }
  ]);

  const [messages] = useState<Message[]>([
    {
      id: "1",
      sender: "CryptoMaster",
      content: "Hey there! I saw you're interested in crypto exchanges.",
      timestamp: "10:30 AM",
      isOwn: false
    },
    {
      id: "2",
      sender: "You",
      content: "Yes! I'm looking to exchange some BTC for ETH. What are your rates?",
      timestamp: "10:32 AM",
      isOwn: true
    },
    {
      id: "3",
      sender: "CryptoMaster",
      content: "Current rate is 1 BTC = 15.5 ETH. Very competitive!",
      timestamp: "10:33 AM",
      isOwn: false
    },
    {
      id: "4",
      sender: "You",
      content: "That sounds good. How do we proceed?",
      timestamp: "10:35 AM",
      isOwn: true
    },
    {
      id: "5",
      sender: "CryptoMaster",
      content: "Hey, interested in that BTC exchange?",
      timestamp: "10:40 AM",
      isOwn: false
    }
  ]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Logic to send message would go here
      setMessageInput("");
    }
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <SkidHavenHeader />
      
      <div className="container py-4">
        <div className={`${currentTheme.cardBg} rounded-xl border ${currentTheme.border} overflow-hidden`} style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Chat List */}
            <div className={`w-1/3 border-r ${currentTheme.border} flex flex-col`}>
              <div className="p-4 border-b border-gray-700">
                <h2 className={`text-xl font-bold ${currentTheme.text} mb-4`}>Messages</h2>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${currentTheme.muted}`} />
                  <Input
                    placeholder="Search conversations..."
                    className={`pl-10 ${currentTheme.secondary} ${currentTheme.text} border-0`}
                  />
                </div>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`w-full p-3 rounded-lg mb-2 text-left transition-colors ${
                        selectedChat === chat.id 
                          ? `${currentTheme.secondary} ${currentTheme.accent}` 
                          : `hover:${currentTheme.secondary} ${currentTheme.text}`
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{chat.name}</p>
                            <span className="text-xs opacity-70">{chat.timestamp}</span>
                          </div>
                          <p className="text-sm opacity-70 truncate">{chat.lastMessage}</p>
                        </div>
                        {chat.unread > 0 && (
                          <span className={`${currentTheme.primary} text-white text-xs px-2 py-1 rounded-full`}>
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
              {selectedChatData ? (
                <>
                  {/* Chat Header */}
                  <div className={`p-4 border-b ${currentTheme.border} flex items-center justify-between`}>
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedChatData.avatar}
                        alt={selectedChatData.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className={`font-semibold ${currentTheme.text}`}>{selectedChatData.name}</h3>
                        <p className={`text-sm ${currentTheme.muted}`}>Online</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary}`}>
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className={`${currentTheme.text} hover:${currentTheme.secondary}`}>
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.isOwn
                                ? `${currentTheme.primary} text-white`
                                : `${currentTheme.secondary} ${currentTheme.text}`
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 opacity-70`}>{message.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className={`p-4 border-t ${currentTheme.border}`}>
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className={`flex-1 ${currentTheme.secondary} ${currentTheme.text} border-0`}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        className={`${currentTheme.primary} text-white`}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className={`h-16 w-16 ${currentTheme.muted} mx-auto mb-4`} />
                    <p className={`${currentTheme.muted} text-lg`}>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SkidHavenFooter />
    </div>
  );
};

export default Messages;
