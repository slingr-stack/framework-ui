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
  message
} from 'antd';
import { 
  UserOutlined, 
  PlusOutlined, 
  ReloadOutlined,
  DatabaseOutlined,
  ApiOutlined
} from '@ant-design/icons';
import { ViewContainer } from '../components/ViewContainer';
import type { ViewComponent } from '../types/view';

const { Title, Paragraph } = Typography;

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
  const [form] = Form.useForm();
  const [mockData, setMockData] = useState(mockUsers);
  const [loading, setLoading] = useState(false);

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

  return (
    <ViewContainer config={config}>
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
                        <Button type="link" key="edit">Edit</Button>,
                        <Button type="link" danger key="delete">Delete</Button>
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
                  <Paragraph style={{ fontSize: 12, background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{`import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'your-graphql-endpoint',
  cache: new InMemoryCache()
});`}</pre>
                  </Paragraph>
                </div>

                <div>
                  <Title level={5}>Query Example</Title>
                  <Paragraph style={{ fontSize: 12, background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{`const { data, loading, error } = useQuery(gql\`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
\`);`}</pre>
                  </Paragraph>
                </div>

                <div>
                  <Title level={5}>Mutation Example</Title>
                  <Paragraph style={{ fontSize: 12, background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{`const [addUser] = useMutation(gql\`
  mutation AddUser($name: String!, $email: String!) {
    addUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
\`);`}</pre>
                  </Paragraph>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Modal
          title="Add New User"
          visible={isModalVisible}
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
      </div>
    </ViewContainer>
  );
};