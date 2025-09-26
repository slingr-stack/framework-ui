import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin, Layout } from 'antd';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Spin size="large" tip="Loading..." style={{ color: 'white' }} />
      </Layout>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};