import React, { useState } from 'react';
import { Card, Typography, Table, Button, Drawer, Form, Select, DatePicker, Input, Space, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useAuth } from '../context/useAuth';
import { useDataContext } from '../context/DataContext';

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
  const [form] = Form.useForm();

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
        message.success('PM schedule updated');
      } else {
        addPMSchedule({ ...payload, machine });
        message.success('PM schedule created');
      }
      close();
    } catch (e) {
      message.error('Please complete required fields');
    }
  };

  const handleDelete = (id: number) => {
    deletePMSchedule(id);
    message.success('PM schedule deleted');
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
              <Button type="link" danger>Delete</Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  const upcomingCount = pmSchedules.filter(s => dayjs(s.nextDueDate).isAfter(dayjs(), 'day')).length;
  const overdueCount = pmSchedules.filter(s => dayjs(s.nextDueDate).isBefore(dayjs(), 'day')).length;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>PM Schedule Entry</Title>
        <Text type="secondary">Plan and manage preventive maintenance schedules.</Text>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Text strong>Upcoming:</Text>
          <Text>{upcomingCount}</Text>
          <Text strong>Overdue:</Text>
          <Text>{overdueCount}</Text>
        </Space>
      </Card>

      <Card>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <Input.Search placeholder="Search machine" onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
          {canEdit && <Button type="primary" onClick={openNew}>+ New PM</Button>}
        </div>
        <Table dataSource={filtered} columns={columns} rowKey="id" />
      </Card>

      <Drawer title={editing ? 'Edit PM Schedule' : 'New PM Schedule'} open={isDrawerOpen} onClose={close} width={520}>
        <Form form={form} layout="vertical">
          <Form.Item name="machineId" label="Machine" rules={[{ required: true }]}>
            <Select options={machines.map(m => ({ label: m.name, value: m.id }))} />
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
          <Space style={{ marginTop: 12 }}>
            <Button onClick={close}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </Space>
        </Form>
      </Drawer>
    </div>
  );
};

export default PMScheduleEntry;
