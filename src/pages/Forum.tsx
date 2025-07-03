
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useForumPosts } from "@/hooks/useForumPosts";
import { useForumComments } from "@/hooks/useForumComments";
import { useUserProfiles } from "@/hooks/useUserProfiles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Code, Heart, Eye, Plus, User, Send, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UserProfileCard from "@/components/UserProfileCard";

const Forum = () => {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const { posts, loading, createPost, likePost } = useForumPosts();
  const { fetchMultipleProfiles, getUserDisplayName } = useUserProfiles();
  
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    code_snippet: '',
    category: 'general'
  });
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  // Fetch user profiles for all posts
  useEffect(() => {
    if (posts.length > 0) {
      const userIds = posts.map(post => post.user_id);
      fetchMultipleProfiles(userIds);
    }
  }, [posts]);

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      return;
    }

    setIsCreating(true);
    const success = await createPost(newPost);
    
    if (success) {
      setNewPost({ title: '', content: '', code_snippet: '', category: 'general' });
      setShowCreateDialog(false);
    }
    
    setIsCreating(false);
  };

  const handleLike = async (postId: string) => {
    await likePost(postId);
  };

  if (!user) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} pt-16 flex items-center justify-center`}>
        <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-8`}>
          <CardHeader>
            <CardTitle className={`${currentTheme.text} text-xl`}>Access Denied</CardTitle>
            <CardDescription className={currentTheme.muted}>
              Please log in to access the forum.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} pt-16`}>
      <div className="container max-w-6xl mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className={`h-8 w-8 ${currentTheme.accent}`} />
            <div>
              <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Forum</h1>
              <p className={`${currentTheme.muted}`}>Share code, ask questions, and connect with the community</p>
            </div>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className={`${currentTheme.primary} ${currentTheme.text} flex items-center gap-2`}>
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
              <DialogHeader>
                <DialogTitle className={currentTheme.text}>Create New Post</DialogTitle>
                <DialogDescription className={currentTheme.muted}>
                  Share your thoughts, ask questions, or showcase your code
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className={currentTheme.text}>Title</Label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Enter post title..."
                    className={`${currentTheme.cardBg} border ${currentTheme.border} ${currentTheme.text}`}
                  />
                </div>

                <div>
                  <Label htmlFor="category" className={currentTheme.text}>Category</Label>
                  <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                    <SelectTrigger className={`${currentTheme.cardBg} border ${currentTheme.border} ${currentTheme.text}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
                      <SelectItem value="general" className={currentTheme.text}>General Discussion</SelectItem>
                      <SelectItem value="javascript" className={currentTheme.text}>JavaScript</SelectItem>
                      <SelectItem value="python" className={currentTheme.text}>Python</SelectItem>
                      <SelectItem value="react" className={currentTheme.text}>React</SelectItem>
                      <SelectItem value="help" className={currentTheme.text}>Help & Support</SelectItem>
                      <SelectItem value="showcase" className={currentTheme.text}>Showcase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content" className={currentTheme.text}>Content</Label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Write your post content..."
                    rows={4}
                    className={`${currentTheme.cardBg} border ${currentTheme.border} ${currentTheme.text}`}
                  />
                </div>

                <div>
                  <Label htmlFor="code" className={currentTheme.text}>Code Snippet (Optional)</Label>
                  <Textarea
                    id="code"
                    value={newPost.code_snippet}
                    onChange={(e) => setNewPost({ ...newPost, code_snippet: e.target.value })}
                    placeholder="Paste your code here..."
                    rows={6}
                    className={`${currentTheme.cardBg} border ${currentTheme.border} ${currentTheme.text} font-mono text-sm`}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleCreatePost}
                    disabled={isCreating || !newPost.title.trim() || !newPost.content.trim()}
                    className={`${currentTheme.primary} ${currentTheme.text} flex-1`}
                  >
                    {isCreating ? 'Creating...' : 'Create Post'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                    className={`${currentTheme.secondary} ${currentTheme.text} border ${currentTheme.border}`}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className={`${currentTheme.text}`}>Loading posts...</div>
            </div>
          ) : posts.length === 0 ? (
            <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
              <CardContent className="text-center py-12">
                <MessageSquare className={`h-12 w-12 ${currentTheme.muted} mx-auto mb-4`} />
                <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>No posts yet</h3>
                <p className={`${currentTheme.muted} mb-4`}>Be the first to start a discussion!</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <ForumPostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                getUserDisplayName={getUserDisplayName}
                currentTheme={currentTheme}
                selectedPost={selectedPost}
                setSelectedPost={setSelectedPost}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

interface ForumPostCardProps {
  post: any;
  onLike: (postId: string) => void;
  getUserDisplayName: (userId: string) => string;
  currentTheme: any;
  selectedPost: string | null;
  setSelectedPost: (postId: string | null) => void;
}

const ForumPostCard = ({ post, onLike, getUserDisplayName, currentTheme, selectedPost, setSelectedPost }: ForumPostCardProps) => {
  const { comments, loading: commentsLoading, createComment } = useForumComments(selectedPost === post.id ? post.id : '');
  const { fetchMultipleProfiles, getUserDisplayName: getCommentUserName } = useUserProfiles();
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (comments.length > 0) {
      const userIds = comments.map(comment => comment.user_id);
      fetchMultipleProfiles(userIds);
    }
  }, [comments]);

  const handleShowComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      setSelectedPost(post.id);
    } else {
      setSelectedPost(null);
    }
  };

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;

    setIsCommenting(true);
    const success = await createComment({
      post_id: post.id,
      content: newComment,
    });

    if (success) {
      setNewComment('');
    }
    setIsCommenting(false);
  };

  return (
    <Card className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <UserProfileCard userId={post.user_id}>
                <div className="flex items-center gap-2 hover:opacity-80 cursor-pointer">
                  <User className={`h-4 w-4 ${currentTheme.muted}`} />
                  <span className={`text-sm ${currentTheme.muted} hover:${currentTheme.text} transition-colors`}>
                    {getUserDisplayName(post.user_id)}
                  </span>
                </div>
              </UserProfileCard>
              <span className={`px-2 py-1 text-xs rounded-full ${currentTheme.secondary} ${currentTheme.text}`}>
                {post.category}
              </span>
            </div>
            <CardTitle className={`${currentTheme.text} text-xl mb-2`}>
              {post.title}
            </CardTitle>
            <CardDescription className={`${currentTheme.muted} text-sm`}>
              {new Date(post.created_at).toLocaleDateString()} • {new Date(post.created_at).toLocaleTimeString()}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className={`${currentTheme.text} whitespace-pre-wrap`}>{post.content}</p>
          
          {post.code_snippet && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Code className={`h-4 w-4 ${currentTheme.accent}`} />
                <span className={`text-sm font-medium ${currentTheme.text}`}>Code Snippet</span>
              </div>
              <pre className={`${currentTheme.secondary} p-4 rounded-lg overflow-x-auto text-sm`}>
                <code className={currentTheme.text}>{post.code_snippet}</code>
              </pre>
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
              className="flex items-center gap-2 hover:bg-transparent"
            >
              <Heart className={`h-4 w-4 ${currentTheme.accent}`} />
              <span className={`${currentTheme.text} text-sm`}>{post.likes_count}</span>
            </Button>
            <div className="flex items-center gap-2">
              <Eye className={`h-4 w-4 ${currentTheme.muted}`} />
              <span className={`${currentTheme.muted} text-sm`}>{post.views_count}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShowComments}
              className="flex items-center gap-2 hover:bg-transparent"
            >
              <MessageCircle className={`h-4 w-4 ${currentTheme.accent}`} />
              <span className={`${currentTheme.text} text-sm`}>
                {showComments ? 'Hide Comments' : 'Comments'}
              </span>
            </Button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className={`border-t ${currentTheme.border} pt-4 space-y-4`}>
              {/* Add Comment */}
              <div className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={2}
                  className={`${currentTheme.cardBg} border ${currentTheme.border} ${currentTheme.text}`}
                />
                <Button
                  onClick={handleCreateComment}
                  disabled={isCommenting || !newComment.trim()}
                  className={`${currentTheme.primary} text-white flex items-center gap-2`}
                >
                  <Send className="h-4 w-4" />
                  {isCommenting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {commentsLoading ? (
                  <div className={`text-center py-4 ${currentTheme.muted}`}>Loading comments...</div>
                ) : comments.length === 0 ? (
                  <div className={`text-center py-4 ${currentTheme.muted}`}>No comments yet. Be the first to comment!</div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className={`${currentTheme.secondary} p-3 rounded-lg`}>
                      <div className="flex items-center gap-2 mb-2">
                        <UserProfileCard userId={comment.user_id}>
                          <span className={`text-sm font-medium ${currentTheme.text} hover:opacity-80 cursor-pointer`}>
                            {getCommentUserName(comment.user_id)}
                          </span>
                        </UserProfileCard>
                        <span className={`text-xs ${currentTheme.muted}`}>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`${currentTheme.text} text-sm`}>{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Forum;
