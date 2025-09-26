import React from 'react';
import { Layout, Typography, Button, Card, Row, Col, Space, Divider, message } from 'antd';
import { 
  LogoutOutlined, 
  CodepenOutlined, 
  DatabaseOutlined, 
  CodeOutlined,
  ApiOutlined 
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export const DashboardPage: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      message.error('Logout failed');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#001529', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 24px'
      }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Framework UI Dashboard
        </Title>
        <Space>
          <Text style={{ color: 'white' }}>
            Welcome, {user?.name || user?.email || 'User'}
          </Text>
          <Button 
            type="primary" 
            danger 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Card style={{ marginBottom: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ color: '#1890ff' }}>
                Welcome to Framework UI
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                This is the main dashboard page. This implementation uses:
              </Text>
            </div>
          </Card>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card 
                style={{ height: '100%' }}
                headStyle={{ background: '#1890ff', color: 'white' }}
                title={
                  <Space>
                    <CodepenOutlined />
                    Frontend Stack
                  </Space>
                }
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CodeOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    <Text>React with TypeScript</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CodeOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    <Text>Create React App for build tooling</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CodeOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    <Text>Ant Design for UI components</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CodeOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    <Text>React Router for navigation</Text>
                  </div>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card 
                style={{ height: '100%' }}
                headStyle={{ background: '#52c41a', color: 'white' }}
                title={
                  <Space>
                    <DatabaseOutlined />
                    API & State Management
                  </Space>
                }
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ApiOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                    <Text>Axios for HTTP requests</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ApiOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                    <Text>RESTful API integration</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ApiOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                    <Text>JWT token authentication</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ApiOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                    <Text>Request/Response interceptors</Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Card>
            <Title level={4}>Features Implemented:</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                  <Text strong>✅ Authentication Flow</Text>
                  <br />
                  <Text type="secondary">Login/logout with JWT tokens</Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                  <Text strong>✅ Protected Routes</Text>
                  <br />
                  <Text type="secondary">Route guards and redirects</Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                  <Text strong>✅ Responsive Design</Text>
                  <br />
                  <Text type="secondary">Mobile-first approach</Text>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};