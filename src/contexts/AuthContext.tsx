
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, username?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (email: string, password: string, username?: string): Promise<boolean> => {
    try {
      // Get existing users
      const existingUsers = localStorage.getItem('registered_users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Check if user already exists
      const userExists = users.some((u: any) => u.email === email);
      if (userExists) {
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        username: username || email.split('@')[0],
        created_at: new Date().toISOString()
      };

      // Save user to registered users
      users.push({ ...newUser, password });
      localStorage.setItem('registered_users', JSON.stringify(users));

      // Set as current user
      setUser(newUser);
      localStorage.setItem('current_user', JSON.stringify(newUser));

      console.log('User signed up successfully:', newUser);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get registered users
      const existingUsers = localStorage.getItem('registered_users');
      if (!existingUsers) {
        return false;
      }

      const users = JSON.parse(existingUsers);
      
      // Find user with matching email and password
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      if (!foundUser) {
        return false;
      }

      // Set as current user (without password in the state)
      const userWithoutPassword = {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
        created_at: foundUser.created_at
      };
      
      setUser(userWithoutPassword);
      localStorage.setItem('current_user', JSON.stringify(userWithoutPassword));

      console.log('User logged in successfully:', userWithoutPassword);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
