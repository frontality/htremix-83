
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Users, Pin, Clock, Eye, ThumbsUp, Reply, Plus, Code, FileText, HelpCircle, Image, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  createdAt: string;
  isPinned: boolean;
  lastReply?: {
    author: string;
    time: string;
  };
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  postCount: number;
  icon: any;
  color: string;
}

const Forum = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', code: '', category: 'general' });
  const [uploadedMedia, setUploadedMedia] = useState<{type: 'image' | 'video', url: string}[]>([]);

  const categories: ForumCategory[] = [
    {
      id: 'general',
      name: 'General Discussion',
      description: 'General chat and discussions',
      postCount: posts.filter(p => p.category === 'general').length,
      icon: MessageCircle,
      color: 'text-blue-400'
    },
    {
      id: 'trading',
      name: 'Trading & Market',
      description: 'Discuss trading strategies and market trends',
      postCount: posts.filter(p => p.category === 'trading').length,
      icon: Users,
      color: 'text-green-400'
    },
    {
      id: 'coding',
      name: 'Coding & Programming',
      description: 'Programming discussions and code sharing',
      postCount: posts.filter(p => p.category === 'coding').length,
      icon: Code,
      color: 'text-purple-400'
    },
    {
      id: 'scripting',
      name: 'Scripting & Automation',
      description: 'Scripts, bots, and automation tools',
      postCount: posts.filter(p => p.category === 'scripting').length,
      icon: FileText,
      color: 'text-cyan-400'
    },
    {
      id: 'source',
      name: 'Source Code',
      description: 'Share and request source code',
      postCount: posts.filter(p => p.category === 'source').length,
      icon: Code,
      color: 'text-orange-400'
    },
    {
      id: 'support',
      name: 'Support & Help',
      description: 'Get help and support from the community',
      postCount: posts.filter(p => p.category === 'support').length,
      icon: HelpCircle,
      color: 'text-yellow-400'
    }
  ];

  useEffect(() => {
    const loadPosts = () => {
      try {
        const savedPosts = localStorage.getItem('forum_posts');
        console.log('Loading forum posts:', savedPosts);
        
        if (savedPosts) {
          const parsedPosts = JSON.parse(savedPosts);
          if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
            console.log('Loaded posts successfully:', parsedPosts.length);
            setPosts(parsedPosts);
            return;
          }
        }
        
        const samplePosts: ForumPost[] = [
          {
            id: 'sample-1',
            title: 'Welcome to the Forum!',
            author: 'Admin',
            authorId: 'admin',
            authorAvatar: '/placeholder.svg',
            content: 'Welcome to our community forum! Feel free to share your thoughts and connect with other members.',
            category: 'general',
            replies: 0,
            views: 5,
            likes: 2,
            createdAt: new Date().toLocaleDateString(),
            isPinned: true
          },
          {
            id: 'sample-2',
            title: 'Trading Tips and Strategies',
            author: 'Trader123',
            authorId: 'trader123',
            authorAvatar: '/placeholder.svg',
            content: 'Share your best trading strategies here! What has worked for you?',
            category: 'trading',
            replies: 0,
            views: 3,
            likes: 1,
            createdAt: new Date().toLocaleDateString(),
            isPinned: false
          }
        ];
        
        localStorage.setItem('forum_posts', JSON.stringify(samplePosts));
        setPosts(samplePosts);
        console.log('Created sample posts');
      } catch (error) {
        console.error('Error loading forum posts:', error);
        setPosts([]);
      }
    };

    loadPosts();
  }, []);

  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  const isCodingRelated = (category: string) => {
    return ['coding', 'scripting', 'source'].includes(category);
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    
    if (type === 'image' && !validImageTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, WebP)",
        variant: "destructive",
      });
      return;
    }

    if (type === 'video' && !validVideoTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file (MP4, WebM, OGG)",
        variant: "destructive",
      });
      return;
    }

    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Please select a ${type} smaller than ${type === 'video' ? '50MB' : '10MB'}`,
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedMedia(prev => [...prev, { type, url: result }]);
      toast({
        title: `${type === 'image' ? 'Image' : 'Video'} added! 📎`,
        description: `Your ${type} has been added to the post`,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = (index: number) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to create a post.",
        variant: "destructive"
      });
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content.",
        variant: "destructive"
      });
      return;
    }

    const post: ForumPost = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newPost.title,
      author: user.email?.split('@')[0] || 'Anonymous',
      authorId: user.id,
      authorAvatar: '/placeholder.svg',
      content: newPost.content,
      code: newPost.code.trim() || undefined,
      media: uploadedMedia.length > 0 ? uploadedMedia : undefined,
      category: newPost.category,
      replies: 0,
      views: 0,
      likes: 0,
      createdAt: new Date().toLocaleDateString(),
      isPinned: false
    };

    try {
      const currentPosts = [...posts, post];
      localStorage.setItem('forum_posts', JSON.stringify(currentPosts));
      setPosts(currentPosts);
      
      setNewPost({ title: '', content: '', code: '', category: 'general' });
      setUploadedMedia([]);
      setShowNewPostForm(false);

      toast({
        title: "Post Created! 🎉",
        description: "Your post has been published successfully."
      });
      
      console.log('Post created successfully:', post.id);
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePostClick = (postId: string) => {
    const updatedPosts = posts.map(post => 
      post.id === postId ? { ...post, views: post.views + 1 } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('forum_posts', JSON.stringify(updatedPosts));
    
    navigate(`/forum/post/${postId}`);
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} pt-16`}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
          <p className="text-gray-400">Connect, discuss, and share with the $KID HAVEN community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4 cursor-pointer transition-all hover:border-purple-500 hover:shadow-lg ${
                selectedCategory === category.id ? 'border-purple-500 bg-purple-900/20 shadow-lg' : ''
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <category.icon className={`w-6 h-6 ${category.color}`} />
                <h3 className="font-semibold">{category.name}</h3>
              </div>
              <p className="text-sm text-gray-400 mb-2">{category.description}</p>
              <p className="text-xs text-gray-500">{category.postCount} posts</p>
            </div>
          ))}
        </div>

        {selectedCategory && (
          <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
            <span className="text-sm text-gray-300">
              Showing posts in: <span className="text-purple-400 font-medium">
                {categories.find(c => c.id === selectedCategory)?.name}
              </span>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="ml-3 text-xs text-red-400 hover:text-red-300 underline"
              >
                Clear filter
              </button>
            </span>
          </div>
        )}

        {showNewPostForm && (
          <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-6 mb-6 shadow-xl`}>
            <h3 className="text-xl font-semibold mb-4">Create New Post</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={newPost.category} onValueChange={(value) => setNewPost({...newPost, category: value})}>
                  <SelectTrigger className={`w-full ${currentTheme.cardBg} border ${currentTheme.border} ${currentTheme.text}`}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className={`${currentTheme.cardBg} border ${currentTheme.border} ${currentTheme.text} bg-gray-900 z-50`}>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id} className={`${currentTheme.text} hover:bg-gray-800 focus:bg-gray-800`}>
                        <div className="flex items-center space-x-2">
                          <cat.icon className={`w-4 h-4 ${cat.color}`} />
                          <span>{cat.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className={`w-full p-3 rounded ${currentTheme.cardBg} border ${currentTheme.border} ${currentTheme.text} focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                  placeholder="Enter post title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className={`w-full p-3 rounded ${currentTheme.cardBg} border ${currentTheme.border} h-32 ${currentTheme.text} focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                  placeholder="Write your post content..."
                />
              </div>
              
              {isCodingRelated(newPost.category) && (
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                    <Code className="w-4 h-4 text-green-400" />
                    <span>Code (Optional)</span>
                  </label>
                  <Textarea
                    value={newPost.code}
                    onChange={(e) => setNewPost({...newPost, code: e.target.value})}
                    className={`w-full p-3 rounded ${currentTheme.cardBg} border ${currentTheme.border} h-32 font-mono text-sm ${currentTheme.text} focus:border-green-500 focus:ring-1 focus:ring-green-500`}
                    placeholder="Paste your code here..."
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Add Media (Optional)</label>
                <div className="flex space-x-2 mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMediaUpload(e, 'image')}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button type="button" variant="outline" size="sm" className="cursor-pointer">
                      <Image className="w-4 h-4 mr-2" />
                      Add Image
                    </Button>
                  </label>
                  
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleMediaUpload(e, 'video')}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload">
                    <Button type="button" variant="outline" size="sm" className="cursor-pointer">
                      <Video className="w-4 h-4 mr-2" />
                      Add Video
                    </Button>
                  </label>
                </div>

                {uploadedMedia.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {uploadedMedia.map((media, index) => (
                      <div key={index} className="relative">
                        <button
                          onClick={() => removeMedia(index)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center z-10 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt="Upload preview"
                            className="w-full h-32 object-cover rounded border hover:opacity-90 transition-opacity"
                          />
                        ) : (
                          <video
                            src={media.url}
                            className="w-full h-32 object-cover rounded border"
                            controls
                            preload="metadata"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 pt-4 border-t border-gray-700">
                <Button onClick={handleCreatePost} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
                <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-8 text-center`}>
              <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-4">Be the first to start a discussion!</p>
              {user && (
                <Button onClick={() => setShowNewPostForm(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </div>
          ) : (
            filteredPosts.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)).map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-6 hover:border-purple-500/50 hover:shadow-lg transition-all cursor-pointer group`}
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-12 h-12 rounded-full border-2 border-gray-600 group-hover:border-purple-500 transition-colors"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2 flex-wrap">
                      {post.isPinned && (
                        <Pin className="w-4 h-4 text-yellow-400" />
                      )}
                      <h3 className="font-semibold text-lg hover:text-purple-400 truncate">
                        {post.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full bg-opacity-20 bg-gray-600 text-gray-300`}>
                        {categories.find(cat => cat.id === post.category)?.name}
                      </span>
                      {post.code && (
                        <Code className="w-4 h-4 text-green-400" />
                      )}
                      {post.media && post.media.length > 0 && (
                        <div className="flex space-x-1">
                          {post.media.some(m => m.type === 'image') && (
                            <Image className="w-4 h-4 text-blue-400" />
                          )}
                          {post.media.some(m => m.type === 'video') && (
                            <Video className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-300 mb-3 line-clamp-2">{post.content}</p>
                    
                    {post.media && post.media.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {post.media.slice(0, 4).map((media, index) => (
                          <div key={index} className="relative">
                            {media.type === 'image' ? (
                              <img
                                src={media.url}
                                alt="Post media"
                                className="w-full h-16 object-cover rounded border border-gray-600"
                              />
                            ) : (
                              <div className="w-full h-16 bg-gray-800 rounded flex items-center justify-center border border-gray-600">
                                <Video className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        ))}
                        {post.media.length > 4 && (
                          <div className="w-full h-16 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400 border border-gray-600">
                            +{post.media.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>by <span className="text-purple-400">{post.author}</span></span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.createdAt}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Reply className="w-4 h-4" />
                          <span>{post.replies}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {user && !showNewPostForm && (
          <div className="fixed bottom-6 right-6">
            <Button 
              onClick={() => setShowNewPostForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Post</span>
            </Button>
          </div>
        )}

        {!user && (
          <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-6 text-center mt-8`}>
            <p className="text-gray-400 mb-4">Please log in to create posts and interact with the community.</p>
            <Button onClick={() => navigate('/login')} className="bg-purple-600 hover:bg-purple-700">
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
