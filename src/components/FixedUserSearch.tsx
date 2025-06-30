
import { useState, useEffect } from "react";
import { Search, User, MessageCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

const FixedUserSearch = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { createConversation } = useMessages();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const searchUsers = async (query: string) => {
    if (!query.trim() || !user) {
      setUsers([]);
      return;
    }
    
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
        setUsers([]);
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error in searchUsers:', error);
      setUsers([]);
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

  const handleUserSelect = async (userId: string) => {
    const conversationId = await createConversation(userId);
    if (conversationId) {
      window.location.href = `/messages?conversation=${conversationId}`;
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  if (!user) return null;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-24 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg z-50"
      >
        <Search size={20} />
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
          <div className={`${currentTheme.cardBg} rounded-lg border ${currentTheme.border} p-6 shadow-lg w-full max-w-md m-4`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${currentTheme.text} flex items-center gap-2`}>
                <Search className="h-5 w-5" />
                Find Users
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X size={16} />
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
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white flex items-center gap-2"
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
        </div>
      )}
    </>
  );
};

export default FixedUserSearch;
