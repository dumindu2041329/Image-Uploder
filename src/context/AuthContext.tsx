import React, { createContext, useContext, useEffect, useState } from 'react';
import Parse, { isParseInitialized } from '../lib/parse';

interface AuthContextType {
  user: Parse.User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Parse.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      // Safety check: Don't try to fetch user if Parse isn't initialized
      if (!isParseInitialized()) {
        console.warn("Parse not initialized, skipping user check");
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await Parse.User.currentAsync();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking current user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isParseInitialized()) {
        await Parse.User.logOut();
        setUser(null);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
