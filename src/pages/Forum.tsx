
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle, Users, Pin, Clock, Eye, ThumbsUp, Reply } from 'lucide-react';

interface ForumPost {
  id: string;
  title: string;
  author: string;
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
  
  const categories: ForumCategory[] = [
    {
      id: 'general',
      name: 'General Discussion',
      description: 'General chat and discussions',
      postCount: 245,
      icon: MessageCircle,
      color: 'text-blue-400'
    },
    {
      id: 'trading',
      name: 'Trading & Market',
      description: 'Discuss trading strategies and market trends',
      postCount: 189,
      icon: Users,
      color: 'text-green-400'
    },
    {
      id: 'support',
      name: 'Support & Help',
      description: 'Get help and support from the community',
      postCount: 67,
      icon: Reply,
      color: 'text-yellow-400'
    }
  ];

  const posts: ForumPost[] = [
    {
      id: '1',
      title: 'Welcome to $KID HAVEN Forum',
      author: 'Admin',
      authorAvatar: '/placeholder.svg',
      content: 'Welcome to our community forum! Please read the rules before posting.',
      category: 'general',
      replies: 23,
      views: 156,
      likes: 45,
      createdAt: '2024-01-15',
      isPinned: true,
      lastReply: {
        author: 'User123',
        time: '2 hours ago'
      }
    },
    {
      id: '2',
      title: 'Best trading strategies for beginners',
      author: 'TraderPro',
      authorAvatar: '/placeholder.svg',
      content: 'Sharing some effective trading strategies for newcomers...',
      category: 'trading',
      replies: 34,
      views: 289,
      likes: 67,
      createdAt: '2024-01-14',
      isPinned: false,
      lastReply: {
        author: 'NewTrader',
        time: '1 hour ago'
      }
    },
    {
      id: '3',
      title: 'How to set up 2FA?',
      author: 'SecurityGuy',
      authorAvatar: '/placeholder.svg',
      content: 'Need help setting up two-factor authentication...',
      category: 'support',
      replies: 12,
      views: 78,
      likes: 15,
      createdAt: '2024-01-13',
      isPinned: false,
      lastReply: {
        author: 'Helper',
        time: '30 minutes ago'
      }
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

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

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4 hover:border-purple-500/50 transition-all`}
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
                    <h3 className="font-semibold text-lg hover:text-purple-400 cursor-pointer">
                      {post.title}
                    </h3>
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
                  
                  {post.lastReply && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <p className="text-xs text-gray-500">
                        Last reply by <span className="text-purple-400">{post.lastReply.author}</span> {post.lastReply.time}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Post Button */}
        <div className="fixed bottom-6 right-6">
          <button className={`${currentTheme.primary} text-white px-6 py-3 rounded-full shadow-lg hover:opacity-80 transition-all flex items-center space-x-2`}>
            <MessageCircle className="w-5 h-5" />
            <span>New Post</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forum;
