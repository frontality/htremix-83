import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { MessageSquare, Users, TrendingUp, Pin, Clock, Search, Plus, Image, Video, Code, Eye, ThumbsUp, Reply, Filter, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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

const Forum = () => {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    code: '',
    media: [] as { type: 'image' | 'video'; url: string }[]
  });
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    { value: 'all', label: '🌐 All Categories', color: 'bg-gray-500' },
    { value: 'general', label: '💬 General', color: 'bg-blue-500' },
    { value: 'help', label: '❓ Help Support', color: 'bg-orange-500' },
    { value: 'source', label: '📄 Source Code', color: 'bg-purple-500' },
    { value: 'codehelp', label: '💻 Code Help', color: 'bg-green-500' },
    { value: 'reverse', label: '🔍 Reverse Engineering', color: 'bg-red-500' },
    { value: 'social', label: '🎭 Social Engineering', color: 'bg-pink-500' },
    { value: 'money', label: '💰 Money Talk', color: 'bg-yellow-500' }
  ];

  // Helper function to check if category is coding-related
  const isCodingCategory = (category: string) => {
    return ['source', 'codehelp', 'reverse'].includes(category);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const savedPosts = localStorage.getItem('forum_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  };

  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to create a post."
      });
      navigate('/login');
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const displayName = profile?.username || user?.email?.split('@')[0] || 'Anonymous';

    const post: ForumPost = {
      id: Date.now().toString(),
      title: newPost.title,
      author: displayName,
      authorId: user.id,
      authorAvatar: profile?.avatar_url || '',
      content: newPost.content,
      code: newPost.code || undefined,
      media: newPost.media.length > 0 ? newPost.media : undefined,
      category: newPost.category,
      replies: 0,
      views: 0,
      likes: 0,
      dislikes: 0,
      createdAt: new Date().toLocaleDateString(),
      isPinned: false,
      likedBy: [],
      dislikedBy: []
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('forum_posts', JSON.stringify(updatedPosts));

    setNewPost({
      title: '',
      content: '',
      category: '',
      code: '',
      media: []
    });
    setShowCreatePost(false);

    toast({
      title: "Post Created! 🎉",
      description: "Your post has been published to the forum."
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (type === 'image' && !isImage) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    if (type === 'video' && !isVideo) {
      toast({
        title: "Invalid File Type", 
        description: "Please select a video file.",
        variant: "destructive"
      });
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      
      const mediaItem = {
        type,
        url
      };

      setNewPost(prev => ({
        ...prev,
        media: [...prev.media, mediaItem]
      }));

      toast({
        title: `${type === 'image' ? 'Image' : 'Video'} Added!`,
        description: `${type === 'image' ? 'Image' : 'Video'} has been added to your post.`
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeMedia = (index: number) => {
    setNewPost(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  // Filter and sort posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    switch (sortBy) {
      case 'popular':
        return (b.likes + b.replies) - (a.likes + a.replies);
      case 'replies':
        return b.replies - a.replies;
      case 'views':
        return b.views - a.views;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Calculate real stats
  const totalPosts = posts.length;
  const totalUsers = new Set(posts.map(post => post.authorId)).size;
  const totalReplies = posts.reduce((sum, post) => sum + post.replies, 0);
  const onlineUsers = Math.max(1, Math.floor(totalUsers * 0.3)); // Estimate 30% online

  return (
    <div className={`min-h-screen ${currentTheme.bg} pt-20`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold ${currentTheme.text} mb-4`}>
            Community Forum
          </h1>
          <p className={`text-lg ${currentTheme.muted}`}>
            Connect, discuss, and share with the community
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-4 text-center shadow-lg`}>
            <MessageSquare className={`h-8 w-8 mx-auto mb-2 ${currentTheme.accent}`} />
            <div className={`text-2xl font-bold ${currentTheme.text}`}>{totalPosts}</div>
            <div className={`text-sm ${currentTheme.muted}`}>Posts</div>
          </Card>
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-4 text-center shadow-lg`}>
            <Users className={`h-8 w-8 mx-auto mb-2 ${currentTheme.accent}`} />
            <div className={`text-2xl font-bold ${currentTheme.text}`}>{totalUsers}</div>
            <div className={`text-sm ${currentTheme.muted}`}>Members</div>
          </Card>
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-4 text-center shadow-lg`}>
            <Reply className={`h-8 w-8 mx-auto mb-2 ${currentTheme.accent}`} />
            <div className={`text-2xl font-bold ${currentTheme.text}`}>{totalReplies}</div>
            <div className={`text-sm ${currentTheme.muted}`}>Replies</div>
          </Card>
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-4 text-center shadow-lg`}>
            <TrendingUp className={`h-8 w-8 mx-auto mb-2 text-green-400`} />
            <div className={`text-2xl font-bold ${currentTheme.text}`}>{onlineUsers}</div>
            <div className={`text-sm ${currentTheme.muted}`}>Online</div>
          </Card>
        </div>

        {/* Controls */}
        <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-6 mb-8 shadow-lg`}>
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${currentTheme.muted}`} />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${currentTheme.secondary} ${currentTheme.text} border-0`}
              />
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className={`w-48 ${currentTheme.secondary} ${currentTheme.text} border-0`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className={`w-32 ${currentTheme.secondary} ${currentTheme.text} border-0`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="replies">Most Replies</SelectItem>
                  <SelectItem value="views">Most Views</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => setShowCreatePost(!showCreatePost)}
                className={`${currentTheme.primary} text-white hover:scale-105 transition-transform`}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>
        </div>

        {/* Create Post Form */}
        {showCreatePost && (
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 mb-8 shadow-lg`}>
            <h2 className={`text-xl font-semibold ${currentTheme.text} mb-6`}>Create New Post</h2>
            
            <div className="space-y-6">
              <div>
                <Input
                  placeholder="Post title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  className={`${currentTheme.secondary} ${currentTheme.text} border ${currentTheme.border}`}
                />
              </div>

              <div>
                <Select value={newPost.category} onValueChange={(value) => setNewPost(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className={`${currentTheme.secondary} ${currentTheme.text} border ${currentTheme.border}`}>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Textarea
                  placeholder="Write your post content..."
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  className={`min-h-32 ${currentTheme.secondary} ${currentTheme.text} border ${currentTheme.border}`}
                />
              </div>

              {/* Conditional Code Input - Only show for coding categories */}
              {isCodingCategory(newPost.category) && (
                <div>
                  <Textarea
                    placeholder="Add code snippet (optional)..."
                    value={newPost.code}
                    onChange={(e) => setNewPost(prev => ({ ...prev, code: e.target.value }))}
                    className={`min-h-24 font-mono text-sm ${currentTheme.secondary} ${currentTheme.text} border ${currentTheme.border}`}
                  />
                </div>
              )}

              {/* Media Upload */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      className="hidden"
                      id="image-upload"
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={isUploading}
                      className={`${currentTheme.text} border ${currentTheme.border}`}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                  </div>
                  
                  <div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'video')}
                      className="hidden"
                      id="video-upload"
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('video-upload')?.click()}
                      disabled={isUploading}
                      className={`${currentTheme.text} border ${currentTheme.border}`}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Add Video
                    </Button>
                  </div>
                </div>

                {newPost.media.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {newPost.media.map((media, index) => (
                      <div key={index} className="relative">
                        {media.type === 'image' ? (
                          <img 
                            src={media.url} 
                            alt={`Upload ${index + 1}`}
                            className="w-20 h-20 object-cover rounded border-2 border-purple-500"
                          />
                        ) : (
                          <video 
                            src={media.url}
                            className="w-20 h-20 object-cover rounded border-2 border-purple-500"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCreatePost(false)}
                  className={`${currentTheme.text} border ${currentTheme.border}`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePost}
                  className={`${currentTheme.primary} text-white`}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Create Post'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {sortedPosts.length > 0 ? (
            sortedPosts.map((post) => {
              const categoryInfo = categories.find(c => c.value === post.category);
              
              return (
                <Card
                  key={post.id}
                  className={`${currentTheme.cardBg} border ${currentTheme.border} p-6 hover:border-purple-500/50 transition-all cursor-pointer shadow-lg`}
                  onClick={() => navigate(`/forum/post/${post.id}`)}
                >
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={post.authorAvatar} />
                      <AvatarFallback>{post.author[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {post.isPinned && (
                          <Pin className="h-4 w-4 text-yellow-500" />
                        )}
                        <Badge className={`${categoryInfo?.color || 'bg-gray-500'} text-white`}>
                          {categoryInfo?.label.replace(/^[^\s]+\s/, '') || post.category}
                        </Badge>
                        <span className={`text-sm ${currentTheme.muted}`}>•</span>
                        <span className={`text-sm ${currentTheme.muted}`}>{post.createdAt}</span>
                      </div>
                      
                      <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2 hover:text-purple-400 transition-colors`}>
                        {post.title}
                      </h3>
                      
                      <p className={`${currentTheme.muted} text-sm mb-4 line-clamp-2`}>
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span className={currentTheme.muted}>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Reply className="h-4 w-4" />
                            <span className={currentTheme.muted}>{post.replies}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span className={currentTheme.muted}>{post.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span className={currentTheme.muted}>{post.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-16">
              <MessageSquare className={`h-24 w-24 ${currentTheme.muted} mx-auto mb-6`} />
              <h2 className={`text-2xl font-semibold ${currentTheme.text} mb-4`}>
                {searchQuery || selectedCategory !== 'all' 
                  ? "No posts match your search" 
                  : "No posts yet"
                }
              </h2>
              <p className={`text-lg ${currentTheme.muted} mb-8`}>
                {searchQuery || selectedCategory !== 'all'
                  ? "Try adjusting your search or filters."
                  : "Be the first to start a discussion!"
                }
              </p>
              {!showCreatePost && (
                <Button
                  onClick={() => setShowCreatePost(true)}
                  className={`${currentTheme.primary} text-white px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform`}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create First Post
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;
