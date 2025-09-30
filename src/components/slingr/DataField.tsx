import React from 'react';
import { Typography, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface DataFieldProps {
  /** Field label to display */
  label: string;
  /** Field value to display - can be bound to GraphQL data */
  value?: string | number | boolean | null;
  /** Optional field type for formatting */
  type?: 'text' | 'number' | 'boolean' | 'date' | 'email' | 'currency';
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
}

/**
 * Data Field Component
 * 
 * Displays a label and a value. The value is bound to a backend model field through GraphQL.
 * Supports various data types and formatting options.
 */
export const DataField: React.FC<DataFieldProps> = ({
  label,
  value,
  type = 'text',
  helpText,
  layout = 'horizontal',
  style,
  loading = false,
  error,
  prefix,
  suffix
}) => {
  const formatValue = (val: typeof value): string => {
    if (val === null || val === undefined) return '-';
    
    switch (type) {
      case 'boolean':
        return val ? 'Yes' : 'No';
      case 'currency':
        return typeof val === 'number' ? `$${val.toFixed(2)}` : String(val);
      case 'date':
        return typeof val === 'string' ? new Date(val).toLocaleDateString() : String(val);
      case 'email':
        return String(val);
      case 'number':
        return typeof val === 'number' ? val.toLocaleString() : String(val);
      default:
        return String(val);
    }
  };

  const displayValue = formatValue(value);
  const fullValue = `${prefix || ''}${displayValue}${suffix || ''}`;

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
          {loading ? (
            <Text type="secondary">Loading...</Text>
          ) : error ? (
            <Text type="danger">{error}</Text>
          ) : (
            <Text>{fullValue}</Text>
          )}
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
        {loading ? (
          <Text type="secondary">Loading...</Text>
        ) : error ? (
          <Text type="danger">{error}</Text>
        ) : (
          <Text>{fullValue}</Text>
        )}
      </div>
    </div>
  );
};