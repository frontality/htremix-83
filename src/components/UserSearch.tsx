
import { useState, useEffect } from "react";
import { Search, User, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UserSearchProps {
  onSelectUser: (userId: string) => void;
  onClose: () => void;
}

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

const UserSearch = ({ onSelectUser, onClose }: UserSearchProps) => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (query: string) => {
    if (!query.trim() || !user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${query}%`)
        .neq('id', user.id)
        .limit(10);

      if (error) {
        console.error('Error searching users:', error);
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error in searchUsers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, user]);

  const handleUserSelect = (userId: string) => {
    onSelectUser(userId);
    onClose();
  };

  return (
    <div className={`${currentTheme.cardBg} rounded-lg border ${currentTheme.border} p-4 shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${currentTheme.text} flex items-center gap-2`}>
          <Search className="h-5 w-5" />
          Find Users
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>
      
      <div className="relative mb-4">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${currentTheme.muted}`} />
        <Input
          placeholder="Search by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`pl-10 ${currentTheme.secondary} ${currentTheme.text} border-0`}
        />
      </div>

      <ScrollArea className="max-h-64">
        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-4">
              <div className={`${currentTheme.muted}`}>Searching...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-4">
              <User className={`h-8 w-8 ${currentTheme.muted} mx-auto mb-2`} />
              <div className={`${currentTheme.muted}`}>
                {searchQuery ? 'No users found' : 'Start typing to search for users'}
              </div>
            </div>
          ) : (
            users.map((profile) => (
              <div
                key={profile.id}
                className={`flex items-center justify-between p-3 rounded-lg hover:${currentTheme.secondary} transition-colors`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt={profile.username || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className={`font-medium ${currentTheme.text}`}>
                      {profile.username || "Anonymous User"}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleUserSelect(profile.id)}
                  className={`${currentTheme.primary} text-white flex items-center gap-2`}
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserSearch;
