
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, ThumbsUp, ThumbsDown, Reply, Eye, Clock, User, UserPlus, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  content: string;
  code?: string;
  category: string;
  replies: number;
  views: number;
  likes: number;
  dislikes?: number;
  createdAt: string;
  isPinned: boolean;
  likedBy?: string[];
  dislikedBy?: string[];
}

interface Comment {
  id: string;
  postId: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy?: string[];
}

const ForumPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();

  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!postId) return;

    // Load post from localStorage
    const savedPosts = localStorage.getItem('forum_posts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      const foundPost = posts.find((p: ForumPost) => p.id === postId);
      if (foundPost) {
        setPost(foundPost);
      }
    }

    // Load comments from localStorage
    const savedComments = localStorage.getItem('forum_comments');
    if (savedComments) {
      const allComments = JSON.parse(savedComments);
      const postComments = allComments.filter((c: Comment) => c.postId === postId);
      setComments(postComments);
    }
  }, [postId]);

  const handleLike = () => {
    if (!user || !post) return;

    const savedPosts = localStorage.getItem('forum_posts');
    if (!savedPosts) return;

    const posts = JSON.parse(savedPosts);
    const updatedPosts = posts.map((p: ForumPost) => {
      if (p.id === post.id) {
        const likedBy = p.likedBy || [];
        const dislikedBy = p.dislikedBy || [];
        
        if (likedBy.includes(user.id)) {
          // Remove like
          return {
            ...p,
            likes: p.likes - 1,
            likedBy: likedBy.filter(id => id !== user.id)
          };
        } else {
          // Add like and remove dislike if exists
          return {
            ...p,
            likes: p.likes + 1,
            dislikes: dislikedBy.includes(user.id) ? (p.dislikes || 0) - 1 : (p.dislikes || 0),
            likedBy: [...likedBy, user.id],
            dislikedBy: dislikedBy.filter(id => id !== user.id)
          };
        }
      }
      return p;
    });

    localStorage.setItem('forum_posts', JSON.stringify(updatedPosts));
    const updatedPost = updatedPosts.find((p: ForumPost) => p.id === post.id);
    setPost(updatedPost);
  };

  const handleDislike = () => {
    if (!user || !post) return;

    const savedPosts = localStorage.getItem('forum_posts');
    if (!savedPosts) return;

    const posts = JSON.parse(savedPosts);
    const updatedPosts = posts.map((p: ForumPost) => {
      if (p.id === post.id) {
        const likedBy = p.likedBy || [];
        const dislikedBy = p.dislikedBy || [];
        
        if (dislikedBy.includes(user.id)) {
          // Remove dislike
          return {
            ...p,
            dislikes: (p.dislikes || 0) - 1,
            dislikedBy: dislikedBy.filter(id => id !== user.id)
          };
        } else {
          // Add dislike and remove like if exists
          return {
            ...p,
            likes: likedBy.includes(user.id) ? p.likes - 1 : p.likes,
            dislikes: (p.dislikes || 0) + 1,
            likedBy: likedBy.filter(id => id !== user.id),
            dislikedBy: [...dislikedBy, user.id]
          };
        }
      }
      return p;
    });

    localStorage.setItem('forum_posts', JSON.stringify(updatedPosts));
    const updatedPost = updatedPosts.find((p: ForumPost) => p.id === post.id);
    setPost(updatedPost);
  };

  const handleAddComment = () => {
    if (!user || !post || !newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      postId: post.id,
      author: user.email?.split('@')[0] || 'Anonymous',
      authorId: user.id,
      content: newComment,
      createdAt: new Date().toLocaleDateString(),
      likes: 0,
      likedBy: []
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);

    // Save comments to localStorage
    const savedComments = localStorage.getItem('forum_comments');
    const allComments = savedComments ? JSON.parse(savedComments) : [];
    allComments.push(comment);
    localStorage.setItem('forum_comments', JSON.stringify(allComments));

    // Update post reply count
    const savedPosts = localStorage.getItem('forum_posts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      const updatedPosts = posts.map((p: ForumPost) => 
        p.id === post.id ? { ...p, replies: p.replies + 1 } : p
      );
      localStorage.setItem('forum_posts', JSON.stringify(updatedPosts));
      setPost({ ...post, replies: post.replies + 1 });
    }

    setNewComment('');
    toast({
      title: "Comment Added! 💬",
      description: "Your comment has been posted successfully."
    });
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile?user=${userId}`);
  };

  const handleSendFriendRequest = (userId: string, username: string) => {
    if (!user) return;
    
    toast({
      title: "Friend Request Sent! 👋",
      description: `Friend request sent to ${username}`
    });
  };

  if (!post) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <Button onClick={() => navigate('/forum')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text}`}>
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/forum')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forum
        </Button>

        {/* Post Content */}
        <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-6 mb-6`}>
          <div className="flex items-start space-x-4 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={post.authorAvatar} />
              <AvatarFallback>{post.author[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">{post.author}</h3>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewProfile(post.authorId)}
                  >
                    <User className="w-4 h-4 mr-1" />
                    Profile
                  </Button>
                  {user && user.id !== post.authorId && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendFriendRequest(post.authorId, post.author)}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Add Friend
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.createdAt}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views} views</span>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          
          <div className="prose prose-invert max-w-none mb-4">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Code Section */}
          {post.code && (
            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-2">
                <Code className="w-4 h-4 text-green-400" />
                <h3 className="text-lg font-semibold text-green-400">Code</h3>
              </div>
              <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4 bg-gray-900/50`}>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-green-300">{post.code}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Vote Buttons */}
          {user && (
            <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={post.likedBy?.includes(user.id) ? 'bg-green-600' : ''}
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                {post.likes}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDislike}
                className={post.dislikedBy?.includes(user.id) ? 'bg-red-600' : ''}
              >
                <ThumbsDown className="w-4 h-4 mr-1" />
                {post.dislikes || 0}
              </Button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-6`}>
          <h2 className="text-xl font-semibold mb-4">
            Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          {user && (
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className={`w-full p-3 rounded ${currentTheme.cardBg} border ${currentTheme.border} h-24`}
              />
              <Button 
                onClick={handleAddComment}
                className="mt-2"
                disabled={!newComment.trim()}
              >
                <Reply className="w-4 h-4 mr-2" />
                Post Comment
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`border-l-2 border-purple-500 pl-4 py-2`}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{comment.author[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-xs text-gray-400">{comment.createdAt}</span>
                        {user && user.id !== comment.authorId && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSendFriendRequest(comment.authorId, comment.author)}
                            className="text-xs"
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        )}
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {!user && (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Please log in to comment</p>
              <Button onClick={() => navigate('/login')}>Login</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPost;
