import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { graphqlClient, LOGIN_MUTATION } from '@/lib/graphql-client';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

interface LoginResponse {
  login: {
    token: string;
    user: User;
  };
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('authToken');
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: !!token,
      token,
      isLoading: false,
    }));
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const data = await graphqlClient.request<LoginResponse>(LOGIN_MUTATION, { email, password });
      return data.login;
    },
    onSuccess: (data) => {
      const { token, user } = data;
      localStorage.setItem('authToken', token);
      setAuthState({
        isAuthenticated: true,
        token,
        user,
        isLoading: false,
      });
    },
  });

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
      isLoading: false,
    });
  };

  // Mock login for demo purposes
  const mockLogin = (email: string) => {
    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockUser = { id: '1', email, name: 'Demo User' };
    
    localStorage.setItem('authToken', mockToken);
    setAuthState({
      isAuthenticated: true,
      token: mockToken,
      user: mockUser,
      isLoading: false,
    });
  };

  return {
    ...authState,
    login: loginMutation.mutate,
    mockLogin,
    logout,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
  };
};