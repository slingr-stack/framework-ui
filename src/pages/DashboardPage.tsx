import React from 'react';
import { Layout, Typography, Button, Card, Row, Col, Space, Divider, message, Badge, Tag } from 'antd';
import { 
  LogoutOutlined, 
  ThunderboltOutlined,
  DatabaseOutlined, 
  CodeOutlined,
  ApiOutlined,
  RocketOutlined,
  BugOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export const DashboardPage: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      logout();
      message.success('Logged out successfully!');
      navigate('/login');
    } catch {
      message.error('Logout failed');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Space>
          <RocketOutlined style={{ fontSize: 24, color: 'white' }} />
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            Framework UI Dashboard
          </Title>
          <Badge count="NEW" style={{ backgroundColor: '#52c41a' }}>
            <Tag color="gold">Vite + Ant Design + Apollo</Tag>
          </Badge>
        </Space>
        <Space>
          <Text style={{ color: 'white' }}>
            Welcome, {user?.name || user?.email || 'User'}
          </Text>
          <Button 
            type="primary" 
            ghost
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ borderColor: 'white', color: 'white' }}
          >
            Logout
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Card style={{ marginBottom: 24, borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center' }}>
              <Space direction="vertical" size="large">
                <div>
                  <ThunderboltOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 16 }} />
                  <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>
                    Welcome to Framework UI
                  </Title>
                  <Paragraph style={{ fontSize: 16, color: '#666', marginBottom: 0 }}>
                    This implementation combines the best of modern web development:
                    <br />
                    <Tag color="blue">Fast Development</Tag>
                    <Tag color="purple">Enterprise UI</Tag>
                    <Tag color="green">GraphQL Power</Tag>
                  </Paragraph>
                </div>
              </Space>
            </div>
          </Card>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card 
                style={{ 
                  height: '100%',
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
                headStyle={{ 
                  background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)', 
                  color: 'white',
                  borderRadius: '12px 12px 0 0'
                }}
                title={
                  <Space>
                    <RocketOutlined />
                    Frontend Stack
                  </Space>
                }
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space>
                      <ThunderboltOutlined style={{ color: '#1890ff' }} />
                      <Text strong>Vite Build Tool</Text>
                    </Space>
                    <Tag color="volcano">⚡ Fast</Tag>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space>
                      <CodeOutlined style={{ color: '#1890ff' }} />
                      <Text strong>React + TypeScript</Text>
                    </Space>
                    <Tag color="blue">Type Safe</Tag>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space>
                      <BugOutlined style={{ color: '#1890ff' }} />
                      <Text strong>Ant Design Components</Text>
                    </Space>
                    <Tag color="purple">Enterprise</Tag>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space>
                      <SafetyOutlined style={{ color: '#1890ff' }} />
                      <Text strong>React Router v6</Text>
                    </Space>
                    <Tag color="green">Modern</Tag>
                  </div>
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card 
                style={{ 
                  height: '100%',
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
                headStyle={{ 
                  background: 'linear-gradient(135deg, #722ed1 0%, #b37feb 100%)', 
                  color: 'white',
                  borderRadius: '12px 12px 0 0'
                }}
                title={
                  <Space>
                    <DatabaseOutlined />
                    API & State Management
                  </Space>
                }
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space>
                      <ApiOutlined style={{ color: '#722ed1' }} />
                      <Text strong>Apollo GraphQL Client</Text>
                    </Space>
                    <Tag color="purple">Smart Cache</Tag>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space>
                      <DatabaseOutlined style={{ color: '#722ed1' }} />
                      <Text strong>InMemory Caching</Text>
                    </Space>
                    <Tag color="cyan">Offline Ready</Tag>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space>
                      <SafetyOutlined style={{ color: '#722ed1' }} />
                      <Text strong>JWT Authentication</Text>
                    </Space>
                    <Tag color="red">Secure</Tag>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space>
                      <ThunderboltOutlined style={{ color: '#722ed1' }} />
                      <Text strong>Optimistic Updates</Text>
                    </Space>
                    <Tag color="gold">Fast UX</Tag>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          <Divider style={{ margin: '32px 0' }} />

          <Card style={{ 
            borderRadius: 12, 
            border: 'none', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)'
          }}>
            <Title level={4} style={{ color: '#1890ff', marginBottom: 16 }}>
              🎯 Why This Stack?
            </Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Card size="small" style={{ 
                  background: 'linear-gradient(135deg, #e6f7ff 0%, #ffffff 100%)', 
                  border: '1px solid #91d5ff',
                  borderRadius: 8
                }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#1890ff' }}>⚡ Lightning Fast Development</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Vite's HMR + Ant Design's ready components = rapid prototyping
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card size="small" style={{ 
                  background: 'linear-gradient(135deg, #f9f0ff 0%, #ffffff 100%)', 
                  border: '1px solid #d3adf7',
                  borderRadius: 8
                }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#722ed1' }}>🚀 Production Ready</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Enterprise-grade components with GraphQL for scalable APIs
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card size="small" style={{ 
                  background: 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)', 
                  border: '1px solid #95de64',
                  borderRadius: 8
                }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#52c41a' }}>💡 Best of Both Worlds</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Modern tooling with proven, enterprise-tested UI library
                    </Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};