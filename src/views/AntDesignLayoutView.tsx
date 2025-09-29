import { useState } from 'react';
import { 
  Layout, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Breadcrumb, 
  Menu, 
  Drawer, 
  Affix,
  BackTop,
  Anchor
} from 'antd';
import { 
  HomeOutlined, 
  UserOutlined, 
  UpOutlined,
  MenuOutlined,
  SettingOutlined,
  FileOutlined
} from '@ant-design/icons';
import { ViewContainer } from '../components/ViewContainer';
import type { ViewComponent } from '../types/view';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Link } = Anchor;

export const AntDesignLayoutView: ViewComponent = ({ config }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
      children: [
        { key: 'user-list', label: 'User List' },
        { key: 'user-profile', label: 'User Profile' },
      ],
    },
    {
      key: 'documents',
      icon: <FileOutlined />,
      label: 'Documents',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  return (
    <ViewContainer config={config}>
      <div style={{ padding: 16 }}>
        <Row gutter={[16, 16]}>
          {/* Basic Layout */}
          <Col span={24}>
            <Card title="Basic Layout Components" style={{ marginBottom: 16 }}>
              <Layout style={{ minHeight: 200, background: '#f0f2f5' }}>
                <Header style={{ background: '#001529', color: 'white', display: 'flex', alignItems: 'center' }}>
                  <Title level={4} style={{ color: 'white', margin: 0 }}>Header</Title>
                </Header>
                <Layout>
                  <Sider width={200} style={{ background: '#fff' }}>
                    <div style={{ padding: 16, textAlign: 'center', background: '#f6f6f6' }}>
                      Sider
                    </div>
                  </Sider>
                  <Content style={{ padding: 16, background: '#fff' }}>
                    <div style={{ padding: 24, background: '#f0f2f5', textAlign: 'center' }}>
                      Content Area
                    </div>
                  </Content>
                </Layout>
                <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
                  Footer
                </Footer>
              </Layout>
            </Card>
          </Col>

          {/* Navigation Components */}
          <Col xs={24} lg={12}>
            <Card title="Breadcrumb Navigation" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Breadcrumb>
                  <Breadcrumb.Item href="">
                    <HomeOutlined />
                  </Breadcrumb.Item>
                  <Breadcrumb.Item href="">
                    Application Center
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>Application List</Breadcrumb.Item>
                  <Breadcrumb.Item>An Application</Breadcrumb.Item>
                </Breadcrumb>
                
                <Breadcrumb separator=">">
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item>Application Center</Breadcrumb.Item>
                  <Breadcrumb.Item>Application List</Breadcrumb.Item>
                </Breadcrumb>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Menu Component" style={{ marginBottom: 16 }}>
              <Menu
                mode="vertical"
                defaultSelectedKeys={['home']}
                defaultOpenKeys={['users']}
                items={menuItems}
                style={{ border: 'none' }}
              />
            </Card>
          </Col>

          {/* Responsive Features */}
          <Col xs={24} lg={12}>
            <Card title="Drawer (Mobile Menu)" style={{ marginBottom: 16 }}>
              <Space>
                <MenuOutlined 
                  style={{ fontSize: 18, cursor: 'pointer' }} 
                  onClick={() => setDrawerVisible(true)}
                />
                <Text>Click to open mobile drawer menu</Text>
              </Space>
              
              <Drawer
                title="Navigation Menu"
                placement="left"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
              >
                <Menu
                  mode="vertical"
                  defaultSelectedKeys={['home']}
                  items={menuItems}
                  style={{ border: 'none' }}
                />
              </Drawer>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Anchor & BackTop" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Anchor
                  direction="horizontal"
                  items={[
                    { key: 'basic-demo', href: '#basic-demo', title: 'Basic Demo' },
                    { key: 'static-demo', href: '#static-demo', title: 'Static Demo' },
                    { key: 'basic-demo-with-replace', href: '#basic-demo-with-replace', title: 'Basic Demo With Replace' },
                  ]}
                />
                <Text type="secondary">Anchor for page navigation</Text>
                <BackTop>
                  <div style={{
                    height: 40,
                    width: 40,
                    lineHeight: '40px',
                    borderRadius: 4,
                    backgroundColor: '#1677ff',
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 14,
                  }}>
                    <UpOutlined />
                  </div>
                </BackTop>
              </Space>
            </Card>
          </Col>

          {/* Affix Demo */}
          <Col span={24}>
            <Card title="Affix (Sticky Elements)">
              <div style={{ height: 200, overflow: 'auto', border: '1px solid #e8e8e8', padding: 16 }}>
                <Affix offsetTop={10}>
                  <div style={{ 
                    background: '#1677ff', 
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: 4,
                    marginBottom: 16
                  }}>
                    Affix Element (Sticky)
                  </div>
                </Affix>
                <Paragraph>
                  This is some content below the affix element. Scroll within this container to see the affix behavior.
                </Paragraph>
                <Paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Paragraph>
                <Paragraph>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Paragraph>
                <Paragraph>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </Paragraph>
                <Paragraph>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Paragraph>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </ViewContainer>
  );
};