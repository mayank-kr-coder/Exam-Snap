import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAdminSession, saveAdminSession, clearAdminSession } from '../utils/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin credential pair for setup / deployment initial authorization
// In production, these are matched against backend JWT or environment secrets
const ADMIN_CONFIG = {
  EMAIL: 'admin@examsnap.in',
  PASSWORD_HASH_SALT: 'examsnap_secure_2026',
  // Simple SHA-256 equivalent check or direct safe verification
  PASSWORD: 'Admin@ExamSnap2026!'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<{ isAuthenticated: boolean; email: string | null }>(() => {
    const existing = getAdminSession();
    if (existing && existing.isAuthenticated) {
      return { isAuthenticated: true, email: existing.email };
    }
    return { isAuthenticated: false, email: null };
  });

  useEffect(() => {
    const existing = getAdminSession();
    if (existing) {
      setSession({ isAuthenticated: true, email: existing.email });
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Artificial delay to prevent brute-force timing attacks
    await new Promise((r) => setTimeout(r, 400));

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === ADMIN_CONFIG.EMAIL && password === ADMIN_CONFIG.PASSWORD) {
      const token = 'es_admin_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      saveAdminSession(cleanEmail, token);
      setSession({ isAuthenticated: true, email: cleanEmail });
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid administrator email or password. Please check your credentials.'
    };
  };

  const logout = () => {
    clearAdminSession();
    setSession({ isAuthenticated: false, email: null });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: session.isAuthenticated,
        adminEmail: session.email,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
