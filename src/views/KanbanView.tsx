import { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Avatar, 
  Typography, 
  Space,
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Dropdown,
  Menu
} from 'antd';
import { 
  PlusOutlined, 
  FilterOutlined, 
  MoreOutlined,
  UserOutlined,
  CalendarOutlined,
  FlagOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { ViewContainer } from '../components/ViewContainer';
import type { ViewComponent } from '../types/view';

const { Text, Title } = Typography;
const { Option } = Select;

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  dueDate?: string;
  tags: string[];
  estimatedHours?: number;
  department?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  color: string;
  cards: KanbanCard[];
}

// Mock data generation
const generateMockKanbanData = (): KanbanColumn[] => {
  const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];
  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR'];
  const tags = ['Frontend', 'Backend', 'API', 'UI/UX', 'Database', 'Testing', 'Bug', 'Feature', 'Research', 'Documentation'];
  const assignees = [
    { name: 'John Doe', avatar: 'https://joeschmoe.io/api/v1/john' },
    { name: 'Jane Smith', avatar: 'https://joeschmoe.io/api/v1/jane' },
    { name: 'Mike Johnson', avatar: 'https://joeschmoe.io/api/v1/mike' },
    { name: 'Sarah Wilson', avatar: 'https://joeschmoe.io/api/v1/sarah' },
    { name: 'Alex Chen', avatar: 'https://joeschmoe.io/api/v1/alex' },
  ];

  const generateCards = (status: 'todo' | 'in-progress' | 'review' | 'done', count: number): KanbanCard[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `${status}-${i + 1}`,
      title: `${status === 'todo' ? 'Task' : status === 'in-progress' ? 'Development' : status === 'review' ? 'Review' : 'Completed'} Item ${i + 1}`,
      description: `This is a sample ${status.replace('-', ' ')} item for the kanban board demonstration.`,
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status,
      dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: tags.slice(0, Math.floor(Math.random() * 3) + 1),
      estimatedHours: Math.floor(Math.random() * 16) + 1,
      department: departments[Math.floor(Math.random() * departments.length)]
    }));
  };

  return [
    {
      id: 'todo',
      title: 'To Do',
      status: 'todo',
      color: '#f5f5f5',
      cards: generateCards('todo', 8)
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      status: 'in-progress',
      color: '#e6f7ff',
      cards: generateCards('in-progress', 5)
    },
    {
      id: 'review',
      title: 'Review',
      status: 'review',
      color: '#fff7e6',
      cards: generateCards('review', 3)
    },
    {
      id: 'done',
      title: 'Done',
      status: 'done',
      color: '#f6ffed',
      cards: generateCards('done', 12)
    }
  ];
};

export const KanbanView: ViewComponent = ({ config }) => {
  const [columns] = useState<KanbanColumn[]>(generateMockKanbanData());
  const [filteredColumns, setFilteredColumns] = useState<KanbanColumn[]>(columns);
  const [quickFilters, setQuickFilters] = useState<Record<string, boolean>>({
    highPriority: false,
    myTasks: false,
    overdue: false,
    thisWeek: false
  });
  const [advancedFilterVisible, setAdvancedFilterVisible] = useState(false);
  const [filterForm] = Form.useForm();

  // Apply filters when quickFilters change
  useEffect(() => {
    applyFilters();
  }, [quickFilters]);

  // Apply filters
  const applyFilters = () => {
    let filtered = [...columns];

    // Quick filters
    if (quickFilters.highPriority) {
      filtered = filtered.map(col => ({
        ...col,
        cards: col.cards.filter(card => card.priority === 'high' || card.priority === 'urgent')
      }));
    }

    if (quickFilters.myTasks) {
      filtered = filtered.map(col => ({
        ...col,
        cards: col.cards.filter(card => card.assignee?.name === 'John Doe') // Mock current user
      }));
    }

    if (quickFilters.overdue) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.map(col => ({
        ...col,
        cards: col.cards.filter(card => card.dueDate && card.dueDate < today)
      }));
    }

    if (quickFilters.thisWeek) {
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.map(col => ({
        ...col,
        cards: col.cards.filter(card => card.dueDate && card.dueDate >= today && card.dueDate <= nextWeek)
      }));
    }

    setFilteredColumns(filtered);
  };

  // Handle quick filter changes
  const handleQuickFilter = (filterKey: string) => {
    setQuickFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey as keyof typeof prev]
    }));
  };

  // Handle advanced filter
  const handleAdvancedFilter = async () => {
    try {
      const values = await filterForm.validateFields();
      let filtered = [...columns];

      if (values.title) {
        filtered = filtered.map(col => ({
          ...col,
          cards: col.cards.filter(card => 
            card.title.toLowerCase().includes(values.title.toLowerCase()) ||
            card.description?.toLowerCase().includes(values.title.toLowerCase())
          )
        }));
      }

      if (values.assignee) {
        filtered = filtered.map(col => ({
          ...col,
          cards: col.cards.filter(card => card.assignee?.name === values.assignee)
        }));
      }

      if (values.department) {
        filtered = filtered.map(col => ({
          ...col,
          cards: col.cards.filter(card => card.department === values.department)
        }));
      }

      if (values.priority) {
        filtered = filtered.map(col => ({
          ...col,
          cards: col.cards.filter(card => card.priority === values.priority)
        }));
      }

      setFilteredColumns(filtered);
      setAdvancedFilterVisible(false);
      message.success('Filters applied successfully');
    } catch {
      message.error('Please fill in the required fields');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setQuickFilters({
      highPriority: false,
      myTasks: false,
      overdue: false,
      thisWeek: false
    });
    setFilteredColumns(columns);
    filterForm.resetFields();
    message.info('All filters cleared');
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ff4d4f';
      case 'high': return '#fa8c16';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  // Card menu actions
  const getCardMenu = () => (
    <Menu>
      <Menu.Item key="edit">Edit</Menu.Item>
      <Menu.Item key="duplicate">Duplicate</Menu.Item>
      <Menu.Item key="delete" danger>Delete</Menu.Item>
    </Menu>
  );

  // Render kanban card
  const renderCard = (card: KanbanCard) => (
    <Card
      key={card.id}
      size="small"
      style={{ 
        marginBottom: 8, 
        cursor: 'pointer',
        border: '1px solid #f0f0f0',
        borderRadius: 6,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
      bodyStyle={{ padding: 12 }}
      extra={
        <Dropdown overlay={getCardMenu()} trigger={['click']}>
          <Button type="text" size="small" icon={<MoreOutlined />} />
        </Dropdown>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Text strong style={{ fontSize: 14 }}>{card.title}</Text>
        
        {card.description && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            {card.description.length > 100 ? card.description.substring(0, 100) + '...' : card.description}
          </Text>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tag 
            color={getPriorityColor(card.priority)} 
            style={{ fontSize: 10, padding: '0 4px', lineHeight: '16px' }}
          >
            {card.priority.toUpperCase()}
          </Tag>
          <Text type="secondary" style={{ fontSize: 10 }}>
            {card.estimatedHours}h
          </Text>
        </div>

        {card.tags.length > 0 && (
          <div>
            {card.tags.slice(0, 2).map(tag => (
              <Tag key={tag} style={{ fontSize: 10, marginBottom: 2 }}>
                {tag}
              </Tag>
            ))}
            {card.tags.length > 2 && (
              <Tag style={{ fontSize: 10 }}>+{card.tags.length - 2}</Tag>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {card.assignee && (
              <Avatar 
                size={20} 
                src={card.assignee.avatar} 
                icon={<UserOutlined />}
              />
            )}
            <Text style={{ fontSize: 10 }}>{card.assignee?.name}</Text>
          </div>
          
          {card.dueDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalendarOutlined style={{ fontSize: 10, color: '#666' }} />
              <Text style={{ fontSize: 10, color: '#666' }}>
                {new Date(card.dueDate).toLocaleDateString()}
              </Text>
            </div>
          )}
        </div>
      </Space>
    </Card>
  );

  return (
    <ViewContainer config={config}>
      <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header with filters */}
        <Card style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Title level={4} style={{ margin: 0 }}>
                  Project Tasks Kanban
                </Title>
                <Text type="secondary">
                  {filteredColumns.reduce((total, col) => total + col.cards.length, 0)} tasks
                </Text>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button 
                  type={quickFilters.highPriority ? 'primary' : 'default'}
                  size="small"
                  icon={<FlagOutlined />}
                  onClick={() => handleQuickFilter('highPriority')}
                >
                  High Priority
                </Button>
                <Button 
                  type={quickFilters.myTasks ? 'primary' : 'default'}
                  size="small"
                  icon={<UserOutlined />}
                  onClick={() => handleQuickFilter('myTasks')}
                >
                  My Tasks
                </Button>
                <Button 
                  type={quickFilters.overdue ? 'primary' : 'default'}
                  size="small"
                  icon={<CalendarOutlined />}
                  onClick={() => handleQuickFilter('overdue')}
                >
                  Overdue
                </Button>
                <Button 
                  type={quickFilters.thisWeek ? 'primary' : 'default'}
                  size="small"
                  icon={<CalendarOutlined />}
                  onClick={() => handleQuickFilter('thisWeek')}
                >
                  This Week
                </Button>
                <Button 
                  icon={<FilterOutlined />} 
                  onClick={() => setAdvancedFilterVisible(true)}
                >
                  Advanced Filter
                </Button>
                <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                  Reset
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Kanban Board */}
        <div style={{ flex: 1, overflowX: 'auto' }}>
          <Row gutter={16} style={{ minWidth: 1000 }}>
            {filteredColumns.map(column => (
              <Col key={column.id} flex={1} style={{ minWidth: 250 }}>
                <Card
                  title={
                    <Space>
                      <Text strong>{column.title}</Text>
                      <Tag>{column.cards.length}</Tag>
                    </Space>
                  }
                  extra={
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<PlusOutlined />}
                      onClick={() => message.info(`Add new task to ${column.title}`)}
                    />
                  }
                  style={{ 
                    height: 'calc(100vh - 300px)',
                    backgroundColor: column.color,
                    border: '1px solid #e8e8e8'
                  }}
                  bodyStyle={{ 
                    padding: 8, 
                    height: 'calc(100% - 57px)', 
                    overflowY: 'auto' 
                  }}
                >
                  {column.cards.map(renderCard)}
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Advanced Filter Drawer */}
        <Drawer
          title="Advanced Filters"
          placement="right"
          onClose={() => setAdvancedFilterVisible(false)}
          visible={advancedFilterVisible}
          width={400}
          extra={
            <Space>
              <Button onClick={() => setAdvancedFilterVisible(false)}>Cancel</Button>
              <Button type="primary" onClick={handleAdvancedFilter}>
                Apply Filters
              </Button>
            </Space>
          }
        >
          <Form form={filterForm} layout="vertical">
            <Form.Item name="title" label="Title/Description">
              <Input placeholder="Search in title or description..." />
            </Form.Item>

            <Form.Item name="assignee" label="Assignee">
              <Select placeholder="Select assignee" allowClear>
                <Option value="John Doe">John Doe</Option>
                <Option value="Jane Smith">Jane Smith</Option>
                <Option value="Mike Johnson">Mike Johnson</Option>
                <Option value="Sarah Wilson">Sarah Wilson</Option>
                <Option value="Alex Chen">Alex Chen</Option>
              </Select>
            </Form.Item>

            <Form.Item name="department" label="Department">
              <Select placeholder="Select department" allowClear>
                <Option value="Engineering">Engineering</Option>
                <Option value="Design">Design</Option>
                <Option value="Marketing">Marketing</Option>
                <Option value="Sales">Sales</Option>
                <Option value="HR">HR</Option>
              </Select>
            </Form.Item>

            <Form.Item name="priority" label="Priority">
              <Select placeholder="Select priority" allowClear>
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
                <Option value="urgent">Urgent</Option>
              </Select>
            </Form.Item>

            <Form.Item name="dateRange" label="Due Date Range">
              <DatePicker.RangePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="tags" label="Tags">
              <Select mode="multiple" placeholder="Select tags" allowClear>
                <Option value="Frontend">Frontend</Option>
                <Option value="Backend">Backend</Option>
                <Option value="API">API</Option>
                <Option value="UI/UX">UI/UX</Option>
                <Option value="Database">Database</Option>
                <Option value="Testing">Testing</Option>
                <Option value="Bug">Bug</Option>
                <Option value="Feature">Feature</Option>
              </Select>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </ViewContainer>
  );
};