import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { client } from './lib/apollo-client';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { LoginPage } from './pages/LoginPage';
import { MainLayout } from './components/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const { isAuthenticated } = useAuth();
  const { themeConfig } = useTheme();

  return (
    <ApolloProvider client={client}>
      <ConfigProvider
        theme={{
          algorithm: themeConfig.algorithm,
          token: themeConfig.token,
        }}
      >
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/views/api-integration" replace /> : <LoginPage />
              } 
            />
            <Route 
              path="/views/:viewId" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/views" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              } 
            />
            {/* Legacy dashboard route - redirect to new views structure */}
            <Route 
              path="/dashboard" 
              element={<Navigate to="/views/dashboard" replace />} 
            />
            <Route 
              path="/" 
              element={<Navigate to={isAuthenticated ? "/views/api-integration" : "/login"} replace />} 
            />
          </Routes>
        </Router>
      </ConfigProvider>
    </ApolloProvider>
  );
}

export default App;
