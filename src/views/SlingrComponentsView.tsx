import { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Button, 
  Modal,
  Alert,
  Tag,
  Tabs
} from 'antd';
import type { TabsProps } from 'antd';
import { 
  CodeOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MailOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  ReloadOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import { ViewContainer } from '../components/ViewContainer';
import type { ViewComponent } from '../types/view';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Import Slingr components
import { 
  DataField, 
  ActionButton, 
  ActionsMenu, 
  ModelForm, 
  ModelTable 
} from '../components/slingr';
import type { 
  ModelFormConfig, 
  ModelTableConfig, 
  ActionItem 
} from '../components/slingr';

const { Title, Paragraph } = Typography;

// Mock data for examples
const mockUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  department: 'Engineering',
  salary: 85000,
  isActive: true,
  joinDate: '2023-01-15',
  projectCount: 12
};

const mockTableData = [
  {
    key: '1',
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    department: 'Engineering',
    salary: 85000,
    status: 'active',
    joinDate: '2023-01-15'
  },
  {
    key: '2',
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    department: 'Design',
    salary: 75000,
    status: 'active',
    joinDate: '2023-03-20'
  },
  {
    key: '3',
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    department: 'Marketing',
    salary: 65000,
    status: 'inactive',
    joinDate: '2022-11-10'
  }
];

const userFormConfig: ModelFormConfig = {
  modelId: 'user',
  title: 'User Information',
  description: 'Edit user profile information',
  mode: 'edit',
  layout: { columns: 2 },
  fields: [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      helpText: 'Enter the user\'s full name'
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      validation: {
        pattern: '^[^@]+@[^@]+\\.[^@]+$',
        message: 'Please enter a valid email address'
      }
    },
    {
      id: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      options: [
        { label: 'Engineering', value: 'engineering' },
        { label: 'Design', value: 'design' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Sales', value: 'sales' }
      ]
    },
    {
      id: 'salary',
      label: 'Annual Salary',
      type: 'number',
      validation: {
        min: 30000,
        max: 200000
      }
    },
    {
      id: 'isActive',
      label: 'Active Status',
      type: 'boolean',
      defaultValue: true
    },
    {
      id: 'joinDate',
      label: 'Join Date',
      type: 'date',
      required: true
    },
    {
      id: 'bio',
      label: 'Biography',
      type: 'textarea',
      helpText: 'Brief description about the user'
    }
  ]
};

const tableConfig: ModelTableConfig = {
  modelId: 'user',
  title: 'Users',
  rowSelection: true,
  showBulkActions: true,
  columns: [
    {
      id: 'name',
      title: 'Name',
      type: 'text',
      sortable: true,
      searchable: true
    },
    {
      id: 'email',
      title: 'Email',
      type: 'email',
      sortable: true,
      searchable: true
    },
    {
      id: 'department',
      title: 'Department',
      type: 'tag',
      filterable: true,
      filterOptions: [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Design', value: 'Design' },
        { label: 'Marketing', value: 'Marketing' }
      ]
    },
    {
      id: 'salary',
      title: 'Salary',
      type: 'currency',
      sortable: true
    },
    {
      id: 'status',
      title: 'Status',
      type: 'tag',
      render: (value) => (
        <Tag color={value === 'active' ? 'green' : 'red'}>
          {String(value).toUpperCase()}
        </Tag>
      )
    }
  ],
  actions: [
    {
      key: 'view',
      label: 'View',
      icon: <EyeOutlined />,
      onClick: (record) => console.log('View user:', record)
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: (record) => console.log('Edit user:', record)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (record) => console.log('Delete user:', record)
    }
  ],
  bulkActions: [
    {
      key: 'activate',
      label: 'Activate',
      icon: <CheckCircleOutlined />,
      onClick: (record) => console.log('Activate user:', record)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (record) => console.log('Delete user:', record)
    }
  ]
};

const userActions: ActionItem[] = [
  {
    key: 'send-welcome-email',
    label: 'Send Welcome Email',
    icon: <MailOutlined />,
    params: { userId: 123, template: 'welcome' }
  },
  {
    key: 'reset-password',
    label: 'Reset Password',
    icon: <EditOutlined />,
    params: { userId: 123 }
  },
  {
    key: 'deactivate-user',
    label: 'Deactivate User',
    icon: <DeleteOutlined />,
    danger: true,
    confirmMessage: 'Are you sure you want to deactivate this user?',
    params: { userId: 123 }
  }
];

// Code examples for each component
const codeExamples = {
  dataField: `// Data Field Component Example
import { DataField } from '../components/slingr';

// Basic usage
<DataField
  label="User Name"
  value="John Doe"
  type="text"
/>

// With GraphQL binding (conceptual)
<DataField
  label="Email"
  value={user?.email}
  type="email"
  loading={userLoading}
  error={userError?.message}
  helpText="User's primary email address"
/>

// Currency formatting
<DataField
  label="Annual Salary"
  value={85000}
  type="currency"
  prefix="$"
  layout="vertical"
/>`,

  actionButton: `// Action Button Component Example
import { ActionButton } from '../components/slingr';

// Basic action button
<ActionButton
  actionId="send-notification"
  params={{ userId: 123, type: 'welcome' }}
  type="primary"
  icon={<MailOutlined />}
  onSuccess={(result) => {
    console.log('Action completed:', result);
  }}
  onError={(error) => {
    console.error('Action failed:', error);
  }}
>
  Send Notification
</ActionButton>

// Dangerous action with confirmation
<ActionButton
  actionId="delete-user"
  params={{ userId: 123 }}
  danger
  confirmAction
  confirmMessage="This will permanently delete the user. Continue?"
  icon={<DeleteOutlined />}
>
  Delete User
</ActionButton>`,

  actionsMenu: `// Actions Menu Component Example
import { ActionsMenu } from '../components/slingr';

const actions = [
  {
    key: 'send-email',
    label: 'Send Email',
    icon: <MailOutlined />,
    params: { userId: 123, template: 'welcome' }
  },
  {
    key: 'reset-password', 
    label: 'Reset Password',
    icon: <EditOutlined />,
    params: { userId: 123 }
  },
  {
    key: 'deactivate',
    label: 'Deactivate',
    icon: <DeleteOutlined />,
    danger: true,
    confirmMessage: 'Deactivate this user?',
    params: { userId: 123 }
  }
];

<ActionsMenu
  actions={actions}
  buttonType="primary"
  onSuccess={(actionId, result) => {
    console.log(\`Action \${actionId} completed:, result);
  }}
>
  User Actions
</ActionsMenu>`,

  modelForm: `// Model Form Component Example
import { ModelForm } from '../components/slingr';

const formConfig = {
  modelId: 'user',
  title: 'User Information',
  mode: 'edit',
  layout: { columns: 2 },
  fields: [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      required: true
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validation: {
        pattern: '^[^@]+@[^@]+\\\\.[^@]+$'
      }
    },
    {
      id: 'department',
      label: 'Department',
      type: 'select',
      options: [
        { label: 'Engineering', value: 'engineering' },
        { label: 'Design', value: 'design' }
      ]
    },
    {
      id: 'isActive',
      label: 'Active',
      type: 'boolean',
      dependencies: [{
        field: 'department',
        value: 'engineering',
        action: 'show'
      }]
    }
  ]
};

<ModelForm
  config={formConfig}
  initialValues={userData}
  onSubmit={async (values) => {
    // GraphQL mutation call
    await updateUser({ variables: { id: userId, input: values } });
  }}
  onChange={(values) => {
    console.log('Form values changed:', values);
  }}
/>`,

  modelTable: `// Model Table Component Example  
import { ModelTable } from '../components/slingr';

const tableConfig = {
  modelId: 'user',
  title: 'Users',
  rowSelection: true,
  showBulkActions: true,
  columns: [
    {
      id: 'name',
      title: 'Name', 
      type: 'text',
      sortable: true,
      searchable: true
    },
    {
      id: 'email',
      title: 'Email',
      type: 'email',
      sortable: true
    },
    {
      id: 'department',
      title: 'Department',
      type: 'tag',
      filterable: true,
      filterOptions: [
        { label: 'Engineering', value: 'Engineering' }
      ]
    },
    {
      id: 'salary',
      title: 'Salary',
      type: 'currency',
      sortable: true
    }
  ],
  actions: [
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: (record) => editUser(record.id)
    }
  ],
  bulkActions: [
    {
      key: 'delete',
      label: 'Delete Selected',
      danger: true,
      onClick: (record) => deleteUser(record.id)
    }
  ]
};

<ModelTable
  config={tableConfig}
  dataSource={users}
  loading={usersLoading}
  total={totalUsers}
  onRefresh={() => refetchUsers()}
  onPaginationChange={(page, pageSize) => {
    fetchUsers({ page, pageSize });
  }}
  onSortChange={(field, order) => {
    fetchUsers({ sortBy: field, sortOrder: order });
  }}
  onFilterChange={(filters) => {
    fetchUsers({ filters });
  }}
/>`
};

export const SlingrComponentsView: ViewComponent = ({ config }) => {
  const [codeModalVisible, setCodeModalVisible] = useState(false);
  const [selectedCodeExample, setSelectedCodeExample] = useState('');
  const [selectedCodeTitle, setSelectedCodeTitle] = useState('');

  const showCodeExample = (codeKey: keyof typeof codeExamples, title: string) => {
    setSelectedCodeExample(codeExamples[codeKey]);
    setSelectedCodeTitle(title);
    setCodeModalVisible(true);
  };

  const CodeButton = ({ codeKey, title }: { codeKey: keyof typeof codeExamples; title: string }) => (
    <Button 
      type="text" 
      size="small" 
      icon={<CodeOutlined />}
      onClick={() => showCodeExample(codeKey, title)}
    >
      View Code
    </Button>
  );

  const tabItems: TabsProps['items'] = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <div>
          <Alert
            message="Slingr Components"
            description="A collection of UI components built on top of Ant Design for seamless backend integration through GraphQL. These components provide automatic data binding, action handling, and form generation based on backend model definitions."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>🔗 Data Field</Title>
                <Paragraph>
                  Displays a label and value with automatic GraphQL data binding. 
                  Supports various data types and formatting options.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>⚡ Action Button</Title>
                <Paragraph>
                  Triggers backend actions through GraphQL mutations with loading states 
                  and error handling.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>📋 Actions Menu</Title>
                <Paragraph>
                  Dropdown menu containing multiple backend actions with confirmation 
                  dialogs for dangerous operations.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>📝 Model Form</Title>
                <Paragraph>
                  Dynamically generated forms based on backend model definitions with 
                  automatic validation and field dependencies.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24}>
              <Card>
                <Title level={4}>📊 Model Table</Title>
                <Paragraph>
                  Data tables with automatic GraphQL integration, featuring sorting, 
                  filtering, pagination, and bulk actions.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'datafield',
      label: 'Data Field',
      children: (
        <div>
          <Card 
            title="Data Field Component" 
            extra={<CodeButton codeKey="dataField" title="Data Field Component" />}
            style={{ marginBottom: 16 }}
          >
            <Paragraph>
              The Data Field component displays a label and value with automatic formatting 
              based on the data type. It supports GraphQL data binding with loading and error states.
            </Paragraph>
            
            <Title level={5}>Examples</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <DataField
                  label="User Name"
                  value={mockUserData.name}
                  type="text"
                />
                <DataField
                  label="Email Address"
                  value={mockUserData.email}
                  type="email"
                  helpText="Primary contact email"
                />
                <DataField
                  label="Department"
                  value={mockUserData.department}
                  type="text"
                  prefix="🏢 "
                />
              </Col>
              <Col xs={24} md={12}>
                <DataField
                  label="Annual Salary"
                  value={mockUserData.salary}
                  type="currency"
                  layout="vertical"
                />
                <DataField
                  label="Active Status"
                  value={mockUserData.isActive}
                  type="boolean"
                  layout="vertical"
                />
                <DataField
                  label="Projects"
                  value={mockUserData.projectCount}
                  type="number"
                  suffix=" projects"
                  layout="vertical"
                />
              </Col>
            </Row>
          </Card>
        </div>
      )
    },
    {
      key: 'actionbutton',
      label: 'Action Button',
      children: (
        <div>
          <Card 
            title="Action Button Component" 
            extra={<CodeButton codeKey="actionButton" title="Action Button Component" />}
            style={{ marginBottom: 16 }}
          >
            <Paragraph>
              Action buttons trigger backend GraphQL mutations with automatic loading states, 
              error handling, and optional confirmation dialogs.
            </Paragraph>
            
            <Title level={5}>Examples</Title>
            <Space wrap>
              <ActionButton
                actionId="send-notification"
                params={{ userId: 123, type: 'welcome' }}
                type="primary"
                icon={<MailOutlined />}
              >
                Send Notification
              </ActionButton>
              
              <ActionButton
                actionId="export-data"
                params={{ format: 'csv' }}
                icon={<DownloadOutlined />}
              >
                Export Data
              </ActionButton>
              
              <ActionButton
                actionId="delete-user"
                params={{ userId: 123 }}
                danger
                confirmAction
                confirmMessage="This will permanently delete the user. Continue?"
                icon={<DeleteOutlined />}
              >
                Delete User
              </ActionButton>
            </Space>
          </Card>
        </div>
      )
    },
    {
      key: 'actionsmenu',
      label: 'Actions Menu',
      children: (
        <div>
          <Card 
            title="Actions Menu Component" 
            extra={<CodeButton codeKey="actionsMenu" title="Actions Menu Component" />}
            style={{ marginBottom: 16 }}
          >
            <Paragraph>
              Actions menu provides a dropdown containing multiple backend actions. 
              Supports dangerous action confirmation and loading states.
            </Paragraph>
            
            <Title level={5}>Examples</Title>
            <Space wrap>
              <ActionsMenu
                actions={userActions}
                buttonType="primary"
                onSuccess={(actionId, result) => {
                  console.log(`Action ${actionId} completed:`, result);
                }}
              >
                User Actions
              </ActionsMenu>
              
              <ActionsMenu
                actions={[
                  {
                    key: 'refresh-cache',
                    label: 'Refresh Cache',
                    icon: <ReloadOutlined />,
                    params: { cacheKey: 'users' }
                  },
                  {
                    key: 'backup-data',
                    label: 'Backup Data',
                    icon: <DatabaseOutlined />,
                    params: { tables: ['users', 'projects'] }
                  }
                ]}
                size="small"
              >
                System Actions
              </ActionsMenu>
            </Space>
          </Card>
        </div>
      )
    },
    {
      key: 'modelform',
      label: 'Model Form',
      children: (
        <div>
          <Card 
            title="Model Form Component" 
            extra={<CodeButton codeKey="modelForm" title="Model Form Component" />}
            style={{ marginBottom: 16 }}
          >
            <Paragraph>
              Model forms are dynamically generated based on backend model definitions. 
              They support field dependencies, validation rules, and automatic GraphQL integration.
            </Paragraph>
            
            <Title level={5}>Example</Title>
            <ModelForm
              config={userFormConfig}
              initialValues={{
                name: 'John Doe',
                email: 'john.doe@example.com',
                department: 'engineering',
                salary: 85000,
                isActive: true,
                joinDate: '2023-01-15'
              }}
              onSubmit={async (values) => {
                console.log('Form submitted:', values);
                // In real app: await updateUser({ variables: { input: values } });
              }}
              onChange={(values) => {
                console.log('Form values changed:', values);
              }}
            />
          </Card>
        </div>
      )
    },
    {
      key: 'modeltable',
      label: 'Model Table',
      children: (
        <div>
          <Card 
            title="Model Table Component" 
            extra={<CodeButton codeKey="modelTable" title="Model Table Component" />}
            style={{ marginBottom: 16 }}
          >
            <Paragraph>
              Model tables display data from backend models with automatic GraphQL integration. 
              Features include sorting, filtering, pagination, row selection, and bulk actions.
            </Paragraph>
            
            <Title level={5}>Example</Title>
            <ModelTable
              config={tableConfig}
              dataSource={mockTableData}
              onRefresh={() => console.log('Refreshing table data...')}
              onPaginationChange={(page, pageSize) => {
                console.log('Pagination changed:', { page, pageSize });
              }}
              onSortChange={(field, order) => {
                console.log('Sort changed:', { field, order });
              }}
              onFilterChange={(filters) => {
                console.log('Filters changed:', filters);
              }}
              onSearch={(searchTerm) => {
                console.log('Search:', searchTerm);
              }}
            />
          </Card>
        </div>
      )
    }
  ];

  return (
    <ViewContainer config={config}>
      <div style={{ padding: 16 }}>
        <Tabs
          defaultActiveKey="overview"
          items={tabItems}
          size="large"
        />
      </div>

      {/* Code Modal */}
      <Modal
        title={`Source Code - ${selectedCodeTitle}`}
        open={codeModalVisible}
        onCancel={() => setCodeModalVisible(false)}
        footer={null}
        width={1000}
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