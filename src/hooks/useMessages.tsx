
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
  last_message?: string;
  unread_count?: number;
}

export const useMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant1:profiles!conversations_participant1_id_fkey(username, avatar_url),
          participant2:profiles!conversations_participant2_id_fkey(username, avatar_url)
        `)
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      setConversations(data || []);
    } catch (error) {
      console.error('Error in fetchConversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(username, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    if (!user || !content.trim()) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
        }]);

      if (error) {
        toast({
          title: "Oops! 😅",
          description: "Message didn't send. Try again?",
          variant: "destructive",
        });
        return false;
      }

      // Refresh messages
      await fetchMessages(conversationId);
      toast({
        title: "Message sent! 📨",
        description: "Your message is on its way!",
      });
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  const createConversation = async (participantId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([{
          participant1_id: user.id,
          participant2_id: participantId,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return null;
      }

      await fetchConversations();
      return data.id;
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
