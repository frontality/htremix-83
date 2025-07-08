
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

// Input sanitization function
const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .replace(/on\w+=/gi, '')
              .trim();
};

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
const isValidPassword = (password: string): boolean => {
  return password.length >= 6 && password.length <= 128;
};

// Username validation
const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('current_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Validate the saved user data
        if (parsedUser && parsedUser.id && parsedUser.email && isValidEmail(parsedUser.email)) {
          setUser(parsedUser);
          console.log('Restored user from localStorage:', parsedUser.email);
        } else {
          localStorage.removeItem('current_user');
        }
      }
    } catch (error) {
      console.error('Error parsing saved user:', error);
      localStorage.removeItem('current_user');
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, username?: string): Promise<{ error: any }> => {
    try {
      // Sanitize and validate inputs
      const sanitizedEmail = sanitizeInput(email.toLowerCase());
      const sanitizedUsername = username ? sanitizeInput(username) : sanitizedEmail.split('@')[0];

      if (!isValidEmail(sanitizedEmail)) {
        return { error: 'Please enter a valid email address' };
      }

      if (!isValidPassword(password)) {
        return { error: 'Password must be between 6-128 characters' };
      }

      if (!isValidUsername(sanitizedUsername)) {
        return { error: 'Username must be 3-30 characters and contain only letters, numbers, and underscores' };
      }

      console.log('Starting signup process for:', sanitizedEmail);
      
      // Get existing users
      const existingUsers = localStorage.getItem('registered_users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Check if user already exists
      const userExists = users.some((u: any) => u.email === sanitizedEmail);
      if (userExists) {
        return { error: 'User already exists with this email' };
      }

      // Check if username already exists
      const usernameExists = users.some((u: any) => u.username === sanitizedUsername);
      if (usernameExists) {
        return { error: 'Username already taken' };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: sanitizedEmail,
        username: sanitizedUsername,
        created_at: new Date().toISOString()
      };

      // Save user to registered users (with hashed password simulation)
      const userWithPassword = { ...newUser, password: btoa(password) }; // Simple encoding for demo
      users.push(userWithPassword);
      localStorage.setItem('registered_users', JSON.stringify(users));

      // Set as current user (without password)
      setUser(newUser);
      localStorage.setItem('current_user', JSON.stringify(newUser));

      console.log('User signed up successfully');
      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error: 'Signup failed. Please try again.' };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: any }> => {
    try {
      // Sanitize and validate inputs
      const sanitizedEmail = sanitizeInput(email.toLowerCase());

      if (!isValidEmail(sanitizedEmail)) {
        return { error: 'Please enter a valid email address' };
      }

      if (!isValidPassword(password)) {
        return { error: 'Invalid credentials' };
      }

      console.log('Attempting login for:', sanitizedEmail);
      
      // Get registered users
      const existingUsers = localStorage.getItem('registered_users');
      if (!existingUsers) {
        return { error: 'No account found with this email' };
      }

      const users = JSON.parse(existingUsers);
      
      // Find user with matching email and password
      const foundUser = users.find((u: any) => 
        u.email === sanitizedEmail && u.password === btoa(password)
      );
      
      if (!foundUser) {
        return { error: 'Invalid email or password' };
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

      console.log('User logged in successfully');
      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Login failed. Please try again.' };
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<{ error: any }> => {
    try {
      if (!user) {
        return { error: 'No user logged in' };
      }

      // Sanitize and validate updates
      const sanitizedUpdates: Partial<User> = {};
      
      if (updates.email) {
        const sanitizedEmail = sanitizeInput(updates.email.toLowerCase());
        if (!isValidEmail(sanitizedEmail)) {
          return { error: 'Please enter a valid email address' };
        }
        sanitizedUpdates.email = sanitizedEmail;
      }

      if (updates.username) {
        const sanitizedUsername = sanitizeInput(updates.username);
        if (!isValidUsername(sanitizedUsername)) {
          return { error: 'Username must be 3-30 characters and contain only letters, numbers, and underscores' };
        }
        sanitizedUpdates.username = sanitizedUsername;
      }

      console.log('Updating user profile');

      // Get existing users
      const existingUsers = localStorage.getItem('registered_users');
      if (!existingUsers) {
        return { error: 'No users found' };
      }

      const users = JSON.parse(existingUsers);
      
      // Check if email/username is being updated and already exists
      if (sanitizedUpdates.email && sanitizedUpdates.email !== user.email) {
        const emailExists = users.some((u: any) => u.email === sanitizedUpdates.email && u.id !== user.id);
        if (emailExists) {
          return { error: 'Email already taken' };
        }
      }

      if (sanitizedUpdates.username && sanitizedUpdates.username !== user.username) {
        const usernameExists = users.some((u: any) => u.username === sanitizedUpdates.username && u.id !== user.id);
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
      users[userIndex] = { ...users[userIndex], ...sanitizedUpdates };
      localStorage.setItem('registered_users', JSON.stringify(users));

      // Update current user
      const updatedUser = { ...user, ...sanitizedUpdates };
      setUser(updatedUser);
      localStorage.setItem('current_user', JSON.stringify(updatedUser));

      console.log('User profile updated successfully');
      return { error: null };
    } catch (error) {
      console.error('Profile update error:', error);
      return { error: 'Profile update failed. Please try again.' };
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
