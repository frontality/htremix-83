
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    username: string;
    avatar_url: string;
  };
}

interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  created_at: string;
  participant1?: {
    username: string;
    avatar_url: string;
  };
  participant2?: {
    username: string;
    avatar_url: string;
  };
}

export const useMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const getStorageKey = (key: string) => `messages_${key}`;

  const fetchConversations = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching conversations for user:', user.id);
      const storageKey = getStorageKey('conversations');
      const saved = localStorage.getItem(storageKey);
      
      if (saved) {
        const allConversations = JSON.parse(saved);
        const userConversations = allConversations.filter((conv: Conversation) => 
          conv.participant1_id === user.id || conv.participant2_id === user.id
        );
        console.log('Conversations found:', userConversations);
        setConversations(userConversations);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error('Error in fetchConversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      console.log('Fetching messages for conversation:', conversationId);
      const storageKey = getStorageKey(`messages_${conversationId}`);
      const saved = localStorage.getItem(storageKey);
      
      if (saved) {
        const conversationMessages = JSON.parse(saved);
        console.log('Messages found:', conversationMessages);
        setMessages(conversationMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    if (!user || !content.trim()) return false;

    try {
      console.log('Sending message:', { conversationId, content });
      
      const newMessage: Message = {
        id: Date.now().toString(),
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
        created_at: new Date().toISOString(),
        sender: {
          username: user.email?.split('@')[0] || 'User',
          avatar_url: ''
        }
      };

      const storageKey = getStorageKey(`messages_${conversationId}`);
      const existing = localStorage.getItem(storageKey);
      const existingMessages = existing ? JSON.parse(existing) : [];
      const updatedMessages = [...existingMessages, newMessage];
      
      localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
      
      console.log('Message sent successfully');
      await fetchMessages(conversationId);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Message didn't send. Try again?",
        variant: "destructive",
      });
      return false;
    }
  };

  const createConversation = async (participantId: string) => {
    if (!user) return null;

    try {
      console.log('Creating conversation with participant:', participantId);
      
      // Check if conversation already exists
      const existingConv = conversations.find(conv => 
        (conv.participant1_id === user.id && conv.participant2_id === participantId) ||
        (conv.participant1_id === participantId && conv.participant2_id === user.id)
      );

      if (existingConv?.id) {
        console.log('Existing conversation found:', existingConv.id);
        return existingConv.id;
      }

      const newConversation: Conversation = {
        id: Date.now().toString(),
        participant1_id: user.id,
        participant2_id: participantId,
        created_at: new Date().toISOString(),
        participant1: {
          username: user.email?.split('@')[0] || 'User',
          avatar_url: ''
        },
        participant2: {
          username: 'Other User',
          avatar_url: ''
        }
      };

      const storageKey = getStorageKey('conversations');
      const existing = localStorage.getItem(storageKey);
      const existingConversations = existing ? JSON.parse(existing) : [];
      const updatedConversations = [...existingConversations, newConversation];
      
      localStorage.setItem(storageKey, JSON.stringify(updatedConversations));

      console.log('Conversation created:', newConversation);
      await fetchConversations();
      return newConversation.id;
    } catch (error) {
      console.error('Error in createConversation:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  return {
    conversations,
    messages,
    loading,
    fetchMessages,
    sendMessage,
    createConversation,
    refetch: fetchConversations
  };
};
