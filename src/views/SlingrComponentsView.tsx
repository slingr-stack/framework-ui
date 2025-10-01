import { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Modal,
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

// Code examples for each data field type
const codeExamples = {
  text: `// Text Field Type - Configuration and Examples
import { DataField } from '../components/slingr';

// Configuration Properties:
// - label: string (required)
// - value: string | string[] | null
// - type: 'text'
// - mode: 'readonly' | 'editable'
// - multiple: boolean (for array values)
// - helpText: string (tooltip)
// - loading: boolean
// - error: string
// - prefix: string
// - suffix: string
// - onChange: (value) => void

// GraphQL Binding Examples:
const FETCH_USER = gql\`
  query GetUser($id: ID!) {
    user(id: $id) {
      name      # Bind to value prop
      tags      # Bind to value prop for multiple
    }
  }
\`;

// Simple Examples:
<DataField 
  label="Name" 
  value="John Doe" 
  type="text" 
  mode="readonly" 
/>

<DataField 
  label="Name" 
  value="John Doe" 
  type="text" 
  mode="editable" 
  onChange={(value) => console.log('Name changed:', value)}
/>

// Multi-valued Example:
<DataField 
  label="Tags" 
  value={["frontend", "backend", "full-stack"]} 
  type="text" 
  mode="readonly" 
  multiple 
/>

// With Loading State:
<DataField 
  label="Name" 
  value={data?.user?.name} 
  type="text" 
  mode="editable"
  loading={loading}
  error={error?.message}
  onChange={(value) => updateUser({ variables: { name: value } })}
/>

// With Help Text and Prefix/Suffix:
<DataField 
  label="Username" 
  value="johndoe" 
  type="text" 
  mode="editable"
  prefix="@"
  helpText="Choose a unique username"
  onChange={(value) => setUsername(value)}
/>`,

  uuid: `// UUID Field Type - Configuration and Examples
import { DataField } from '../components/slingr';

// Configuration Properties:
// - label: string (required)
// - value: string | null
// - type: 'uuid'
// - mode: 'readonly' | 'editable'
// - helpText: string
// - loading: boolean
// - error: string
// - onChange: (value) => void

// GraphQL Binding Examples:
const FETCH_RECORD = gql\`
  query GetRecord($id: ID!) {
    record(id: $id) {
      id        # Bind to value prop
      userId    # Another UUID field
    }
  }
\`;

// Simple Examples:
<DataField 
  label="ID" 
  value="a1b2c3d4-e5f6-7890-abcd-ef1234567890" 
  type="uuid" 
  mode="readonly" 
/>

<DataField 
  label="User ID" 
  value="a1b2c3d4-e5f6-7890-abcd-ef1234567890" 
  type="uuid" 
  mode="editable" 
  onChange={(value) => console.log('UUID changed:', value)}
/>

// With GraphQL Integration:
<DataField 
  label="Record ID" 
  value={data?.record?.id} 
  type="uuid" 
  mode="readonly"
  loading={loading}
  error={error?.message}
/>

// Editable with Validation:
<DataField 
  label="External ID" 
  value={externalId} 
  type="uuid" 
  mode="editable"
  helpText="Enter a valid UUID format"
  error={!isValidUUID(externalId) ? "Invalid UUID format" : undefined}
  onChange={(value) => setExternalId(value)}
/>`,

  email: `// Email Field Type - Configuration and Examples
import { DataField } from '../components/slingr';

// Configuration Properties:
// - label: string (required)
// - value: string | string[] | null
// - type: 'email'
// - mode: 'readonly' | 'editable'
// - multiple: boolean (for array values)
// - helpText: string
// - loading: boolean
// - error: string
// - onChange: (value) => void

// GraphQL Binding Examples:
const FETCH_USER = gql\`
  query GetUser($id: ID!) {
    user(id: $id) {
      email           # Primary email
      alternateEmails # Array of emails
    }
  }
\`;

// Simple Examples:
<DataField 
  label="Email" 
  value="john@example.com" 
  type="email" 
  mode="readonly" 
/>

<DataField 
  label="Email" 
  value="john@example.com" 
  type="email" 
  mode="editable" 
  onChange={(value) => console.log('Email changed:', value)}
/>

// Multi-valued Example:
<DataField 
  label="Contact Emails" 
  value={["john@example.com", "john.doe@work.com"]} 
  type="email" 
  mode="readonly" 
  multiple 
/>

// With Validation and Events:
<DataField 
  label="Email Address" 
  value={email} 
  type="email" 
  mode="editable"
  helpText="Enter a valid email address"
  error={!isValidEmail(email) ? "Invalid email format" : undefined}
  onChange={(value) => {
    setEmail(value);
    // Trigger email validation
    validateEmailAvailability(value);
  }}
/>

// GraphQL Mutation Example:
const [updateEmail] = useMutation(UPDATE_USER_EMAIL, {
  onCompleted: () => message.success('Email updated successfully'),
  onError: (error) => message.error('Failed to update email')
});

<DataField 
  label="Primary Email" 
  value={data?.user?.email} 
  type="email" 
  mode="editable"
  loading={loading}
  onChange={(value) => updateEmail({ variables: { email: value } })}
/>`,

  html: `// HTML Field Type - Configuration and Examples
import { DataField } from '../components/slingr';

// Configuration Properties:
// - label: string (required)
// - value: string | null
// - type: 'html'
// - mode: 'readonly' | 'editable'
// - layout: 'horizontal' | 'vertical' (recommended: vertical)
// - helpText: string
// - loading: boolean
// - error: string
// - onChange: (value) => void

// GraphQL Binding Examples:
const FETCH_CONTENT = gql\`
  query GetContent($id: ID!) {
    content(id: $id) {
      description     # HTML content
      richText       # Rich text HTML
    }
  }
\`;

// Simple Examples:
<DataField 
  label="Bio" 
  value="<p>Senior <strong>Engineer</strong> with 5+ years experience</p>" 
  type="html" 
  mode="readonly"
  layout="vertical"
/>

<DataField 
  label="Description" 
  value="<p>Enter your description here</p>" 
  type="html" 
  mode="editable"
  layout="vertical"
  onChange={(value) => console.log('HTML changed:', value)}
/>

// Complex Example with Rich Text:
const [content, setContent] = useState('<p>Initial content</p>');

<DataField 
  label="Article Content" 
  value={content} 
  type="html" 
  mode="editable"
  layout="vertical"
  helpText="Use HTML tags for formatting"
  onChange={(value) => {
    setContent(value);
    // Auto-save content
    debouncedSave(value);
  }}
/>

// GraphQL Integration:
const [updateContent] = useMutation(UPDATE_CONTENT, {
  onCompleted: () => message.success('Content saved'),
  onError: (error) => message.error('Failed to save content')
});

<DataField 
  label="Page Content" 
  value={data?.content?.description} 
  type="html" 
  mode="editable"
  layout="vertical"
  loading={loading}
  error={error?.message}
  onChange={(value) => updateContent({ variables: { html: value } })}
/>`,

  number: `// Number Field Type - Configuration and Examples
import { DataField } from '../components/slingr';

// Configuration Properties:
// - label: string (required)
// - value: number | number[] | null
// - type: 'number'
// - mode: 'readonly' | 'editable'
// - multiple: boolean (for array values)
// - helpText: string
// - loading: boolean
// - error: string
// - prefix: string
// - suffix: string
// - onChange: (value) => void

// GraphQL Binding Examples:
const FETCH_METRICS = gql\`
  query GetMetrics($id: ID!) {
    metrics(id: $id) {
      score           # Single number
      measurements    # Array of numbers
    }
  }
\`;

// Simple Examples:
<DataField 
  label="Score" 
  value={87.5} 
  type="number" 
  mode="readonly" 
/>

<DataField 
  label="Score" 
  value={87.5} 
  type="number" 
  mode="editable" 
  onChange={(value) => console.log('Score changed:', value)}
/>

// Multi-valued Example:
<DataField 
  label="Test Scores" 
  value={[85, 92, 78, 95]} 
  type="number" 
  mode="readonly" 
  multiple 
/>

// With Suffix and Validation:
<DataField 
  label="Temperature" 
  value={23.5} 
  type="number" 
  mode="editable"
  suffix="°C"
  helpText="Enter temperature in Celsius"
  error={temp < -50 || temp > 100 ? "Invalid temperature range" : undefined}
  onChange={(value) => setTemperature(value)}
/>

// Advanced Example with Min/Max:
<DataField 
  label="Progress" 
  value={progress} 
  type="number" 
  mode="editable"
  suffix="%"
  helpText="Value between 0 and 100"
  onChange={(value) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    setProgress(clampedValue);
  }}
/>`,

  integer: `// Integer Field Type - Configuration and Examples
import { DataField } from '../components/slingr';

// Configuration Properties:
// - label: string (required)
// - value: number | number[] | null
// - type: 'integer'
// - mode: 'readonly' | 'editable'
// - multiple: boolean (for array values)
// - helpText: string
// - loading: boolean
// - error: string
// - prefix: string
// - suffix: string
// - onChange: (value) => void

// GraphQL Binding Examples:
const FETCH_COUNTS = gql\`
  query GetCounts($id: ID!) {
    stats(id: $id) {
      userCount       # Integer count
      monthlyValues   # Array of integers
    }
  }
\`;

// Simple Examples:
<DataField 
  label="Age" 
  value={28} 
  type="integer" 
  mode="readonly" 
/>

<DataField 
  label="Quantity" 
  value={15} 
  type="integer" 
  mode="editable" 
  onChange={(value) => console.log('Quantity changed:', value)}
/>

// Multi-valued Example:
<DataField 
  label="Work Days per Month" 
  value={[22, 20, 23, 21]} 
  type="integer" 
  mode="readonly" 
  multiple 
  suffix=" days"
/>

// With Validation:
<DataField 
  label="Team Size" 
  value={teamSize} 
  type="integer" 
  mode="editable"
  helpText="Enter number of team members"
  error={teamSize < 1 ? "Team must have at least 1 member" : undefined}
  onChange={(value) => {
    const intValue = Math.floor(Number(value));
    setTeamSize(intValue);
  }}
/>

// Inventory Management Example:
const [updateStock] = useMutation(UPDATE_STOCK, {
  onCompleted: () => message.success('Stock updated'),
  onError: (error) => message.error('Failed to update stock')
});

<DataField 
  label="Units in Stock" 
  value={data?.product?.stock} 
  type="integer" 
  mode="editable"
  loading={loading}
  helpText="Current inventory count"
  onChange={(value) => updateStock({ variables: { stock: value } })}
/>`,

  decimal: `// Decimal Field Type - Configuration and Examples
import { DataField } from '../components/slingr';

// Configuration Properties:
// - label: string (required)
// - value: number | number[] | null
// - type: 'decimal'
// - mode: 'readonly' | 'editable'
// - multiple: boolean (for array values)
// - helpText: string
// - loading: boolean
// - error: string
// - prefix: string
// - suffix: string
// - onChange: (value) => void

// GraphQL Binding Examples:
const FETCH_RATINGS = gql\`
  query GetRatings($id: ID!) {
    product(id: $id) {
      rating          # Decimal rating
      scores          # Array of decimal scores
    }
  }
\`;

// Simple Examples:
<DataField 
  label="Rating" 
  value={4.8} 
  type="decimal" 
  mode="readonly" 
  suffix="/5"
/>

<DataField 
  label="Rating" 
  value={4.8} 
  type="decimal" 
  mode="editable" 
  onChange={(value) => console.log('Rating changed:', value)}
/>

// Multi-valued Example:
<DataField 
  label="Performance Scores" 
  value={[4.8, 4.2, 4.9, 4.6]} 
  type="decimal" 
  mode="readonly" 
  multiple 
  suffix="/5"
/>

// Percentage Example:
<DataField 
  label="Completion Rate" 
  value={87.5} 
  type="decimal" 
  mode="editable"
  suffix="%"
  helpText="Enter completion percentage"
  onChange={(value) => setCompletionRate(value)}
/>

// Rating System with Constraints:
<DataField 
  label="Product Rating" 
  value={rating} 
  type="decimal" 
  mode="editable"
  suffix="/5"
  helpText="Rating from 1.0 to 5.0"
  error={rating < 1 || rating > 5 ? "Rating must be between 1.0 and 5.0" : undefined}
  onChange={(value) => {
    const clampedRating = Math.min(5, Math.max(1, Number(value)));
    setRating(clampedRating);
    // Update in real-time
    updateProductRating({ variables: { rating: clampedRating } });
  }}
/>`,

  money: `// Money Field Type - Configuration and Examples
import { DataField } from '../components/slingr';

// Configuration Properties:
// - label: string (required)
// - value: number | number[] | null
// - type: 'money'
// - mode: 'readonly' | 'editable'
// - multiple: boolean (for array values)
// - helpText: string
// - loading: boolean
// - error: string
// - onChange: (value) => void
// Note: Automatically formats with $ and commas

// GraphQL Binding Examples:
const FETCH_FINANCIALS = gql\`
  query GetFinancials($id: ID!) {
    user(id: $id) {
      salary          # Money value
      bonuses         # Array of money values
    }
  }
\`;

// Simple Examples:
<DataField 
  label="Salary" 
  value={85000} 
  type="money" 
  mode="readonly" 
/>

<DataField 
  label="Budget" 
  value={50000} 
  type="money" 
  mode="editable" 
  onChange={(value) => console.log('Budget changed:', value)}
/>

// Multi-valued Example:
<DataField 
  label="Quarterly Bonuses" 
  value={[5000, 3000, 4000, 6000]} 
  type="money" 
  mode="readonly" 
  multiple 
/>

// Budget Management:
<DataField 
  label="Project Budget" 
  value={projectBudget} 
  type="money" 
  mode="editable"
  helpText="Enter total project budget"
  error={projectBudget < 1000 ? "Budget must be at least $1,000" : undefined}
  onChange={(value) => {
    setProjectBudget(value);
    // Calculate remaining budget
    const remaining = value - spentAmount;
    setRemainingBudget(remaining);
  }}
/>

// Sales Integration:
const [updateSalary] = useMutation(UPDATE_SALARY, {
  onCompleted: () => message.success('Salary updated successfully'),
  onError: (error) => message.error('Failed to update salary')
});

<DataField 
  label="Annual Salary" 
  value={data?.employee?.salary} 
  type="money" 
  mode="editable"
  loading={loading}
  helpText="Gross annual salary"
  onChange={(value) => updateSalary({ variables: { amount: value } })}
/>`,

  datetime: `// DateTime Field Type - Configuration and Examples
import { DataField } from '../components/slingr';

// Configuration Properties:
// - label: string (required)
// - value: Date | string | Date[] | string[] | null
// - type: 'datetime'
// - mode: 'readonly' | 'editable'
// - multiple: boolean (for array values)
// - helpText: string
// - loading: boolean
// - error: string
// - onChange: (value) => void

// GraphQL Binding Examples:
const FETCH_DATES = gql\`
  query GetDates($id: ID!) {
    user(id: $id) {
      joinDate        # ISO date string
      importantDates  # Array of dates
    }
  }
\`;

// Simple Examples:
<DataField 
  label="Join Date" 
  value="2023-01-15T00:00:00Z" 
  type="datetime" 
  mode="readonly" 
/>

<DataField 
  label="Event Date" 
  value={new Date()} 
  type="datetime" 
  mode="editable" 
  onChange={(value) => console.log('Date changed:', value)}
/>

// Multi-valued Example:
<DataField 
  label="Project Milestones" 
  value={[
    "2023-01-15T00:00:00Z",
    "2023-06-15T00:00:00Z",
    "2023-12-15T00:00:00Z"
  ]} 
  type="datetime" 
  mode="readonly" 
  multiple 
/>

// Event Scheduling:
<DataField 
  label="Meeting Time" 
  value={meetingDate} 
  type="datetime" 
  mode="editable"
  helpText="Select meeting date and time"
  error={meetingDate < new Date() ? "Meeting cannot be in the past" : undefined}
  onChange={(value) => {
    setMeetingDate(value);
    // Check availability
    checkAvailability(value);
  }}
/>

// Project Management:
const [updateDeadline] = useMutation(UPDATE_PROJECT_DEADLINE, {
  onCompleted: () => message.success('Deadline updated'),
  onError: (error) => message.error('Failed to update deadline')
});

<DataField 
  label="Project Deadline" 
  value={data?.project?.deadline} 
  type="datetime" 
  mode="editable"
  loading={loading}
  helpText="Set project completion deadline"
  onChange={(value) => updateDeadline({ variables: { deadline: value.toISOString() } })}
/>`,

  boolean: `// Boolean Field Type - Configuration and Examples
import { DataField } from '../components/slingr';

// Configuration Properties:
// - label: string (required)
// - value: boolean | null
// - type: 'boolean'
// - mode: 'readonly' | 'editable'
// - helpText: string
// - loading: boolean
// - error: string
// - onChange: (value) => void
// Note: multiple is not supported for boolean type

// GraphQL Binding Examples:
const FETCH_STATUS = gql\`
  query GetStatus($id: ID!) {
    user(id: $id) {
      isActive        # Boolean status
      isVerified      # Another boolean
    }
  }
\`;

// Simple Examples:
<DataField 
  label="Active Status" 
  value={true} 
  type="boolean" 
  mode="readonly" 
/>

<DataField 
  label="Email Verified" 
  value={false} 
  type="boolean" 
  mode="editable" 
  onChange={(value) => console.log('Verified changed:', value)}
/>

// User Settings:
<DataField 
  label="Email Notifications" 
  value={emailNotifications} 
  type="boolean" 
  mode="editable"
  helpText="Receive email notifications"
  onChange={(value) => {
    setEmailNotifications(value);
    // Save setting immediately
    updateUserPreferences({ emailNotifications: value });
  }}
/>

// Feature Toggles:
<DataField 
  label="Beta Features" 
  value={betaEnabled} 
  type="boolean" 
  mode="editable"
  helpText="Enable experimental features"
  onChange={(value) => {
    setBetaEnabled(value);
    if (value) {
      // Warn user about beta features
      modal.confirm({
        title: 'Enable Beta Features',
        content: 'Beta features may be unstable. Continue?',
        onOk: () => enableBetaFeatures(),
        onCancel: () => setBetaEnabled(false)
      });
    }
  }}
/>

// Account Management:
const [updateAccountStatus] = useMutation(UPDATE_ACCOUNT_STATUS, {
  onCompleted: () => message.success('Account status updated'),
  onError: (error) => message.error('Failed to update status')
});

<DataField 
  label="Account Active" 
  value={data?.user?.isActive} 
  type="boolean" 
  mode="editable"
  loading={loading}
  helpText="Activate or deactivate user account"
  onChange={(value) => updateAccountStatus({ variables: { active: value } })}
/>`,

  choice: `// Choice Field Type - Configuration and Examples
import { DataField } from '../components/slingr';

// Configuration Properties:
// - label: string (required)
// - value: string | number | Array<string | number> | null
// - type: 'choice'
// - mode: 'readonly' | 'editable'
// - choices: Array<{ label: string; value: string | number }> (required)
// - multiple: boolean (for multi-select)
// - helpText: string
// - loading: boolean
// - error: string
// - onChange: (value) => void

// Choice Options Examples:
const departmentChoices = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Design', value: 'design' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Sales', value: 'sales' }
];

const skillChoices = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'React', value: 'react' },
  { label: 'Node.js', value: 'nodejs' }
];

// GraphQL Binding Examples:
const FETCH_USER = gql\`
  query GetUser($id: ID!) {
    user(id: $id) {
      department      # Single choice value
      skills          # Array of choice values
    }
  }
\`;

// Simple Examples:
<DataField 
  label="Department" 
  value="engineering" 
  type="choice" 
  mode="readonly"
  choices={departmentChoices}
/>

<DataField 
  label="Department" 
  value="engineering" 
  type="choice" 
  mode="editable"
  choices={departmentChoices}
  onChange={(value) => console.log('Department changed:', value)}
/>

// Multi-select Example:
<DataField 
  label="Skills" 
  value={['javascript', 'react']} 
  type="choice" 
  mode="editable"
  choices={skillChoices}
  multiple
  helpText="Select multiple skills"
  onChange={(value) => setSkills(value)}
/>

// Dynamic Choices with GraphQL:
const { data: departments } = useQuery(FETCH_DEPARTMENTS);
const departmentOptions = departments?.departments?.map(dept => ({
  label: dept.name,
  value: dept.id
})) || [];

<DataField 
  label="Department" 
  value={selectedDepartment} 
  type="choice" 
  mode="editable"
  choices={departmentOptions}
  loading={!departments}
  helpText="Select your department"
  onChange={(value) => {
    setSelectedDepartment(value);
    // Trigger department change effects
    onDepartmentChange(value);
  }}
/>

// Advanced Example with Dependent Choices:
<DataField 
  label="Role" 
  value={selectedRole} 
  type="choice" 
  mode="editable"
  choices={getRolesByDepartment(selectedDepartment)}
  helpText="Role options based on selected department"
  error={!selectedRole && selectedDepartment ? "Please select a role" : undefined}
  onChange={(value) => setSelectedRole(value)}
/>`,

  relationship: `// Relationship Field Type - Configuration and Examples
import { DataField } from '../components/slingr';

// Configuration Properties:
// - label: string (required)
// - value: string | number | Array<string | number> | null
// - type: 'relationship'
// - mode: 'readonly' | 'editable'
// - relationshipOptions: Array<{ label: string; value: string | number; id?: string | number }> (required)
// - multiple: boolean (for multi-select relationships)
// - helpText: string
// - loading: boolean
// - error: string
// - onChange: (value) => void

// Relationship Options Examples:
const managerOptions = [
  { id: 1, label: 'Jane Smith', value: 1 },
  { id: 2, label: 'Bob Johnson', value: 2 },
  { id: 3, label: 'Sarah Wilson', value: 3 }
];

const customerOptions = [
  { id: 1, label: 'Acme Corp', value: 1 },
  { id: 2, label: 'Tech Solutions Inc', value: 2 },
  { id: 3, label: 'Global Industries', value: 3 }
];

// GraphQL Binding Examples:
const FETCH_RELATIONSHIPS = gql\`
  query GetRelationships($id: ID!) {
    user(id: $id) {
      manager {
        id
        name
      }
      assignedCustomers {
        id
        name
      }
    }
  }
\`;

// Simple Examples:
<DataField 
  label="Manager" 
  value={1} 
  type="relationship" 
  mode="readonly"
  relationshipOptions={managerOptions}
/>

<DataField 
  label="Manager" 
  value={1} 
  type="relationship" 
  mode="editable"
  relationshipOptions={managerOptions}
  onChange={(value) => console.log('Manager changed:', value)}
/>

// Multi-select Relationships:
<DataField 
  label="Assigned Customers" 
  value={[1, 2]} 
  type="relationship" 
  mode="editable"
  relationshipOptions={customerOptions}
  multiple
  helpText="Select multiple customers"
  onChange={(value) => setAssignedCustomers(value)}
/>

// Dynamic Relationship Loading:
const { data: users, loading: usersLoading } = useQuery(FETCH_USERS);
const userOptions = users?.users?.map(user => ({
  id: user.id,
  label: \`\${user.firstName} \${user.lastName}\`,
  value: user.id
})) || [];

<DataField 
  label="Team Lead" 
  value={teamLead} 
  type="relationship" 
  mode="editable"
  relationshipOptions={userOptions}
  loading={usersLoading}
  helpText="Select team leader"
  onChange={(value) => {
    setTeamLead(value);
    // Update team assignments
    updateTeamAssignments(value);
  }}
/>

// Complex Relationship with Search:
const [searchUsers, { data: searchResults, loading: searching }] = useLazyQuery(SEARCH_USERS);

<DataField 
  label="Project Members" 
  value={projectMembers} 
  type="relationship" 
  mode="editable"
  relationshipOptions={searchResults?.searchUsers || []}
  multiple
  loading={searching}
  helpText="Search and select project members"
  onChange={(value) => {
    setProjectMembers(value);
    // Real-time member addition
    addProjectMembers(value);
  }}
/>

// Hierarchical Relationships:
<DataField 
  label="Reports To" 
  value={reportsTo} 
  type="relationship" 
  mode="editable"
  relationshipOptions={getHierarchyOptions(currentUser.level)}
  helpText="Select direct supervisor"
  error={reportsTo === currentUser.id ? "Cannot report to yourself" : undefined}
  onChange={(value) => setReportsTo(value)}
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

  // Helper function to get template based on field type
  const getCodeTemplate = (type: string, mode: string = 'readonly', multiple: boolean = false) => {
    const valueExample = (() => {
      switch (type) {
        case 'text': return multiple ? '["tag1", "tag2"]' : '"Sample text"';
        case 'uuid': return '"a1b2c3d4-e5f6-7890-abcd-ef1234567890"';
        case 'email': return multiple ? '["user@example.com", "admin@example.com"]' : '"user@example.com"';
        case 'html': return '"<p>Rich <strong>text</strong></p>"';
        case 'number': return multiple ? '[10, 20, 30]' : '42';
        case 'integer': return multiple ? '[1, 2, 3]' : '5';
        case 'decimal': return multiple ? '[4.5, 3.8, 4.9]' : '4.8';
        case 'money': return multiple ? '[1000, 2500, 750]' : '1250';
        case 'datetime': return multiple ? '["2023-01-15", "2023-12-25"]' : '"2023-01-15"';
        case 'boolean': return 'true';
        case 'choice': return multiple ? '["option1", "option2"]' : '"option1"';
        case 'relationship': return multiple ? '[1, 2]' : '1';
        default: return '"value"';
      }
    })();

    const additionalProps = (() => {
      switch (type) {
        case 'choice': return '\n  choices={choiceOptions}';
        case 'relationship': return '\n  relationshipOptions={relationshipOptions}';
        default: return '';
      }
    })();

    const multipleAttr = multiple && type !== 'boolean' ? '\n  multiple' : '';
    const modeAttr = mode === 'editable' ? '\n  mode="editable"\n  onChange={(value) => console.log(value)}' : '';

    return `<DataField
  label="Field Label"
  value=${valueExample}
  type="${type}"${modeAttr}${multipleAttr}${additionalProps}
/>`;
  };

  // Helper function to create section content for each data type
  const createTypeSection = (
    type: string,
    typeName: string,
    description: string,
    codeKey: keyof typeof codeExamples,
    examples: React.ReactNode
  ) => (
    <Card 
      title={`${typeName} Field Type`} 
      extra={<CodeButton codeKey={codeKey} title={`${typeName} Field Type`} />}
      style={{ marginBottom: 16 }}
    >
      <Paragraph>{description}</Paragraph>
      
      <Title level={5}>Code Template</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <AntText strong>Readonly</AntText>
          <SyntaxHighlighter 
            language="typescript" 
            style={tomorrow}
            customStyle={{ fontSize: '12px', margin: '8px 0', borderRadius: '4px' }}
          >
            {getCodeTemplate(type, 'readonly', false)}
          </SyntaxHighlighter>
        </Col>
        <Col xs={24} lg={8}>
          <AntText strong>Editable</AntText>
          <SyntaxHighlighter 
            language="typescript" 
            style={tomorrow}
            customStyle={{ fontSize: '12px', margin: '8px 0', borderRadius: '4px' }}
          >
            {getCodeTemplate(type, 'editable', false)}
          </SyntaxHighlighter>
        </Col>
        {type !== 'boolean' && (
          <Col xs={24} lg={8}>
            <AntText strong>Multi-valued</AntText>
            <SyntaxHighlighter 
              language="typescript" 
              style={tomorrow}
              customStyle={{ fontSize: '12px', margin: '8px 0', borderRadius: '4px' }}
            >
              {getCodeTemplate(type, 'readonly', true)}
            </SyntaxHighlighter>
          </Col>
        )}
      </Row>

      <Title level={5}>Configuration Properties</Title>
      <Paragraph>
        <ul>
          <li><strong>label</strong> (string, required): Field label to display</li>
          <li><strong>value</strong> ({type === 'boolean' ? 'boolean' : type === 'datetime' ? 'Date | string' : type}): Field value - can be bound to GraphQL data</li>
          <li><strong>type</strong> ('{type}'): Field type for proper formatting</li>
          <li><strong>mode</strong> ('readonly' | 'editable'): Display mode</li>
          {type !== 'boolean' && <li><strong>multiple</strong> (boolean): Whether field supports multiple values (array)</li>}
          <li><strong>helpText</strong> (string): Optional help text tooltip</li>
          <li><strong>loading</strong> (boolean): Loading state</li>
          <li><strong>error</strong> (string): Error state message</li>
          <li><strong>onChange</strong> (function): Callback when value changes in editable mode</li>
          {(type === 'text' || type === 'number' || type === 'integer' || type === 'decimal') && 
            <>
              <li><strong>prefix</strong> (string): Optional prefix for the value</li>
              <li><strong>suffix</strong> (string): Optional suffix for the value</li>
            </>
          }
          {type === 'choice' && <li><strong>choices</strong> (array): Choice options - {`Array<{ label: string; value: string | number }>`}</li>}
          {type === 'relationship' && <li><strong>relationshipOptions</strong> (array): Relationship options - {`Array<{ label: string; value: string | number; id?: string | number }>`}</li>}
        </ul>
      </Paragraph>

      <Title level={5}>GraphQL Binding</Title>
      <Paragraph>
        The {typeName} field can be bound to GraphQL queries and mutations for seamless backend integration:
        <ul>
          <li>Bind the <code>value</code> prop to query result data</li>
          <li>Use <code>loading</code> prop with query loading state</li>
          <li>Handle <code>error</code> prop with query/mutation errors</li>
          <li>Implement <code>onChange</code> to trigger mutations</li>
          <li>Support for real-time updates via subscriptions</li>
        </ul>
      </Paragraph>

      <Title level={5}>Available Events & Hooks</Title>
      <Paragraph>
        <ul>
          <li><strong>onChange</strong>: Triggered when field value changes in editable mode</li>
          <li><strong>onFocus/onBlur</strong>: Focus events (inherited from underlying input components)</li>
          <li><strong>Validation hooks</strong>: Can be integrated with form validation libraries</li>
          <li><strong>GraphQL hooks</strong>: useQuery, useMutation, useSubscription for data binding</li>
          <li><strong>State management</strong>: Compatible with useState, useReducer, Redux, Zustand</li>
        </ul>
      </Paragraph>

      <Title level={5}>Examples</Title>
      {examples}
    </Card>
  );

  const tabItems: TabsProps['items'] = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <div>
          <Card title="Data Field Component Overview" style={{ marginBottom: 16 }}>
            <Paragraph>
              The Data Field component is a versatile UI component that displays labels and values with automatic formatting 
              based on data type. It supports GraphQL data binding with loading and error states, and can operate in both 
              readonly and editable modes with proper input controls for each data type.
            </Paragraph>
            <Title level={5}>Supported Data Types</Title>
            <Row gutter={[16, 8]}>
              <Col span={6}><AntText strong>Text</AntText> - General text input</Col>
              <Col span={6}><AntText strong>UUID</AntText> - Unique identifier</Col>
              <Col span={6}><AntText strong>Email</AntText> - Email addresses</Col>
              <Col span={6}><AntText strong>HTML</AntText> - Rich text content</Col>
              <Col span={6}><AntText strong>Number</AntText> - General numbers</Col>
              <Col span={6}><AntText strong>Integer</AntText> - Whole numbers</Col>
              <Col span={6}><AntText strong>Decimal</AntText> - Decimal numbers</Col>
              <Col span={6}><AntText strong>Money</AntText> - Currency values</Col>
              <Col span={6}><AntText strong>DateTime</AntText> - Date and time</Col>
              <Col span={6}><AntText strong>Boolean</AntText> - True/false values</Col>
              <Col span={6}><AntText strong>Choice</AntText> - Select from options</Col>
              <Col span={6}><AntText strong>Relationship</AntText> - Entity relationships</Col>
            </Row>
          </Card>
        </div>
      )
    },
    {
      key: 'text',
      label: 'Text',
      children: createTypeSection(
        'text',
        'Text',
        'Text fields handle general text input and display. They support single and multi-valued text content with customizable formatting.',
        'text',
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <AntText strong>Simple Text</AntText>
            <DataField label="Name" value="John Doe" type="text" mode="readonly" />
            <DataField label="Name" value="John Doe" type="text" mode="editable" onChange={(value) => console.log('Name:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>With Prefix/Suffix</AntText>
            <DataField label="Username" value="johndoe" type="text" mode="readonly" prefix="@" />
            <DataField label="File" value="document" type="text" mode="editable" suffix=".pdf" onChange={(value) => console.log('File:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>Multi-valued</AntText>
            <DataField label="Tags" value={["frontend", "backend", "full-stack"]} type="text" mode="readonly" multiple />
            <DataField label="Keywords" value={["react", "typescript"]} type="text" mode="editable" multiple onChange={(value) => console.log('Keywords:', value)} />
          </Col>
        </Row>
      )
    },
    {
      key: 'uuid',
      label: 'UUID',
      children: createTypeSection(
        'uuid',
        'UUID',
        'UUID fields display and edit universally unique identifiers. Commonly used for record IDs and external references.',
        'uuid',
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <AntText strong>Readonly UUID</AntText>
            <DataField label="Record ID" value={mockUserData.id} type="uuid" mode="readonly" />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>Editable UUID</AntText>
            <DataField label="External ID" value={mockUserData.id} type="uuid" mode="editable" onChange={(value) => console.log('UUID:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>With Help Text</AntText>
            <DataField label="API Key" value={mockUserData.id} type="uuid" mode="editable" helpText="Enter a valid UUID format" onChange={(value) => console.log('API Key:', value)} />
          </Col>
        </Row>
      )
    },
    {
      key: 'email',
      label: 'Email',
      children: createTypeSection(
        'email',
        'Email',
        'Email fields handle email addresses with built-in validation and mailto links. Support single and multiple email addresses.',
        'email',
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <AntText strong>Single Email</AntText>
            <DataField label="Email" value={mockUserData.email} type="email" mode="readonly" />
            <DataField label="Email" value={mockUserData.email} type="email" mode="editable" onChange={(value) => console.log('Email:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>Multi-valued</AntText>
            <DataField label="Contact Emails" value={[mockUserData.email, 'jane@example.com']} type="email" mode="readonly" multiple />
            <DataField label="Notification Emails" value={['admin@example.com']} type="email" mode="editable" multiple onChange={(value) => console.log('Emails:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>With Validation</AntText>
            <DataField label="Work Email" value={mockUserData.email} type="email" mode="editable" helpText="Enter a valid email address" onChange={(value) => console.log('Work Email:', value)} />
          </Col>
        </Row>
      )
    },
    {
      key: 'html',
      label: 'HTML',
      children: createTypeSection(
        'html',
        'HTML',
        'HTML fields handle rich text content with HTML markup. Best used with vertical layout for better text area display.',
        'html',
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <AntText strong>Readonly HTML</AntText>
            <DataField label="Bio" value={mockUserData.bio} type="html" mode="readonly" layout="vertical" />
          </Col>
          <Col xs={24} lg={12}>
            <AntText strong>Editable HTML</AntText>
            <DataField label="Description" value="<p>Enter your <strong>description</strong> here</p>" type="html" mode="editable" layout="vertical" onChange={(value) => console.log('HTML:', value)} />
          </Col>
        </Row>
      )
    },
    {
      key: 'number',
      label: 'Number',
      children: createTypeSection(
        'number',
        'Number',
        'Number fields handle general numeric values with formatting and validation. Support decimal places and custom suffixes.',
        'number',
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <AntText strong>Simple Number</AntText>
            <DataField label="Score" value={87.5} type="number" mode="readonly" />
            <DataField label="Score" value={87.5} type="number" mode="editable" onChange={(value) => console.log('Score:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>With Suffix</AntText>
            <DataField label="Temperature" value={23.5} type="number" mode="readonly" suffix="°C" />
            <DataField label="Progress" value={75} type="number" mode="editable" suffix="%" onChange={(value) => console.log('Progress:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>Multi-valued</AntText>
            <DataField label="Measurements" value={[87.5, 92.1, 78.9]} type="number" mode="readonly" multiple suffix=" cm" />
            <DataField label="Test Scores" value={[85, 92]} type="number" mode="editable" multiple onChange={(value) => console.log('Scores:', value)} />
          </Col>
        </Row>
      )
    },
    {
      key: 'integer',
      label: 'Integer',
      children: createTypeSection(
        'integer',
        'Integer',
        'Integer fields handle whole numbers without decimal places. Commonly used for counts, quantities, and IDs.',
        'integer',
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <AntText strong>Simple Integer</AntText>
            <DataField label="Age" value={28} type="integer" mode="readonly" />
            <DataField label="Quantity" value={15} type="integer" mode="editable" onChange={(value) => console.log('Quantity:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>With Suffix</AntText>
            <DataField label="Work Days" value={mockUserData.workDays} type="integer" mode="readonly" suffix=" days" />
            <DataField label="Team Size" value={5} type="integer" mode="editable" suffix=" members" onChange={(value) => console.log('Team Size:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>Multi-valued</AntText>
            <DataField label="Monthly Days" value={[22, 20, 23, 21]} type="integer" mode="readonly" multiple suffix=" days" />
            <DataField label="Project Hours" value={[40, 35]} type="integer" mode="editable" multiple suffix=" hrs" onChange={(value) => console.log('Hours:', value)} />
          </Col>
        </Row>
      )
    },
    {
      key: 'decimal',
      label: 'Decimal',
      children: createTypeSection(
        'decimal',
        'Decimal',
        'Decimal fields handle precise decimal numbers. Ideal for ratings, percentages, and measurements requiring decimal precision.',
        'decimal',
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <AntText strong>Simple Decimal</AntText>
            <DataField label="Rating" value={mockUserData.rating} type="decimal" mode="readonly" suffix="/5" />
            <DataField label="Rating" value={mockUserData.rating} type="decimal" mode="editable" onChange={(value) => console.log('Rating:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>Percentages</AntText>
            <DataField label="Completion" value={87.5} type="decimal" mode="readonly" suffix="%" />
            <DataField label="Accuracy" value={95.2} type="decimal" mode="editable" suffix="%" onChange={(value) => console.log('Accuracy:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>Multi-valued</AntText>
            <DataField label="Performance Scores" value={[4.8, 4.2, 4.9, 4.6]} type="decimal" mode="readonly" multiple suffix="/5" />
            <DataField label="Monthly Ratings" value={[4.5, 4.8]} type="decimal" mode="editable" multiple suffix="/5" onChange={(value) => console.log('Ratings:', value)} />
          </Col>
        </Row>
      )
    },
    {
      key: 'money',
      label: 'Money',
      children: createTypeSection(
        'money',
        'Money',
        'Money fields handle currency values with automatic dollar formatting and comma separators. Perfect for salaries, prices, and financial data.',
        'money',
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <AntText strong>Simple Money</AntText>
            <DataField label="Salary" value={mockUserData.salary} type="money" mode="readonly" />
            <DataField label="Budget" value={50000} type="money" mode="editable" onChange={(value) => console.log('Budget:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>Large Amounts</AntText>
            <DataField label="Revenue" value={1250000} type="money" mode="readonly" />
            <DataField label="Investment" value={750000} type="money" mode="editable" onChange={(value) => console.log('Investment:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>Multi-valued</AntText>
            <DataField label="Quarterly Bonuses" value={[5000, 3000, 4000, 6000]} type="money" mode="readonly" multiple />
            <DataField label="Expenses" value={[1200, 800]} type="money" mode="editable" multiple onChange={(value) => console.log('Expenses:', value)} />
          </Col>
        </Row>
      )
    },
    {
      key: 'datetime',
      label: 'DateTime',
      children: createTypeSection(
        'datetime',
        'DateTime',
        'DateTime fields handle date and time values with proper formatting and date picker controls. Support various date formats and multi-valued dates.',
        'datetime',
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <AntText strong>Simple DateTime</AntText>
            <DataField label="Join Date" value="2023-01-15" type="datetime" mode="readonly" />
            <DataField label="Event Date" value="2023-01-15" type="datetime" mode="editable" onChange={(value) => console.log('Event Date:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>Current Date</AntText>
            <DataField label="Last Login" value={new Date()} type="datetime" mode="readonly" />
            <DataField label="Schedule" value={new Date()} type="datetime" mode="editable" onChange={(value) => console.log('Schedule:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>Multi-valued</AntText>
            <DataField label="Milestones" value={["2023-01-15", "2023-06-15", "2023-12-15"]} type="datetime" mode="readonly" multiple />
            <DataField label="Deadlines" value={["2023-03-01", "2023-06-01"]} type="datetime" mode="editable" multiple onChange={(value) => console.log('Deadlines:', value)} />
          </Col>
        </Row>
      )
    },
    {
      key: 'boolean',
      label: 'Boolean',
      children: createTypeSection(
        'boolean',
        'Boolean',
        'Boolean fields handle true/false values with switch controls. Used for flags, status indicators, and yes/no questions. Does not support multi-valued mode.',
        'boolean',
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <AntText strong>Simple Boolean</AntText>
            <DataField label="Active Status" value={mockUserData.isActive} type="boolean" mode="readonly" />
            <DataField label="Email Verified" value={false} type="boolean" mode="editable" onChange={(value) => console.log('Verified:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>Feature Toggles</AntText>
            <DataField label="Beta Features" value={true} type="boolean" mode="readonly" />
            <DataField label="Notifications" value={true} type="boolean" mode="editable" onChange={(value) => console.log('Notifications:', value)} />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>Status Flags</AntText>
            <DataField label="Published" value={false} type="boolean" mode="readonly" />
            <DataField label="Premium User" value={false} type="boolean" mode="editable" onChange={(value) => console.log('Premium:', value)} />
          </Col>
        </Row>
      )
    },
    {
      key: 'choice',
      label: 'Choice',
      children: createTypeSection(
        'choice',
        'Choice',
        'Choice fields allow selection from predefined options. Support single and multi-select modes with custom choice lists.',
        'choice',
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <AntText strong>Single Choice</AntText>
            <DataField 
              label="Department" 
              value="engineering" 
              type="choice" 
              mode="readonly"
              choices={mockDepartments}
            />
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
            <AntText strong>Multi-select</AntText>
            <DataField 
              label="Skills" 
              value={['javascript', 'react']} 
              type="choice" 
              mode="readonly"
              multiple
              choices={mockSkills}
            />
            <DataField 
              label="Skills" 
              value={['javascript']} 
              type="choice" 
              mode="editable"
              multiple
              choices={mockSkills}
              onChange={(value) => console.log('Skills:', value)}
            />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>Status Choices</AntText>
            <DataField 
              label="Priority" 
              value="high" 
              type="choice" 
              mode="readonly"
              choices={[
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' }
              ]}
            />
          </Col>
        </Row>
      )
    },
    {
      key: 'relationship',
      label: 'Relationship',
      children: createTypeSection(
        'relationship',
        'Relationship',
        'Relationship fields handle connections to other entities. Feature search functionality and support both single and multi-select relationships.',
        'relationship',
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <AntText strong>Single Relationship</AntText>
            <DataField 
              label="Manager" 
              value={1} 
              type="relationship" 
              mode="readonly"
              relationshipOptions={mockManagers}
            />
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
            <AntText strong>Multi-relationship</AntText>
            <DataField 
              label="Customers" 
              value={[1, 2]} 
              type="relationship" 
              mode="readonly"
              multiple
              relationshipOptions={mockCustomers}
            />
            <DataField 
              label="Team Members" 
              value={[1]} 
              type="relationship" 
              mode="editable"
              multiple
              relationshipOptions={mockManagers}
              onChange={(value) => console.log('Team:', value)}
            />
          </Col>
          <Col xs={24} lg={8}>
            <AntText strong>With Search</AntText>
            <DataField 
              label="Assigned To" 
              value={2} 
              type="relationship" 
              mode="editable"
              relationshipOptions={mockManagers}
              helpText="Search and select user"
              onChange={(value) => console.log('Assigned:', value)}
            />
          </Col>
        </Row>
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