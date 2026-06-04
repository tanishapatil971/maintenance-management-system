import React from 'react';
import { Card, Row, Col, Typography, Table, Badge } from 'antd';

const { Title, Text } = Typography;

const kpiMetrics = [
  { key: 'total-machines', label: 'Total Machines', value: 248, color: 'blue' },
  { key: 'active-machines', label: 'Active Machines', value: 198, color: 'green' },
  { key: 'open-downtime', label: 'Open Downtime', value: 18, color: 'orange' },
  { key: 'closed-downtime', label: 'Closed Downtime', value: 34, color: 'purple' },
  { key: 'pm-due', label: 'PM Due', value: 12, color: 'red' },
  { key: 'pm-completed', label: 'PM Completed', value: 76, color: 'cyan' },
];

const recentActivities = [
  {
    key: '1',
    activity: 'Created Downtime log for Machine B-24',
    owner: 'Riya Patel',
    status: 'Open',
    time: '12 mins ago',
  },
  {
    key: '2',
    activity: 'Completed PM inspection for Press Unit 14',
    owner: 'Arjun Singh',
    status: 'Completed',
    time: '45 mins ago',
  },
  {
    key: '3',
    activity: 'Assigned action taken review to maintenance team',
    owner: 'Priya Rao',
    status: 'Pending',
    time: '1 hr ago',
  },
  {
    key: '4',
    activity: 'Updated scheduled maintenance for Conveyor A',
    owner: 'Sanjay Kumar',
    status: 'In Progress',
    time: '2 hrs ago',
  },
];

const activityColumns = [
  { title: 'Activity', dataIndex: 'activity', key: 'activity' },
  { title: 'Owner', dataIndex: 'owner', key: 'owner' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const color = status === 'Completed' ? 'green' : status === 'Open' ? 'orange' : 'red';
      return <Badge color={color} text={status} />;
    },
  },
  { title: 'Time', dataIndex: 'time', key: 'time' },
];

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>Dashboard</Title>
        <Text type="secondary">Executive overview of plant maintenance operations and performance metrics.</Text>
      </div>

      <Row gutter={[24, 24]}>
        {kpiMetrics.map(metric => (
          <Col xs={24} sm={12} md={12} lg={8} xl={4} key={metric.key}>
            <Card bordered={false} className="metric-card" style={{ borderRadius: 20 }}>
              <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 1.1 }}>
                {metric.label}
              </Text>
              <Title level={2} style={{ margin: '16px 0 0', color: '#0f172a' }}>
                {metric.value}
              </Title>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} xl={16}>
          <Card bordered={false} className="metric-card" style={{ borderRadius: 24 }}>
            <Title level={4}>Maintenance insights</Title>
            <Text type="secondary">Review real-time maintenance work and ensure the right issues are prioritized.</Text>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>
              <Card type="inner" title="Production Availability" bordered={false} style={{ borderRadius: 20 }}>
                <Title level={3} style={{ margin: 0 }}>94%</Title>
                <Text type="secondary">Equipment uptime across key production lines.</Text>
              </Card>
              <Card type="inner" title="PM Compliance" bordered={false} style={{ borderRadius: 20 }}>
                <Title level={3} style={{ margin: 0 }}>88%</Title>
                <Text type="secondary">Completed preventive maintenance tasks on schedule.</Text>
              </Card>
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card bordered={false} className="metric-card" style={{ borderRadius: 24, minHeight: 260 }}>
            <Title level={4}>Safety & response</Title>
            <Text type="secondary">Monitor response time and critical alerts in the plant.</Text>
            <div style={{ marginTop: 24 }}>
              <Text strong>MTTR</Text>
              <Title level={3} style={{ margin: '10px 0 0' }}>4.2 hrs</Title>
              <Text strong>Critical tickets</Text>
              <Title level={3} style={{ margin: '10px 0 0' }}>5</Title>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card bordered={false} className="metric-card" style={{ borderRadius: 24 }}>
            <Title level={4}>Recent activity</Title>
            <Table columns={activityColumns} dataSource={recentActivities} pagination={{ pageSize: 4 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
