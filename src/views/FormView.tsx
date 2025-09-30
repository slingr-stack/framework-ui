import { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  TimePicker,
  Radio,
  Checkbox,
  Switch,
  Slider,
  Rate,
  Upload,
  Button,
  Typography,
  Space,
  message,
  Divider,
  InputNumber,
  TreeSelect,
  Cascader,
  Transfer
} from 'antd';
import type { TransferProps, UploadProps } from 'antd';
import { 
  InboxOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  SaveOutlined,
  ClearOutlined
} from '@ant-design/icons';
import { ViewContainer } from '../components/ViewContainer';
import type { ViewComponent } from '../types/view';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;
const { TreeNode } = TreeSelect;
const { Dragger } = Upload;

const cascaderOptions = [
  {
    value: 'usa',
    label: 'USA',
    children: [
      {
        value: 'california',
        label: 'California',
        children: [
          { value: 'san-francisco', label: 'San Francisco' },
          { value: 'los-angeles', label: 'Los Angeles' },
        ],
      },
      {
        value: 'new-york',
        label: 'New York',
        children: [
          { value: 'new-york-city', label: 'New York City' },
          { value: 'albany', label: 'Albany' },
        ],
      },
    ],
  },
  {
    value: 'canada',
    label: 'Canada',
    children: [
      {
        value: 'ontario',
        label: 'Ontario',
        children: [
          { value: 'toronto', label: 'Toronto' },
          { value: 'ottawa', label: 'Ottawa' },
        ],
      },
    ],
  },
];

interface TransferDataItem {
  key: string;
  title: string;
  description: string;
}

const transferData: TransferDataItem[] = [];
for (let i = 0; i < 20; i++) {
  transferData.push({
    key: i.toString(),
    title: `Content ${i + 1}`,
    description: `Description of content ${i + 1}`,
  });
}

interface FormValues {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  age?: number;
  gender?: string;
  birthDate?: string;
  address?: string;
  location?: string[];
  zipCode?: string;
  timezone?: string;
  department?: string;
  skills?: string[];
  experience?: number;
  satisfaction?: number;
  newsletter?: boolean;
  notifications?: boolean;
  priority?: string;
  preferredTime?: [string, string];
  bio?: string;
  upload?: unknown;
  permissions?: string[];
}

export const FormView: ViewComponent = ({ config }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form values:', values);
      message.success('Form submitted successfully!');
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    form.resetFields();
    message.info('Form reset');
  };

  const handleTransferChange: TransferProps<TransferDataItem>['onChange'] = (newTargetKeys) => {
    setTargetKeys(newTargetKeys as string[]);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <ViewContainer config={config}>
      <div style={{ padding: 16, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            gender: 'male',
            newsletter: true,
            satisfaction: 4,
            priority: 'medium',
            experience: 3,
          }}
        >
          <Row gutter={[16, 16]}>
            {/* Personal Information */}
            <Col span={24}>
              <Card title="Personal Information" size="small">
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="firstName"
                      label="First Name"
                      rules={[{ required: true, message: 'Please input your first name!' }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="John" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="lastName"
                      label="Last Name"
                      rules={[{ required: true, message: 'Please input your last name!' }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Doe" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="john@example.com" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phone"
                      label="Phone Number"
                      rules={[{ required: true, message: 'Please input your phone number!' }]}
                    >
                      <Input prefix={<PhoneOutlined />} placeholder="+1 (555) 123-4567" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="age" label="Age">
                      <InputNumber min={1} max={120} style={{ width: '100%' }} placeholder="25" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="gender" label="Gender">
                      <Radio.Group>
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                        <Radio value="other">Other</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="birthDate" label="Birth Date">
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Address Information */}
            <Col span={24}>
              <Card title="Address Information" size="small">
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="address" label="Street Address">
                      <Input prefix={<HomeOutlined />} placeholder="123 Main St" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="location" label="City, State, Country">
                      <Cascader 
                        options={cascaderOptions} 
                        placeholder="Select location"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="zipCode" label="ZIP Code">
                      <Input placeholder="12345" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="timezone" label="Timezone">
                      <Select placeholder="Select timezone">
                        <Option value="est">EST (UTC-5)</Option>
                        <Option value="cst">CST (UTC-6)</Option>
                        <Option value="mst">MST (UTC-7)</Option>
                        <Option value="pst">PST (UTC-8)</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Preferences */}
            <Col xs={24} lg={12}>
              <Card title="Preferences & Settings" size="small">
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Form.Item name="department" label="Department">
                    <TreeSelect
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="Please select department"
                      allowClear
                      treeDefaultExpandAll
                    >
                      <TreeNode value="engineering" title="Engineering">
                        <TreeNode value="frontend" title="Frontend" />
                        <TreeNode value="backend" title="Backend" />
                        <TreeNode value="devops" title="DevOps" />
                      </TreeNode>
                      <TreeNode value="marketing" title="Marketing">
                        <TreeNode value="digital" title="Digital Marketing" />
                        <TreeNode value="content" title="Content Marketing" />
                      </TreeNode>
                      <TreeNode value="sales" title="Sales" />
                    </TreeSelect>
                  </Form.Item>

                  <Form.Item name="skills" label="Skills">
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      placeholder="Select your skills"
                      optionLabelProp="label"
                    >
                      <Option value="react" label="React">React</Option>
                      <Option value="typescript" label="TypeScript">TypeScript</Option>
                      <Option value="nodejs" label="Node.js">Node.js</Option>
                      <Option value="python" label="Python">Python</Option>
                      <Option value="graphql" label="GraphQL">GraphQL</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="experience" label="Experience Level">
                    <Slider
                      min={1}
                      max={5}
                      marks={{
                        1: 'Beginner',
                        2: 'Basic',
                        3: 'Intermediate',
                        4: 'Advanced',
                        5: 'Expert'
                      }}
                    />
                  </Form.Item>

                  <Form.Item name="satisfaction" label="Satisfaction Rating">
                    <Rate />
                  </Form.Item>

                  <Form.Item name="newsletter" valuePropName="checked">
                    <Checkbox>Subscribe to newsletter</Checkbox>
                  </Form.Item>

                  <Form.Item name="notifications" valuePropName="checked">
                    <Switch checkedChildren="ON" unCheckedChildren="OFF" />
                    <Text style={{ marginLeft: 8 }}>Email notifications</Text>
                  </Form.Item>
                </Space>
              </Card>
            </Col>

            {/* Additional Info */}
            <Col xs={24} lg={12}>
              <Card title="Additional Information" size="small">
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Form.Item name="priority" label="Priority Level">
                    <Radio.Group>
                      <Radio.Button value="low">Low</Radio.Button>
                      <Radio.Button value="medium">Medium</Radio.Button>
                      <Radio.Button value="high">High</Radio.Button>
                      <Radio.Button value="urgent">Urgent</Radio.Button>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item name="preferredTime" label="Preferred Contact Time">
                    <TimePicker.RangePicker style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item name="bio" label="Bio">
                    <TextArea 
                      rows={4} 
                      placeholder="Tell us about yourself..." 
                      maxLength={500}
                      showCount
                    />
                  </Form.Item>

                  <Form.Item name="upload" label="Upload Documents">
                    <Dragger {...uploadProps}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Click or drag file to this area to upload</p>
                      <p className="ant-upload-hint">
                        Support for single or bulk upload. Strictly prohibited from uploading company data.
                      </p>
                    </Dragger>
                  </Form.Item>
                </Space>
              </Card>
            </Col>

            {/* Transfer Demo */}
            <Col span={24}>
              <Card title="Transfer Control Demo" size="small">
                <Form.Item name="permissions" label="Assign Permissions">
                  <Transfer
                    dataSource={transferData}
                    targetKeys={targetKeys}
                    onChange={handleTransferChange}
                    render={item => item.title}
                    style={{ marginBottom: 16 }}
                  />
                </Form.Item>
              </Card>
            </Col>

            {/* Form Actions */}
            <Col span={24}>
              <Divider />
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                    Submit Form
                  </Button>
                  <Button htmlType="button" onClick={onReset} icon={<ClearOutlined />}>
                    Reset
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </ViewContainer>
  );
};