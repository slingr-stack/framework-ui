import React from 'react';
import { Typography, Space, Tooltip, Input, Select, Switch, DatePicker, InputNumber } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;
const { Option } = Select;

export interface DataFieldProps {
  /** Field label to display */
  label: string;
  /** Field value to display - can be bound to GraphQL data */
  value?: string | number | boolean | Date | null;
  /** Field type for proper formatting and representation */
  type?: 'text' | 'uuid' | 'email' | 'html' | 'number' | 'integer' | 'decimal' | 'money' | 'datetime' | 'boolean' | 'choice';
  /** Display mode - editable or readonly */
  mode?: 'editable' | 'readonly';
  /** Choice options for choice type fields */
  choices?: Array<{ label: string; value: string | number }>;
  /** Optional help text tooltip */
  helpText?: string;
  /** Whether to display in vertical or horizontal layout */
  layout?: 'horizontal' | 'vertical';
  /** Custom styling */
  style?: React.CSSProperties;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Optional prefix for the value */
  prefix?: string;
  /** Optional suffix for the value */
  suffix?: string;
  /** Callback when value changes in editable mode */
  onChange?: (value: string | number | boolean | Date | null) => void;
}

/**
 * Data Field Component
 * 
 * Displays a label and a value. The value is bound to a backend model field through GraphQL.
 * Supports various data types and formatting options. Can be displayed in readonly or editable mode.
 */
export const DataField: React.FC<DataFieldProps> = ({
  label,
  value,
  type = 'text',
  mode = 'readonly',
  choices = [],
  helpText,
  layout = 'horizontal',
  style,
  loading = false,
  error,
  prefix,
  suffix,
  onChange
}) => {
  const formatReadonlyValue = (val: typeof value): string => {
    if (val === null || val === undefined) return '-';
    
    switch (type) {
      case 'boolean':
        return val ? 'Yes' : 'No';
      case 'money':
        return typeof val === 'number' ? `$${val.toFixed(2)}` : String(val);
      case 'datetime':
        if (val instanceof Date) {
          return val.toLocaleString();
        }
        if (typeof val === 'string') {
          return new Date(val).toLocaleString();
        }
        return String(val);
      case 'email':
        return String(val);
      case 'uuid':
        return String(val);
      case 'html':
        return String(val); // In readonly mode, show as text
      case 'number':
      case 'integer':
      case 'decimal':
        return typeof val === 'number' ? val.toLocaleString() : String(val);
      case 'choice':
        const choice = choices.find(c => c.value === val);
        return choice ? choice.label : String(val);
      default:
        return String(val);
    }
  };

  const renderEditableField = () => {
    const commonProps = {
      value,
      onChange,
      style: { width: '100%' },
      placeholder: helpText
    };

    switch (type) {
      case 'boolean':
        return (
          <Switch 
            checked={Boolean(value)} 
            onChange={(checked) => onChange?.(checked)}
          />
        );
      
      case 'choice':
        return (
          <Select {...commonProps} value={value as string | number}>
            {choices.map(choice => (
              <Option key={choice.value} value={choice.value}>
                {choice.label}
              </Option>
            ))}
          </Select>
        );
      
      case 'datetime':
        return (
          <DatePicker 
            {...commonProps}
            showTime
            value={value ? dayjs(value as string | Date) : null}
            onChange={(date) => onChange?.(date?.toDate() || null)}
          />
        );
      
      case 'number':
      case 'integer':
      case 'decimal':
      case 'money':
        return (
          <InputNumber 
            {...commonProps}
            value={value as number}
            precision={type === 'integer' ? 0 : type === 'money' ? 2 : undefined}
            formatter={type === 'money' ? (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : undefined}
            parser={type === 'money' ? (value) => value!.replace(/\$\s?|(,*)/g, '') as any : undefined}
            onChange={(val) => onChange?.(val)}
          />
        );
      
      case 'email':
        return (
          <Input 
            {...commonProps}
            type="email"
            value={value as string}
            onChange={(e) => onChange?.(e.target.value)}
          />
        );
      
      case 'html':
        return (
          <Input.TextArea 
            {...commonProps}
            rows={4}
            value={value as string}
            onChange={(e) => onChange?.(e.target.value)}
          />
        );
      
      case 'text':
      case 'uuid':
      default:
        return (
          <Input 
            {...commonProps}
            value={value as string}
            onChange={(e) => onChange?.(e.target.value)}
          />
        );
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Text type="secondary">Loading...</Text>;
    }
    
    if (error) {
      return <Text type="danger">{error}</Text>;
    }

    if (mode === 'editable') {
      return renderEditableField();
    }

    // Readonly mode
    const displayValue = formatReadonlyValue(value);
    const fullValue = `${prefix || ''}${displayValue}${suffix || ''}`;
    
    if (type === 'email' && value) {
      return <a href={`mailto:${value}`}>{fullValue}</a>;
    }
    
    if (type === 'html' && value) {
      return <div dangerouslySetInnerHTML={{ __html: String(value) }} />;
    }
    
    return <Text>{fullValue}</Text>;
  };

  if (layout === 'vertical') {
    return (
      <div style={style}>
        <div style={{ marginBottom: 4 }}>
          <Space size={4}>
            <Text strong>{label}</Text>
            {helpText && (
              <Tooltip title={helpText}>
                <InfoCircleOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
              </Tooltip>
            )}
          </Space>
        </div>
        <div>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', ...style }}>
      <div style={{ minWidth: 120, marginRight: 16 }}>
        <Space size={4}>
          <Text strong>{label}:</Text>
          {helpText && (
            <Tooltip title={helpText}>
              <InfoCircleOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
            </Tooltip>
          )}
        </Space>
      </div>
      <div style={{ flex: 1 }}>
        {renderContent()}
      </div>
    </div>
  );
};