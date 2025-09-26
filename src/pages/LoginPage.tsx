import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Layout, message, Space } from 'antd';
import { UserOutlined, LockOutlined, RocketOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Content } = Layout;

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const { mockLogin } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await mockLogin(values.email);
      message.success('Login successful!');
      navigate('/dashboard');
    } catch {
      message.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <Card 
          style={{ 
            width: 420, 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            borderRadius: 16,
            border: 'none'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Space direction="vertical" size="small">
              <RocketOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              <Title level={2} style={{ color: '#1890ff', marginBottom: 0 }}>
                Framework UI
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Vite + Ant Design + Apollo GraphQL
              </Text>
              <Title level={4} style={{ color: '#666', fontWeight: 'normal', marginTop: 16 }}>
                Sign in to your account
              </Title>
            </Space>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: '#1890ff' }} />} 
                placeholder="Email address" 
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined style={{ color: '#1890ff' }} />} 
                placeholder="Password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{ 
                  width: '100%', 
                  height: 44,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                  border: 'none'
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            fontSize: '13px', 
            marginTop: 24,
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: 8
          }}>
            <Text type="secondary">
              🚀 Demo credentials: Any email and password will work
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};