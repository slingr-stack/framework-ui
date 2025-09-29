import { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Input, 
  Select, 
  Checkbox, 
  Radio, 
  Switch, 
  Slider, 
  Rate,
  Progress,
  Spin,
  Alert,
  Tag,
  Badge,
  Avatar,
  Tooltip,
  Popover,
  Modal,
  message,
  notification,
  Typography,
  Space,
  Upload,
  Table,
  Pagination,
  Steps,
  Breadcrumb,
  Menu,
  Tabs
} from 'antd';
import { 
  UploadOutlined, 
  UserOutlined, 
  SettingOutlined,
  HomeOutlined,
  LaptopOutlined,
  NotificationOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { ViewContainer } from '../components/ViewContainer';
import type { ViewComponent } from '../types/view';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <Space size="middle">
        <Button type="link" icon={<EditOutlined />} size="small">Edit</Button>
        <Button type="link" danger icon={<DeleteOutlined />} size="small">Delete</Button>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];

// Component code examples for quick reference
const componentCodeExamples = {
  'input-controls': `// Basic Input Components
import { Input, Select } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

// Basic Input
<Input placeholder="Basic usage" />

// Password Input  
<Input.Password placeholder="Password" />

// Text Area
<TextArea rows={3} placeholder="Multi-line input" />

// Select with Options
<Select defaultValue="option1" style={{ width: 120 }}>
  <Option value="option1">Option 1</Option>
  <Option value="option2">Option 2</Option>
  <Option value="option3">Option 3</Option>
</Select>`,

  'selection-controls': `// Selection Controls
import { Checkbox, Radio, Switch, Slider } from 'antd';

// Checkbox Group
<Checkbox.Group>
  <Checkbox value="A">Option A</Checkbox>
  <Checkbox value="B" defaultChecked>Option B</Checkbox>
  <Checkbox value="C" disabled>Option C</Checkbox>
</Checkbox.Group>

// Radio Group
<Radio.Group defaultValue="A">
  <Radio value="A">A</Radio>
  <Radio value="B">B</Radio>
  <Radio value="C">C</Radio>
</Radio.Group>

// Switch
<Switch 
  checkedChildren="ON" 
  unCheckedChildren="OFF" 
  defaultChecked 
/>

// Slider with Marks
<Slider 
  marks={{ 0: '0°C', 26: '26°C', 37: '37°C', 100: '100°C' }}
  defaultValue={30}
/>`,

  'date-controls': `// Date and Time Controls
import { DatePicker, TimePicker } from 'antd';
const { RangePicker } = DatePicker;

// Date Picker
<DatePicker placeholder="Select date" />

// Date Range Picker
<RangePicker placeholder={['Start date', 'End date']} />

// Time Picker
<TimePicker placeholder="Select time" format="HH:mm" />`,

  'progress-indicators': `// Progress and Loading Components
import { Progress, Spin, Rate } from 'antd';

// Progress Bar
<Progress percent={75} />
<Progress percent={100} status="success" />
<Progress percent={35} status="exception" />

// Circular Progress
<Progress type="circle" percent={75} />
<Progress type="circle" percent={100} status="success" />

// Loading Spinner
<Spin size="small" />
<Spin size="large" />

// Rating Component
<Rate defaultValue={3} />
<Rate disabled defaultValue={4} />`,

  'data-display': `// Data Display Components
import { Tag, Badge, Avatar, Alert } from 'antd';

// Tags
<Tag color="blue">Tag 1</Tag>
<Tag color="green">Tag 2</Tag>
<Tag color="red">Tag 3</Tag>

// Badges
<Badge count={5}>
  <Avatar shape="square" size="large" />
</Badge>
<Badge dot>
  <Avatar shape="square" size="large" />
</Badge>

// Avatars
<Avatar size="large" icon={<UserOutlined />} />
<Avatar size="large" src="https://example.com/avatar.jpg" />
<Avatar size="large">U</Avatar>

// Alerts
<Alert message="Success Tips" type="success" showIcon />
<Alert message="Warning" type="warning" showIcon closable />
<Alert message="Error" type="error" showIcon />`,

  'data-table': `// Data Table Component
import { Table } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age', 
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address', 
    key: 'address',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button type="link">Edit</Button>
        <Button type="link" danger>Delete</Button>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  // ... more data
];

<Table columns={columns} dataSource={data} />`,

  'interaction-buttons': `// Interactive Buttons
import { Button, Space } from 'antd';

// Button Types
<Space>
  <Button type="primary">Primary</Button>
  <Button>Default</Button>
  <Button type="dashed">Dashed</Button>
  <Button type="text">Text</Button>
  <Button type="link">Link</Button>
</Space>

// Button Sizes
<Space>
  <Button size="large">Large</Button>
  <Button>Default</Button>
  <Button size="small">Small</Button>
</Space>

// Button States
<Space>
  <Button loading>Loading</Button>
  <Button disabled>Disabled</Button>
  <Button danger>Danger</Button>
</Space>`,

  'tooltips-popovers': `// Tooltips and Popovers
import { Tooltip, Popover, Button } from 'antd';

// Tooltip
<Tooltip title="Tooltip text">
  <Button>Hover me</Button>
</Tooltip>

// Popover with content
const content = (
  <div>
    <p>Content line 1</p>
    <p>Content line 2</p>
  </div>
);

<Popover content={content} title="Popover Title">
  <Button>Click me</Button>
</Popover>`,

  'modals-notifications': `// Modals and Notifications  
import { Modal, message, notification, Button } from 'antd';

// Modal
const [isModalVisible, setIsModalVisible] = useState(false);

<Button onClick={() => setIsModalVisible(true)}>
  Open Modal
</Button>

<Modal
  title="Basic Modal"
  visible={isModalVisible}
  onOk={() => setIsModalVisible(false)}
  onCancel={() => setIsModalVisible(false)}
>
  <p>Modal content...</p>
</Modal>

// Message
message.success('Success message');
message.error('Error message');
message.warning('Warning message');

// Notification
notification.open({
  message: 'Notification Title',
  description: 'This is the content of the notification.',
  icon: <NotificationOutlined style={{ color: '#108ee9' }} />,
});`,

  'file-upload': `// File Upload Component
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

// Basic Upload
<Upload>
  <Button icon={<UploadOutlined />}>Click to Upload</Button>
</Upload>

// Drag and Drop Upload
const { Dragger } = Upload;

<Dragger multiple>
  <div>
    <UploadOutlined style={{ fontSize: 48 }} />
    <p>Click or drag file to this area to upload</p>
    <p>Support for single or bulk upload</p>
  </div>
</Dragger>`,

  'navigation': `// Navigation Components
import { Steps, Breadcrumb, Pagination } from 'antd';

// Steps
<Steps current={1}>
  <Steps.Step title="Finished" description="This is a description." />
  <Steps.Step title="In Progress" description="This is a description." />
  <Steps.Step title="Waiting" description="This is a description." />
</Steps>

// Breadcrumb
<Breadcrumb>
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item href="/components">Components</Breadcrumb.Item>
  <Breadcrumb.Item>Current Page</Breadcrumb.Item>
</Breadcrumb>

// Pagination
<Pagination 
  current={1}
  total={500}
  showSizeChanger
  showQuickJumper
  showTotal={(total, range) => 
    \`\${range[0]}-\${range[1]} of \${total} items\`
  }
/>`
};

export const AntDesignShowcaseView: ViewComponent = ({ config }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [sliderValue, setSliderValue] = useState(30);
  const [codeModalVisible, setCodeModalVisible] = useState(false);
  const [selectedCodeExample, setSelectedCodeExample] = useState('');
  const [selectedCodeTitle, setSelectedCodeTitle] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    message.success('Modal action completed!');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showNotification = () => {
    notification.open({
      message: 'Notification Title',
      description: 'This is the content of the notification.',
      icon: <NotificationOutlined style={{ color: '#108ee9' }} />,
    });
  };

  const showCodeExample = (codeKey: string, title: string) => {
    setSelectedCodeExample(componentCodeExamples[codeKey as keyof typeof componentCodeExamples] || 'Code example not found');
    setSelectedCodeTitle(title);
    setCodeModalVisible(true);
  };

  const ComponentCard = ({ title, codeKey, children }: { title: string; codeKey: string; children: React.ReactNode }) => (
    <Card 
      title={title} 
      size="small"
      extra={
        <Button 
          type="text" 
          size="small" 
          icon={<CodeOutlined />}
          onClick={() => showCodeExample(codeKey, title)}
        >
          Code
        </Button>
      }
    >
      {children}
    </Card>
  );

  return (
    <ViewContainer config={config}>
      <div style={{ padding: 16, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Form Controls" key="1">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <ComponentCard title="Input Controls" codeKey="input-controls">
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                      <Text strong>Basic Input</Text>
                      <Input placeholder="Basic usage" />
                    </div>
                    <div>
                      <Text strong>Password Input</Text>
                      <Input.Password placeholder="Password" />
                    </div>
                    <div>
                      <Text strong>Text Area</Text>
                      <TextArea rows={3} placeholder="Multi-line input" />
                    </div>
                    <div>
                      <Text strong>Select</Text>
                      <Select defaultValue="option1" style={{ width: '100%' }}>
                        <Option value="option1">Option 1</Option>
                        <Option value="option2">Option 2</Option>
                        <Option value="option3">Option 3</Option>
                      </Select>
                    </div>
                  </Space>
                </ComponentCard>
              </Col>

              <Col xs={24} lg={12}>
                <ComponentCard title="Selection Controls" codeKey="selection-controls">
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                      <Text strong>Checkbox</Text>
                      <div>
                        <Checkbox>Option A</Checkbox>
                        <Checkbox defaultChecked>Option B</Checkbox>
                        <Checkbox disabled>Option C</Checkbox>
                      </div>
                    </div>
                    <div>
                      <Text strong>Radio</Text>
                      <Radio.Group defaultValue="a">
                        <Radio value="a">A</Radio>
                        <Radio value="b">B</Radio>
                        <Radio value="c">C</Radio>
                      </Radio.Group>
                    </div>
                    <div>
                      <Text strong>Switch</Text>
                      <div>
                        <Switch 
                          checked={switchValue} 
                          onChange={setSwitchValue}
                          checkedChildren="ON"
                          unCheckedChildren="OFF" 
                        />
                      </div>
                    </div>
                    <div>
                      <Text strong>Slider</Text>
                      <Slider 
                        value={sliderValue} 
                        onChange={setSliderValue}
                        marks={{ 0: '0°C', 26: '26°C', 37: '37°C', 100: '100°C' }}
                      />
                    </div>
                  </Space>
                </ComponentCard>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Data Display" key="2">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <ComponentCard title="Progress & Feedback" codeKey="progress-indicators">
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                      <Text strong>Progress Bar</Text>
                      <Progress percent={30} />
                      <Progress percent={50} status="active" />
                      <Progress percent={70} status="exception" />
                      <Progress percent={100} />
                    </div>
                    <div>
                      <Text strong>Rating</Text>
                      <div>
                        <Rate defaultValue={3} />
                      </div>
                    </div>
                    <div>
                      <Text strong>Loading Spinner</Text>
                      <div>
                        <Spin size="small" />
                        <Spin style={{ margin: '0 16px' }} />
                        <Spin size="large" />
                      </div>
                    </div>
                  </Space>
                </ComponentCard>
              </Col>

              <Col xs={24} lg={12}>
                <ComponentCard title="Tags & Badges" codeKey="data-display">
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                      <Text strong>Tags</Text>
                      <div>
                        <Tag>Default</Tag>
                        <Tag color="blue">Blue</Tag>
                        <Tag color="green">Green</Tag>
                        <Tag color="orange">Orange</Tag>
                        <Tag color="red">Red</Tag>
                      </div>
                    </div>
                    <div>
                      <Text strong>Badges</Text>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <Badge count={5}>
                          <Avatar shape="square" size="large" />
                        </Badge>
                        <Badge count={0} showZero>
                          <Avatar shape="square" size="large" />
                        </Badge>
                        <Badge count="99+">
                          <Avatar shape="square" size="large" />
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Text strong>Avatars</Text>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Avatar size={32} icon={<UserOutlined />} />
                        <Avatar size={32}>U</Avatar>
                        <Avatar size={32} src="https://joeschmoe.io/api/v1/random" />
                      </div>
                    </div>
                  </Space>
                </ComponentCard>
              </Col>

              <Col span={24}>
                <ComponentCard title="Data Table" codeKey="data-table">
                  <Table 
                    columns={columns} 
                    dataSource={data} 
                    pagination={false}
                    size="small"
                  />
                  <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <Pagination defaultCurrent={1} total={50} />
                  </div>
                </ComponentCard>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Interaction" key="3">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <ComponentCard title="Buttons & Actions" codeKey="interaction-buttons">
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                      <Text strong>Button Types</Text>
                      <div>
                        <Space wrap>
                          <Button type="primary">Primary</Button>
                          <Button>Default</Button>
                          <Button type="dashed">Dashed</Button>
                          <Button type="text">Text</Button>
                          <Button type="link">Link</Button>
                        </Space>
                      </div>
                    </div>
                    <div>
                      <Text strong>Button States</Text>
                      <div>
                        <Space wrap>
                          <Button type="primary" loading>Loading</Button>
                          <Button disabled>Disabled</Button>
                          <Button danger>Danger</Button>
                          <Button type="primary" icon={<DownloadOutlined />}>
                            Download
                          </Button>
                        </Space>
                      </div>
                    </div>
                    <div>
                      <Text strong>Upload</Text>
                      <Upload>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                      </Upload>
                    </div>
                  </Space>
                </ComponentCard>
              </Col>

              <Col xs={24} lg={12}>
                <ComponentCard title="Overlays & Feedback" codeKey="tooltips-popovers">
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                      <Text strong>Tooltip & Popover</Text>
                      <div>
                        <Space>
                          <Tooltip title="Tooltip text">
                            <Button>Hover for tooltip</Button>
                          </Tooltip>
                          <Popover content="Popover content" title="Popover Title">
                            <Button>Click for popover</Button>
                          </Popover>
                        </Space>
                      </div>
                    </div>
                    <div>
                      <Text strong>Modal & Messages</Text>
                      <div>
                        <Space>
                          <Button type="primary" onClick={showModal}>
                            Show Modal
                          </Button>
                          <Button onClick={() => message.info('This is an info message')}>
                            Show Message
                          </Button>
                          <Button onClick={showNotification}>
                            Show Notification
                          </Button>
                        </Space>
                      </div>
                    </div>
                    <div>
                      <Text strong>Alerts</Text>
                      <Alert message="Success Tips" type="success" showIcon />
                      <Alert message="Informational Notes" type="info" showIcon />
                      <Alert message="Warning" type="warning" showIcon closable />
                      <Alert message="Error" type="error" showIcon />
                    </div>
                  </Space>
                </ComponentCard>
              </Col>

              <Col span={24}>
                <ComponentCard title="Navigation" codeKey="navigation">
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Text strong>Steps</Text>
                      <Steps current={1} size="small">
                        <Step title="Finished" description="This is a description." />
                        <Step title="In Progress" description="This is a description." />
                        <Step title="Waiting" description="This is a description." />
                      </Steps>
                    </Col>
                    <Col xs={24} md={8}>
                      <Text strong>Breadcrumb</Text>
                      <Breadcrumb>
                        <Breadcrumb.Item href="">
                          <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                          <UserOutlined />
                          <span>Application List</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Application</Breadcrumb.Item>
                      </Breadcrumb>
                    </Col>
                    <Col xs={24} md={8}>
                      <Text strong>Menu</Text>
                      <Menu mode="horizontal" defaultSelectedKeys={['2']}>
                        <Menu.Item key="1" icon={<SettingOutlined />}>
                          Navigation One
                        </Menu.Item>
                        <Menu.Item key="2" icon={<LaptopOutlined />}>
                          Navigation Two
                        </Menu.Item>
                      </Menu>
                    </Col>
                  </Row>
                </ComponentCard>
              </Col>
            </Row>
          </TabPane>
        </Tabs>

        <Modal
          title="Basic Modal"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>

        {/* Code Example Modal */}
        <Modal
          title={`Code Example - ${selectedCodeTitle}`}
          open={codeModalVisible}
          onCancel={() => setCodeModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setCodeModalVisible(false)}>
              Close
            </Button>
          ]}
          width={800}
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
            <code>{selectedCodeExample}</code>
          </pre>
        </Modal>
      </div>
    </ViewContainer>
  );
};