import { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Switch,
  InputNumber,
  Upload,
  Button,
  Typography,
  Space,
  message,
  Divider
} from 'antd';
import { 
  SaveOutlined, 
  ClearOutlined,
  MailOutlined,
  UploadOutlined,
  DollarOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { ViewContainer } from '../components/ViewContainer';
import type { ViewComponent } from '../types/view';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text, Title } = Typography;
const { Option } = Select;

// Field types supported by the dynamic form
type FieldType = 
  | 'text' 
  | 'email' 
  | 'boolean' 
  | 'relationship-reference' 
  | 'relationship-composition' 
  | 'choice' 
  | 'integer' 
  | 'decimal' 
  | 'money' 
  | 'date' 
  | 'datetime' 
  | 'file';

// Dynamic field configuration with backend rules
interface FieldConfig {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  visible?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  relationshipEntity?: string;
  currency?: string;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
  helpText?: string;
  defaultValue?: string | number | boolean | Date;
  rules?: Array<{
    type: 'visibility' | 'readOnly' | 'required';
    condition: string;
    value: boolean;
  }>;
}

// Form schema for different entity types
interface FormSchema {
  id: string;
  title: string;
  description?: string;
  entity: string;
  mode: 'create' | 'edit';
  fields: FieldConfig[];
}

// Mock data for relationships
const mockCustomers = [
  { id: 1, name: 'Acme Corporation', email: 'contact@acme.com' },
  { id: 2, name: 'Global Tech Solutions', email: 'info@globaltech.com' },
  { id: 3, name: 'Innovation Labs', email: 'hello@innovation-labs.com' },
];

const mockUsers = [
  { id: 1, name: 'John Doe', department: 'Engineering' },
  { id: 2, name: 'Jane Smith', department: 'Design' },
  { id: 3, name: 'Mike Johnson', department: 'Marketing' },
];

// Sample form schemas
const getFormSchemas = (): { [key: string]: FormSchema } => ({
  'employee-create': {
    id: 'employee-create',
    title: 'Create Employee',
    description: 'Add a new employee to the system',
    entity: 'employee',
    mode: 'create',
    fields: [
      {
        id: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        visible: true,
        readOnly: false,
        placeholder: 'Enter first name'
      },
      {
        id: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        visible: true,
        readOnly: false,
        placeholder: 'Enter last name'
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        visible: true,
        readOnly: false,
        placeholder: 'john.doe@company.com',
        pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
      },
      {
        id: 'isActive',
        label: 'Active Employee',
        type: 'boolean',
        required: false,
        visible: true,
        readOnly: false,
        defaultValue: true
      },
      {
        id: 'manager',
        label: 'Direct Manager',
        type: 'relationship-reference',
        required: false,
        visible: true,
        readOnly: false,
        relationshipEntity: 'user',
        helpText: 'Select the direct manager for this employee'
      },
      {
        id: 'department',
        label: 'Department',
        type: 'choice',
        required: true,
        visible: true,
        readOnly: false,
        options: [
          { value: 'engineering', label: 'Engineering' },
          { value: 'design', label: 'Design' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'sales', label: 'Sales' },
          { value: 'hr', label: 'Human Resources' }
        ]
      },
      {
        id: 'employeeId',
        label: 'Employee ID',
        type: 'integer',
        required: true,
        visible: true,
        readOnly: false,
        minValue: 1000,
        maxValue: 9999,
        placeholder: 'e.g., 1234'
      },
      {
        id: 'salary',
        label: 'Annual Salary',
        type: 'money',
        required: true,
        visible: true,
        readOnly: false,
        currency: 'USD',
        minValue: 30000,
        maxValue: 500000,
        rules: [
          {
            type: 'visibility',
            condition: 'department === "hr" || department === "management"',
            value: true
          }
        ]
      },
      {
        id: 'startDate',
        label: 'Start Date',
        type: 'date',
        required: true,
        visible: true,
        readOnly: false,
        defaultValue: new Date().toISOString().split('T')[0]
      },
      {
        id: 'profilePhoto',
        label: 'Profile Photo',
        type: 'file',
        required: false,
        visible: true,
        readOnly: false,
        helpText: 'Upload a profile photo (JPG, PNG, max 2MB)'
      }
    ]
  },
  'project-edit': {
    id: 'project-edit',
    title: 'Edit Project',
    description: 'Modify existing project details',
    entity: 'project',
    mode: 'edit',
    fields: [
      {
        id: 'name',
        label: 'Project Name',
        type: 'text',
        required: true,
        visible: true,
        readOnly: false,
        placeholder: 'Enter project name',
        defaultValue: 'Sample Project Alpha'
      },
      {
        id: 'description',
        label: 'Description',
        type: 'text',
        required: false,
        visible: true,
        readOnly: false,
        placeholder: 'Describe the project objectives and scope...',
        defaultValue: 'This is a sample project for demonstrating the dynamic form system.'
      },
      {
        id: 'customer',
        label: 'Customer',
        type: 'relationship-reference',
        required: true,
        visible: true,
        readOnly: false,
        relationshipEntity: 'customer',
        defaultValue: 1,
        helpText: 'Select the customer for this project'
      },
      {
        id: 'isActive',
        label: 'Active Project',
        type: 'boolean',
        required: false,
        visible: true,
        readOnly: false,
        defaultValue: true
      },
      {
        id: 'priority',
        label: 'Priority Level',
        type: 'choice',
        required: true,
        visible: true,
        readOnly: false,
        defaultValue: 'medium',
        options: [
          { value: 'low', label: 'Low Priority' },
          { value: 'medium', label: 'Medium Priority' },
          { value: 'high', label: 'High Priority' },
          { value: 'urgent', label: 'Urgent' }
        ]
      },
      {
        id: 'budget',
        label: 'Project Budget',
        type: 'money',
        required: true,
        visible: true,
        readOnly: false,
        currency: 'USD',
        defaultValue: 50000,
        minValue: 1000,
        maxValue: 1000000
      },
      {
        id: 'estimatedHours',
        label: 'Estimated Hours',
        type: 'decimal',
        required: false,
        visible: true,
        readOnly: false,
        defaultValue: 160.5,
        minValue: 0,
        maxValue: 10000,
        helpText: 'Total estimated hours for project completion'
      },
      {
        id: 'startDate',
        label: 'Start Date',
        type: 'date',
        required: true,
        visible: true,
        readOnly: false,
        defaultValue: '2024-01-15'
      },
      {
        id: 'deadline',
        label: 'Project Deadline',
        type: 'datetime',
        required: true,
        visible: true,
        readOnly: false,
        defaultValue: '2024-06-30T17:00:00',
        helpText: 'Final deadline for project delivery'
      },
      {
        id: 'teamMembers',
        label: 'Team Members',
        type: 'relationship-composition',
        required: false,
        visible: true,
        readOnly: false,
        relationshipEntity: 'user',
        helpText: 'Select team members assigned to this project'
      },
      {
        id: 'documents',
        label: 'Project Documents',
        type: 'file',
        required: false,
        visible: true,
        readOnly: false,
        helpText: 'Upload project-related documents'
      }
    ]
  }
});

export const DynamicFormView: ViewComponent = ({ config }) => {
  const [activeSchema, setActiveSchema] = useState<string>('employee-create');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  
  const schemas = getFormSchemas();
  const currentSchema = schemas[activeSchema];

  // Simulate backend field rule evaluation
  const evaluateFieldRules = (field: FieldConfig, formValues: Record<string, unknown>): FieldConfig => {
    if (!field.rules) return field;

    const evaluatedField = { ...field };
    
    field.rules.forEach(rule => {
      // Simulate simple condition evaluation
      // In real implementation, this would be more sophisticated
      if (rule.condition.includes('department === "hr"')) {
        if (formValues.department === 'hr') {
          if (rule.type === 'visibility') evaluatedField.visible = rule.value;
          if (rule.type === 'readOnly') evaluatedField.readOnly = rule.value;
          if (rule.type === 'required') evaluatedField.required = rule.value;
        }
      }
    });

    return evaluatedField;
  };

  // Handle form value changes and re-evaluate rules
  const handleFormChange = (changedValues: Record<string, unknown>, allValues: Record<string, unknown>) => {
    setFormData(allValues);
    // In real implementation, this would trigger backend rule evaluation
    console.log('Form changed:', changedValues, 'All values:', allValues);
  };

  // Render field based on type
  const renderField = (evaluatedField: FieldConfig) => {
    const commonProps = {
      disabled: evaluatedField.readOnly,
      placeholder: evaluatedField.placeholder
    };

    switch (evaluatedField.type) {
      case 'text':
        return evaluatedField.id === 'description' ? (
          <TextArea {...commonProps} rows={3} maxLength={500} showCount />
        ) : (
          <Input {...commonProps} />
        );

      case 'email':
        return (
          <Input 
            {...commonProps} 
            type="email" 
            prefix={<MailOutlined />}
          />
        );

      case 'boolean':
        return (
          <Switch 
            disabled={evaluatedField.readOnly}
            checkedChildren="Yes" 
            unCheckedChildren="No" 
          />
        );

      case 'relationship-reference': {
        const getOptions = () => {
          switch (evaluatedField.relationshipEntity) {
            case 'customer':
              return mockCustomers.map(c => ({ value: c.id, label: c.name }));
            case 'user':
              return mockUsers.map(u => ({ value: u.id, label: u.name }));
            default:
              return [];
          }
        };

        return (
          <Select
            {...commonProps}
            showSearch
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase()) ?? false
            }
            options={getOptions()}
          />
        );
      }

      case 'relationship-composition':
        return (
          <Select
            {...commonProps}
            mode="multiple"
            showSearch
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase()) ?? false
            }
            options={mockUsers.map(u => ({ value: u.id, label: u.name }))}
          />
        );

      case 'choice':
        return (
          <Select {...commonProps} options={evaluatedField.options} />
        );

      case 'integer':
        return (
          <InputNumber
            {...commonProps}
            style={{ width: '100%' }}
            min={evaluatedField.minValue}
            max={evaluatedField.maxValue}
            precision={0}
          />
        );

      case 'decimal':
        return (
          <InputNumber
            {...commonProps}
            style={{ width: '100%' }}
            min={evaluatedField.minValue}
            max={evaluatedField.maxValue}
            precision={2}
            step={0.1}
          />
        );

      case 'money':
        return (
          <InputNumber
            {...commonProps}
            style={{ width: '100%' }}
            min={evaluatedField.minValue}
            max={evaluatedField.maxValue}
            precision={2}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0}
            prefix={<DollarOutlined />}
          />
        );

      case 'date':
        return (
          <DatePicker
            {...commonProps}
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
          />
        );

      case 'datetime':
        return (
          <DatePicker
            {...commonProps}
            showTime
            style={{ width: '100%' }}
            format="YYYY-MM-DD HH:mm"
          />
        );

      case 'file':
        return (
          <Upload
            {...commonProps}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="text"
            multiple
            disabled={evaluatedField.readOnly}
          >
            <Button icon={<UploadOutlined />} disabled={evaluatedField.readOnly}>
              Upload File
            </Button>
          </Upload>
        );

      default:
        return <Input {...commonProps} />;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', values);
      message.success(`${currentSchema.mode === 'create' ? 'Created' : 'Updated'} ${currentSchema.entity} successfully!`);
      
      if (currentSchema.mode === 'create') {
        form.resetFields();
      }
    } catch {
      message.error('Please fix validation errors before submitting');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    form.resetFields();
    setFormData({});
    message.info('Form reset');
  };

  // Memoize the evaluated fields to prevent infinite re-renders
  const evaluatedFields = useMemo(() => {
    return currentSchema.fields.map(field => evaluateFieldRules(field, formData));
  }, [currentSchema.fields, formData]);

  // Set initial values when schema changes
  useEffect(() => {
    const initialValues: Record<string, unknown> = {};
    currentSchema.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        if (field.type === 'date' && typeof field.defaultValue === 'string') {
          initialValues[field.id] = dayjs(field.defaultValue);
        } else if (field.type === 'datetime' && typeof field.defaultValue === 'string') {
          initialValues[field.id] = dayjs(field.defaultValue);
        } else {
          initialValues[field.id] = field.defaultValue;
        }
      }
    });
    
    form.setFieldsValue(initialValues);
    setFormData(initialValues);
  }, [activeSchema, form]);

  return (
    <ViewContainer config={config}>
      <div style={{ padding: 16 }}>
        {/* Schema Selector */}
        <Card style={{ marginBottom: 16 }}>
          <Space>
            <Text strong>Select Form Type:</Text>
            <Select
              value={activeSchema}
              onChange={setActiveSchema}
              style={{ width: 300 }}
            >
              <Option value="employee-create">Create Employee Form</Option>
              <Option value="project-edit">Edit Project Form</Option>
            </Select>
          </Space>
        </Card>

        {/* Dynamic Form */}
        <Card>
          <div style={{ marginBottom: 24 }}>
            <Title level={3} style={{ marginBottom: 8 }}>
              {currentSchema.mode === 'create' ? <PlusOutlined /> : <EditOutlined />}
              {' '}
              {currentSchema.title}
            </Title>
            {currentSchema.description && (
              <Text type="secondary">{currentSchema.description}</Text>
            )}
          </div>

          <Form
            form={form}
            layout="vertical"
            onValuesChange={handleFormChange}
            onFinish={handleSubmit}
          >
            <Row gutter={[16, 16]}>
              {evaluatedFields.map(evaluatedField => {
                if (!evaluatedField.visible) return null;

                return (
                  <Col key={evaluatedField.id} xs={24} md={12} lg={8}>
                    <Form.Item
                      name={evaluatedField.id}
                      label={evaluatedField.label}
                      help={evaluatedField.helpText}
                      rules={[
                        ...(evaluatedField.required ? [{ required: true, message: `${evaluatedField.label} is required` }] : []),
                        ...(evaluatedField.pattern ? [{ pattern: new RegExp(evaluatedField.pattern), message: 'Invalid format' }] : [])
                      ]}
                    >
                      {renderField(evaluatedField)}
                    </Form.Item>
                  </Col>
                );
              })}
            </Row>

            <Divider />

            <Row justify="end">
              <Space>
                <Button icon={<ClearOutlined />} onClick={handleReset}>
                  Reset
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  {currentSchema.mode === 'create' ? 'Create' : 'Update'} {currentSchema.entity}
                </Button>
              </Space>
            </Row>
          </Form>
        </Card>

        {/* Developer Info */}
        <Card style={{ marginTop: 16 }} title="Dynamic Form Features">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Title level={5}>Supported Field Types:</Title>
              <ul style={{ paddingLeft: 20 }}>
                <li><Text code>text</Text> - Single line text input</li>
                <li><Text code>email</Text> - Email input with validation</li>
                <li><Text code>boolean</Text> - Switch/toggle control</li>
                <li><Text code>relationship-reference</Text> - Single select from related entity</li>
                <li><Text code>relationship-composition</Text> - Multi-select from related entity</li>
                <li><Text code>choice</Text> - Dropdown with predefined options</li>
                <li><Text code>integer</Text> - Whole number input</li>
                <li><Text code>decimal</Text> - Decimal number input</li>
                <li><Text code>money</Text> - Currency input with formatting</li>
                <li><Text code>date</Text> - Date picker</li>
                <li><Text code>datetime</Text> - Date and time picker</li>
                <li><Text code>file</Text> - File upload control</li>
              </ul>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>Dynamic Rules:</Title>
              <ul style={{ paddingLeft: 20 }}>
                <li><Text strong>Visibility Rules:</Text> Show/hide fields based on other field values</li>
                <li><Text strong>Read-only Rules:</Text> Make fields editable/non-editable conditionally</li>
                <li><Text strong>Required Rules:</Text> Make fields required based on conditions</li>
                <li><Text strong>Validation Rules:</Text> Custom validation patterns and ranges</li>
              </ul>
              <Text type="secondary">
                Rules are evaluated in real-time as the user interacts with the form, 
                simulating backend-driven form behavior.
              </Text>
            </Col>
          </Row>
        </Card>
      </div>
    </ViewContainer>
  );
};