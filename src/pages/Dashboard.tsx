import React, { useMemo } from 'react';
import { Card, Row, Col, Typography, Table, Badge, Button, Space, Statistic } from 'antd';
import {
  SettingOutlined,
  AlertOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  DatabaseOutlined,
  ToolOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';
import {
  PieChart, Pie, Cell,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { downtimeRecords, actionRecords, pmSchedules, tbmSchedules, machines, pmCompletions, tbmCompletions } = useDataContext();
  const navigate = useNavigate();

  // Advanced Statistics Calculations
  const stats = useMemo(() => {
    const openDowntime = downtimeRecords.filter(d => d.status === 'Open').length;
    const closedDowntime = downtimeRecords.filter(d => d.status === 'Closed').length;

    const pmPending = pmSchedules.filter(p => p.status !== 'Completed').length;
    const pmCompleted = pmCompletions.length;
    const tbmCompleted = tbmCompletions.length;

    const totalRequests = downtimeRecords.length + pmSchedules.length + tbmSchedules.length;
    const totalCompleted = closedDowntime + pmCompleted + tbmCompleted;
    const completionRate = totalRequests ? Math.round((totalCompleted / totalRequests) * 100) : 0;

    return {
      totalMachines: machines.length,
      openDowntime,
      pmPending,
      completionRate,
    };
  }, [downtimeRecords, pmSchedules, tbmSchedules, machines, pmCompletions, tbmCompletions]);

  // Chart Data: Pie (Downtime Status)
  const pieData = [
    { name: 'Open', value: downtimeRecords.filter(d => d.status === 'Open').length },
    { name: 'In Progress', value: downtimeRecords.filter(d => d.status === 'In Progress').length },
    { name: 'Closed', value: downtimeRecords.filter(d => d.status === 'Closed').length },
  ].filter(d => d.value > 0);

  // Chart Data: Line (Activities Over Time)
  const lineData = useMemo(() => {
    const datesMap: Record<string, number> = {};
    actionRecords.forEach(action => {
      const d = dayjs(action.actionDateTime).format('MMM DD');
      datesMap[d] = (datesMap[d] || 0) + 1;
    });
    const sortedDates = Object.keys(datesMap)
      .sort((a, b) => dayjs(a, 'MMM DD').valueOf() - dayjs(b, 'MMM DD').valueOf())
      .slice(-7);
    
    return sortedDates.map(date => ({
      date,
      actions: datesMap[date],
    }));
  }, [actionRecords]);

  // Recent Activities
  const recentActivities = actionRecords
    .slice()
    .sort((a, b) => dayjs(b.actionDateTime).diff(dayjs(a.actionDateTime)))
    .slice(0, 10)
    .map((action, index) => ({
      key: String(index),
      activity: `${action.actionNumber}: ${action.actionTaken}`,
      machine: action.machine,
      owner: action.maintenanceEngineer,
      status: action.status,
      time: dayjs(action.actionDateTime).format('MMM DD, HH:mm'),
    }));

  const activityColumns = [
    { title: 'Time', dataIndex: 'time', key: 'time', render: (text: string) => <Text type="secondary">{text}</Text> },
    { title: 'Machine', dataIndex: 'machine', key: 'machine', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Engineer', dataIndex: 'owner', key: 'owner' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Closed' ? 'green' : status === 'Open' ? 'red' : status === 'In Progress' ? 'orange' : 'cyan';
        return <Badge color={color} text={status} />;
      },
    },
    { title: 'Action', dataIndex: 'activity', key: 'activity' },
  ];

  return (
    <div style={{ padding: '24px 32px 32px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Dashboard</Title>
        </Col>
        <Col>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => navigate('/downtime-entry')}>+ New</Button>
            <Button icon={<ToolOutlined />} size="small" onClick={() => navigate('/pm-schedule')}>PM</Button>
            <Button icon={<DatabaseOutlined />} size="small" onClick={() => navigate('/masters/machine')}>Machine</Button>
            <Button icon={<UnorderedListOutlined />} size="small" onClick={() => navigate('/actiontaken-entry')}>Logs</Button>
          </Space>
        </Col>
      </Row>

      {/* Primary KPI Overview (4 Cards Only) */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic title="Total Machines" value={stats.totalMachines} prefix={<SettingOutlined />} valueStyle={{ color: '#0f172a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic title="Open Downtime" value={stats.openDowntime} prefix={<AlertOutlined />} valueStyle={{ color: '#e11d48' }} />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic title="PM Pending" value={stats.pmPending} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#ea580c' }} />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic title="Completion Rate" value={stats.completionRate} suffix="%" valueStyle={{ color: '#16a34a' }} />
          </Card>
        </Col>
      </Row>

      {/* Streamlined Executive Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Maintenance Trends (Last 7 Days)" bordered={false} style={{ height: 320 }}>
            {lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={lineData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="actions" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: 260, alignItems: 'center', justifyContent: 'center' }}><Text type="secondary">No trend data available</Text></div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Downtime Status" bordered={false} style={{ height: 320 }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Open' ? '#e11d48' : entry.name === 'In Progress' ? '#ea580c' : '#16a34a'} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: 260, alignItems: 'center', justifyContent: 'center' }}><Text type="secondary">No status data available</Text></div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Card title="Recent Activities" bordered={false}>
        <Table
          dataSource={recentActivities}
          columns={activityColumns}
          pagination={{ pageSize: 8 }}
          size="small"
          rowClassName={(_, index) => index % 2 === 0 ? '' : 'table-row-zebra'}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
