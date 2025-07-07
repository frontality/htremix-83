
import { useState, useEffect, useCallback } from 'react';
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

  const getUserList = useCallback(() => {
    try {
      const allUsers = localStorage.getItem('registered_users');
      return allUsers ? JSON.parse(allUsers) : [];
    } catch (error) {
      console.error('Error parsing user list:', error);
      return [];
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching conversations for user:', user.id);
      
      const savedConversations = localStorage.getItem('conversations');
      const conversationsData = savedConversations ? JSON.parse(savedConversations) : [];
      
      const userConversations = conversationsData.filter((conv: any) => 
        conv.participant1_id === user.id || conv.participant2_id === user.id
      );

      if (userConversations.length === 0) {
        console.log('No conversations found');
        setConversations([]);
        setLoading(false);
        return;
      }

      const userList = getUserList();
      
      const conversationsWithProfiles = userConversations.map((conv: any) => {
        const participant1 = userList.find((u: any) => u.id === conv.participant1_id);
        const participant2 = userList.find((u: any) => u.id === conv.participant2_id);
        
        return {
          ...conv,
          participant1: participant1 ? {
            username: participant1.username || participant1.email.split('@')[0],
            avatar_url: null
          } : { username: 'Unknown User', avatar_url: null },
          participant2: participant2 ? {
            username: participant2.username || participant2.email.split('@')[0],
            avatar_url: null
          } : { username: 'Unknown User', avatar_url: null }
        };
      });

      console.log('Conversations with profiles:', conversationsWithProfiles);
      setConversations(conversationsWithProfiles);
    } catch (error) {
      console.error('Error in fetchConversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [user, getUserList]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      console.log('Fetching messages for conversation:', conversationId);
      
      const savedMessages = localStorage.getItem('messages');
      const messagesData = savedMessages ? JSON.parse(savedMessages) : [];
      
      const conversationMessages = messagesData.filter((msg: any) => 
        msg.conversation_id === conversationId
      );

      if (conversationMessages.length === 0) {
        console.log('No messages found');
        setMessages([]);
        return;
      }

      const userList = getUserList();
      
      const messagesWithSenders = conversationMessages.map((msg: any) => {
        const sender = userList.find((u: any) => u.id === msg.sender_id);
        
        return {
          ...msg,
          sender: sender ? {
            username: sender.username || sender.email.split('@')[0],
            avatar_url: null
          } : { username: 'Unknown User', avatar_url: null }
        };
      });

      console.log('Messages with senders:', messagesWithSenders);
      setMessages(messagesWithSenders);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      setMessages([]);
    }
  }, [getUserList]);

  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    if (!user || !content.trim()) {
      console.log('No user or empty content');
      return false;
    }

    try {
      console.log('Sending message:', { conversationId, content, userId: user.id });
      
      const savedMessages = localStorage.getItem('messages');
      const messagesData = savedMessages ? JSON.parse(savedMessages) : [];
      
      const newMessage = {
        id: Date.now().toString(),
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
        created_at: new Date().toISOString()
      };
      
      messagesData.push(newMessage);
      localStorage.setItem('messages', JSON.stringify(messagesData));

      console.log('Message sent successfully');
      await fetchMessages(conversationId);
      
      toast({
        title: "Message sent! 💬",
        description: "Your message has been delivered",
      });
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, fetchMessages, toast]);

  const createConversation = useCallback(async (participantId: string) => {
    if (!user) {
      console.log('No user for creating conversation');
      return null;
    }

    try {
      console.log('Creating conversation with participant:', participantId);
      
      const existingConv = conversations.find(conv => 
        (conv.participant1_id === user.id && conv.participant2_id === participantId) ||
        (conv.participant1_id === participantId && conv.participant2_id === user.id)
      );

      if (existingConv?.id) {
        console.log('Existing conversation found:', existingConv.id);
        return existingConv.id;
      }

      const savedConversations = localStorage.getItem('conversations');
      const conversationsData = savedConversations ? JSON.parse(savedConversations) : [];
      
      const newConversation = {
        id: Date.now().toString(),
        participant1_id: user.id,
        participant2_id: participantId,
        created_at: new Date().toISOString()
      };
      
      conversationsData.push(newConversation);
      localStorage.setItem('conversations', JSON.stringify(conversationsData));

      console.log('New conversation created:', newConversation);
      await fetchConversations();
      
      toast({
        title: "Conversation started! 🎉",
        description: "You can now start chatting",
      });
      
      return newConversation.id;
    } catch (error) {
      console.error('Error in createConversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [user, conversations, fetchConversations, toast]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

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
