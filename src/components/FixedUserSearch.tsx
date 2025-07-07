
import { useState } from "react";
import { Search, User, MessageCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

const FixedUserSearch = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
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
      // For now, just show empty results since database tables don't exist
      console.log('Search functionality requires database tables to be set up');
      setUsers([]);
    } catch (error) {
      console.error('Error in searchUsers:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (userId: string) => {
    // For now, just log the selection since messaging functionality requires database setup
    console.log('Selected user:', userId);
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchUsers(e.target.value);
                }}
                className={`pl-10 ${currentTheme.secondary} ${currentTheme.text} border-0`}
              />
            </div>

            <ScrollArea className="max-h-64">
              <div className="space-y-2">
                {loading ? (
                  <div className="text-center py-4">
                    <div className={`${currentTheme.muted}`}>Searching...</div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <User className={`h-8 w-8 ${currentTheme.muted} mx-auto mb-2`} />
                    <div className={`${currentTheme.muted}`}>
                      {searchQuery ? 'Database setup required for user search' : 'Start typing to search for users'}
                    </div>
                  </div>
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
