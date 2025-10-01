import React from 'react';
import { Typography, Space, Tooltip, Input, Select, Switch, DatePicker, InputNumber, Button } from 'antd';
import { InfoCircleOutlined, SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;
const { Option } = Select;

export interface DataFieldProps {
  /** Field label to display */
  label: string;
  /** Field value to display - can be bound to GraphQL data */
  value?: string | number | boolean | Date | Array<any> | null;
  /** Field type for proper formatting and representation */
  type?: 'text' | 'uuid' | 'email' | 'html' | 'number' | 'integer' | 'decimal' | 'money' | 'datetime' | 'boolean' | 'choice' | 'relationship';
  /** Display mode - editable or readonly */
  mode?: 'editable' | 'readonly';
  /** Choice options for choice type fields */
  choices?: Array<{ label: string; value: string | number }>;
  /** Relationship options for relationship type fields */
  relationshipOptions?: Array<{ label: string; value: string | number; id?: string | number }>;
  /** Whether the field supports multiple values (array) */
  multiple?: boolean;
  /** Optional help text tooltip */
  helpText?: string;
  /** Label position - top or left, default is left */
  labelPosition?: 'top' | 'left';
  /** Custom styling */
  style?: React.CSSProperties;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Callback when value changes in editable mode */
  onChange?: (value: string | number | boolean | Date | Array<any> | null) => void;
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
  relationshipOptions = [],
  multiple = false,
  helpText,
  labelPosition = 'left',
  style,
  loading = false,
  error,
  onChange
}) => {
  const formatReadonlyValue = (val: typeof value): string => {
    if (val === null || val === undefined) return '-';
    
    // Handle arrays (multi-valued fields)
    if (Array.isArray(val)) {
      if (val.length === 0) return '-';
      
      switch (type) {
        case 'relationship':
          const relationshipLabels = val.map(v => {
            const option = relationshipOptions.find(opt => opt.value === v || opt.id === v);
            return option ? option.label : String(v);
          });
          return relationshipLabels.join(', ');
        case 'choice':
          const choiceLabels = val.map(v => {
            const choice = choices.find(c => c.value === v);
            return choice ? choice.label : String(v);
          });
          return choiceLabels.join(', ');
        default:
          return val.map(v => String(v)).join(', ');
      }
    }
    
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
      case 'relationship':
        const relationship = relationshipOptions.find(opt => opt.value === val || opt.id === val);
        return relationship ? relationship.label : String(val);
      default:
        return String(val);
    }
  };

  const renderEditableField = () => {
    // For boolean type (no multi-valued support)
    if (type === 'boolean') {
      return (
        <Switch 
          checked={Boolean(value)} 
          onChange={(checked) => onChange?.(checked)}
        />
      );
    }

    // For choice and relationship types, use existing select implementation
    if (type === 'choice') {
      return (
        <Select 
          value={Array.isArray(value) ? value : value as string | number}
          mode={multiple ? 'multiple' : undefined}
          style={{ width: '100%' }}
          placeholder={helpText}
          onChange={(val) => onChange?.(val)}
        >
          {choices.map(choice => (
            <Option key={choice.value} value={choice.value}>
              {choice.label}
            </Option>
          ))}
        </Select>
      );
    }

    if (type === 'relationship') {
      return (
        <Select 
          value={Array.isArray(value) ? value : value as string | number}
          mode={multiple ? 'multiple' : undefined}
          style={{ width: '100%' }}
          placeholder={helpText}
          showSearch
          filterOption={(input, option) =>
            String(option?.children)?.toLowerCase().includes(input.toLowerCase())
          }
          suffixIcon={<SearchOutlined />}
          onChange={(val) => onChange?.(val)}
        >
          {relationshipOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      );
    }

    // For multi-valued fields (text, email, number, etc.), create individual inputs
    if (multiple) {
      const arrayValue = Array.isArray(value) ? value : (value !== undefined && value !== null ? [value] : []);
      
      const handleValueChange = (index: number, newValue: any) => {
        const newArray = [...arrayValue];
        newArray[index] = newValue;
        onChange?.(newArray);
      };

      const handleAddValue = () => {
        const defaultValue = type === 'number' || type === 'integer' || type === 'decimal' || type === 'money' ? 0 : '';
        onChange?.([...arrayValue, defaultValue]);
      };

      const handleRemoveValue = (index: number) => {
        const newArray = arrayValue.filter((_, i) => i !== index);
        onChange?.(newArray);
      };

      const renderSingleInput = (val: any, index: number) => {
        const commonProps = {
          value: val,
          style: { width: '100%' },
          placeholder: helpText
        };

        switch (type) {
          case 'datetime':
            return (
              <DatePicker 
                {...commonProps}
                showTime
                value={val ? dayjs(val) : null}
                onChange={(date) => handleValueChange(index, date?.toDate() || null)}
              />
            );
          
          case 'number':
          case 'integer':
          case 'decimal':
          case 'money':
            return (
              <InputNumber 
                {...commonProps}
                precision={type === 'integer' ? 0 : type === 'money' ? 2 : undefined}
                formatter={type === 'money' ? (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : undefined}
                parser={type === 'money' ? (value) => value!.replace(/\$\s?|(,*)/g, '') as any : undefined}
                onChange={(newVal) => handleValueChange(index, newVal)}
              />
            );
          
          case 'email':
            return (
              <Input 
                {...commonProps}
                type="email"
                onChange={(e) => handleValueChange(index, e.target.value)}
              />
            );
          
          case 'html':
            return (
              <Input.TextArea 
                {...commonProps}
                rows={2}
                onChange={(e) => handleValueChange(index, e.target.value)}
              />
            );
          
          case 'text':
          case 'uuid':
          default:
            return (
              <Input 
                {...commonProps}
                onChange={(e) => handleValueChange(index, e.target.value)}
              />
            );
        }
      };

      return (
        <div>
          {arrayValue.map((val, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: 8, alignItems: 'center' }}>
              <div style={{ flex: 1, marginRight: 8 }}>
                {renderSingleInput(val, index)}
              </div>
              <Button 
                type="text" 
                danger 
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveValue(index)}
                disabled={arrayValue.length <= 1}
              />
            </div>
          ))}
          <Button 
            type="dashed" 
            icon={<PlusOutlined />} 
            onClick={handleAddValue}
            style={{ width: '100%' }}
          >
            Add {type}
          </Button>
        </div>
      );
    }

    // Single value fields
    const commonProps = {
      value: Array.isArray(value) ? value[0] : value,
      style: { width: '100%' },
      placeholder: helpText
    };

    switch (type) {
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
    
    if (type === 'email' && value && !Array.isArray(value)) {
      return <a href={`mailto:${value}`}>{displayValue}</a>;
    }
    
    if (type === 'html' && value && !Array.isArray(value)) {
      return <div dangerouslySetInnerHTML={{ __html: String(value) }} />;
    }

    // Handle arrays (multi-valued fields) with tags
    if (Array.isArray(value) && value.length > 0) {
      return (
        <Space wrap>
          {value.map((item, index) => {
            let displayItem = item;
            if (type === 'relationship') {
              const relationship = relationshipOptions.find(opt => opt.value === item || opt.id === item);
              displayItem = relationship ? relationship.label : String(item);
            } else if (type === 'choice') {
              const choice = choices.find(c => c.value === item);
              displayItem = choice ? choice.label : String(item);
            }
            
            return (
              <Text key={index} code style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>
                {displayItem}
              </Text>
            );
          })}
        </Space>
      );
    }
    
    return <Text>{displayValue}</Text>;
  };

  if (labelPosition === 'top') {
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