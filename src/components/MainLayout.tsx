import React, { useState } from 'react';
import { Layout, Typography, Button, Space, Badge, Tag, Avatar, Tooltip, Collapse, Modal, Tabs, Spin } from 'antd';
import { 
  LogoutOutlined, 
  RocketOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { viewRegistry, getViewCategories, getViewsByCategory } from '../registry/viewRegistry';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

export const MainLayout: React.FC = () => {
  const { viewId } = useParams<{ viewId: string }>();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isCodeModalVisible, setIsCodeModalVisible] = useState(false);

  const currentView = viewId ? viewRegistry[viewId] : viewRegistry.dashboard;
  const categories = getViewCategories();

  const handleLogout = async () => {
    try {
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleMenuClick = (key: string) => {
    navigate(`/views/${key}`);
  };

  const showCodeModal = () => {
    setIsCodeModalVisible(true);
  };

  const handleCodeModalClose = () => {
    setIsCodeModalVisible(false);
  };



  const renderMenuItems = () => {
    return categories.map(category => {
      const views = getViewsByCategory(category);
      return (
        <Panel 
          header={
            <Text strong style={{ color: '#1890ff' }}>
              {category}
            </Text>
          } 
          key={category}
        >
          {views.map(({ config }) => (
            <div
              key={config.id}
              onClick={() => handleMenuClick(config.id)}
              style={{
                padding: '8px 12px',
                margin: '4px 0',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: currentView?.config.id === config.id ? '#e6f7ff' : 'transparent',
                border: currentView?.config.id === config.id ? '1px solid #91d5ff' : '1px solid transparent',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (currentView?.config.id !== config.id) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView?.config.id !== config.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Space>
                {config.icon && <config.icon style={{ color: '#1890ff' }} />}
                <div style={{ fontWeight: currentView?.config.id === config.id ? 'bold' : 'normal' }}>
                  {config.title}
                </div>
              </Space>
            </div>
          ))}
        </Panel>
      );
    });
  };

  const renderContent = () => {
    if (!currentView) {
      return (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Title level={3}>View not found</Title>
          <Text>The requested view could not be found.</Text>
        </div>
      );
    }

    const ViewComponent = currentView.component;
    return <ViewComponent config={currentView.config} />;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        <Space>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: 'white', fontSize: '16px' }}
          />
          <RocketOutlined style={{ fontSize: 24, color: 'white' }} />
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            Framework UI
          </Title>
          <Badge count="NEW" style={{ backgroundColor: '#52c41a' }}>
            <Tag color="gold">Custom Views</Tag>
          </Badge>
        </Space>
        <Space>
          <Button
            type="text"
            icon={<CodeOutlined />}
            onClick={showCodeModal}
            style={{ color: 'white' }}
          >
            View Code
          </Button>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text style={{ color: 'white' }}>
            {user?.name || user?.email || 'User'}
          </Text>
          <Tooltip title="Logout">
            <Button 
              type="text" 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ color: 'white' }}
            />
          </Tooltip>
        </Space>
      </Header>

      <Layout>
        <Sider 
          width={collapsed ? 80 : 300} 
          style={{ 
            background: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            zIndex: 999
          }}
          collapsible
          collapsed={collapsed}
          trigger={null}
        >
          <div style={{ 
            padding: collapsed ? '16px 8px' : '16px', 
            borderBottom: '1px solid #f0f0f0',
            background: '#fafafa'
          }}>
            {!collapsed ? (
              <div>
                <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
                  Navigation
                </Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Select a view to explore different components
                </Text>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <RocketOutlined style={{ fontSize: 20, color: '#1890ff' }} />
              </div>
            )}
          </div>
          
          <div style={{ 
            padding: collapsed ? '8px' : '16px', 
            height: 'calc(100vh - 120px)', 
            overflowY: 'auto' 
          }}>
            {!collapsed ? (
              <Collapse 
                ghost 
                defaultActiveKey={categories}
                expandIconPosition="right"
              >
                {renderMenuItems()}
              </Collapse>
            ) : (
              <div>
                {Object.values(viewRegistry).map(({ config }) => (
                  <Tooltip key={config.id} title={config.title} placement="right">
                    <div
                      onClick={() => handleMenuClick(config.id)}
                      style={{
                        padding: '12px',
                        margin: '8px 0',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        backgroundColor: currentView?.config.id === config.id ? '#e6f7ff' : 'transparent',
                        border: currentView?.config.id === config.id ? '1px solid #91d5ff' : '1px solid transparent'
                      }}
                    >
                      {config.icon && <config.icon style={{ color: '#1890ff', fontSize: 18 }} />}
                    </div>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        </Sider>

        <Content style={{ 
          padding: 0,
          background: '#f0f2f5',
          minHeight: 'calc(100vh - 64px)',
          overflow: 'hidden'
        }}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {renderContent()}
          </div>
        </Content>
      </Layout>

      <Modal
        title={
          <Space>
            <CodeOutlined />
            {`Source Code - ${currentView?.config.title || 'View'}`}
          </Space>
        }
        open={isCodeModalVisible}
        onCancel={handleCodeModalClose}
        footer={null}
        width="80%"
        style={{ top: 20 }}
      >
        <CodeViewer viewId={viewId || 'dashboard'} />
      </Modal>
    </Layout>
  );
};

// Code Viewer Component
const CodeViewer: React.FC<{ viewId: string }> = ({ viewId }) => {
  const [sourceCode, setSourceCode] = useState<{ [filename: string]: string }>({});
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchCode = async () => {
      setLoading(true);
      
      // Mapping of view IDs to their source files with actual content structure
      const viewFileMap: { [key: string]: { [filename: string]: string } } = {
        dashboard: {
          'views/DashboardView.tsx': `import { Card, Row, Col, Statistic, Progress, Typography, Space } from 'antd';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  DollarOutlined,
  RiseOutlined,
  TrophyOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { ViewContainer } from '../components/ViewContainer';
import type { ViewComponent } from '../types/view';

const { Text } = Typography;

export const DashboardView: ViewComponent = ({ config }) => {
  return (
    <ViewContainer config={config}>
      <div style={{ padding: 16 }}>
        <Row gutter={[16, 16]}>
          {/* Statistics Cards */}
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={11280}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          {/* More components... */}
        </Row>
      </div>
    </ViewContainer>
  );
};`
        },
        'ant-design': {
          'views/AntDesignShowcaseView.tsx': `import { useState } from 'react';
import { 
  Card, Row, Col, Button, Input, Select, Checkbox, Radio, Switch, Slider,
  Rate, Progress, Spin, Alert, Tag, Badge, Avatar, Tooltip, Popover,
  Modal, message, notification, Typography, Space, Upload, Table,
  Pagination, Steps, Breadcrumb, Menu, Tabs
} from 'antd';

export const AntDesignShowcaseView: ViewComponent = ({ config }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  return (
    <ViewContainer config={config}>
      <div style={{ padding: 16 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Form Controls" key="1">
            {/* Form controls implementation */}
          </TabPane>
          <TabPane tab="Data Display" key="2">
            {/* Data display components */}
          </TabPane>
          <TabPane tab="Interaction" key="3">
            {/* Interactive components */}
          </TabPane>
        </Tabs>
      </div>
    </ViewContainer>
  );
};`
        },
        graphql: {
          'views/GraphQLView.tsx': `import { useState } from 'react';
import { 
  Card, Row, Col, Button, Input, List, Avatar, Typography, 
  Space, Spin, Alert, Form, Modal, message
} from 'antd';
import { ViewContainer } from '../components/ViewContainer';

export const GraphQLView: ViewComponent = ({ config }) => {
  const [mockData, setMockData] = useState(initialUsers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  return (
    <ViewContainer config={config}>
      <div style={{ padding: 16 }}>
        <Alert
          message="GraphQL Integration Demo"
          description="This demonstrates Apollo Client integration"
          type="info"
        />
        {/* GraphQL examples and user management */}
      </div>
    </ViewContainer>
  );
};`
        },
        forms: {
          'views/FormView.tsx': `import { useState } from 'react';
import { 
  Card, Row, Col, Form, Input, Select, DatePicker, Radio, Checkbox,
  Switch, Slider, Rate, Upload, Button, Typography, Space, message
} from 'antd';

export const FormView: ViewComponent = ({ config }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  return (
    <ViewContainer config={config}>
      <div style={{ padding: 16 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Complex form implementation */}
        </Form>
      </div>
    </ViewContainer>
  );
};`
        }
      };

      const commonFiles = {
        'components/MainLayout.tsx': `import React, { useState } from 'react';
import { Layout, Typography, Button, Space, Badge, Tag, Avatar, Tooltip, Collapse } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { viewRegistry, getViewCategories, getViewsByCategory } from '../registry/viewRegistry';

export const MainLayout: React.FC = () => {
  const { viewId } = useParams<{ viewId: string }>();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header with navigation */}
      <Header>
        {/* Navigation and user controls */}
      </Header>
      
      <Layout>
        {/* Collapsible sidebar */}
        <Sider>
          {/* View navigation */}
        </Sider>
        
        {/* Main content area */}
        <Content>
          {/* Dynamic view rendering */}
        </Content>
      </Layout>
    </Layout>
  );
};`,
        'components/ViewContainer.tsx': `import React from 'react';
import { Card, Typography } from 'antd';
import type { ViewProps } from '../types/view';

export const ViewContainer: React.FC<ViewProps & { children: React.ReactNode }> = ({ 
  config, 
  children 
}) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Card size="small">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {config.icon && <config.icon style={{ fontSize: 20, color: '#1890ff' }} />}
          <div>
            <Typography.Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              {config.title}
            </Typography.Title>
            {config.description && (
              <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                {config.description}
              </Typography.Text>
            )}
          </div>
        </div>
      </Card>
      
      <div style={{ flex: 1, minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
};`,
        'registry/viewRegistry.ts': `import { 
  DashboardOutlined, 
  ExperimentOutlined, 
  ApiOutlined, 
  FormOutlined,
  BugOutlined
} from '@ant-design/icons';
import type { ViewConfig, ViewComponent } from '../types/view';

export interface ViewRegistryEntry {
  config: ViewConfig;
  component: ViewComponent;
}

export const viewRegistry: Record<string, ViewRegistryEntry> = {
  dashboard: {
    config: {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Analytics and overview dashboard',
      icon: DashboardOutlined,
      category: 'Analytics'
    },
    component: DashboardView
  },
  // ... other views
};`
      };

      const files = { ...commonFiles, ...(viewFileMap[viewId] || {}) };
      setSourceCode(files);
      setLoading(false);
    };

    fetchCode();
  }, [viewId]);

  if (loading) {
    return <Spin tip="Loading source code..." style={{ display: 'block', textAlign: 'center', padding: 50 }} />;
  }

  const fileNames = Object.keys(sourceCode);

  return (
    <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
      <Tabs defaultActiveKey={fileNames[0]} type="card">
        {fileNames.map(filename => (
          <TabPane tab={filename.split('/').pop()} key={filename}>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: 16, 
              borderRadius: 4, 
              fontSize: 12,
              overflow: 'auto',
              maxHeight: '60vh'
            }}>
              <code>{sourceCode[filename]}</code>
            </pre>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};