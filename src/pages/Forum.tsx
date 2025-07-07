import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Plus, Search, Filter, Image, Video, Code, Pin, TrendingUp, MessageCircle, Eye, ThumbsUp, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    code: '',
    category: 'general'
  });
  const [uploadedMedia, setUploadedMedia] = useState<{ type: 'image' | 'video'; url: string }[]>([]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General Discussion' },
    { value: 'trading', label: 'Trading Tips' },
    { value: 'tech', label: 'Tech Support' },
    { value: 'guides', label: 'Guides & Tutorials' },
    { value: 'marketplace', label: 'Marketplace' },
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const savedPosts = localStorage.getItem('forum_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initialize with some sample posts
      const samplePosts: ForumPost[] = [
        {
          id: '1',
          title: 'Welcome to the $KID HAVEN Forum! 🎉',
          author: 'Admin',
          authorId: 'admin',
          authorAvatar: '/lovable-uploads/2a21bfaa-d803-4e5a-aa4e-e377ae6c835f.png',
          content: 'Welcome to our amazing community! Here you can discuss trading strategies, share tips, get help, and connect with other members. Please be respectful and follow our community guidelines.',
          category: 'general',
          replies: 15,
          views: 1250,
          likes: 42,
          dislikes: 0,
          createdAt: '2024-01-15',
          isPinned: true,
          likedBy: [],
          dislikedBy: []
        },
        {
          id: '2',
          title: 'Best Trading Strategies for 2024',
          author: 'CryptoMaster',
          authorId: 'crypto_master',
          authorAvatar: '/placeholder.svg',
          content: 'Let\'s discuss the most effective trading strategies for this year. What has been working for you?',
          category: 'trading',
          replies: 8,
          views: 456,
          likes: 23,
          dislikes: 2,
          createdAt: '2024-01-14',
          isPinned: false,
          likedBy: [],
          dislikedBy: []
        }
      ];
      setPosts(samplePosts);
      localStorage.setItem('forum_posts', JSON.stringify(samplePosts));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload only image files.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Image must be under 5MB.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedMedia(prev => [...prev, { type: 'image', url: result }]);
        toast({
          title: "Image Added! 📸",
          description: "Image uploaded successfully."
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload only video files.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File Too Large",
          description: "Video must be under 50MB.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedMedia(prev => [...prev, { type: 'video', url: result }]);
        toast({
          title: "Video Added! 🎥",
          description: "Video uploaded successfully."
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    console.log('Media upload handler called for type:', type);
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Processing file upload:', file.name, file.type, file.size);

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    
    if (type === 'image' && !validImageTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, GIF, WebP)",
        variant: "destructive",
      });
      return;
    }
    
    if (type === 'video' && !validVideoTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file (MP4, WebM, OGG, MOV)",
        variant: "destructive",
      });
      return;
    }

    const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `${type === 'image' ? 'Image' : 'Video'} must be smaller than ${type === 'image' ? '5MB' : '50MB'}`,
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        console.log(`Adding ${type} to uploaded media`);
        setUploadedMedia(prev => [...prev, { type, url: result }]);
        toast({
          title: `${type === 'image' ? 'Image' : 'Video'} added! 📎`,
          description: `Your ${type} has been added to the post`,
        });
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      toast({
        title: "Upload failed",
        description: "Failed to read the file. Please try again.",
        variant: "destructive",
      });
    };
    
    reader.readAsDataURL(file);

    // Reset the input value to allow uploading the same file again
    event.target.value = '';
  };

  const removeMedia = (index: number) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = () => {
    if (!user || !newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    const displayName = profile?.username || user.email?.split('@')[0] || 'Anonymous';

    const post: ForumPost = {
      id: Date.now().toString(),
      title: newPost.title,
      author: displayName,
      authorId: user.id,
      authorAvatar: profile?.avatar_url || '/placeholder.svg',
      content: newPost.content,
      code: newPost.code || undefined,
      media: uploadedMedia.length > 0 ? uploadedMedia : undefined,
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

    // Reset form
    setNewPost({ title: '', content: '', code: '', category: 'general' });
    setUploadedMedia([]);
    setShowCreatePost(false);

    toast({
      title: "Post Created! 🎉",
      description: "Your post has been published successfully"
    });
  };

  const handleLike = (postId: string) => {
    if (!user) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const likedBy = post.likedBy || [];
        const dislikedBy = post.dislikedBy || [];
        
        if (likedBy.includes(user.id)) {
          // Remove like
          return {
            ...post,
            likes: post.likes - 1,
            likedBy: likedBy.filter(id => id !== user.id)
          };
        } else {
          // Add like and remove dislike if exists
          return {
            ...post,
            likes: post.likes + 1,
            dislikes: dislikedBy.includes(user.id) ? (post.dislikes || 0) - 1 : (post.dislikes || 0),
            likedBy: [...likedBy, user.id],
            dislikedBy: dislikedBy.filter(id => id !== user.id)
          };
        }
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('forum_posts', JSON.stringify(updatedPosts));
  };

  const handlePostClick = (post: ForumPost) => {
    // Increment view count
    const updatedPosts = posts.map(p => 
      p.id === post.id ? { ...p, views: p.views + 1 } : p
    );
    setPosts(updatedPosts);
    localStorage.setItem('forum_posts', JSON.stringify(updatedPosts));
    
    navigate(`/forum/post/${post.id}`);
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

  // Filter and sort posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'most-liked':
        return b.likes - a.likes;
      case 'most-viewed':
        return b.views - a.views;
      case 'most-replies':
        return b.replies - a.replies;
      default:
        return 0;
    }
  });

  // Separate pinned and regular posts
  const pinnedPosts = sortedPosts.filter(post => post.isPinned);
  const regularPosts = sortedPosts.filter(post => !post.isPinned);

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} pt-16`}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
          <p className={`${currentTheme.muted} text-lg`}>
            Connect, share, and learn with the community
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${currentTheme.primary}`}>
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,234</p>
                <p className={`text-sm ${currentTheme.muted}`}>Total Posts</p>
              </div>
            </div>
          </div>
          
          <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${currentTheme.secondary}`}>
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">45.6K</p>
                <p className={`text-sm ${currentTheme.muted}`}>Total Views</p>
              </div>
            </div>
          </div>
          
          <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-green-600`}>
                <ThumbsUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">2,890</p>
                <p className={`text-sm ${currentTheme.muted}`}>Total Likes</p>
              </div>
            </div>
          </div>
          
          <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-orange-600`}>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className={`text-sm ${currentTheme.muted}`}>Active Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${currentTheme.secondary} ${currentTheme.text} border-0`}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSortBy(sortBy === 'newest' ? 'popular' : 'newest')}
              className={`${currentTheme.secondary} hover:${currentTheme.primary}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              {sortBy === 'newest' ? 'Latest' : 'Popular'}
            </Button>
            {user && (
              <Button
                onClick={() => setShowCreatePost(true)}
                className={`${currentTheme.primary} text-white`}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            )}
          </div>
        </div>

        {/* Create Post Modal */}
        {showCreatePost && user && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Create New Post</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCreatePost(false);
                      setNewPost({ title: '', content: '', category: 'General', code: '' });
                      setUploadedMedia([]);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <Input
                    placeholder="Post title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                  />

                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className={`w-full p-2 rounded ${currentTheme.secondary} ${currentTheme.text} border-0`}
                  >
                    <option value="General">General</option>
                    <option value="Trading">Trading</option>
                    <option value="Technical">Technical</option>
                    <option value="Marketplace">Marketplace</option>
                    <option value="Crypto">Crypto</option>
                  </select>

                  <Textarea
                    placeholder="What's on your mind?"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0 min-h-[120px]`}
                  />

                  <Textarea
                    placeholder="Add code snippet (optional)..."
                    value={newPost.code}
                    onChange={(e) => setNewPost({ ...newPost, code: e.target.value })}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0 font-mono text-sm`}
                  />

                  {/* Media Upload Section */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={`${currentTheme.secondary} hover:${currentTheme.primary}`}
                        >
                          <Image className="w-4 h-4 mr-2" />
                          Add Images
                        </Button>
                      </label>

                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="video/*"
                          multiple
                          className="hidden"
                          onChange={handleVideoUpload}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={`${currentTheme.secondary} hover:${currentTheme.primary}`}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Add Videos
                        </Button>
                      </label>
                    </div>

                    {/* Media Preview */}
                    {uploadedMedia.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {uploadedMedia.map((media, index) => (
                          <div key={index} className="relative">
                            {media.type === 'image' ? (
                              <img
                                src={media.url}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-24 object-cover rounded border"
                              />
                            ) : (
                              <video
                                src={media.url}
                                className="w-full h-24 object-cover rounded border"
                                controls={false}
                                muted
                              />
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                              onClick={() => {
                                setUploadedMedia(prev => prev.filter((_, i) => i !== index));
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreatePost(false);
                        setNewPost({ title: '', content: '', category: 'General', code: '' });
                        setUploadedMedia([]);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePost}
                      disabled={!newPost.title.trim() || !newPost.content.trim()}
                      className={`${currentTheme.primary} text-white`}
                    >
                      Create Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-12 text-center`}>
              <MessageCircle className={`w-16 h-16 ${currentTheme.muted} mx-auto mb-4`} />
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className={`${currentTheme.muted} mb-4`}>
                {searchQuery ? 'Try adjusting your search terms' : 'Be the first to start a conversation!'}
              </p>
              {user && !searchQuery && (
                <Button
                  onClick={() => setShowCreatePost(true)}
                  className={`${currentTheme.primary} text-white`}
                >
                  Create First Post
                </Button>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-6 hover:${currentTheme.secondary} transition-all cursor-pointer`}
                onClick={() => navigate(`/forum/post/${post.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.authorAvatar} />
                      <AvatarFallback>{post.author[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{post.author}</h3>
                        {post.isPinned && (
                          <Pin className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{post.createdAt}</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${currentTheme.secondary}`}>
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-3 hover:text-purple-400 transition-colors">
                  {post.title}
                </h2>

                <p className={`${currentTheme.muted} mb-4 line-clamp-3`}>
                  {post.content}
                </p>

                {/* Media/Code indicators */}
                <div className="flex items-center space-x-4 mb-4">
                  {post.media && post.media.length > 0 && (
                    <div className="flex items-center space-x-1 text-sm text-blue-400">
                      <Image className="w-4 h-4" />
                      <span>{post.media.length} media</span>
                    </div>
                  )}
                  {post.code && (
                    <div className="flex items-center space-x-1 text-sm text-green-400">
                      <Code className="w-4 h-4" />
                      <span>Code</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.replies}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;
