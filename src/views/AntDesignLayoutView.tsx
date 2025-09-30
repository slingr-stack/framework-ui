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
  Anchor,
  Button,
  Modal
} from 'antd';
import { 
  HomeOutlined, 
  UserOutlined, 
  UpOutlined,
  MenuOutlined,
  SettingOutlined,
  FileOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { ViewContainer } from '../components/ViewContainer';
import type { ViewComponent } from '../types/view';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

export const AntDesignLayoutView: ViewComponent = ({ config }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [codeModalVisible, setCodeModalVisible] = useState(false);
  const [selectedCodeExample, setSelectedCodeExample] = useState('');
  const [selectedCodeTitle, setSelectedCodeTitle] = useState('');

  const layoutCodeExamples = {
    'basic-layout': `// Basic Layout Structure
import { Layout } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

<Layout style={{ minHeight: '100vh' }}>
  <Header style={{ 
    background: '#001529', 
    color: 'white', 
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center'
  }}>
    <h1 style={{ color: 'white', margin: 0 }}>My App</h1>
  </Header>
  <Layout>
    <Sider width={200} style={{ background: '#fff' }}>
      <Menu mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">Navigation One</Menu.Item>
        <Menu.Item key="2">Navigation Two</Menu.Item>
      </Menu>
    </Sider>
    <Content style={{ padding: '24px', background: '#fff' }}>
      Main content area
    </Content>
  </Layout>
  <Footer style={{ textAlign: 'center' }}>
    My App ©2024
  </Footer>
</Layout>`,

    'breadcrumb': `// Breadcrumb Navigation
import { Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

<Breadcrumb>
  <Breadcrumb.Item href="/">
    <HomeOutlined />
  </Breadcrumb.Item>
  <Breadcrumb.Item href="/users">
    <UserOutlined />
    <span>Users</span>
  </Breadcrumb.Item>
  <Breadcrumb.Item>Profile</Breadcrumb.Item>
</Breadcrumb>`,

    'menu': `// Menu Component
import { Menu } from 'antd';
import { HomeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';

<Menu mode="vertical" defaultSelectedKeys={['home']}>
  <Menu.Item key="home" icon={<HomeOutlined />}>
    Home
  </Menu.Item>
  <Menu.SubMenu key="users" icon={<UserOutlined />} title="Users">
    <Menu.Item key="user-list">User List</Menu.Item>
    <Menu.Item key="user-profile">User Profile</Menu.Item>
  </Menu.SubMenu>
  <Menu.Item key="settings" icon={<SettingOutlined />}>
    Settings
  </Menu.Item>
</Menu>`,

    'drawer': `// Drawer Component
import { Drawer, Button } from 'antd';
import { useState } from 'react';

const [visible, setVisible] = useState(false);

<Button type="primary" onClick={() => setVisible(true)}>
  Open Drawer
</Button>
<Drawer
  title="Navigation Menu"
  placement="left"
  onClose={() => setVisible(false)}
  open={visible}
>
  <p>Drawer content goes here...</p>
</Drawer>`,

    'anchor-affix': `// Anchor and Affix Components
import { Anchor, Affix, BackTop } from 'antd';

// Anchor Navigation
<Anchor direction="horizontal">
  <Anchor.Link href="#section1" title="Section 1" />
  <Anchor.Link href="#section2" title="Section 2" />
  <Anchor.Link href="#section3" title="Section 3" />
</Anchor>

// Affix (Sticky positioning)
<Affix offsetTop={10}>
  <Button type="primary">Sticky Button</Button>
</Affix>

// Back to Top
<BackTop />
<div style={{ height: 2000 }}>
  Scroll down to see BackTop button
</div>`
  };

  const showCodeExample = (codeKey: string, title: string) => {
    setSelectedCodeExample(layoutCodeExamples[codeKey as keyof typeof layoutCodeExamples] || 'Code example not found');
    setSelectedCodeTitle(title);
    setCodeModalVisible(true);
  };

  const CodeButton = ({ codeKey, title }: { codeKey: string; title: string }) => (
    <Button 
      type="text" 
      size="small" 
      icon={<CodeOutlined />}
      onClick={() => showCodeExample(codeKey, title)}
    >
      Code
    </Button>
  );

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
            <Card 
              title="Basic Layout Components" 
              style={{ marginBottom: 16 }}
              extra={<CodeButton codeKey="basic-layout" title="Basic Layout Components" />}
            >
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
            <Card 
              title="Breadcrumb Navigation" 
              style={{ marginBottom: 16 }}
              extra={<CodeButton codeKey="breadcrumb" title="Breadcrumb Navigation" />}
            >
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
            <Card 
              title="Menu Component" 
              style={{ marginBottom: 16 }}
              extra={<CodeButton codeKey="menu" title="Menu Component" />}
            >
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
            <Card 
              title="Drawer (Mobile Menu)" 
              style={{ marginBottom: 16 }}
              extra={<CodeButton codeKey="drawer" title="Drawer Component" />}
            >
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
            <Card 
              title="Anchor & BackTop" 
              style={{ marginBottom: 16 }}
              extra={<CodeButton codeKey="anchor-affix" title="Anchor & Affix Components" />}
            >
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

      {/* Code Modal */}
      <Modal
        title={`Source Code - ${selectedCodeTitle}`}
        open={codeModalVisible}
        onCancel={() => setCodeModalVisible(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <SyntaxHighlighter 
          language="typescript" 
          style={tomorrow}
          showLineNumbers
        >
          {selectedCodeExample}
        </SyntaxHighlighter>
      </Modal>
    </ViewContainer>
  );
};