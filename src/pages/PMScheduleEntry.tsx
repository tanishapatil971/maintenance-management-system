import React, { useState } from 'react';
import { Card, Typography, Table, Button, Drawer, Form, Select, DatePicker, Input, Space, Popconfirm, Row, Col, Badge, App } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { DownloadOutlined } from '@ant-design/icons';
import { useAuth } from '../context/useAuth';
import { useDataContext } from '../context/DataContext';
import { exportToCSV } from '../utils/export';

const { Title, Text } = Typography;

const frequencyOptions = [
  { label: 'Daily', value: 'Daily' },
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Quarterly', value: 'Quarterly' },
  { label: 'Yearly', value: 'Yearly' },
];

const PMScheduleEntry: React.FC = () => {
  const { role } = useAuth();
  const { pmSchedules, addPMSchedule, updatePMSchedule, deletePMSchedule, machines } = useDataContext();
  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const { notification } = App.useApp();

  const canEdit = role === 'manager' || role === 'admin';
  const canDelete = role === 'admin';

  const openNew = () => {
    setEditing(null);
    form.resetFields();
    setIsDrawerOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue({
      machineId: machines.find(m => m.name === record.machine)?.id || record.machineId,
      scheduledDate: dayjs(record.scheduledDate),
      frequency: record.frequency,
      assignedTo: record.assignedTo,
      remarks: record.remarks,
    });
    setIsDrawerOpen(true);
  };

  const close = () => {
    setIsDrawerOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const computeNextDue = (dateStr: string, frequency: string) => {
    const d = dayjs(dateStr);
    switch (frequency) {
      case 'Daily': return d.add(1, 'day').format('YYYY-MM-DD');
      case 'Weekly': return d.add(1, 'week').format('YYYY-MM-DD');
      case 'Monthly': return d.add(1, 'month').format('YYYY-MM-DD');
      case 'Quarterly': return d.add(3, 'month').format('YYYY-MM-DD');
      case 'Yearly': return d.add(1, 'year').format('YYYY-MM-DD');
      default: return d.add(1, 'month').format('YYYY-MM-DD');
    }
  };

  const handleSave = async () => {
    try {
      const vals = await form.validateFields();
      setSubmitting(true);
      await new Promise(res => setTimeout(res, 400));
      const machine = machines.find(m => m.id === vals.machineId);
      const payload = {
        machineId: vals.machineId,
        scheduledDate: vals.scheduledDate.format('YYYY-MM-DD'),
        frequency: vals.frequency,
        assignedTo: vals.assignedTo,
        remarks: vals.remarks || '',
        nextDueDate: computeNextDue(vals.scheduledDate.format('YYYY-MM-DD'), vals.frequency),
      } as any;

      if (editing) {
        const updated = { ...editing, ...payload, machine: machine?.name || editing.machine };
        updatePMSchedule(updated);
        notification.success({ message: 'Update Successful', description: 'PM schedule updated successfully' });
      } else {
        addPMSchedule({ ...payload, machine });
        notification.success({ message: 'Create Successful', description: 'PM schedule created successfully' });
      }
      setSubmitting(false);
      close();
    } catch (e) {
      notification.error({ message: 'Validation Error', description: 'Please complete required fields' });
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await new Promise(res => setTimeout(res, 400));
    deletePMSchedule(id);
    setDeletingId(null);
    notification.success({ message: 'Delete Successful', description: 'PM schedule deleted successfully' });
  };

  const filtered = pmSchedules.filter(s => !search || s.machine.toLowerCase().includes(search.toLowerCase()));

  const columns: ColumnsType<any> = [
    { title: 'Machine', dataIndex: 'machine', key: 'machine' },
    { title: 'Scheduled', dataIndex: 'scheduledDate', key: 'scheduledDate' },
    { title: 'Frequency', dataIndex: 'frequency', key: 'frequency' },
    { title: 'Next Due', dataIndex: 'nextDueDate', key: 'nextDueDate' },
    { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions', key: 'actions', render: (_: any, rec: any) => (
        <Space>
          {canEdit && <Button type="link" onClick={() => openEdit(rec)}>Edit</Button>}
          {canDelete && (
            <Popconfirm title="Delete schedule?" onConfirm={() => handleDelete(rec.id)}>
              <Button type="link" danger loading={deletingId === rec.id} disabled={deletingId === rec.id}>Delete</Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  const upcomingCount = pmSchedules.filter(s => dayjs(s.nextDueDate).isAfter(dayjs(), 'day')).length;
  const overdueCount = pmSchedules.filter(s => dayjs(s.nextDueDate).isBefore(dayjs(), 'day')).length;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 700 }}>PM Schedule Entry</Title>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #2563eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>Upcoming PMs</Text>
              <Badge status="processing" />
            </div>
            <Title level={4} style={{ margin: '8px 0 0', fontWeight: 700 }}>{upcomingCount}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>Overdue PMs</Text>
              <Badge status="error" />
            </div>
            <Title level={4} style={{ margin: '8px 0 0', fontWeight: 700 }}>{overdueCount}</Title>
          </Card>
        </Col>
      </Row>

      <Card bordered={false}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <Input.Search placeholder="Search machine..." onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                const exportData = filtered.map(r => ({
                  Machine: r.machine,
                  Frequency: r.frequency,
                  Scheduled_Date: dayjs(r.scheduledDate).format('YYYY-MM-DD'),
                  Next_Due_Date: dayjs(r.nextDueDate).format('YYYY-MM-DD'),
                  Assigned_To: r.assignedTo,
                  Status: r.status,
                }));
                exportToCSV(exportData, 'pm_schedule_report.csv');
              }}
            >
              Export CSV
            </Button>
            {canEdit && <Button type="primary" onClick={openNew}>+ New PM</Button>}
          </Space>
        </div>
        <Table
          loading={loading}
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          size="middle"
          rowClassName={(_, index) => index % 2 === 0 ? '' : 'table-row-zebra'}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Drawer
        title={editing ? 'Edit PM Schedule' : 'New PM Schedule'}
        open={isDrawerOpen}
        onClose={close}
        width={400}
        destroyOnClose
        extra={
          <Space>
            <Button onClick={close} disabled={submitting}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()} loading={submitting}>Save</Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="machineId" label="Machine" rules={[{ required: true }]}>
            <Select autoFocus disabled={submitting} options={machines.map(m => ({ label: m.name, value: m.id }))} />
          </Form.Item>
          <Form.Item name="scheduledDate" label="Scheduled Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="frequency" label="Frequency" rules={[{ required: true }]}>
            <Select options={frequencyOptions} />
          </Form.Item>
          <Form.Item name="assignedTo" label="Assigned To" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default PMScheduleEntry;
