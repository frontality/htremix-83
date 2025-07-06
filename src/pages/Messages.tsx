
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

const Messages = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadConversations();
  }, [user, navigate]);

  const loadConversations = () => {
    try {
      const savedConversations = localStorage.getItem('user_conversations');
      if (savedConversations) {
        setConversations(JSON.parse(savedConversations));
      } else {
        // Create sample conversations
        const sampleConversations: Conversation[] = [
          {
            id: 'conv1',
            participantId: 'user1',
            participantName: 'TradingPro',
            participantAvatar: '/placeholder.svg',
            lastMessage: 'Hey, interested in that Hot Topic card!',
            lastMessageTime: '2m ago',
            unreadCount: 2,
            isOnline: true,
            messages: [
              {
                id: 'msg1',
                senderId: 'user1',
                senderName: 'TradingPro',
                content: 'Hi! I saw your Hot Topic gift card listing',
                timestamp: '10:30 AM',
                isRead: true
              },
              {
                id: 'msg2',
                senderId: 'user1',
                senderName: 'TradingPro',
                content: 'Hey, interested in that Hot Topic card!',
                timestamp: '10:32 AM',
                isRead: false
              }
            ]
          },
          {
            id: 'conv2',
            participantId: 'user2',
            participantName: 'CryptoKing',
            participantAvatar: '/placeholder.svg',
            lastMessage: 'Payment sent successfully',
            lastMessageTime: '1h ago',
            unreadCount: 0,
            isOnline: false,
            messages: [
              {
                id: 'msg3',
                senderId: 'user2',
                senderName: 'CryptoKing',
                content: 'Payment sent successfully',
                timestamp: '9:15 AM',
                isRead: true
              }
            ]
          }
        ];
        localStorage.setItem('user_conversations', JSON.stringify(sampleConversations));
        setConversations(sampleConversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || 'current-user',
      senderName: user?.email?.split('@')[0] || 'You',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: message.content,
          lastMessageTime: 'now'
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    localStorage.setItem('user_conversations', JSON.stringify(updatedConversations));
    setNewMessage('');

    toast({
      title: "Message sent! 📨",
      description: "Your message has been delivered."
    });
  };

  const markAsRead = (conversationId: string) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, isRead: true }))
        };
      }
      return conv;
    });
    setConversations(updatedConversations);
    localStorage.setItem('user_conversations', JSON.stringify(updatedConversations));
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  if (!user) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} pt-20 flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to access messages</h2>
          <Button onClick={() => navigate('/login')} className="bg-purple-600 hover:bg-purple-700">
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} pt-20`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Conversations List */}
          <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg overflow-hidden`}>
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 ${currentTheme.cardBg} border-gray-600 focus:border-purple-500`}
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start trading to connect with others!</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversation(conv.id);
                      markAsRead(conv.id);
                    }}
                    className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-colors ${
                      selectedConversation === conv.id ? 'bg-purple-900/20 border-purple-500/50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={conv.participantAvatar}
                          alt={conv.participantName}
                          className="w-12 h-12 rounded-full border-2 border-gray-600"
                        />
                        {conv.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate">{conv.participantName}</h3>
                          <span className="text-xs text-gray-400">{conv.lastMessageTime}</span>
                        </div>
                        <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`lg:col-span-2 ${currentTheme.cardBg} border ${currentTheme.border} rounded-lg overflow-hidden flex flex-col`}>
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={selectedConv.participantAvatar}
                        alt={selectedConv.participantName}
                        className="w-10 h-10 rounded-full border-2 border-gray-600"
                      />
                      {selectedConv.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConv.participantName}</h3>
                      <p className="text-xs text-gray-400">
                        {selectedConv.isOnline ? 'Online' : 'Last seen recently'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConv.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user?.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-100'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === user?.id ? 'text-purple-200' : 'text-gray-400'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 flex items-center space-x-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className={`${currentTheme.cardBg} border-gray-600 focus:border-purple-500`}
                      />
                      <Button variant="ghost" size="sm">
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p>Choose a conversation from the left to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
