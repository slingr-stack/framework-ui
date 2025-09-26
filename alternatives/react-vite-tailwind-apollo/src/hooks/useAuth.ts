import { useState, useEffect } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('authToken');
    setAuthState({
      isAuthenticated: !!token,
      token,
      isLoading: false,
    });
  }, []);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setAuthState({
      isAuthenticated: true,
      token,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({
      isAuthenticated: false,
      token: null,
      isLoading: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};