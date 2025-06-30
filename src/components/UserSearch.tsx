
import { useState, useEffect } from "react";
import { Search, User, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<SearchedUser[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (term: string) => {
    if (!term.trim() || !user) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      console.log('Searching for users with term:', term);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${term}%`)
        .neq('id', user.id)
        .limit(10);

      if (error) {
        console.error('Error searching users:', error);
        setUsers([]);
        return;
      }

      console.log('Users found:', data);
      setUsers(data || []);
    } catch (error) {
      console.error('Error in searchUsers:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, user]);

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
              </div>
              <MessageCircle className="h-4 w-4 text-gray-400" />
            </div>
          ))
        ) : searchTerm.trim() ? (
          <div className="text-center py-4">
            <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className={`${currentTheme.muted} text-sm`}>No users found</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className={`${currentTheme.muted} text-sm`}>Start typing to search for users</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
