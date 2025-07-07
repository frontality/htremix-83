
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { ArrowLeft, ThumbsUp, ThumbsDown, Reply, Eye, Clock, User, UserPlus, Code, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
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
  code?: string;
  createdAt: string;
  likes: number;
  likedBy?: string[];
}

const ForumPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();

  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newCommentCode, setNewCommentCode] = useState('');

  // Helper function to check if category is coding-related
  const isCodingCategory = (category: string) => {
    return ['source', 'codehelp', 'reverse'].includes(category);
  };

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

    // Use profile username or fallback to "Anonymous" - never use email
    const displayName = profile?.username || 'Anonymous';

    const comment: Comment = {
      id: Date.now().toString(),
      postId: post.id,
      author: displayName,
      authorId: user.id,
      content: newComment,
      code: newCommentCode || undefined,
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
    setNewCommentCode('');
    toast({
      title: "Reply Posted! 💬",
      description: "Your reply has been posted successfully."
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
      <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} flex items-center justify-center pt-16`}>
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
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} pt-16`}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back Button - Prominent and fixed position */}
        <div className="sticky top-16 z-10 bg-opacity-90 backdrop-blur-sm py-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/forum')}
            className={`${currentTheme.secondary} hover:${currentTheme.primary} transition-all duration-300 shadow-lg`}
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Forum
          </Button>
        </div>

        {/* Post Content */}
        <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-6 mb-6 shadow-lg`}>
          <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <Avatar className="w-12 h-12 flex-shrink-0">
              <AvatarImage src={post.authorAvatar} />
              <AvatarFallback>{post.author[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{post.author}</h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
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
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewProfile(post.authorId)}
                    className="text-xs"
                  >
                    <User className="w-3 h-3 mr-1" />
                    Profile
                  </Button>
                  {user && user.id !== post.authorId && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendFriendRequest(post.authorId, post.author)}
                      className="text-xs"
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      Add Friend
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-6 break-words">{post.title}</h1>
          
          <div className="prose prose-invert max-w-none mb-6">
            <p className="whitespace-pre-wrap text-base leading-relaxed">{post.content}</p>
          </div>

          {/* Media Section */}
          {post.media && post.media.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex space-x-1">
                  {post.media.some(m => m.type === 'image') && (
                    <Image className="w-5 h-5 text-blue-400" />
                  )}
                  {post.media.some(m => m.type === 'video') && (
                    <Video className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <h3 className="text-lg font-semibold">Media</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.media.map((media, index) => (
                  <div key={index} className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg overflow-hidden shadow-md`}>
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-auto max-h-96 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(media.url, '_blank')}
                      />
                    ) : (
                      <video
                        src={media.url}
                        controls
                        className="w-full h-auto max-h-96"
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Section */}
          {post.code && (
            <div className="mt-8">
              <div className="flex items-center space-x-2 mb-3">
                <Code className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-green-400">Code</h3>
              </div>
              <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4 bg-gray-900/50 overflow-x-auto`}>
                <pre className="text-sm">
                  <code className="text-green-300 whitespace-pre-wrap break-all">{post.code}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Vote Buttons */}
          {user && (
            <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={`${post.likedBy?.includes(user.id) ? 'bg-green-600 hover:bg-green-700' : ''} transition-colors`}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                {post.likes}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDislike}
                className={`${post.dislikedBy?.includes(user.id) ? 'bg-red-600 hover:bg-red-700' : ''} transition-colors`}
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                {post.dislikes || 0}
              </Button>
            </div>
          )}
        </div>

        {/* Replies Section */}
        <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-6 shadow-lg`}>
          <h2 className="text-xl font-semibold mb-6">
            Replies ({comments.length})
          </h2>

          {/* Add Reply */}
          {user && (
            <div className="mb-8 space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply..."
                className={`w-full p-4 rounded-lg ${currentTheme.secondary} border ${currentTheme.border} min-h-[100px] resize-vertical`}
              />
              
              {/* Conditional Code Input - Only show for coding categories */}
              {isCodingCategory(post.category) && (
                <Textarea
                  placeholder="Add code snippet (optional)..."
                  value={newCommentCode}
                  onChange={(e) => setNewCommentCode(e.target.value)}
                  className={`min-h-24 font-mono text-sm ${currentTheme.secondary} ${currentTheme.text} border ${currentTheme.border}`}
                />
              )}
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className={`${currentTheme.primary} text-white`}
                >
                  <Reply className="w-4 h-4 mr-2" />
                  Post Reply
                </Button>
              </div>
            </div>
          )}

          {/* Replies List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">
                  No replies yet. Be the first to reply!
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`border-l-4 border-purple-500 pl-6 py-4 ${currentTheme.secondary} rounded-r-lg`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback>{comment.author[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-xs text-gray-400">{comment.createdAt}</span>
                        </div>
                        {user && user.id !== comment.authorId && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSendFriendRequest(comment.authorId, comment.author)}
                            className="text-xs mt-2 sm:mt-0"
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Add Friend
                          </Button>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed break-words mb-4">{comment.content}</p>
                      
                      {/* Code in reply */}
                      {comment.code && (
                        <div className="mt-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Code className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-green-400">Code</span>
                          </div>
                          <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-3 bg-gray-900/50 overflow-x-auto`}>
                            <pre className="text-xs">
                              <code className="text-green-300 whitespace-pre-wrap break-all">{comment.code}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {!user && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">Please log in to reply</p>
              <Button onClick={() => navigate('/login')} className={`${currentTheme.primary} text-white`}>
                Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPost;
