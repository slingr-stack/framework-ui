import { Card, Row, Col, Statistic, Progress, Typography, Space } from 'antd';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  DollarOutlined,
  RiseOutlined,
  TrophyOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { ViewContainer } from '../components/ViewContainer';
import type { ViewComponent } from '../types/view';

const { Text } = Typography;

export const DashboardView: ViewComponent = ({ config }) => {
  return (
    <ViewContainer config={config}>
      <div style={{ padding: 16 }}>
        <Row gutter={[16, 16]}>
          {/* Statistics Cards */}
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={11280}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Sales"
                value={11.28}
                precision={2}
                valueStyle={{ color: '#1890ff' }}
                prefix={<DollarOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Orders"
                value={112893}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Growth"
                value={9.3}
                precision={1}
                valueStyle={{ color: '#cf1322' }}
                prefix={<RiseOutlined />}
                suffix="%"
              />
            </Card>
          </Col>

          {/* Progress and Charts */}
          <Col xs={24} lg={12}>
            <Card title="Performance Overview" style={{ height: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                  <Text strong>Server Performance</Text>
                  <Progress percent={78} status="active" />
                </div>
                <div>
                  <Text strong>Database Load</Text>
                  <Progress percent={60} strokeColor="#52c41a" />
                </div>
                <div>
                  <Text strong>Memory Usage</Text>
                  <Progress percent={45} strokeColor="#faad14" />
                </div>
                <div>
                  <Text strong>Network</Text>
                  <Progress percent={85} strokeColor="#1890ff" />
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Team Activity" style={{ height: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <TrophyOutlined style={{ color: '#faad14' }} />
                    <Text strong>Top Performer</Text>
                  </Space>
                  <Text>Sarah Chen</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <TeamOutlined style={{ color: '#1890ff' }} />
                    <Text strong>Active Teams</Text>
                  </Space>
                  <Text>12</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <UserOutlined style={{ color: '#52c41a' }} />
                    <Text strong>Online Now</Text>
                  </Space>
                  <Text>247 users</Text>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Activity Feed */}
          <Col span={24}>
            <Card title="Recent Activity">
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <Text strong>John Doe</Text> <Text type="secondary">created a new project</Text>
                    <div><Text type="secondary" style={{ fontSize: 12 }}>2 minutes ago</Text></div>
                  </div>
                  <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <Text strong>Sarah Chen</Text> <Text type="secondary">completed 5 tasks</Text>
                    <div><Text type="secondary" style={{ fontSize: 12 }}>15 minutes ago</Text></div>
                  </div>
                  <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <Text strong>Mike Johnson</Text> <Text type="secondary">uploaded new files</Text>
                    <div><Text type="secondary" style={{ fontSize: 12 }}>1 hour ago</Text></div>
                  </div>
                  <div style={{ padding: '8px 0' }}>
                    <Text strong>System</Text> <Text type="secondary">Backup completed successfully</Text>
                    <div><Text type="secondary" style={{ fontSize: 12 }}>2 hours ago</Text></div>
                  </div>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </ViewContainer>
  );
};