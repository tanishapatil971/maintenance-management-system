import React, { useMemo } from 'react';
import { Card, Row, Col, Typography, Table, Badge } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// Mock downtime data from Down Time Entry
const downTimeData = [
  {
    id: 1,
    ticketNumber: 'DT-20260601-001',
    machine: 'Press Unit 14',
    department: 'Production',
    startDateTime: '2026-06-01 08:30:00',
    status: 'Closed',
  },
  {
    id: 2,
    ticketNumber: 'DT-20260602-002',
    machine: 'Pump Station 3',
    department: 'Fluid Systems',
    startDateTime: '2026-06-02 14:20:00',
    status: 'In Progress',
  },
  {
    id: 3,
    ticketNumber: 'DT-20260603-003',
    machine: 'Conveyor A',
    department: 'Material Handling',
    startDateTime: '2026-06-03 11:00:00',
    status: 'Open',
  },
  {
    id: 4,
    ticketNumber: 'DT-20260604-004',
    machine: 'Cooling Tower',
    department: 'Utilities',
    startDateTime: '2026-06-04 09:00:00',
    status: 'Closed',
  },
];

const Dashboard: React.FC = () => {
  // Calculate metrics from downtime data
  const metrics = useMemo(() => {
    const openCount = downTimeData.filter(d => d.status === 'Open').length;
    const closedCount = downTimeData.filter(d => d.status === 'Closed').length;
    const inProgressCount = downTimeData.filter(d => d.status === 'In Progress').length;
    
    return {
      openDowntime: openCount,
      closedDowntime: closedCount,
      inProgressDowntime: inProgressCount,
    };
  }, []);

  const kpiMetrics = [
    { key: 'total-machines', label: 'Total Machines', value: 248, color: 'blue' },
    { key: 'active-machines', label: 'Active Machines', value: 198, color: 'green' },
    { key: 'open-downtime', label: 'Open Downtime', value: metrics.openDowntime, color: 'orange' },
    { key: 'closed-downtime', label: 'Closed Downtime', value: metrics.closedDowntime, color: 'purple' },
    { key: 'in-progress-downtime', label: 'In Progress', value: metrics.inProgressDowntime, color: 'cyan' },
    { key: 'pm-due', label: 'PM Due', value: 12, color: 'red' },
  ];

  // Recent downtime activities
  const recentActivities = [
    {
      key: '1',
      activity: `Opened downtime ticket ${downTimeData[2].ticketNumber} for ${downTimeData[2].machine}`,
      owner: 'Riya Patel',
      status: 'Open',
      time: '2 hours ago',
    },
    {
      key: '2',
      activity: `In progress: ${downTimeData[1].ticketNumber} - ${downTimeData[1].machine}`,
      owner: 'Arjun Singh',
      status: 'In Progress',
      time: '4 hours ago',
    },
    {
      key: '3',
      activity: `Closed downtime ticket ${downTimeData[0].ticketNumber}`,
      owner: 'Priya Rao',
      status: 'Closed',
      time: '1 day ago',
    },
    {
      key: '4',
      activity: `Closed downtime ticket ${downTimeData[3].ticketNumber}`,
      owner: 'Sanjay Kumar',
      status: 'Closed',
      time: '1 day ago',
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
        const color = status === 'Closed' ? 'green' : status === 'Open' ? 'orange' : 'cyan';
        return <Badge color={color} text={status} />;
      },
    },
    { title: 'Time', dataIndex: 'time', key: 'time' },
  ];

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
