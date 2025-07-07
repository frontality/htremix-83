
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: any }>;
  signOut: () => void;
  loading: boolean;
  updateUserProfile: (updates: Partial<User>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log('Restored user from localStorage:', parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('current_user');
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, username?: string): Promise<{ error: any }> => {
    try {
      console.log('Starting signup process for:', email, 'with username:', username);
      
      // Get existing users
      const existingUsers = localStorage.getItem('registered_users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Check if user already exists
      const userExists = users.some((u: any) => u.email === email);
      if (userExists) {
        console.log('User already exists with email:', email);
        return { error: 'User already exists' };
      }

      // Check if username already exists (if provided)
      if (username) {
        const usernameExists = users.some((u: any) => u.username === username);
        if (usernameExists) {
          console.log('Username already taken:', username);
          return { error: 'Username already taken' };
        }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        username: username || email.split('@')[0],
        created_at: new Date().toISOString()
      };

      // Save user to registered users (with password)
      const userWithPassword = { ...newUser, password };
      users.push(userWithPassword);
      localStorage.setItem('registered_users', JSON.stringify(users));

      // Set as current user (without password)
      setUser(newUser);
      localStorage.setItem('current_user', JSON.stringify(newUser));

      console.log('User signed up successfully:', newUser);
      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error: 'Signup failed' };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: any }> => {
    try {
      console.log('Attempting login for:', email);
      
      // Get registered users
      const existingUsers = localStorage.getItem('registered_users');
      if (!existingUsers) {
        console.log('No registered users found');
        return { error: 'No users found' };
      }

      const users = JSON.parse(existingUsers);
      
      // Find user with matching email and password
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      if (!foundUser) {
        console.log('Invalid credentials for:', email);
        return { error: 'Invalid credentials' };
      }

      // Set as current user (without password in the state)
      const userWithoutPassword: User = {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
        created_at: foundUser.created_at
      };
      
      setUser(userWithoutPassword);
      localStorage.setItem('current_user', JSON.stringify(userWithoutPassword));

      console.log('User logged in successfully:', userWithoutPassword);
      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Login failed' };
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<{ error: any }> => {
    try {
      if (!user) {
        return { error: 'No user logged in' };
      }

      console.log('Updating user profile:', updates);

      // Get existing users
      const existingUsers = localStorage.getItem('registered_users');
      if (!existingUsers) {
        return { error: 'No users found' };
      }

      const users = JSON.parse(existingUsers);
      
      // Check if username is being updated and already exists
      if (updates.username && updates.username !== user.username) {
        const usernameExists = users.some((u: any) => u.username === updates.username && u.id !== user.id);
        if (usernameExists) {
          return { error: 'Username already taken' };
        }
      }

      // Find and update the user
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex === -1) {
        return { error: 'User not found' };
      }

      // Update user in registered users
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('registered_users', JSON.stringify(users));

      // Update current user
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('current_user', JSON.stringify(updatedUser));

      console.log('User profile updated successfully:', updatedUser);
      return { error: null };
    } catch (error) {
      console.error('Profile update error:', error);
      return { error: 'Profile update failed' };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('current_user');
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      signUp,
      signOut,
      loading,
      updateUserProfile
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
