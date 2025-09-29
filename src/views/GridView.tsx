import { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Input, 
  Select, 
  Button, 
  Space, 
  Tag, 
  Row, 
  Col,
  Drawer,
  Form,
  InputNumber,
  Typography,
  DatePicker,
  AutoComplete,
  Modal,
  message
} from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ReloadOutlined,
  DownloadOutlined,
  SettingOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { ViewContainer } from '../components/ViewContainer';
import type { ViewComponent } from '../types/view';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Option } = Select;
const { Text } = Typography;
const { RangePicker } = DatePicker;

interface DataRecord {
  key: string;
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  salary: number;
  joinDate: string;
  age: number;
  location: string;
}

// Mock API delay function
const mockApiCall = <T,>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
};

interface DataRecord {
  key: string;
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  salary: number;
  joinDate: string;
  age: number;
  location: string;
}

// Mock data
const generateMockData = (): DataRecord[] => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const roles = ['Manager', 'Developer', 'Designer', 'Analyst', 'Coordinator'];
  const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'inactive', 'pending'];
  const locations = ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo'];
  
  return Array.from({ length: 100 }, (_, i) => ({
    key: `${i}`,
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    department: departments[Math.floor(Math.random() * departments.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    salary: Math.floor(Math.random() * 150000) + 50000,
    joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    age: Math.floor(Math.random() * 40) + 25,
    location: locations[Math.floor(Math.random() * locations.length)]
  }));
};

export const GridView: ViewComponent = ({ config }) => {
  const [data, setData] = useState<DataRecord[]>([]);
  const [filteredData, setFilteredData] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [advancedFilterVisible, setAdvancedFilterVisible] = useState(false);
  const [codeModalVisible, setCodeModalVisible] = useState(false);
  const [quickFilters, setQuickFilters] = useState<Record<string, boolean>>({
    activeOnly: false,
    highSalary: false,
    recentJoiners: false,
    managers: false
  });
  
  // Advanced filter form
  const [filterForm] = Form.useForm();
  
  // Autocomplete options
  const [departmentOptions, setDepartmentOptions] = useState<{value: string}[]>([]);
  const [roleOptions, setRoleOptions] = useState<{value: string}[]>([]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Apply filters when quickFilters change
  useEffect(() => {
    if (data.length > 0) {
      applyAllFilters();
    }
  }, [quickFilters, data]);

  const loadData = async () => {
    setLoading(true);
    try {
      const mockData = await mockApiCall(generateMockData());
      setData(mockData);
      setFilteredData(mockData);
      
      // Extract unique values for autocomplete
      const departments = [...new Set(mockData.map(item => item.department))];
      const roles = [...new Set(mockData.map(item => item.role))];
      setDepartmentOptions(departments.map(dept => ({ value: dept })));
      setRoleOptions(roles.map(role => ({ value: role })));
    } catch (error) {
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Quick filter functions
  const applyQuickFilters = (baseData: DataRecord[]) => {
    let result = [...baseData];
    
    if (quickFilters.activeOnly) {
      result = result.filter(item => item.status === 'active');
    }
    
    if (quickFilters.highSalary) {
      result = result.filter(item => item.salary > 100000);
    }
    
    if (quickFilters.recentJoiners) {
      const cutoffDate = new Date();
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 2);
      result = result.filter(item => new Date(item.joinDate) > cutoffDate);
    }
    
    if (quickFilters.managers) {
      result = result.filter(item => item.role === 'Manager');
    }
    
    return result;
  };

  const applyAllFilters = () => {
    let result = [...data];
    
    // Apply quick filters
    result = applyQuickFilters(result);
    
    // Apply advanced filters if any
    const formValues = filterForm.getFieldsValue();
    
    if (formValues.name) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(formValues.name.toLowerCase())
      );
    }
    
    if (formValues.departments?.length > 0) {
      result = result.filter(item => formValues.departments.includes(item.department));
    }
    
    if (formValues.statuses?.length > 0) {
      result = result.filter(item => formValues.statuses.includes(item.status));
    }
    
    if (formValues.salaryRange) {
      const [min, max] = formValues.salaryRange;
      if (min) result = result.filter(item => item.salary >= min);
      if (max) result = result.filter(item => item.salary <= max);
    }
    
    if (formValues.ageRange) {
      const [min, max] = formValues.ageRange;
      if (min) result = result.filter(item => item.age >= min);
      if (max) result = result.filter(item => item.age <= max);
    }
    
    if (formValues.dateRange) {
      const [startDate, endDate] = formValues.dateRange;
      if (startDate && endDate) {
        result = result.filter(item => {
          const itemDate = new Date(item.joinDate);
          return itemDate >= startDate.toDate() && itemDate <= endDate.toDate();
        });
      }
    }
    
    setFilteredData(result);
  };

  // Apply quick filter
  const handleQuickFilter = (filterKey: string) => {
    setQuickFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  // Refresh data
  const handleRefresh = () => {
    loadData();
    setQuickFilters({
      activeOnly: false,
      highSalary: false,
      recentJoiners: false,
      managers: false
    });
    filterForm.resetFields();
  };

  // Autocomplete search for departments
  const handleDepartmentSearch = (searchText: string) => {
    if (searchText) {
      const filtered = [...new Set(data.map(item => item.department))]
        .filter(dept => dept.toLowerCase().includes(searchText.toLowerCase()))
        .map(dept => ({ value: dept }));
      setDepartmentOptions(filtered);
    } else {
      const allDepartments = [...new Set(data.map(item => item.department))];
      setDepartmentOptions(allDepartments.map(dept => ({ value: dept })));
    }
  };

  // Code viewing
  const gridViewCode = `// Grid View with Advanced Filtering
import { Table, Input, Select, Button, DatePicker, AutoComplete } from 'antd';
import { useState, useEffect } from 'react';

const GridView = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickFilters, setQuickFilters] = useState({
    activeOnly: false,
    highSalary: false,
    recentJoiners: false,
    managers: false
  });

  // Load data with API simulation
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      setData(users);
      setFilteredData(users);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Quick filter handler
  const handleQuickFilter = (filterKey) => {
    setQuickFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  // Apply filters with useEffect
  useEffect(() => {
    if (data.length > 0) {
      applyAllFilters();
    }
  }, [quickFilters, data]);

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};`;

  const showCodeModal = () => {
    setCodeModalVisible(true);
  };

  // Advanced filter submit
  const handleAdvancedFilter = async () => {
    try {
      const values = await filterForm.validateFields();
      let filtered = [...data];
      
      // Apply advanced filters
      if (values.name) {
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(values.name.toLowerCase())
        );
      }
      
      if (values.department && values.department.length > 0) {
        filtered = filtered.filter(item => values.department.includes(item.department));
      }
      
      if (values.status && values.status.length > 0) {
        filtered = filtered.filter(item => values.status.includes(item.status));
      }
      
      if (values.salaryRange) {
        const [min, max] = values.salaryRange;
        filtered = filtered.filter(item => 
          item.salary >= (min || 0) && item.salary <= (max || Infinity)
        );
      }
      
      if (values.ageRange) {
        const [min, max] = values.ageRange;
        filtered = filtered.filter(item => 
          item.age >= (min || 0) && item.age <= (max || Infinity)
        );
      }
      
      // Apply quick filters on top of advanced filters
      const finalFiltered = applyQuickFilters(filtered);
      setFilteredData(finalFiltered);
      setAdvancedFilterVisible(false);
    } catch (error) {
      console.error('Filter validation failed:', error);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setQuickFilters({
      activeOnly: false,
      highSalary: false,
      recentJoiners: false,
      managers: false
    });
    filterForm.resetFields();
    setFilteredData(data);
  };

  // Column search function
  const getColumnSearchProps = (dataIndex: keyof DataRecord, title: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: {
      setSelectedKeys: (keys: React.Key[]) => void;
      selectedKeys: React.Key[];
      confirm: () => void;
      clearFilters?: () => void;
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${title}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && clearFilters()}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: boolean | React.Key, record: DataRecord) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
  });

  // Table columns with filtering
  const columns: ColumnsType<DataRecord> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name', 'Name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email', 'Email'),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      filters: [
        { text: 'Engineering', value: 'Engineering' },
        { text: 'Marketing', value: 'Marketing' },
        { text: 'Sales', value: 'Sales' },
        { text: 'HR', value: 'HR' },
        { text: 'Finance', value: 'Finance' },
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Manager', value: 'Manager' },
        { text: 'Developer', value: 'Developer' },
        { text: 'Designer', value: 'Designer' },
        { text: 'Analyst', value: 'Analyst' },
        { text: 'Coordinator', value: 'Coordinator' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'active' ? 'green' : status === 'inactive' ? 'red' : 'orange';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Pending', value: 'pending' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary: number) => `$${salary.toLocaleString()}`,
      sorter: (a, b) => a.salary - b.salary,
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      sorter: (a, b) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      filters: [
        { text: 'New York', value: 'New York' },
        { text: 'San Francisco', value: 'San Francisco' },
        { text: 'London', value: 'London' },
        { text: 'Berlin', value: 'Berlin' },
        { text: 'Tokyo', value: 'Tokyo' },
      ],
      onFilter: (value, record) => record.location === value,
    },
  ];

  const handleTableChange: TableProps<DataRecord>['onChange'] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log('Table change:', { pagination, filters, sorter, extra });
  };

  return (
    <ViewContainer config={config}>
      <div style={{ padding: 16 }}>
        {/* Quick Filters */}
        <Card 
          title={
            <Space>
              <FilterOutlined />
              Quick Filters
            </Space>
          }
          size="small" 
          style={{ marginBottom: 16 }}
        >
          <Space wrap>
            <Button
              type={quickFilters.activeOnly ? 'primary' : 'default'}
              onClick={() => handleQuickFilter('activeOnly')}
              icon={<UserOutlined />}
            >
              Active Only
            </Button>
            <Button
              type={quickFilters.highSalary ? 'primary' : 'default'}
              onClick={() => handleQuickFilter('highSalary')}
              icon={<DollarOutlined />}
            >
              High Salary ($100k+)
            </Button>
            <Button
              type={quickFilters.recentJoiners ? 'primary' : 'default'}
              onClick={() => handleQuickFilter('recentJoiners')}
              icon={<CalendarOutlined />}
            >
              Recent Joiners (2 years)
            </Button>
            <Button
              type={quickFilters.managers ? 'primary' : 'default'}
              onClick={() => handleQuickFilter('managers')}
              icon={<SettingOutlined />}
            >
              Managers Only
            </Button>
          </Space>
        </Card>

        {/* Advanced Filter Panel & Actions */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  onClick={() => setAdvancedFilterVisible(true)}
                >
                  Advanced Filters
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleResetFilters}
                >
                  Reset All
                </Button>
              </Space>
            </Col>
            <Col>
              <Space>
                <Text type="secondary">
                  Showing {filteredData.length} of {data.length} records
                </Text>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => console.log('Export data')}
                >
                  Export
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Data Table */}
        <Card>
          <Table<DataRecord>
            columns={columns}
            dataSource={filteredData}
            onChange={handleTableChange}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            scroll={{ x: 1200 }}
            bordered
            size="middle"
          />
        </Card>

        {/* Advanced Filter Drawer */}
        <Drawer
          title="Advanced Filters"
          width={400}
          onClose={() => setAdvancedFilterVisible(false)}
          open={advancedFilterVisible}
          extra={
            <Space>
              <Button onClick={() => setAdvancedFilterVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" onClick={handleAdvancedFilter}>
                Apply Filters
              </Button>
            </Space>
          }
        >
          <Form
            form={filterForm}
            layout="vertical"
            onFinish={handleAdvancedFilter}
          >
            <Form.Item label="Name" name="name">
              <Input placeholder="Search by name" />
            </Form.Item>
            
            <Form.Item label="Department" name="department">
              <Select
                mode="multiple"
                placeholder="Select departments"
                style={{ width: '100%' }}
              >
                <Option value="Engineering">Engineering</Option>
                <Option value="Marketing">Marketing</Option>
                <Option value="Sales">Sales</Option>
                <Option value="HR">HR</Option>
                <Option value="Finance">Finance</Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="Status" name="status">
              <Select
                mode="multiple"
                placeholder="Select status"
                style={{ width: '100%' }}
              >
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="pending">Pending</Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="Salary Range" name="salaryRange">
              <Input.Group compact>
                <Form.Item name={['salaryRange', 0]} noStyle>
                  <InputNumber placeholder="Min" style={{ width: '50%' }} />
                </Form.Item>
                <Form.Item name={['salaryRange', 1]} noStyle>
                  <InputNumber placeholder="Max" style={{ width: '50%' }} />
                </Form.Item>
              </Input.Group>
            </Form.Item>
            
            <Form.Item label="Age Range" name="ageRange">
              <Input.Group compact>
                <Form.Item name={['ageRange', 0]} noStyle>
                  <InputNumber placeholder="Min Age" style={{ width: '50%' }} />
                </Form.Item>
                <Form.Item name={['ageRange', 1]} noStyle>
                  <InputNumber placeholder="Max Age" style={{ width: '50%' }} />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </ViewContainer>
  );
};