import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, UserRole } from '@/types/university';
import { mockUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  authenticatedFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('university_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role?: UserRole): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json();
        console.error('Login failed:', errorData.message);
        return false;
      }

      const data = await response.json();
      const { token, user: userData } = data;

      // Store the token and user data
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('university_user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Network error or unexpected issue:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('university_user');
    navigate('/erp'); // Redirect to ERP login page after logout
  };

  const authenticatedFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const token = localStorage.getItem('jwt_token');
    const headers = {
      ...init?.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return fetch(input, { ...init, headers });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        authenticatedFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
