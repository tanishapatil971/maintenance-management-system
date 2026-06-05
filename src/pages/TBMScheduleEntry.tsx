import React, { useState } from 'react';
import { Card, Typography, Table, Button, Drawer, Form, Select, DatePicker, Input, Space, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useAuth } from '../context/useAuth';
import { useDataContext } from '../context/DataContext';

const { Title, Text } = Typography;

const cycleOptions = [
  { label: '1 month', value: 1 },
  { label: '3 months', value: 3 },
  { label: '6 months', value: 6 },
  { label: '12 months', value: 12 },
];

const TBMScheduleEntry: React.FC = () => {
  const { role } = useAuth();
  const { tbmSchedules, addTBMSchedule, updateTBMSchedule, deleteTBMSchedule, machines } = useDataContext();
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
      plannedDate: dayjs(record.plannedDate),
      cycleMonths: record.cycleMonths || 12,
      owner: record.owner,
      remarks: record.remarks,
    });
    setIsDrawerOpen(true);
  };

  const close = () => {
    setIsDrawerOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const vals = await form.validateFields();
      const machine = machines.find(m => m.id === vals.machineId);
      const planned = vals.plannedDate.format('YYYY-MM-DD');
      const nextDue = dayjs(planned).add(vals.cycleMonths, 'month').format('YYYY-MM-DD');
      const payload: any = {
        machineId: vals.machineId,
        plannedDate: planned,
        cycleMonths: vals.cycleMonths,
        owner: vals.owner,
        remarks: vals.remarks || '',
      };

      if (editing) {
        const updated = { ...editing, ...payload, nextDueDate: nextDue, machine: machine?.name || editing.machine };
        updateTBMSchedule(updated);
        message.success('TBM schedule updated');
      } else {
        addTBMSchedule({ ...payload, nextDueDate: nextDue });
        message.success('TBM schedule created');
      }
      close();
    } catch (e) {
      message.error('Please complete required fields');
    }
  };

  const handleDelete = (id: number) => {
    deleteTBMSchedule(id);
    message.success('TBM schedule deleted');
  };

  const filtered = tbmSchedules.filter(s => !search || s.machine.toLowerCase().includes(search.toLowerCase()));

  const columns: ColumnsType<any> = [
    { title: 'Machine', dataIndex: 'machine', key: 'machine' },
    { title: 'Planned', dataIndex: 'plannedDate', key: 'plannedDate' },
    { title: 'Cycle (months)', dataIndex: 'cycleMonths', key: 'cycleMonths' },
    { title: 'Next Due', dataIndex: 'nextDueDate', key: 'nextDueDate' },
    { title: 'Owner', dataIndex: 'owner', key: 'owner' },
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

  const upcomingCount = tbmSchedules.filter(s => dayjs(s.nextDueDate).isAfter(dayjs(), 'day')).length;
  const overdueCount = tbmSchedules.filter(s => dayjs(s.nextDueDate).isBefore(dayjs(), 'day')).length;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>TBM Schedule Entry</Title>
        <Text type="secondary">Manage time-based maintenance cycles and inspections.</Text>
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
          {canEdit && <Button type="primary" onClick={openNew}>+ New TBM</Button>}
        </div>
        <Table dataSource={filtered} columns={columns} rowKey="id" />
      </Card>

      <Drawer title={editing ? 'Edit TBM Schedule' : 'New TBM Schedule'} open={isDrawerOpen} onClose={close} width={520}>
        <Form form={form} layout="vertical">
          <Form.Item name="machineId" label="Machine" rules={[{ required: true }]}>
            <Select options={machines.map(m => ({ label: m.name, value: m.id }))} />
          </Form.Item>
          <Form.Item name="plannedDate" label="Planned Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="cycleMonths" label="Cycle (months)" rules={[{ required: true }]}>
            <Select options={cycleOptions} />
          </Form.Item>
          <Form.Item name="owner" label="Owner" rules={[{ required: true }]}>
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

export default TBMScheduleEntry;
