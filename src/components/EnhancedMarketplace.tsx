
import React, { useState } from 'react';
import { Search, Filter, Star, Shield, Zap, TrendingUp, Users, MessageCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';

const EnhancedMarketplace = () => {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️' },
    { id: 'accounts', name: 'Accounts', icon: '👤' },
    { id: 'tools', name: 'Tools', icon: '🔧' },
    { id: 'services', name: 'Services', icon: '⚙️' },
    { id: 'crypto', name: 'Crypto', icon: '₿' },
    { id: 'premium', name: 'Premium', icon: '💎' },
  ];

  const featuredProducts = [
    {
      id: 1,
      title: 'Premium Netflix Account',
      description: 'Lifetime access to all Netflix content',
      price: '$15.99',
      rating: 4.9,
      seller: 'CryptoSeller',
      sales: 2847,
      verified: true,
      category: 'accounts',
      tags: ['Netflix', 'Streaming', 'Lifetime'],
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Advanced Crypto Bot',
      description: 'AI-powered trading bot with 89% success rate',
      price: '$299.99',
      rating: 4.8,
      seller: 'TradeMaster',
      sales: 1234,
      verified: true,
      category: 'tools',
      tags: ['Trading', 'AI', 'Crypto'],
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'Social Media Growth Service',
      description: 'Organic followers and engagement boost',
      price: '$49.99',
      rating: 4.7,
      seller: 'GrowthHacker',
      sales: 5678,
      verified: true,
      category: 'services',
      tags: ['Social Media', 'Growth', 'Organic'],
      image: '/placeholder.svg'
    },
  ];

  const stats = [
    { label: 'Active Users', value: '25,847', icon: Users, color: 'text-blue-500' },
    { label: 'Products Sold', value: '1.2M+', icon: ShoppingCart, color: 'text-green-500' },
    { label: 'Success Rate', value: '99.2%', icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Avg Rating', value: '4.8/5', icon: Star, color: 'text-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className={`${currentTheme.cardBg} rounded-xl p-8 border ${currentTheme.border}`}>
        <div className="text-center space-y-4">
          <h1 className={`text-4xl font-bold ${currentTheme.text} bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}>
            Premium Digital Marketplace
          </h1>
          <p className={`text-lg ${currentTheme.muted} max-w-2xl mx-auto`}>
            Your trusted source for premium accounts, tools, and services. 100% secure and anonymous transactions.
          </p>
          <div className="flex justify-center space-x-6 mt-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`flex items-center justify-center space-x-2 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                  <span className="font-bold text-lg">{stat.value}</span>
                </div>
                <p className={`text-sm ${currentTheme.muted}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`${currentTheme.cardBg} rounded-xl p-6 border ${currentTheme.border}`}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.muted}`} />
            <Input
              placeholder="Search for accounts, tools, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${currentTheme.secondary} ${currentTheme.text} border-0 focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id 
                ? "bg-gradient-to-r from-purple-600 to-blue-600" 
                : `${currentTheme.secondary} ${currentTheme.text}`
              }
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <h2 className={`text-2xl font-bold ${currentTheme.text} mb-6 flex items-center gap-2`}>
          <Zap className="h-6 w-6 text-yellow-500" />
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className={`${currentTheme.cardBg} ${currentTheme.border} hover:shadow-lg transition-all duration-300 group`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className={`${currentTheme.text} text-lg group-hover:text-purple-500 transition-colors`}>
                      {product.title}
                    </CardTitle>
                    <CardDescription className={`${currentTheme.muted} mt-1`}>
                      {product.description}
                    </CardDescription>
                  </div>
                  {product.verified && (
                    <Shield className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Price and Rating */}
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${currentTheme.text} text-green-500`}>
                      {product.price}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className={`text-sm ${currentTheme.text}`}>{product.rating}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center justify-between text-sm">
                    <span className={currentTheme.muted}>
                      by <span className="font-medium text-purple-500">{product.seller}</span>
                    </span>
                    <span className={currentTheme.muted}>
                      {product.sales.toLocaleString()} sales
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                    <Button size="sm" variant="outline" className={`${currentTheme.border}`}>
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className={`${currentTheme.cardBg} rounded-xl p-6 border ${currentTheme.border}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <Shield className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className={`font-bold ${currentTheme.text}`}>100% Secure</h3>
            <p className={`text-sm ${currentTheme.muted}`}>All transactions are encrypted and anonymous</p>
          </div>
          <div className="space-y-2">
            <Zap className="h-12 w-12 text-yellow-500 mx-auto" />
            <h3 className={`font-bold ${currentTheme.text}`}>Instant Delivery</h3>
            <p className={`text-sm ${currentTheme.muted}`}>Get your products delivered within minutes</p>
          </div>
          <div className="space-y-2">
            <Star className="h-12 w-12 text-purple-500 mx-auto" />
            <h3 className={`font-bold ${currentTheme.text}`}>Premium Quality</h3>
            <p className={`text-sm ${currentTheme.muted}`}>Only verified sellers with high ratings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMarketplace;
