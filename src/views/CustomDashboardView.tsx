import { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Typography, 
  Space, 
  DatePicker, 
  Select, 
  Switch, 
  Button,
  message,
  Spin,
  Table,
  Tag
} from 'antd';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  DollarOutlined,
  RiseOutlined,
  TeamOutlined,
  ReloadOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { ViewContainer } from '../components/ViewContainer';
import type { ViewComponent } from '../types/view';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Mock data generator based on date range and filters
const generateMockData = (dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null, department: string, activeOnly: boolean) => {
  const baseUsers = activeOnly ? 8520 : 11280;
  const baseSales = activeOnly ? 156.3 : 189.7;
  const baseOrders = activeOnly ? 85340 : 112893;
  const baseGrowth = activeOnly ? 12.8 : 9.3;

  // Simulate different data based on department
  const departmentMultiplier = department === 'all' ? 1 : department === 'sales' ? 1.3 : department === 'engineering' ? 0.8 : 1.1;

  // Simulate date range effect
  const daysDiff = dateRange ? dateRange[1].diff(dateRange[0], 'day') : 30;
  const dateMultiplier = Math.min(daysDiff / 30, 2);

  return {
    users: Math.round(baseUsers * departmentMultiplier * dateMultiplier),
    sales: parseFloat((baseSales * departmentMultiplier * dateMultiplier).toFixed(1)),
    orders: Math.round(baseOrders * departmentMultiplier * dateMultiplier),
    growth: parseFloat((baseGrowth * departmentMultiplier).toFixed(1)),
    performance: {
      server: Math.round(78 + (Math.random() * 20 - 10)),
      database: Math.round(60 + (Math.random() * 30 - 15)),
      memory: Math.round(45 + (Math.random() * 20 - 10)),
      network: Math.round(85 + (Math.random() * 15 - 7))
    }
  };
};

// Mock chart data
const generateChartData = (dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
  const days = dateRange ? dateRange[1].diff(dateRange[0], 'day') : 7;
  return Array.from({ length: Math.min(days, 30) }, (_, i) => ({
    date: dayjs().subtract(days - i, 'day').format('MM/DD'),
    users: Math.round(1000 + Math.random() * 500),
    sales: Math.round(15000 + Math.random() * 10000),
    orders: Math.round(800 + Math.random() * 400)
  }));
};

// Mock recent activities
const generateActivities = (department: string) => {
  const activities = [
    { user: 'John Doe', action: 'created a new project', time: '2 minutes ago', type: 'create' },
    { user: 'Sarah Chen', action: 'completed 5 tasks', time: '15 minutes ago', type: 'complete' },
    { user: 'Mike Johnson', action: 'uploaded new files', time: '1 hour ago', type: 'upload' },
    { user: 'System', action: 'Backup completed successfully', time: '2 hours ago', type: 'system' },
    { user: 'Alice Brown', action: 'reviewed pull request', time: '3 hours ago', type: 'review' },
    { user: 'Bob Wilson', action: 'deployed to production', time: '4 hours ago', type: 'deploy' }
  ];

  return department === 'all' ? activities : activities.filter((_, i) => i % 2 === 0);
};

const customDashboardCode = `import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Select, Switch } from 'antd';

export const CustomDashboard = () => {
  // Model Variables with State Binding
  const [dateRange, setDateRange] = useState(null);
  const [department, setDepartment] = useState('all');
  const [activeOnly, setActiveOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  // API Simulation with Loading States
  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const data = generateMockData(dateRange, department, activeOnly);
    setDashboardData(data);
    setLoading(false);
  };

  // Event Handlers with Model Binding
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    console.log('Date Range Changed:', { dates, timestamp: new Date() });
  };

  const handleDepartmentChange = (value) => {
    setDepartment(value);
    console.log('Department Changed:', { value, timestamp: new Date() });
  };

  const handleActiveToggle = (checked) => {
    setActiveOnly(checked);
    console.log('Active Filter Changed:', { checked, timestamp: new Date() });
  };

  // Effect for automatic data refresh
  useEffect(() => {
    fetchDashboardData();
  }, [dateRange, department, activeOnly]);

  return (
    <div>
      {/* Interactive Controls */}
      <Card style={{ marginBottom: 16 }}>
        <Space size="large">
          <RangePicker onChange={handleDateRangeChange} />
          <Select value={department} onChange={handleDepartmentChange}>
            <Option value="all">All Departments</Option>
            <Option value="sales">Sales</Option>
            <Option value="engineering">Engineering</Option>
          </Select>
          <Switch 
            checked={activeOnly} 
            onChange={handleActiveToggle}
            checkedChildren="Active Only"
            unCheckedChildren="All Users"
          />
        </Space>
      </Card>

      {/* Dynamic Statistics */}
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={dashboardData?.users || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          {/* More statistics... */}
        </Row>
      </Spin>
    </div>
  );
};`;

export const CustomDashboardView: ViewComponent = ({ config }) => {
  // Model Variables - State Binding
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [department, setDepartment] = useState<string>('all');
  const [activeOnly, setActiveOnly] = useState<boolean>(false);
  const [chartType, setChartType] = useState<string>('line');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  
  // Data State
  const [loading, setLoading] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [codeModalVisible, setCodeModalVisible] = useState<boolean>(false);

  // API Simulation
  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const data = generateMockData(dateRange, department, activeOnly);
      const charts = generateChartData(dateRange);
      const activityData = generateActivities(department);
      
      setDashboardData(data);
      setChartData(charts);
      setActivities(activityData);
      
      message.success('Dashboard data refreshed successfully!');
    } catch (error) {
      message.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers with Model Binding
  const handleDateRangeChange: RangePickerProps['onChange'] = (dates) => {
    setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null);
    console.log('Date Range Change Event:', { dates, timestamp: new Date() });
    if (dates) {
      message.info(`Date range updated: ${dates[0]?.format('MM/DD')} - ${dates[1]?.format('MM/DD')}`);
    } else {
      message.info('Date range cleared - showing all time');
    }
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    console.log('Department Change Event:', { value, timestamp: new Date() });
    message.info(`Department filter: ${value}`);
  };

  const handleActiveToggle = (checked: boolean) => {
    setActiveOnly(checked);
    console.log('Active Filter Change Event:', { checked, timestamp: new Date() });
    message.info(`Filter: ${checked ? 'Active users only' : 'All users'}`);
  };

  const handleChartTypeChange = (value: string) => {
    setChartType(value);
    console.log('Chart Type Change Event:', { value, timestamp: new Date() });
    message.info(`Chart type: ${value}`);
  };

  const handleAutoRefreshToggle = (checked: boolean) => {
    setAutoRefresh(checked);
    console.log('Auto Refresh Toggle Event:', { checked, timestamp: new Date() });
    message.info(`Auto refresh: ${checked ? 'ON' : 'OFF'}`);
  };

  const handleManualRefresh = () => {
    console.log('Manual Refresh Event:', { timestamp: new Date() });
    fetchDashboardData();
  };

  // Effect for automatic data refresh
  useEffect(() => {
    fetchDashboardData();
  }, [dateRange, department, activeOnly]);

  // Auto refresh interval
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchDashboardData();
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, dateRange, department, activeOnly]);

  // Table columns for activities
  const activityColumns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action'
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (text: string) => <Text type="secondary">{text}</Text>
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors = {
          create: 'green',
          complete: 'blue',
          upload: 'orange',
          system: 'purple',
          review: 'cyan',
          deploy: 'red'
        };
        return <Tag color={colors[type as keyof typeof colors]}>{type}</Tag>;
      }
    }
  ];

  const showCodeModal = () => {
    setCodeModalVisible(true);
  };

  const extra = (
    <Button 
      icon={<CodeOutlined />} 
      onClick={showCodeModal}
      type="primary"
      ghost
    >
      View Code
    </Button>
  );

  return (
    <ViewContainer config={config} extra={extra}>
      <div style={{ padding: 16 }}>
        {/* Interactive Controls */}
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col>
              <Space direction="vertical" size="small">
                <Text strong>Date Range:</Text>
                <RangePicker 
                  onChange={handleDateRangeChange}
                  value={dateRange}
                  allowClear
                  placeholder={['Start Date', 'End Date']}
                />
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" size="small">
                <Text strong>Department:</Text>
                <Select 
                  value={department} 
                  onChange={handleDepartmentChange}
                  style={{ width: 160 }}
                >
                  <Option value="all">All Departments</Option>
                  <Option value="sales">Sales</Option>
                  <Option value="engineering">Engineering</Option>
                  <Option value="marketing">Marketing</Option>
                </Select>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" size="small">
                <Text strong>Chart Type:</Text>
                <Select 
                  value={chartType} 
                  onChange={handleChartTypeChange}
                  style={{ width: 120 }}
                >
                  <Option value="line">Line Chart</Option>
                  <Option value="bar">Bar Chart</Option>
                  <Option value="area">Area Chart</Option>
                </Select>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" size="small">
                <Text strong>Active Only:</Text>
                <Switch 
                  checked={activeOnly} 
                  onChange={handleActiveToggle}
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                />
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" size="small">
                <Text strong>Auto Refresh:</Text>
                <Switch 
                  checked={autoRefresh} 
                  onChange={handleAutoRefreshToggle}
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                />
              </Space>
            </Col>
            <Col>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleManualRefresh}
                loading={loading}
                type="primary"
              >
                Refresh
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Current Filter Display */}
        <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
          <Space wrap>
            <Text strong>Active Filters:</Text>
            <Tag color="blue">
              Date: {dateRange ? `${dateRange[0].format('MM/DD/YYYY')} - ${dateRange[1].format('MM/DD/YYYY')}` : 'All time'}
            </Tag>
            <Tag color="green">Department: {department}</Tag>
            <Tag color="orange">Users: {activeOnly ? 'Active only' : 'All users'}</Tag>
            <Tag color="purple">Chart: {chartType}</Tag>
            <Tag color="cyan">Auto Refresh: {autoRefresh ? 'ON' : 'OFF'}</Tag>
          </Space>
        </Card>

        <Spin spinning={loading} tip="Loading dashboard data...">
          <Row gutter={[16, 16]}>
            {/* Dynamic Statistics */}
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={dashboardData?.users || 0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Sales Revenue"
                  value={dashboardData?.sales || 0}
                  precision={1}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<DollarOutlined />}
                  suffix="K"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Orders"
                  value={dashboardData?.orders || 0}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Growth"
                  value={dashboardData?.growth || 0}
                  precision={1}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<RiseOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>

            {/* Performance Charts */}
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <BarChartOutlined />
                    Performance Overview
                  </Space>
                } 
                style={{ height: '100%' }}
              >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div>
                    <Text strong>Server Performance</Text>
                    <Progress 
                      percent={dashboardData?.performance?.server || 78} 
                      status="active" 
                      strokeColor="#52c41a"
                    />
                  </div>
                  <div>
                    <Text strong>Database Load</Text>
                    <Progress 
                      percent={dashboardData?.performance?.database || 60} 
                      strokeColor="#1890ff" 
                    />
                  </div>
                  <div>
                    <Text strong>Memory Usage</Text>
                    <Progress 
                      percent={dashboardData?.performance?.memory || 45} 
                      strokeColor="#faad14" 
                    />
                  </div>
                  <div>
                    <Text strong>Network</Text>
                    <Progress 
                      percent={dashboardData?.performance?.network || 85} 
                      strokeColor="#722ed1" 
                    />
                  </div>
                </Space>
              </Card>
            </Col>

            {/* Chart Visualization */}
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <LineChartOutlined />
                    {chartType} Chart - Trends
                  </Space>
                } 
                style={{ height: '100%' }}
              >
                <div style={{ padding: '20px 0', textAlign: 'center' }}>
                  <Space direction="vertical" size="middle">
                    <div style={{ fontSize: 16, color: '#666' }}>
                      {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart Visualization
                    </div>
                    <div style={{ fontSize: 14, color: '#999' }}>
                      Showing {chartData.length} data points
                    </div>
                    <div style={{ fontSize: 12, color: '#ccc' }}>
                      Chart integration would render here with libraries like Chart.js or D3
                    </div>
                    <Space>
                      <PieChartOutlined style={{ fontSize: 24, color: chartType === 'line' ? '#1890ff' : '#ccc' }} />
                      <LineChartOutlined style={{ fontSize: 24, color: chartType === 'bar' ? '#52c41a' : '#ccc' }} />
                      <BarChartOutlined style={{ fontSize: 24, color: chartType === 'area' ? '#722ed1' : '#ccc' }} />
                    </Space>
                  </Space>
                </div>
              </Card>
            </Col>

            {/* Team Activity with Model Binding */}
            <Col span={24}>
              <Card 
                title={
                  <Space>
                    <TeamOutlined />
                    Recent Activity
                    <Text type="secondary">({activities.length} items)</Text>
                  </Space>
                }
              >
                <Table
                  dataSource={activities}
                  columns={activityColumns}
                  pagination={{ pageSize: 5, showSizeChanger: false }}
                  size="small"
                  rowKey={(_, index) => index?.toString() || '0'}
                />
              </Card>
            </Col>
          </Row>
        </Spin>

        {/* Code Modal */}
        {codeModalVisible && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Card
              title="Custom Dashboard - Source Code"
              style={{ width: '90%', maxWidth: 800, maxHeight: '80%', overflow: 'auto' }}
              extra={
                <Button onClick={() => setCodeModalVisible(false)}>
                  Close
                </Button>
              }
            >
              <SyntaxHighlighter
                language="typescript"
                style={tomorrow}
                showLineNumbers
                wrapLines
                customStyle={{
                  maxHeight: '60vh',
                  overflow: 'auto'
                }}
              >
                {customDashboardCode}
              </SyntaxHighlighter>
            </Card>
          </div>
        )}
      </div>
    </ViewContainer>
  );
};