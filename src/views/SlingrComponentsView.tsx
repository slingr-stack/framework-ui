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
import { CodeOutlined } from '@ant-design/icons';
import { ViewContainer } from '../components/ViewContainer';
import type { ViewComponent } from '../types/view';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Import Slingr components
import { DataField } from '../components/slingr';

const { Title, Paragraph, Text: AntText } = Typography;

// Mock data for examples
const mockUserData = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  name: 'John Doe',
  email: 'john.doe@example.com',
  department: 'Engineering',
  salary: 85000,
  isActive: true,
  joinDate: '2023-01-15',
  projectCount: 12,
  bio: '<p>Senior Software Engineer with <strong>5+ years</strong> of experience in web development.</p>',
  rating: 4.8,
  workDays: 22,
  manager: { id: 1, name: 'Jane Smith' },
  skills: ['JavaScript', 'TypeScript', 'React'],
  tags: ['frontend', 'backend', 'full-stack'],
  customers: [
    { id: 1, name: 'Acme Corp' },
    { id: 2, name: 'Tech Solutions Inc' }
  ]
};

// Mock relationship options
const mockManagers = [
  { id: 1, label: 'Jane Smith', value: 1 },
  { id: 2, label: 'Bob Johnson', value: 2 },
  { id: 3, label: 'Sarah Wilson', value: 3 },
];

const mockDepartments = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Design', value: 'design' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Sales', value: 'sales' }
];

const mockSkills = [
  { id: 1, label: 'JavaScript', value: 'javascript' },
  { id: 2, label: 'TypeScript', value: 'typescript' },
  { id: 3, label: 'React', value: 'react' },
  { id: 4, label: 'Node.js', value: 'nodejs' },
  { id: 5, label: 'Python', value: 'python' },
];

const mockCustomers = [
  { id: 1, label: 'Acme Corp', value: 1 },
  { id: 2, label: 'Tech Solutions Inc', value: 2 },
  { id: 3, label: 'Global Industries', value: 3 },
  { id: 4, label: 'StartupCo', value: 4 },
];

// Code examples for the components
const codeExamples = {
  dataField: `// Data Field Component - Comprehensive Examples
import { DataField } from '../components/slingr';

// Text field types
<DataField label="UUID" value="a1b2c3d4-e5f6-7890-abcd-ef1234567890" type="uuid" mode="readonly" />
<DataField label="Name" value="John Doe" type="text" mode="editable" onChange={(value) => console.log(value)} />
<DataField label="Tags" value={["frontend", "backend"]} type="text" mode="readonly" multiple />

// Email field types
<DataField label="Email" value="john@example.com" type="email" mode="readonly" />
<DataField label="Email" value="john@example.com" type="email" mode="editable" onChange={(value) => console.log(value)} />
<DataField label="Emails" value={["john@example.com", "jane@example.com"]} type="email" mode="readonly" multiple />

// HTML field types  
<DataField label="Bio" value="<p>Senior <strong>Engineer</strong></p>" type="html" mode="readonly" />
<DataField label="Bio" value="<p>Senior <strong>Engineer</strong></p>" type="html" mode="editable" onChange={(value) => console.log(value)} />

// Number field types
<DataField label="Salary" value={85000} type="money" mode="readonly" />
<DataField label="Salary" value={85000} type="money" mode="editable" onChange={(value) => console.log(value)} />
<DataField label="Bonuses" value={[5000, 3000]} type="money" mode="readonly" multiple />

<DataField label="Age" value={28} type="integer" mode="readonly" />
<DataField label="Age" value={28} type="integer" mode="editable" onChange={(value) => console.log(value)} />

<DataField label="Rating" value={4.8} type="decimal" mode="readonly" suffix="/5" />
<DataField label="Rating" value={4.8} type="decimal" mode="editable" onChange={(value) => console.log(value)} />

// DateTime field types
<DataField label="Join Date" value={new Date()} type="datetime" mode="readonly" />
<DataField label="Join Date" value={new Date()} type="datetime" mode="editable" onChange={(value) => console.log(value)} />
<DataField label="Important Dates" value={[new Date(), new Date()]} type="datetime" mode="readonly" multiple />

// Boolean field types
<DataField label="Active" value={true} type="boolean" mode="readonly" />
<DataField label="Active" value={true} type="boolean" mode="editable" onChange={(value) => console.log(value)} />

// Choice field types
<DataField 
  label="Department" 
  value="engineering" 
  type="choice" 
  mode="readonly"
  choices={[{label: 'Engineering', value: 'engineering'}]}
/>
<DataField 
  label="Department" 
  value="engineering" 
  type="choice" 
  mode="editable"
  choices={[{label: 'Engineering', value: 'engineering'}]}
  onChange={(value) => console.log(value)}
/>
<DataField 
  label="Skills" 
  value={["javascript", "react"]} 
  type="choice" 
  mode="readonly"
  multiple
  choices={[{label: 'JavaScript', value: 'javascript'}, {label: 'React', value: 'react'}]}
/>

// Relationship field types
<DataField 
  label="Manager" 
  value={1} 
  type="relationship" 
  mode="readonly"
  relationshipOptions={[{id: 1, label: 'Jane Smith', value: 1}]}
/>
<DataField 
  label="Manager" 
  value={1} 
  type="relationship" 
  mode="editable"
  relationshipOptions={[{id: 1, label: 'Jane Smith', value: 1}]}
  onChange={(value) => console.log(value)}
/>
<DataField 
  label="Customers" 
  value={[1, 2]} 
  type="relationship" 
  mode="readonly"
  multiple
  relationshipOptions={[
    {id: 1, label: 'Acme Corp', value: 1},
    {id: 2, label: 'Tech Solutions', value: 2}
  ]}
/>`,

  allComponents: `// General Example - Using All Components Together
import { DataField } from '../components/slingr';

const UserProfile = ({ user, onUserChange }) => {
  return (
    <div>
      <h2>User Profile</h2>
      
      {/* Basic Information */}
      <DataField label="ID" value={user.id} type="uuid" mode="readonly" />
      <DataField 
        label="Name" 
        value={user.name} 
        type="text" 
        mode="editable" 
        onChange={(value) => onUserChange({...user, name: value})}
      />
      <DataField 
        label="Email" 
        value={user.email} 
        type="email" 
        mode="editable"
        onChange={(value) => onUserChange({...user, email: value})}
      />
      
      {/* Employment Details */}
      <DataField 
        label="Department" 
        value={user.department} 
        type="choice" 
        mode="editable"
        choices={departmentOptions}
        onChange={(value) => onUserChange({...user, department: value})}
      />
      <DataField 
        label="Manager" 
        value={user.managerId} 
        type="relationship" 
        mode="editable"
        relationshipOptions={managerOptions}
        onChange={(value) => onUserChange({...user, managerId: value})}
      />
      <DataField label="Salary" value={user.salary} type="money" mode="readonly" />
      <DataField label="Join Date" value={user.joinDate} type="datetime" mode="readonly" />
      
      {/* Multi-valued fields */}
      <DataField 
        label="Skills" 
        value={user.skills} 
        type="relationship" 
        mode="editable"
        multiple
        relationshipOptions={skillOptions}
        onChange={(value) => onUserChange({...user, skills: value})}
      />
      <DataField 
        label="Assigned Customers" 
        value={user.customers} 
        type="relationship" 
        mode="readonly"
        multiple
        relationshipOptions={customerOptions}
      />
      
      {/* Status */}
      <DataField 
        label="Active" 
        value={user.isActive} 
        type="boolean" 
        mode="editable"
        onChange={(value) => onUserChange({...user, isActive: value})}
      />
    </div>
  );
};`
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
              The component can operate in readonly or editable mode, with proper input controls 
              for each data type including text, numbers, dates, booleans, choices, and relationships.
            </Paragraph>
            
            <Title level={5}>Field Type Examples</Title>
            
            {/* Text Types */}
            <Title level={5}>Text Types</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} lg={8}>
                <AntText strong>Readonly Mode</AntText>
                <DataField label="UUID" value={mockUserData.id} type="uuid" mode="readonly" />
                <DataField label="Name" value={mockUserData.name} type="text" mode="readonly" />
                <DataField label="Email" value={mockUserData.email} type="email" mode="readonly" />
                <DataField label="Bio" value={mockUserData.bio} type="html" mode="readonly" layout="vertical" />
              </Col>
              <Col xs={24} lg={8}>
                <AntText strong>Editable Mode</AntText>
                <DataField label="Name" value={mockUserData.name} type="text" mode="editable" onChange={(value) => console.log('Name:', value)} />
                <DataField label="Email" value={mockUserData.email} type="email" mode="editable" onChange={(value) => console.log('Email:', value)} />
                <DataField label="Bio" value="Simple bio text" type="html" mode="editable" layout="vertical" onChange={(value) => console.log('Bio:', value)} />
              </Col>
              <Col xs={24} lg={8}>
                <AntText strong>Multi-valued</AntText>
                <DataField label="Tags" value={mockUserData.tags} type="text" mode="readonly" multiple />
                <DataField label="Emails" value={[mockUserData.email, 'jane@example.com']} type="email" mode="readonly" multiple />
              </Col>
            </Row>

            {/* Number Types */}
            <Title level={5}>Number Types</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} lg={8}>
                <AntText strong>Readonly Mode</AntText>
                <DataField label="Salary" value={mockUserData.salary} type="money" mode="readonly" />
                <DataField label="Work Days" value={mockUserData.workDays} type="integer" mode="readonly" />
                <DataField label="Rating" value={mockUserData.rating} type="decimal" mode="readonly" suffix="/5" />
              </Col>
              <Col xs={24} lg={8}>
                <AntText strong>Editable Mode</AntText>
                <DataField label="Salary" value={mockUserData.salary} type="money" mode="editable" onChange={(value) => console.log('Salary:', value)} />
                <DataField label="Work Days" value={mockUserData.workDays} type="integer" mode="editable" onChange={(value) => console.log('Work Days:', value)} />
                <DataField label="Rating" value={mockUserData.rating} type="decimal" mode="editable" onChange={(value) => console.log('Rating:', value)} />
              </Col>
              <Col xs={24} lg={8}>
                <AntText strong>Multi-valued</AntText>
                <DataField label="Bonuses" value={[5000, 3000, 2000]} type="money" mode="readonly" multiple />
                <DataField label="Work History" value={[22, 20, 18]} type="integer" mode="readonly" multiple suffix=" days" />
              </Col>
            </Row>

            {/* DateTime Types */}
            <Title level={5}>DateTime Types</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} lg={8}>
                <AntText strong>Readonly Mode</AntText>
                <DataField label="Join Date" value="2023-01-15" type="datetime" mode="readonly" />
              </Col>
              <Col xs={24} lg={8}>
                <AntText strong>Editable Mode</AntText>
                <DataField label="Join Date" value="2023-01-15" type="datetime" mode="editable" onChange={(value) => console.log('Join Date:', value)} />
              </Col>
              <Col xs={24} lg={8}>
                <AntText strong>Multi-valued</AntText>
                <DataField label="Key Dates" value={["2023-01-15", "2023-12-25"]} type="datetime" mode="readonly" multiple />
              </Col>
            </Row>

            {/* Boolean Types */}
            <Title level={5}>Boolean Types</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} lg={8}>
                <AntText strong>Readonly Mode</AntText>
                <DataField label="Active Status" value={mockUserData.isActive} type="boolean" mode="readonly" />
              </Col>
              <Col xs={24} lg={8}>
                <AntText strong>Editable Mode</AntText>
                <DataField label="Active Status" value={mockUserData.isActive} type="boolean" mode="editable" onChange={(value) => console.log('Active:', value)} />
              </Col>
              <Col xs={24} lg={8}>
                <AntText strong>Note</AntText>
                <AntText type="secondary">Boolean fields don't support multi-valued mode</AntText>
              </Col>
            </Row>

            {/* Choice Types */}
            <Title level={5}>Choice Types</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} lg={8}>
                <AntText strong>Readonly Mode</AntText>
                <DataField 
                  label="Department" 
                  value="engineering" 
                  type="choice" 
                  mode="readonly"
                  choices={mockDepartments}
                />
              </Col>
              <Col xs={24} lg={8}>
                <AntText strong>Editable Mode</AntText>
                <DataField 
                  label="Department" 
                  value="engineering" 
                  type="choice" 
                  mode="editable"
                  choices={mockDepartments}
                  onChange={(value) => console.log('Department:', value)}
                />
              </Col>
              <Col xs={24} lg={8}>
                <AntText strong>Multi-valued</AntText>
                <DataField 
                  label="Skills" 
                  value={['javascript', 'react']} 
                  type="choice" 
                  mode="readonly"
                  multiple
                  choices={mockSkills}
                />
              </Col>
            </Row>

            {/* Relationship Types */}
            <Title level={5}>Relationship Types</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} lg={8}>
                <AntText strong>Readonly Mode</AntText>
                <DataField 
                  label="Manager" 
                  value={1} 
                  type="relationship" 
                  mode="readonly"
                  relationshipOptions={mockManagers}
                />
              </Col>
              <Col xs={24} lg={8}>
                <AntText strong>Editable Mode</AntText>
                <DataField 
                  label="Manager" 
                  value={1} 
                  type="relationship" 
                  mode="editable"
                  relationshipOptions={mockManagers}
                  onChange={(value) => console.log('Manager:', value)}
                />
              </Col>
              <Col xs={24} lg={8}>
                <AntText strong>Multi-valued</AntText>
                <DataField 
                  label="Customers" 
                  value={[1, 2]} 
                  type="relationship" 
                  mode="readonly"
                  multiple
                  relationshipOptions={mockCustomers}
                />
              </Col>
            </Row>
          </Card>

          {/* General Example */}
          <Card 
            title="General Example - Complete User Profile" 
            extra={<CodeButton codeKey="allComponents" title="General Example" />}
            style={{ marginBottom: 16 }}
          >
            <Paragraph>
              This example shows how to use DataField components together to create a complete user profile 
              interface with various field types and modes.
            </Paragraph>
            
            <Row gutter={[24, 16]}>
              <Col xs={24} lg={12}>
                <Title level={5}>Basic Information</Title>
                <DataField label="ID" value={mockUserData.id} type="uuid" mode="readonly" />
                <DataField 
                  label="Name" 
                  value={mockUserData.name} 
                  type="text" 
                  mode="editable" 
                  onChange={(value) => console.log('Name changed:', value)}
                />
                <DataField 
                  label="Email" 
                  value={mockUserData.email} 
                  type="email" 
                  mode="editable"
                  onChange={(value) => console.log('Email changed:', value)}
                />
                <DataField 
                  label="Department" 
                  value="engineering" 
                  type="choice" 
                  mode="editable"
                  choices={mockDepartments}
                  onChange={(value) => console.log('Department changed:', value)}
                />
                <DataField 
                  label="Manager" 
                  value={1} 
                  type="relationship" 
                  mode="editable"
                  relationshipOptions={mockManagers}
                  onChange={(value) => console.log('Manager changed:', value)}
                />
              </Col>
              <Col xs={24} lg={12}>
                <Title level={5}>Employment Details</Title>
                <DataField label="Salary" value={mockUserData.salary} type="money" mode="readonly" />
                <DataField label="Join Date" value="2023-01-15" type="datetime" mode="readonly" />
                <DataField 
                  label="Skills" 
                  value={['javascript', 'react']} 
                  type="relationship" 
                  mode="editable"
                  multiple
                  relationshipOptions={mockSkills}
                  onChange={(value) => console.log('Skills changed:', value)}
                />
                <DataField 
                  label="Assigned Customers" 
                  value={[1, 2]} 
                  type="relationship" 
                  mode="readonly"
                  multiple
                  relationshipOptions={mockCustomers}
                />
                <DataField 
                  label="Active" 
                  value={mockUserData.isActive} 
                  type="boolean" 
                  mode="editable"
                  onChange={(value) => console.log('Active changed:', value)}
                />
              </Col>
            </Row>
          </Card>
        </div>
      )
    }
  ];

  return (
    <ViewContainer config={config}>
      <div style={{ padding: 16 }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>Data Field Components</Title>
          <Paragraph>
            Comprehensive showcase of DataField component with support for all data types, 
            readonly/editable modes, and multi-valued fields with proper GraphQL integration patterns.
          </Paragraph>
        </div>
        
        <Tabs
          defaultActiveKey="datafield"
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