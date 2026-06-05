import React, { useMemo } from 'react';
import { Card, Row, Col, Typography, Table, Badge } from 'antd';
import dayjs from 'dayjs';
import { useDataContext } from '../context/DataContext';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { downtimeRecords, actionRecords, pmSchedules, tbmSchedules } = useDataContext();

  const metrics = useMemo(() => {
    const openCount = downtimeRecords.filter(d => d.status === 'Open').length;
    const closedCount = downtimeRecords.filter(d => d.status === 'Closed').length;
    const inProgressCount = downtimeRecords.filter(d => d.status === 'In Progress').length;

    const openActions = actionRecords.filter(a => a.status === 'Open').length;
    const resolvedActions = actionRecords.filter(a => a.status === 'Resolved' || a.status === 'Closed').length;

    const pmUpcoming = pmSchedules.filter(p => dayjs(p.nextDueDate).isAfter(dayjs(), 'day')).length;
    const pmOverdue = pmSchedules.filter(p => dayjs(p.nextDueDate).isBefore(dayjs(), 'day')).length;
    const tbmUpcoming = tbmSchedules.filter(t => dayjs(t.nextDueDate).isAfter(dayjs(), 'day')).length;
    const tbmOverdue = tbmSchedules.filter(t => dayjs(t.nextDueDate).isBefore(dayjs(), 'day')).length;

    return {
      openDowntime: openCount,
      closedDowntime: closedCount,
      inProgressDowntime: inProgressCount,
      openActions,
      resolvedActions,
      pmUpcoming,
      pmOverdue,
      tbmUpcoming,
      tbmOverdue,
    };
  }, [downtimeRecords, actionRecords, pmSchedules, tbmSchedules]);

  const kpiMetrics = [
    { key: 'open-downtime', label: 'Open Downtime', value: metrics.openDowntime, color: 'orange' },
    { key: 'in-progress-downtime', label: 'In Progress', value: metrics.inProgressDowntime, color: 'cyan' },
    { key: 'closed-downtime', label: 'Closed Downtime', value: metrics.closedDowntime, color: 'green' },
    { key: 'open-actions', label: 'Open Actions', value: metrics.openActions, color: 'orange' },
    { key: 'resolved-actions', label: 'Resolved Actions', value: metrics.resolvedActions, color: 'green' },
    { key: 'pm-upcoming', label: 'PM Upcoming', value: metrics.pmUpcoming, color: 'blue' },
    { key: 'pm-overdue', label: 'PM Overdue', value: metrics.pmOverdue, color: 'red' },
    { key: 'tbm-upcoming', label: 'TBM Upcoming', value: metrics.tbmUpcoming, color: 'blue' },
    { key: 'tbm-overdue', label: 'TBM Overdue', value: metrics.tbmOverdue, color: 'red' },
    { key: 'total-downtime', label: 'Downtime Tickets', value: downtimeRecords.length, color: 'purple' },
  ];

  const recentActivities = actionRecords
    .slice()
    .sort((a, b) => dayjs(b.actionDateTime).diff(dayjs(a.actionDateTime)))
    .slice(0, 4)
    .map((action, index) => ({
      key: String(index),
      activity: `${action.actionNumber} on ${action.ticketNumber}: ${action.actionTaken}`,
      owner: action.maintenanceEngineer,
      status: action.status,
      time: dayjs(action.actionDateTime).format('DD/MM/YYYY HH:mm'),
    }));

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
