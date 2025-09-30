import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Switch, 
  InputNumber, 
  Button, 
  Card, 
  Space, 
  message,
  Divider,
  Typography,
  Upload
} from 'antd';
import type { Rule } from 'antd/es/form';
import { SaveOutlined, ClearOutlined, UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

export interface ModelFieldConfig {
  /** Field identifier */
  id: string;
  /** Field label */
  label: string;
  /** Field type */
  type: 'text' | 'email' | 'number' | 'boolean' | 'date' | 'datetime' | 'select' | 'textarea' | 'file';
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is read-only */
  readOnly?: boolean;
  /** Whether the field is visible */
  visible?: boolean;
  /** Default value */
  defaultValue?: unknown;
  /** Help text */
  helpText?: string;
  /** Options for select fields */
  options?: Array<{ label: string; value: string | number }>;
  /** Validation rules */
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  /** Field dependencies (conditional visibility/requirements) */
  dependencies?: {
    field: string;
    value: unknown;
    action: 'show' | 'hide' | 'require' | 'optional';
  }[];
}

export interface ModelFormConfig {
  /** Model identifier */
  modelId: string;
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
  /** Form mode */
  mode: 'create' | 'edit' | 'view';
  /** Field configurations */
  fields: ModelFieldConfig[];
  /** Layout configuration */
  layout?: {
    columns?: 1 | 2 | 3;
    labelCol?: { span: number };
    wrapperCol?: { span: number };
  };
}

export interface ModelFormProps {
  /** Form configuration from backend model definition */
  config: ModelFormConfig;
  /** Initial form values (for edit mode) */
  initialValues?: Record<string, unknown>;
  /** Loading state */
  loading?: boolean;
  /** Whether to show form actions */
  showActions?: boolean;
  /** Custom form actions */
  actions?: React.ReactNode;
  /** Callback when form is submitted */
  onSubmit?: (values: Record<string, unknown>) => Promise<void> | void;
  /** Callback when form is reset */
  onReset?: () => void;
  /** Callback when field values change */
  onChange?: (values: Record<string, unknown>) => void;
  /** Custom styling */
  style?: React.CSSProperties;
}

/**
 * Model Form Component
 * 
 * Dynamically generated form bound to a backend model. 
 * Fields are automatically configured based on the model definition from GraphQL schema.
 */
export const ModelForm: React.FC<ModelFormProps> = ({
  config,
  initialValues,
  loading = false,
  showActions = true,
  actions,
  onSubmit,
  onReset,
  onChange,
  style
}) => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Evaluate field rules based on current form values
  const evaluateFieldRules = (field: ModelFieldConfig): ModelFieldConfig => {
    if (!field.dependencies || field.dependencies.length === 0) {
      return field;
    }

    let processedField = { ...field };

    field.dependencies.forEach(dep => {
      const depValue = formValues[dep.field];
      const matches = depValue === dep.value;

      switch (dep.action) {
        case 'show':
          processedField.visible = matches;
          break;
        case 'hide':
          processedField.visible = !matches;
          break;
        case 'require':
          processedField.required = matches;
          break;
        case 'optional':
          processedField.required = !matches;
          break;
      }
    });

    return processedField;
  };

  // Process fields with current form state
  const processedFields = config.fields.map(evaluateFieldRules);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setFormValues(initialValues);
    }
  }, [initialValues, form]);

  const handleValuesChange = (_: Record<string, unknown>, allValues: Record<string, unknown>) => {
    setFormValues(allValues);
    if (onChange) {
      onChange(allValues);
    }
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!onSubmit) return;

    try {
      setIsSubmitting(true);
      await onSubmit(values);
      message.success('Form submitted successfully');
    } catch (error) {
      message.error('Failed to submit form');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setFormValues({});
    if (onReset) {
      onReset();
    }
    message.info('Form reset');
  };

  const renderField = (field: ModelFieldConfig) => {
    const fieldProps = {
      disabled: field.readOnly || config.mode === 'view',
      placeholder: field.helpText
    };

    switch (field.type) {
      case 'text':
      case 'email':
        return <Input {...fieldProps} type={field.type} />;
      
      case 'textarea':
        return <TextArea {...fieldProps} rows={4} />;
      
      case 'number':
        return <InputNumber {...fieldProps} style={{ width: '100%' }} />;
      
      case 'boolean':
        return <Switch {...fieldProps} />;
      
      case 'date':
        return (
          <DatePicker 
            {...fieldProps} 
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
          />
        );
      
      case 'datetime':
        return (
          <DatePicker 
            {...fieldProps} 
            showTime 
            style={{ width: '100%' }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        );
      
      case 'select':
        return (
          <Select {...fieldProps}>
            {field.options?.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      
      case 'file':
        return (
          <Upload {...fieldProps}>
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
        );
      
      default:
        return <Input {...fieldProps} />;
    }
  };

  const getValidationRules = (field: ModelFieldConfig): Rule[] => {
    const rules: Rule[] = [];

    if (field.required) {
      rules.push({
        required: true,
        message: `${field.label} is required`
      });
    }

    if (field.validation) {
      const { min, max, pattern, message: validationMessage } = field.validation;
      
      if (min !== undefined) {
        rules.push({ min, message: validationMessage || `Minimum value is ${min}` });
      }
      
      if (max !== undefined) {
        rules.push({ max, message: validationMessage || `Maximum value is ${max}` });
      }
      
      if (pattern) {
        rules.push({ 
          pattern: new RegExp(pattern), 
          message: validationMessage || 'Invalid format' 
        });
      }
    }

    if (field.type === 'email') {
      rules.push({
        type: 'email',
        message: 'Please enter a valid email address'
      });
    }

    return rules;
  };

  const { layout = { columns: 1 } } = config;

  return (
    <Card 
      title={config.title}
      style={style}
      loading={loading}
    >
      {config.description && (
        <>
          <Text type="secondary">{config.description}</Text>
          <Divider />
        </>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        labelCol={layout.labelCol}
        wrapperCol={layout.wrapperCol}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {processedFields.map(field => {
            if (!field.visible) return null;

            return (
              <div 
                key={field.id} 
                style={{ 
                  flex: layout.columns === 1 ? '1 1 100%' : `1 1 calc(${100 / (layout.columns || 1)}% - 16px)`,
                  minWidth: layout.columns === 1 ? 'auto' : '300px'
                }}
              >
                <Form.Item
                  name={field.id}
                  label={field.label}
                  rules={getValidationRules(field)}
                  help={field.helpText}
                  initialValue={field.defaultValue}
                >
                  {renderField(field)}
                </Form.Item>
              </div>
            );
          })}
        </div>

        {showActions && (
          <>
            <Divider />
            <Space>
              {actions || (
                <>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SaveOutlined />}
                    loading={isSubmitting}
                    disabled={config.mode === 'view'}
                  >
                    {config.mode === 'create' ? 'Create' : 'Save'}
                  </Button>
                  <Button 
                    icon={<ClearOutlined />} 
                    onClick={handleReset}
                    disabled={config.mode === 'view' || isSubmitting}
                  >
                    Reset
                  </Button>
                </>
              )}
            </Space>
          </>
        )}
      </Form>
    </Card>
  );
};