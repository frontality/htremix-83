
import { useState, useEffect } from "react";
import { Search, User, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

interface UserSearchProps {
  onSelectUser: (userId: string) => void;
  onClose: () => void;
  showMessageButton?: boolean;
}

interface SearchedUser {
  id: string;
  username: string;
  email: string;
}

const UserSearch = ({ onSelectUser, onClose, showMessageButton = false }: UserSearchProps) => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<SearchedUser[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = (term: string) => {
    if (!term.trim() || !user) {
      setUsers([]);
      return;
    }

    setLoading(true);
    
    // Get all registered users from localStorage
    const allUsers = localStorage.getItem('registered_users');
    if (allUsers) {
      const userList = JSON.parse(allUsers);
      const filteredUsers = userList
        .filter((u: any) => 
          u.id !== user.id && 
          (u.email.toLowerCase().includes(term.toLowerCase()) || 
           (u.username && u.username.toLowerCase().includes(term.toLowerCase())))
        )
        .slice(0, 10)
        .map((u: any) => ({
          id: u.id,
          username: u.username || u.email.split('@')[0],
          email: u.email
        }));
      
      setUsers(filteredUsers);
    } else {
      setUsers([]);
    }
    
    setLoading(false);
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
          placeholder="Search users by email or username..."
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
          users.map((searchUser) => (
            <div
              key={searchUser.id}
              className={`flex items-center space-x-3 p-3 rounded-lg ${currentTheme.secondary} hover:${currentTheme.primary} transition-colors cursor-pointer`}
              onClick={() => handleSelectUser(searchUser.id)}
            >
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                {searchUser.username[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${currentTheme.text}`}>
                  @{searchUser.username}
                </p>
                {/* Removed email display for privacy */}
              </div>
              {showMessageButton ? (
                <MessageCircle className="h-4 w-4 text-gray-400" />
              ) : (
                <div className={`text-xs ${currentTheme.muted}`}>
                  Add Friend
                </div>
              )}
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
