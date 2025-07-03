
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Plus, 
  MessageCircle, 
  Heart, 
  Eye, 
  Calendar,
  Code,
  Filter,
  TrendingUp,
  Clock
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useForumPosts } from "@/hooks/useForumPosts";
import UserProfileCard from "@/components/UserProfileCard";

const Forum = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { posts, createPost, likePost, loading } = useForumPosts();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general",
    code_snippet: ""
  });

  const categories = [
    { id: "all", name: "All Posts", icon: TrendingUp },
    { id: "general", name: "General", icon: MessageCircle },
    { id: "trading", name: "Trading", icon: TrendingUp },
    { id: "technical", name: "Technical", icon: Code },
    { id: "help", name: "Help & Support", icon: MessageCircle }
  ];

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPost.title.trim() || !newPost.content.trim()) return;

    const success = await createPost({
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      code_snippet: newPost.code_snippet || null
    });

    if (success) {
      setNewPost({ title: "", content: "", category: "general", code_snippet: "" });
      setShowCreatePost(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} py-8`}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-4xl font-bold ${currentTheme.text} mb-2`}>Community Forum</h1>
              <p className={`text-lg ${currentTheme.muted}`}>
                Connect, share knowledge and discuss with the SKID HAVEN community
              </p>
            </div>
            {user && (
              <Button
                onClick={() => setShowCreatePost(!showCreatePost)}
                className={`${currentTheme.primary} text-white px-6 py-3 hover:scale-105 transition-transform`}
              >
                <Plus className="h-5 w-5 mr-2" />
                New Post
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.muted}`} />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-12 ${currentTheme.secondary} ${currentTheme.text} border-0 rounded-full`}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`flex items-center gap-2 whitespace-nowrap ${
                      selectedCategory === category.id 
                        ? `${currentTheme.primary} text-white` 
                        : `${currentTheme.text} hover:${currentTheme.secondary}`
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Create Post Form */}
        {showCreatePost && user && (
          <Card className={`${currentTheme.cardBg} border ${currentTheme.border} mb-8`}>
            <CardHeader>
              <CardTitle className={currentTheme.text}>Create New Post</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Post title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                  />
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className={`px-4 py-2 rounded-lg ${currentTheme.secondary} ${currentTheme.text} border-0`}
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  rows={4}
                  className={`${currentTheme.secondary} ${currentTheme.text} border-0`}
                />
                <Textarea
                  placeholder="Code snippet (optional)..."
                  value={newPost.code_snippet}
                  onChange={(e) => setNewPost({...newPost, code_snippet: e.target.value})}
                  rows={3}
                  className={`${currentTheme.secondary} ${currentTheme.text} border-0 font-mono`}
                />
                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    className={`${currentTheme.primary} text-white px-6`}
                    disabled={!newPost.title.trim() || !newPost.content.trim()}
                  >
                    Post
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreatePost(false)}
                    className={`${currentTheme.text} border ${currentTheme.border}`}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className={`${currentTheme.text} text-lg`}>Loading posts...</div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <Card className={`${currentTheme.cardBg} border ${currentTheme.border} p-12 text-center`}>
              <MessageCircle className={`h-16 w-16 mx-auto mb-4 ${currentTheme.muted}`} />
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>No posts found</h3>
              <p className={`${currentTheme.muted} mb-4`}>
                {searchQuery ? "Try adjusting your search terms" : "Be the first to start a discussion!"}
              </p>
              {user && !searchQuery && (
                <Button 
                  onClick={() => setShowCreatePost(true)}
                  className={`${currentTheme.primary} text-white`}
                >
                  Create First Post
                </Button>
              )}
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className={`${currentTheme.cardBg} border ${currentTheme.border} hover:shadow-lg transition-all duration-200`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <UserProfileCard userId={post.user_id}>
                        <div className={`w-10 h-10 rounded-full ${currentTheme.secondary} flex items-center justify-center cursor-pointer hover:scale-105 transition-transform`}>
                          <span className={`text-sm font-medium ${currentTheme.text}`}>
                            {post.user_id.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      </UserProfileCard>
                      <div>
                        <UserProfileCard userId={post.user_id}>
                          <h4 className={`font-medium ${currentTheme.text} cursor-pointer hover:underline`}>
                            User {post.user_id.slice(0, 8)}
                          </h4>
                        </UserProfileCard>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className={`h-3 w-3 ${currentTheme.muted}`} />
                          <span className={currentTheme.muted}>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`${currentTheme.secondary} ${currentTheme.text}`}>
                      {post.category}
                    </Badge>
                  </div>

                  <h3 className={`text-xl font-semibold ${currentTheme.text} mb-3 hover:${currentTheme.primary} cursor-pointer transition-colors`}>
                    {post.title}
                  </h3>
                  
                  <p className={`${currentTheme.muted} mb-4 leading-relaxed line-clamp-3`}>
                    {post.content}
                  </p>

                  {post.code_snippet && (
                    <div className={`${currentTheme.secondary} rounded-lg p-4 mb-4 border-l-4 ${currentTheme.primary}`}>
                      <pre className={`text-sm ${currentTheme.text} font-mono overflow-x-auto`}>
                        <code>{post.code_snippet}</code>
                      </pre>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => likePost(post.id)}
                        className={`${currentTheme.text} hover:${currentTheme.secondary} flex items-center gap-2`}
                      >
                        <Heart className="h-4 w-4" />
                        <span>{post.likes_count || 0}</span>
                      </Button>
                      <div className={`flex items-center gap-2 text-sm ${currentTheme.muted}`}>
                        <Eye className="h-4 w-4" />
                        <span>{post.views_count || 0} views</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;
