
import { User } from '../types';

const TOKEN_KEY = 'medimind_auth_token';
const USER_KEY = 'medimind_user_data';
const USERS_DB_KEY = 'medimind_database_users';

export const authService = {
  // Get all registered users from local storage
  getRegisteredUsers: (): User[] => {
    const users = localStorage.getItem(USERS_DB_KEY);
    return users ? JSON.parse(users) : [];
  },

  generateToken: () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  },

  login: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = authService.getRegisteredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error("No account found with this email.");
    }

    // In this mock, we accept any password for valid emails for UX, 
    // but we ensure the user exists in our "DB"
    const token = authService.generateToken();
    const authenticatedUser = { ...user, isLoggedIn: true, token };

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(authenticatedUser));
    return authenticatedUser;
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = authService.getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }

    const newUser: User = {
      id: 'u-' + Math.random().toString(36).substring(7),
      name: name,
      email: email,
      isLoggedIn: true,
    };

    const token = authService.generateToken();
    const authenticatedUser = { ...newUser, token };

    // Save to our "Database"
    localStorage.setItem(USERS_DB_KEY, JSON.stringify([...users, newUser]));
    
    // Set as current session
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(authenticatedUser));
    
    return authenticatedUser;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (userStr && token) {
      return JSON.parse(userStr);
    }
    return null;
  },

  resetPassword: async (email: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`Password reset link sent to ${email}`);
  }
};
