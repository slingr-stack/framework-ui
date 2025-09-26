import { useState, useEffect } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  user: { id: string; email: string; name: string } | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('authUser');
    let user = null;
    
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {
        // Invalid user data, clear it
        localStorage.removeItem('authUser');
      }
    }

    setAuthState({
      isAuthenticated: !!token,
      token,
      user,
      isLoading: false,
    });
  }, []);

  const login = (token: string, user: { id: string; email: string; name: string }) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    setAuthState({
      isAuthenticated: true,
      token,
      user,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
      isLoading: false,
    });
  };

  // Mock login for demo purposes
  const mockLogin = async (email: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockUser = { id: '1', email, name: 'Demo User' };
    
    login(mockToken, mockUser);
  };

  return {
    ...authState,
    login,
    logout,
    mockLogin,
  };
};