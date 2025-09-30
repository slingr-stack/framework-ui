import { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Input, 
  List, 
  Avatar, 
  Typography, 
  Space, 
  Spin, 
  Alert,
  Form,
  Modal,
  message,
  Popconfirm
} from 'antd';
import { 
  UserOutlined, 
  PlusOutlined, 
  ReloadOutlined,
  DatabaseOutlined,
  ApiOutlined,
  EditOutlined,
  DeleteOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { ViewContainer } from '../components/ViewContainer';
import type { ViewComponent } from '../types/view';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Title } = Typography;

// Mock data since we don't have a real GraphQL endpoint
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://joeschmoe.io/api/v1/john'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://joeschmoe.io/api/v1/jane'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://joeschmoe.io/api/v1/bob'
  }
];

export const GraphQLView: ViewComponent = ({ config }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCodeModalVisible, setIsCodeModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [mockData, setMockData] = useState(mockUsers);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // In a real app, this would use actual GraphQL queries
  // const { data, loading, error, refetch } = useQuery(GET_USERS);
  // const [addUser, { loading: addingUser }] = useMutation(ADD_USER);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: (mockData.length + 1).toString(),
        name: values.name,
        email: values.email,
        avatar: `https://joeschmoe.io/api/v1/${values.name.toLowerCase().replace(' ', '')}`
      };
      
      setMockData([...mockData, newUser]);
      setIsModalVisible(false);
      form.resetFields();
      message.success('User added successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const refreshData = async () => {
    setLoading(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    message.success('Data refreshed!');
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    editForm.setFieldsValue({
      name: user.name,
      email: user.email
    });
    setIsEditModalVisible(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await editForm.validateFields();
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedData = mockData.map(user => 
        user.id === editingUser.id 
          ? { ...user, name: values.name, email: values.email }
          : user
      );
      
      setMockData(updatedData);
      setIsEditModalVisible(false);
      editForm.resetFields();
      setEditingUser(null);
      message.success('User updated successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
    setEditingUser(null);
  };

  const handleDelete = async (userId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedData = mockData.filter(user => user.id !== userId);
      setMockData(updatedData);
      message.success('User deleted successfully!');
    } finally {
      setLoading(false);
    }
  };

  const showCodeModal = () => {
    setIsCodeModalVisible(true);
  };

  const handleCodeModalClose = () => {
    setIsCodeModalVisible(false);
  };

  return (
    <ViewContainer 
      config={config}
      extra={
        <Button
          type="primary"
          icon={<CodeOutlined />}
          onClick={showCodeModal}
          size="small"
        >
          View Code
        </Button>
      }
    >
      <div style={{ padding: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Alert
              message="GraphQL Integration Demo"
              description="This view demonstrates how to integrate GraphQL with Apollo Client in your views. In a real application, these would connect to your GraphQL endpoint."
              type="info"
              icon={<ApiOutlined />}
              style={{ marginBottom: 16 }}
            />
          </Col>

          <Col xs={24} lg={16}>
            <Card 
              title={
                <Space>
                  <DatabaseOutlined />
                  Users List (Mock Data)
                </Space>
              }
              extra={
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={refreshData} loading={loading}>
                    Refresh
                  </Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    Add User
                  </Button>
                </Space>
              }
            >
              <Spin spinning={loading}>
                <List
                  itemLayout="horizontal"
                  dataSource={mockData}
                  renderItem={(user) => (
                    <List.Item
                      actions={[
                        <Button 
                          type="link" 
                          icon={<EditOutlined />}
                          key="edit"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </Button>,
                        <Popconfirm
                          title="Are you sure you want to delete this user?"
                          onConfirm={() => handleDelete(user.id)}
                          okText="Yes"
                          cancelText="No"
                          key="delete"
                        >
                          <Button 
                            type="link" 
                            danger 
                            icon={<DeleteOutlined />}
                          >
                            Delete
                          </Button>
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={user.avatar} icon={<UserOutlined />} />}
                        title={user.name}
                        description={user.email}
                      />
                    </List.Item>
                  )}
                />
              </Spin>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="GraphQL Setup" style={{ height: 'fit-content' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div>
                  <Title level={5}>Client Configuration</Title>
                  <SyntaxHighlighter language="typescript" style={tomorrow} showLineNumbers>
{`import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'your-graphql-endpoint',
  cache: new InMemoryCache()
});`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <Title level={5}>Query Example</Title>
                  <SyntaxHighlighter language="typescript" style={tomorrow} showLineNumbers>
{`const { data, loading, error } = useQuery(gql\`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
\`);`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <Title level={5}>Mutation Example</Title>
                  <SyntaxHighlighter language="typescript" style={tomorrow} showLineNumbers>
{`const [addUser] = useMutation(gql\`
  mutation AddUser($name: String!, $email: String!) {
    addUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
\`);`}
                  </SyntaxHighlighter>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Modal
          title="Add New User"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          confirmLoading={loading}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input the name!' }]}
            >
              <Input placeholder="Enter user name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input the email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input placeholder="Enter user email" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Edit User"
          open={isEditModalVisible}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
          confirmLoading={loading}
        >
          <Form form={editForm} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input the name!' }]}
            >
              <Input placeholder="Enter user name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input the email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input placeholder="Enter user email" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="GraphQL View - Source Code"
          open={isCodeModalVisible}
          onCancel={handleCodeModalClose}
          footer={[
            <Button key="close" onClick={handleCodeModalClose}>
              Close
            </Button>
          ]}
          width="80%"
          style={{ top: 20 }}
        >
          <pre style={{ 
            background: '#f6f8fa', 
            padding: 16, 
            borderRadius: 8, 
            overflow: 'auto',
            maxHeight: '60vh',
            fontSize: '13px',
            lineHeight: '1.4'
          }}>
            <code>{`// GraphQL Integration View with CRUD Operations
import { useState } from 'react';
import { 
  Card, Row, Col, Button, Input, List, Avatar, Typography, 
  Space, Spin, Alert, Form, Modal, message, Popconfirm 
} from 'antd';
import { 
  UserOutlined, PlusOutlined, ReloadOutlined, DatabaseOutlined,
  ApiOutlined, EditOutlined, DeleteOutlined, CodeOutlined
} from '@ant-design/icons';
import { ViewContainer } from '../components/ViewContainer';
import type { ViewComponent } from '../types/view';

// In real app, use Apollo Client:
// import { useQuery, useMutation, gql } from '@apollo/client';

export const GraphQLView: ViewComponent = ({ config }) => {
  const [mockData, setMockData] = useState(mockUsers);
  const [loading, setLoading] = useState(false);
  
  // Real GraphQL implementation would use:
  // const { data, loading, error, refetch } = useQuery(GET_USERS);
  // const [addUser] = useMutation(ADD_USER);
  // const [updateUser] = useMutation(UPDATE_USER);
  // const [deleteUser] = useMutation(DELETE_USER);

  const handleAdd = async (values) => {
    // Simulate API call with loading state
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: (mockData.length + 1).toString(),
      name: values.name,
      email: values.email,
      avatar: \`https://joeschmoe.io/api/v1/\${values.name.toLowerCase()}\`
    };
    
    setMockData([...mockData, newUser]);
    message.success('User added successfully!');
    setLoading(false);
  };

  const handleEdit = async (userId, values) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedData = mockData.map(user => 
      user.id === userId ? { ...user, ...values } : user
    );
    
    setMockData(updatedData);
    message.success('User updated successfully!');
    setLoading(false);
  };

  const handleDelete = async (userId) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedData = mockData.filter(user => user.id !== userId);
    setMockData(updatedData);
    message.success('User deleted successfully!');
    setLoading(false);
  };

  // View implementation with CRUD operations...
};`}</code>
          </pre>
        </Modal>
      </div>
    </ViewContainer>
  );
};