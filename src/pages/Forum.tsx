
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Users, Pin, Clock, Eye, ThumbsUp, Reply, Plus, Code, FileText, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  content: string;
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
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });

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
    // Load posts from localStorage
    const savedPosts = localStorage.getItem('forum_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

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
      id: Date.now().toString(),
      title: newPost.title,
      author: user.email?.split('@')[0] || 'Anonymous',
      authorId: user.id,
      authorAvatar: '/placeholder.svg',
      content: newPost.content,
      category: newPost.category,
      replies: 0,
      views: 0,
      likes: 0,
      createdAt: new Date().toLocaleDateString(),
      isPinned: false
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('forum_posts', JSON.stringify(updatedPosts));

    setNewPost({ title: '', content: '', category: 'general' });
    setShowNewPostForm(false);

    toast({
      title: "Post Created! 🎉",
      description: "Your post has been published successfully."
    });
  };

  const handlePostClick = (postId: string) => {
    // Increment view count
    const updatedPosts = posts.map(post => 
      post.id === postId ? { ...post, views: post.views + 1 } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('forum_posts', JSON.stringify(updatedPosts));
    
    navigate(`/forum/post/${postId}`);
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text}`}>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
          <p className="text-gray-400">Connect, discuss, and share with the $KID HAVEN community</p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4 cursor-pointer transition-all hover:border-purple-500 ${
                selectedCategory === category.id ? 'border-purple-500 bg-purple-900/20' : ''
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

        {/* Filter indicator */}
        {selectedCategory && (
          <div className="mb-4">
            <span className="text-sm text-gray-400">
              Showing posts in: <span className="text-purple-400 font-medium">
                {categories.find(c => c.id === selectedCategory)?.name}
              </span>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="ml-2 text-xs text-red-400 hover:text-red-300"
              >
                Clear filter
              </button>
            </span>
          </div>
        )}

        {/* New Post Form */}
        {showNewPostForm && (
          <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-6 mb-6`}>
            <h3 className="text-xl font-semibold mb-4">Create New Post</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={newPost.category} onValueChange={(value) => setNewPost({...newPost, category: value})}>
                  <SelectTrigger className={`w-full ${currentTheme.cardBg} border ${currentTheme.border} ${currentTheme.text}`}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className={`${currentTheme.cardBg} border ${currentTheme.border} ${currentTheme.text}`}>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id} className={`${currentTheme.text} hover:${currentTheme.secondary}`}>
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
                  className={`w-full p-2 rounded ${currentTheme.cardBg} border ${currentTheme.border} ${currentTheme.text}`}
                  placeholder="Enter post title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className={`w-full p-2 rounded ${currentTheme.cardBg} border ${currentTheme.border} h-32 ${currentTheme.text}`}
                  placeholder="Write your post content..."
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleCreatePost}>Create Post</Button>
                <Button variant="outline" onClick={() => setShowNewPostForm(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-8 text-center`}>
              <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-4">Be the first to start a discussion!</p>
              {user && (
                <Button onClick={() => setShowNewPostForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4 hover:border-purple-500/50 transition-all cursor-pointer`}
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-10 h-10 rounded-full"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {post.isPinned && (
                        <Pin className="w-4 h-4 text-yellow-400" />
                      )}
                      <h3 className="font-semibold text-lg hover:text-purple-400">
                        {post.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${categories.find(cat => cat.id === post.category)?.color} bg-opacity-20`}>
                        {categories.find(cat => cat.id === post.category)?.name}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-3 line-clamp-2">{post.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>by {post.author}</span>
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

        {/* New Post Button */}
        {user && !showNewPostForm && (
          <div className="fixed bottom-6 right-6">
            <Button 
              onClick={() => setShowNewPostForm(true)}
              className={`${currentTheme.primary} text-white px-6 py-3 rounded-full shadow-lg hover:opacity-80 transition-all flex items-center space-x-2`}
            >
              <Plus className="w-5 h-5" />
              <span>New Post</span>
            </Button>
          </div>
        )}

        {!user && (
          <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-6 text-center mt-8`}>
            <p className="text-gray-400 mb-4">Please log in to create posts and interact with the community.</p>
            <Button onClick={() => navigate('/login')}>Login</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
