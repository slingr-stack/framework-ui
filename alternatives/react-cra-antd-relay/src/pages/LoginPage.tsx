import React from 'react';
import { Form, Input, Button, Card, Typography, Layout, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Content } = Layout;

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const { login, loginLoading, loginError } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      message.error('Login failed. Please try again.');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card 
          style={{ 
            width: 400, 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: 8
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>
              Framework UI
            </Title>
            <Title level={4} style={{ color: '#666', fontWeight: 'normal' }}>
              Sign in to your account
            </Title>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Email address" 
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Password"
                autoComplete="current-password"
              />
            </Form.Item>

            {loginError && (
              <div style={{ 
                color: '#ff4d4f', 
                marginBottom: 16, 
                textAlign: 'center',
                fontSize: '14px'
              }}>
                {loginError}
              </div>
            )}

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loginLoading}
                style={{ width: '100%' }}
              >
                {loginLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', color: '#666', fontSize: '12px' }}>
            Demo credentials: Any email and password will work
          </div>
        </Card>
      </Content>
    </Layout>
  );
};