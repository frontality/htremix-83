
import { useState, useEffect } from "react";
import { Search, User, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";

interface UserSearchProps {
  onSelectUser: (userId: string) => void;
  onClose: () => void;
}

interface SearchedUser {
  id: string;
  username: string;
  avatar_url: string | null;
}

const UserSearch = ({ onSelectUser, onClose }: UserSearchProps) => {
  const { currentTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<SearchedUser[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (term: string) => {
    if (!term.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      console.log('Searching for users with term:', term);
      
      // Create some demo users for testing since we're using localStorage
      const demoUsers: SearchedUser[] = [
        {
          id: 'demo_user_1',
          username: term.toLowerCase().includes('john') ? 'john_doe' : `${term}_user1`,
          avatar_url: null
        },
        {
          id: 'demo_user_2', 
          username: term.toLowerCase().includes('jane') ? 'jane_smith' : `${term}_user2`,
          avatar_url: null
        },
        {
          id: 'demo_user_3',
          username: `${term}_demo`,
          avatar_url: null
        }
      ].filter(user => user.username.toLowerCase().includes(term.toLowerCase()));

      console.log('Demo users found:', demoUsers);
      setUsers(demoUsers);
    } catch (error) {
      console.error('Error in searchUsers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleSelectUser = (userId: string) => {
    console.log('User selected:', userId);
    onSelectUser(userId);
    onClose();
  };

  return (
    <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-lg p-4 shadow-lg min-w-80`}>
      <div className="flex items-center space-x-2 mb-4">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-1 ${currentTheme.secondary} ${currentTheme.text} border-0`}
          autoFocus
        />
      </div>

      <div className="max-h-60 overflow-y-auto space-y-2">
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500 mx-auto"></div>
          </div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center space-x-3 p-3 rounded-lg ${currentTheme.secondary} hover:${currentTheme.primary} transition-colors cursor-pointer`}
              onClick={() => handleSelectUser(user.id)}
            >
              <img
                src={user.avatar_url || "/placeholder.svg"}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className={`font-medium ${currentTheme.text}`}>
                  {user.username || "Anonymous User"}
                </p>
                <p className={`text-sm ${currentTheme.muted}`}>Demo user - Connect Supabase for real users</p>
              </div>
              <MessageCircle className="h-4 w-4 text-gray-400" />
            </div>
          ))
        ) : searchTerm.trim() ? (
          <div className="text-center py-4">
            <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className={`${currentTheme.muted} text-sm`}>No users found</p>
            <p className={`${currentTheme.muted} text-xs mt-1`}>Try searching for "john" or "jane"</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className={`${currentTheme.muted} text-sm`}>Start typing to search for users</p>
            <p className={`${currentTheme.muted} text-xs mt-1`}>Connect Supabase for real user search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
