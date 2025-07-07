
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Search, Plus, Eye, MessageCircle, ThumbsUp, Clock, User, UserPlus, Code, Image, Video, Camera, Film, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  
  // New post form state
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
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text}`}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold mb-2 flex items-center space-x-2">
              <MessageCircle className="w-8 h-8 text-purple-500" />
              <span>Community Forum</span>
            </h1>
            <p className={`${currentTheme.muted}`}>
              Connect, share, and learn with the $KID HAVEN community
            </p>
          </div>
          
          {user && (
            <Button 
              onClick={() => setShowCreatePost(true)}
              className={`${currentTheme.primary} text-white`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search posts, authors, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${currentTheme.cardBg} border ${currentTheme.border}`}
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className={`w-full md:w-48 ${currentTheme.cardBg} border ${currentTheme.border}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className={`w-full md:w-48 ${currentTheme.cardBg} border ${currentTheme.border}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most-liked">Most Liked</SelectItem>
              <SelectItem value="most-viewed">Most Viewed</SelectItem>
              <SelectItem value="most-replies">Most Replies</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create New Post</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreatePost(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Enter post title..."
                    className={`${currentTheme.cardBg} border ${currentTheme.border}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select 
                    value={newPost.category} 
                    onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                  >
                    <SelectTrigger className={`${currentTheme.cardBg} border ${currentTheme.border}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Write your post content..."
                    className={`${currentTheme.cardBg} border ${currentTheme.border} min-h-32`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Code (Optional)</label>
                  <Textarea
                    value={newPost.code}
                    onChange={(e) => setNewPost({ ...newPost, code: e.target.value })}
                    placeholder="Paste your code here..."
                    className={`${currentTheme.cardBg} border ${currentTheme.border} font-mono text-sm`}
                  />
                </div>

                {/* Media Upload Section */}
                <div>
                  <label className="block text-sm font-medium mb-2">Media</label>
                  <div className="flex space-x-2 mb-4">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={(e) => handleMediaUpload(e, 'image')}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        console.log('Image upload button clicked');
                        document.getElementById('image-upload')?.click();
                      }}
                      className="flex items-center space-x-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Add Image</span>
                    </Button>
                    
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      onChange={(e) => handleMediaUpload(e, 'video')}
                      className="hidden"
                      id="video-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        console.log('Video upload button clicked');
                        document.getElementById('video-upload')?.click();
                      }}
                      className="flex items-center space-x-2"
                    >
                      <Film className="w-4 h-4" />
                      <span>Add Video</span>
                    </Button>
                  </div>

                  {/* Preview uploaded media */}
                  {uploadedMedia.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {uploadedMedia.map((media, index) => (
                        <div key={index} className="relative">
                          {media.type === 'image' ? (
                            <img
                              src={media.url}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                          ) : (
                            <video
                              src={media.url}
                              className="w-full h-24 object-cover rounded"
                              preload="metadata"
                            />
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeMedia(index)}
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleCreatePost} className={`${currentTheme.primary} text-white`}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreatePost(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {/* Pinned Posts */}
          {pinnedPosts.map((post) => (
            <div
              key={post.id}
              className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-6 hover:border-purple-500 transition-colors cursor-pointer relative`}
              onClick={() => handlePostClick(post)}
            >
              {post.isPinned && (
                <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                  Pinned
                </div>
              )}
              
              <div className="flex items-start space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={post.authorAvatar} />
                  <AvatarFallback>{post.author[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg truncate">{post.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${currentTheme.secondary}`}>
                      {categories.find(c => c.value === post.category)?.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                      {user && user.id !== post.authorId && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProfile(post.authorId);
                            }}
                            className="text-xs px-2 py-1"
                          >
                            Profile
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendFriendRequest(post.authorId, post.author);
                            }}
                            className="text-xs px-2 py-1"
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                  
                  <p className={`${currentTheme.text} mb-4 line-clamp-3`}>
                    {post.content}
                  </p>
                  
                  {/* Media Preview */}
                  {post.media && post.media.length > 0 && (
                    <div className="flex items-center space-x-2 mb-4">
                      {post.media.some(m => m.type === 'image') && (
                        <div className="flex items-center space-x-1 text-blue-400">
                          <Image className="w-4 h-4" />
                          <span className="text-xs">
                            {post.media.filter(m => m.type === 'image').length} image(s)
                          </span>
                        </div>
                      )}
                      {post.media.some(m => m.type === 'video') && (
                        <div className="flex items-center space-x-1 text-red-400">
                          <Video className="w-4 h-4" />
                          <span className="text-xs">
                            {post.media.filter(m => m.type === 'video').length} video(s)
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Code Preview */}
                  {post.code && (
                    <div className="flex items-center space-x-1 text-green-400 mb-4">
                      <Code className="w-4 h-4" />
                      <span className="text-xs">Contains code</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.replies}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                    
                    {user && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post.id);
                        }}
                        className={post.likedBy?.includes(user.id) ? 'text-green-500' : ''}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Like
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Regular Posts */}
          {regularPosts.map((post) => (
            <div
              key={post.id}
              className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-6 hover:border-purple-500 transition-colors cursor-pointer`}
              onClick={() => handlePostClick(post)}
            >
              <div className="flex items-start space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={post.authorAvatar} />
                  <AvatarFallback>{post.author[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg truncate">{post.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${currentTheme.secondary}`}>
                      {categories.find(c => c.value === post.category)?.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                      {user && user.id !== post.authorId && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProfile(post.authorId);
                            }}
                            className="text-xs px-2 py-1"
                          >
                            Profile
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendFriendRequest(post.authorId, post.author);
                            }}
                            className="text-xs px-2 py-1"
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                  
                  <p className={`${currentTheme.text} mb-4 line-clamp-3`}>
                    {post.content}
                  </p>
                  
                  {/* Media Preview */}
                  {post.media && post.media.length > 0 && (
                    <div className="flex items-center space-x-2 mb-4">
                      {post.media.some(m => m.type === 'image') && (
                        <div className="flex items-center space-x-1 text-blue-400">
                          <Image className="w-4 h-4" />
                          <span className="text-xs">
                            {post.media.filter(m => m.type === 'image').length} image(s)
                          </span>
                        </div>
                      )}
                      {post.media.some(m => m.type === 'video') && (
                        <div className="flex items-center space-x-1 text-red-400">
                          <Video className="w-4 h-4" />
                          <span className="text-xs">
                            {post.media.filter(m => m.type === 'video').length} video(s)
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Code Preview */}
                  {post.code && (
                    <div className="flex items-center space-x-1 text-green-400 mb-4">
                      <Code className="w-4 h-4" />
                      <span className="text-xs">Contains code</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.replies}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                    
                    {user && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post.id);
                        }}
                        className={post.likedBy?.includes(user.id) ? 'text-green-500' : ''}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Like
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* No posts message */}
          {sortedPosts.length === 0 && (
            <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-12 text-center`}>
              <MessageCircle className={`w-16 h-16 ${currentTheme.muted} mx-auto mb-4`} />
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                {searchQuery || selectedCategory !== 'all' ? 'No posts found' : 'No posts yet'}
              </h3>
              <p className={`${currentTheme.muted} mb-6`}>
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to start a conversation!'
                }
              </p>
              
              {user && (
                <Button 
                  onClick={() => setShowCreatePost(true)}
                  className={`${currentTheme.primary} text-white`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Login prompt for non-logged-in users */}
        {!user && (
          <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-6 text-center mt-8`}>
            <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>
              Join the Conversation! 💬
            </h3>
            <p className={`${currentTheme.muted} mb-4`}>
              Sign in to create posts, like content, and connect with the community
            </p>
            <div className="flex justify-center space-x-3">
              <Button onClick={() => navigate('/login')} className={`${currentTheme.primary} text-white`}>
                Sign In
              </Button>
              <Button variant="outline" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
