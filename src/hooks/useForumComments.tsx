
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ForumComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface CreateCommentData {
  post_id: string;
  content: string;
}

export const useForumComments = (postId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      console.log('Fetching comments for post:', postId);
      const { data, error } = await supabase
        .from('forum_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }

      console.log('Comments fetched successfully:', data);
      setComments(data || []);
    } catch (error) {
      console.error('Error in fetchComments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (commentData: CreateCommentData): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to comment.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      console.log('Creating new comment:', commentData);
      const { data, error } = await supabase
        .from('forum_comments')
        .insert([
          {
            post_id: commentData.post_id,
            user_id: user.id,
            content: commentData.content,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating comment:', error);
        toast({
          title: 'Error',
          description: 'Failed to create comment. Please try again.',
          variant: 'destructive',
        });
        return false;
      }

      console.log('Comment created successfully:', data);
      toast({
        title: 'Comment Added! 💬',
        description: 'Your comment has been added successfully!',
      });

      // Refresh comments
      await fetchComments();
      return true;
    } catch (error) {
      console.error('Error in createComment:', error);
      return false;
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return {
    comments,
    loading,
    createComment,
    refetch: fetchComments,
  };
};
