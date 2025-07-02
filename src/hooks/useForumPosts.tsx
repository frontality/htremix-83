
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ForumPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  code_snippet?: string;
  category: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  views_count: number;
}

interface CreatePostData {
  title: string;
  content: string;
  code_snippet?: string;
  category?: string;
}

export const useForumPosts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      console.log('Fetching forum posts...');
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load posts. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      console.log('Posts fetched successfully:', data);
      setPosts(data || []);
    } catch (error) {
      console.error('Error in fetchPosts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: CreatePostData): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to create a post.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      console.log('Creating new post:', postData);
      const { data, error } = await supabase
        .from('forum_posts')
        .insert([
          {
            user_id: user.id,
            title: postData.title,
            content: postData.content,
            code_snippet: postData.code_snippet,
            category: postData.category || 'general',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        toast({
          title: 'Error',
          description: 'Failed to create post. Please try again.',
          variant: 'destructive',
        });
        return false;
      }

      console.log('Post created successfully:', data);
      toast({
        title: 'Success! 🎉',
        description: 'Your post has been created successfully!',
      });

      // Refresh posts
      await fetchPosts();
      return true;
    } catch (error) {
      console.error('Error in createPost:', error);
      return false;
    }
  };

  const likePost = async (postId: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to like posts.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('forum_post_likes')
        .insert([{ post_id: postId, user_id: user.id }]);

      if (error) {
        console.error('Error liking post:', error);
        return false;
      }

      // Update local likes count
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes_count: post.likes_count + 1 }
            : post
        )
      );

      return true;
    } catch (error) {
      console.error('Error in likePost:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    createPost,
    likePost,
    refetch: fetchPosts,
  };
};
