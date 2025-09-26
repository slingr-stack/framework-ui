import { useState, useEffect, useCallback } from 'react';
import { authAPI, User } from '../lib/api-client';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
    isLoading: true,
  });

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthState({
        isAuthenticated: true,
        token,
        user: null, // User data would be fetched from API in real app
        isLoading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoginLoading(true);
    setLoginError(null);
    
    try {
      // Use mock login for demo purposes
      const result = await authAPI.mockLogin(email);
      
      localStorage.setItem('authToken', result.token);
      setAuthState({
        isAuthenticated: true,
        token: result.token,
        user: result.user,
        isLoading: false,
      });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setLoginError(errorMessage);
      throw error;
    } finally {
      setLoginLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // In a real app, we'd call the logout API
      // await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setAuthState({
        isAuthenticated: false,
        token: null,
        user: null,
        isLoading: false,
      });
    }
  }, []);

  return {
    ...authState,
    login,
    logout,
    loginLoading,
    loginError,
  };
};