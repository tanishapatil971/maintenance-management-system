import React, { useState } from 'react';
import { Card, Typography, Table, Button, Drawer, Form, Select, DatePicker, Input, Space, Popconfirm, Row, Col, Badge, App } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { DownloadOutlined } from '@ant-design/icons';
import { useAuth } from '../context/useAuth';
import { useDataContext } from '../context/DataContext';
import { exportToCSV } from '../utils/export';

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
      setSubmitting(true);
      await new Promise(res => setTimeout(res, 400));
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
        notification.success({ message: 'Update Successful', description: 'TBM schedule updated successfully' });
      } else {
        addTBMSchedule({ ...payload, nextDueDate: nextDue });
        notification.success({ message: 'Create Successful', description: 'TBM schedule created successfully' });
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
    deleteTBMSchedule(id);
    setDeletingId(null);
    notification.success({ message: 'Delete Successful', description: 'TBM schedule deleted successfully' });
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
              <Button type="link" danger loading={deletingId === rec.id} disabled={deletingId === rec.id}>Delete</Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  const upcomingCount = tbmSchedules.filter(s => dayjs(s.nextDueDate).isAfter(dayjs(), 'day')).length;
  const overdueCount = tbmSchedules.filter(s => dayjs(s.nextDueDate).isBefore(dayjs(), 'day')).length;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 700 }}>TBM Schedule Entry</Title>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #2563eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>Upcoming TBMs</Text>
              <Badge status="processing" />
            </div>
            <Title level={4} style={{ margin: '8px 0 0', fontWeight: 700 }}>{upcomingCount}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>Overdue TBMs</Text>
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
                  Cycle: r.cycle,
                  Planned_Date: dayjs(r.plannedDate).format('YYYY-MM-DD'),
                  Next_Due_Date: dayjs(r.nextDueDate).format('YYYY-MM-DD'),
                  Owner: r.owner,
                  Status: r.status,
                }));
                exportToCSV(exportData, 'tbm_schedule_report.csv');
              }}
            >
              Export CSV
            </Button>
            {canEdit && <Button type="primary" onClick={openNew}>+ New TBM</Button>}
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
        title={editing ? 'Edit TBM Schedule' : 'New TBM Schedule'}
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
          <Form.Item name="plannedDate" label="Planned Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} disabled={submitting} />
          </Form.Item>
          <Form.Item name="cycleMonths" label="Cycle (months)" rules={[{ required: true }]}>
            <Select options={cycleOptions} disabled={submitting} />
          </Form.Item>
          <Form.Item name="owner" label="Owner" rules={[{ required: true }]}>
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

export default TBMScheduleEntry;
