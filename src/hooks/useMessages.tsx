import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const fetchConversations = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching conversations for user:', user.id);
      
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant1:profiles!participant1_id(username, avatar_url),
          participant2:profiles!participant2_id(username, avatar_url)
        `)
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        setConversations([]);
      } else {
        console.log('Conversations found:', data);
        setConversations(data || []);
      }
    } catch (error) {
      console.error('Error in fetchConversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      console.log('Fetching messages for conversation:', conversationId);
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(username, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } else {
        console.log('Messages found:', data);
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      setMessages([]);
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    if (!user || !content.trim()) {
      console.log('No user or empty content');
      return false;
    }

    try {
      console.log('Sending message:', { conversationId, content, userId: user.id });
      
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim()
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
        return false;
      }

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
  };

  const createConversation = async (participantId: string) => {
    if (!user) {
      console.log('No user for creating conversation');
      return null;
    }

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

      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participant1_id: user.id,
          participant2_id: participantId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        toast({
          title: "Error",
          description: "Failed to create conversation. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      console.log('New conversation created:', data);
      await fetchConversations();
      
      toast({
        title: "Conversation started! 🎉",
        description: "You can now start chatting",
      });
      
      return data.id;
    } catch (error) {
      console.error('Error in createConversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation. Please try again.",
        variant: "destructive",
      });
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
