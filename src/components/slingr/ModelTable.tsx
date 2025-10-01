import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Input, 
  Button, 
  Space, 
  Tag,
  message,
  Dropdown
} from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { 
  ReloadOutlined,
  MoreOutlined
} from '@ant-design/icons';

// No longer using Option

export interface ModelColumnConfig {
  /** Column identifier (field name) */
  id: string;
  /** Column title */
  title: string;
  /** Column data type */
  type: 'text' | 'number' | 'boolean' | 'date' | 'datetime' | 'tag' | 'currency' | 'email';
  /** Whether column is sortable */
  sortable?: boolean;
  /** Whether column is filterable */
  filterable?: boolean;
  /** Whether column is searchable */
  searchable?: boolean;
  /** Column width */
  width?: number;
  /** Whether column is fixed */
  fixed?: 'left' | 'right';
  /** Custom render function */
  render?: (value: unknown, record: Record<string, unknown>) => React.ReactNode;
  /** Filter options for select filters */
  filterOptions?: Array<{ label: string; value: string | number }>;
  /** Whether to ellipsis long text */
  ellipsis?: boolean;
}

export interface ModelTableAction {
  /** Action identifier */
  key: string;
  /** Action label */
  label: string;
  /** Action icon */
  icon?: React.ReactNode;
  /** Whether action is dangerous */
  danger?: boolean;
  /** Whether action is disabled for certain records */
  disabled?: (record: Record<string, unknown>) => boolean;
  /** Action handler */
  onClick: (record: Record<string, unknown>) => void;
}

export interface ModelTableConfig {
  /** Model identifier */
  modelId: string;
  /** Table title */
  title?: string;
  /** Column configurations */
  columns: ModelColumnConfig[];
  /** Row actions */
  actions?: ModelTableAction[];
  /** Whether to show bulk actions */
  showBulkActions?: boolean;
  /** Bulk actions */
  bulkActions?: ModelTableAction[];
  /** Default page size */
  pageSize?: number;
  /** Whether to show pagination */
  showPagination?: boolean;
  /** Whether rows are selectable */
  rowSelection?: boolean;
}

export interface ModelTableProps {
  /** Table configuration from backend model definition */
  config: ModelTableConfig;
  /** Table data source */
  dataSource?: Record<string, unknown>[];
  /** Loading state */
  loading?: boolean;
  /** Total number of records (for server-side pagination) */
  total?: number;
  /** Current page */
  current?: number;
  /** Callback when data needs to be refreshed */
  onRefresh?: () => void;
  /** Callback for pagination changes */
  onPaginationChange?: (page: number, pageSize: number) => void;
  /** Callback for sorting changes */
  onSortChange?: (field: string, order: 'asc' | 'desc' | null) => void;
  /** Callback for filter changes */
  onFilterChange?: (filters: Record<string, unknown>) => void;
  /** Callback for search */
  onSearch?: (searchTerm: string) => void;
  /** Custom styling */
  style?: React.CSSProperties;
}

/**
 * Model Table Component
 * 
 * Displays a set of records from a backend model in a tabular format.
 * Supports filtering, sorting, pagination, and custom actions.
 */
export const ModelTable: React.FC<ModelTableProps> = ({
  config,
  dataSource = [],
  loading = false,
  total,
  current = 1,
  onRefresh,
  onPaginationChange,
  onSortChange,
  onSearch,
  style
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleSearch = (value: string) => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      message.info('Table refreshed');
    }
  };

  const formatCellValue = (value: unknown, type: ModelColumnConfig['type']): React.ReactNode => {
    if (value === null || value === undefined) return '-';

    switch (type) {
      case 'boolean':
        return value ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>;
      
      case 'currency':
        return typeof value === 'number' ? `$${value.toFixed(2)}` : String(value);
      
      case 'date':
        return value instanceof Date ? value.toLocaleDateString() : String(value);
      
      case 'datetime':
        return value instanceof Date ? value.toLocaleString() : String(value);
      
      case 'tag':
        return <Tag>{String(value)}</Tag>;
      
      case 'email':
        return <a href={`mailto:${value}`}>{String(value)}</a>;
      
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
      
      default:
        return String(value);
    }
  };

  const createTableColumns = (): ColumnsType<Record<string, unknown>> => {
    const columns: ColumnsType<Record<string, unknown>> = config.columns.map(col => {
      const column: ColumnsType<Record<string, unknown>>[0] = {
        key: col.id,
        dataIndex: col.id,
        title: col.title,
        width: col.width,
        fixed: col.fixed,
        ellipsis: col.ellipsis,
        sorter: col.sortable ? true : false,
        render: (value, record) => {
          if (col.render) {
            return col.render(value, record);
          }
          return formatCellValue(value, col.type);
        }
      };

      // Add filters for filterable columns
      if (col.filterable && col.filterOptions) {
        column.filters = col.filterOptions.map(opt => ({
          text: opt.label,
          value: opt.value
        }));
        column.onFilter = (value, record) => {
          const fieldValue = record[col.id];
          return fieldValue === value;
        };
      }

      return column;
    });

    // Add actions column if actions are configured
    if (config.actions && config.actions.length > 0) {
      columns.push({
        key: 'actions',
        title: 'Actions',
        width: 120,
        fixed: 'right',
        render: (_, record) => {
          const menuItems = config.actions!.map(action => ({
            key: action.key,
            label: action.label,
            icon: action.icon,
            danger: action.danger,
            disabled: action.disabled ? action.disabled(record) : false,
            onClick: () => action.onClick(record)
          }));

          if (menuItems.length === 1) {
            const action = config.actions![0];
            return (
              <Button
                type="text"
                size="small"
                icon={action.icon}
                danger={action.danger}
                disabled={action.disabled ? action.disabled(record) : false}
                onClick={() => action.onClick(record)}
              >
                {action.label}
              </Button>
            );
          }

          return (
            <Dropdown
              menu={{
                items: menuItems
              }}
              trigger={['click']}
            >
              <Button type="text" size="small" icon={<MoreOutlined />} />
            </Dropdown>
          );
        }
      });
    }

    return columns;
  };

  const handleTableChange: TableProps<Record<string, unknown>>['onChange'] = (
    pagination,
    _,
    sorter
  ) => {
    // Handle sorting
    if (sorter && !Array.isArray(sorter) && onSortChange) {
      const order = sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : null;
      onSortChange(sorter.field as string, order);
    }

    // Handle pagination
    if (pagination && onPaginationChange) {
      onPaginationChange(pagination.current || 1, pagination.pageSize || 10);
    }
  };

  const rowSelection = config.rowSelection ? {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    onSelectAll: (selected: boolean, selectedRows: Record<string, unknown>[], changeRows: Record<string, unknown>[]) => {
      console.log('Select all:', selected, selectedRows, changeRows);
    }
  } : undefined;

  const hasFilters = config.columns.some(col => col.filterable || col.searchable);
  const searchableColumns = config.columns.filter(col => col.searchable);

  return (
    <Card 
      title={config.title}
      style={style}
      extra={
        <Space>
          {hasFilters && (
            <Space.Compact>
              <Input.Search
                placeholder={`Search ${searchableColumns.map(c => c.title).join(', ')}`}
                onSearch={handleSearch}
                style={{ width: 200 }}
                allowClear
              />
            </Space.Compact>
          )}
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
        </Space>
      }
    >
      {/* Bulk Actions */}
      {config.showBulkActions && config.bulkActions && selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16, padding: 8, backgroundColor: '#f0f2f5', borderRadius: 4 }}>
          <Space>
            <span>{selectedRowKeys.length} items selected</span>
            {config.bulkActions.map(action => (
              <Button
                key={action.key}
                size="small"
                icon={action.icon}
                danger={action.danger}
                onClick={() => {
                  const selectedRecords = dataSource.filter((_, index) => 
                    selectedRowKeys.includes(index)
                  );
                  selectedRecords.forEach(record => action.onClick(record));
                  setSelectedRowKeys([]);
                }}
              >
                {action.label}
              </Button>
            ))}
          </Space>
        </div>
      )}

      <Table
        columns={createTableColumns()}
        dataSource={dataSource}
        loading={loading}
        rowSelection={rowSelection}
        onChange={handleTableChange}
        pagination={config.showPagination !== false ? {
          current,
          pageSize: config.pageSize || 10,
          total: total || dataSource.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        } : false}
        scroll={{ x: 'max-content' }}
        size="middle"
      />
    </Card>
  );
};