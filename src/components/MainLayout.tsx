import React, { useState } from 'react';
import { Layout, Typography, Button, Space, Badge, Tag, Avatar, Tooltip, Collapse } from 'antd';
import { 
  LogoutOutlined, 
  RocketOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemeSelector } from './ThemeSelector';
import { viewRegistry, getViewCategories, getViewsByCategory, getTopLevelViews } from '../registry/viewRegistry';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;

export const MainLayout: React.FC = () => {
  const { viewId } = useParams<{ viewId: string }>();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const currentView = viewId ? viewRegistry[viewId] : viewRegistry['api-integration'];
  const categories = getViewCategories();
  const topLevelViews = getTopLevelViews();

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



  const renderMenuItems = () => {
    const result: React.ReactNode[] = [];
    
    // Add top-level views first
    topLevelViews.forEach(({ config }) => {
      result.push(
        <div
          key={config.id}
          onClick={() => handleMenuClick(config.id)}
          style={{
            padding: '12px 16px',
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
      );
    });

    // Add categories with sub-items
    const categoryPanels = categories.map(category => {
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

    return (
      <div>
        {/* Top level items */}
        {result}
        
        {/* Categorized items */}
        {categoryPanels.length > 0 && (
          <Collapse 
            ghost 
            defaultActiveKey={categories}
            expandIconPosition="right"
            style={{ marginTop: 8 }}
          >
            {categoryPanels}
          </Collapse>
        )}
      </div>
    );
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
          <ThemeSelector />
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
              renderMenuItems()
            ) : (
              <div>
                {[...topLevelViews, ...categories.flatMap(cat => getViewsByCategory(cat))].map(({ config }) => (
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
    </Layout>
  );
};
