import React, { useMemo } from 'react';
import { Card, Row, Col, Typography, Statistic } from 'antd';
import {
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDataContext } from '../context/DataContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';

const { Title, Text } = Typography;
const COLORS = ['#e11d48', '#ea580c', '#16a34a', '#2563eb', '#8b5cf6'];

const Analytics: React.FC = () => {
  const { downtimeRecords, pmSchedules, tbmSchedules, machines, pmCompletions, tbmCompletions } = useDataContext();

  // Advanced Statistics Calculations
  const stats = useMemo(() => {
    const openDowntime = downtimeRecords.filter(d => d.status === 'Open').length;
    const inProgressDowntime = downtimeRecords.filter(d => d.status === 'In Progress').length;
    const closedDowntime = downtimeRecords.filter(d => d.status === 'Closed').length;

    const pmCompleted = pmCompletions.length;
    const tbmCompleted = tbmCompletions.length;

    let totalResolutionTimeHours = 0;
    const closedRecords = downtimeRecords.filter(d => d.status === 'Closed' && d.endDateTime);
    closedRecords.forEach(d => {
      totalResolutionTimeHours += dayjs(d.endDateTime).diff(dayjs(d.startDateTime), 'hour', true);
    });
    const avgResolutionTime = closedRecords.length ? (totalResolutionTimeHours / closedRecords.length).toFixed(1) : '0.0';

    const totalRequests = downtimeRecords.length + pmSchedules.length + tbmSchedules.length;
    const totalCompleted = closedDowntime + pmCompleted + tbmCompleted;
    const completionRate = totalRequests ? Math.round((totalCompleted / totalRequests) * 100) : 0;

    return {
      activeMachines: machines.length - openDowntime - inProgressDowntime,
      closedDowntime,
      pmCompleted,
      avgResolutionTime,
      totalRequests,
      completionRate,
      pendingPercentage: 100 - completionRate,
    };
  }, [downtimeRecords, pmSchedules, tbmSchedules, machines, pmCompletions, tbmCompletions]);

  // Chart Data: Bar (Maintenance Type)
  const barData = [
    { name: 'Breakdown', count: downtimeRecords.length },
    { name: 'PM', count: pmSchedules.length },
    { name: 'TBM', count: tbmSchedules.length },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Analytics</Title>
        </Col>
      </Row>

      {/* Deep Metrics Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic title="Active Machines" value={stats.activeMachines} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#16a34a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic title="Closed Downtime" value={stats.closedDowntime} prefix={<SafetyCertificateOutlined />} valueStyle={{ color: '#16a34a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic title="PM Completed" value={stats.pmCompleted} prefix={<SafetyCertificateOutlined />} valueStyle={{ color: '#0d9488' }} />
          </Card>
        </Col>
      </Row>

      {/* Quick Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card bordered={false}>
            <Statistic title="Avg Resolution Time" value={stats.avgResolutionTime} suffix="hrs" valueStyle={{ color: '#2563eb' }} prefix={<FieldTimeOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false}>
            <Statistic title="Total Work Requests" value={stats.totalRequests} valueStyle={{ color: '#0f172a' }} prefix={<BarChartOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false}>
            <Statistic title="Pending Rate" value={stats.pendingPercentage} suffix="%" valueStyle={{ color: '#f97316' }} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* Distribution Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card title="Maintenance Distribution" bordered={false} style={{ height: 420 }}>
            {barData.some(d => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={barData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <RechartsTooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {barData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: 320, alignItems: 'center', justifyContent: 'center' }}><Text type="secondary">No data available</Text></div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
