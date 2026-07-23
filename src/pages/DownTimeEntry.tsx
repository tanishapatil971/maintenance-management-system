import React, { useState, useCallback } from 'react';
import {
  Card,
  Typography,
  Table,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Badge,
  Popconfirm,
  Space,
  Drawer,
  Row,
  Col,
  Tag,
  App,
} from 'antd';
import type { TableColumnType } from 'antd';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { DownloadOutlined } from '@ant-design/icons';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';
import { exportToCSV } from '../utils/export';

dayjs.extend(duration);

const { Title, Text } = Typography;
const { Search } = Input;

// Fallback machines used until persisted master data is available
const defaultMachines = [
  { id: 1, name: 'Press Unit 14', department: 'Production' },
  { id: 2, name: 'Conveyor A', department: 'Material Handling' },
  { id: 3, name: 'Pump Station 3', department: 'Fluid Systems' },
  { id: 4, name: 'Cooling Tower', department: 'Utilities' },
];

const downTimeReasons = [
  { id: 1, reason: 'Mechanical failure' },
  { id: 2, reason: 'Electrical fault' },
  { id: 3, reason: 'Hydraulic system issue' },
  { id: 4, reason: 'Sensor malfunction' },
  { id: 5, reason: 'Scheduled maintenance' },
  { id: 6, reason: 'Routine inspection' },
  { id: 7, reason: 'Part replacement' },
  { id: 8, reason: 'System recalibration' },
];

const departments = [
  { id: 1, name: 'Production' },
  { id: 2, name: 'Material Handling' },
  { id: 3, name: 'Fluid Systems' },
  { id: 4, name: 'Utilities' },
];

interface DownTimeRecord {
  id: number;
  ticketNumber: string;
  machine: string;
  machineId: number;
  department: string;
  downTimeReason: string;
  startDateTime: string;
  endDateTime: string;
  duration: string;
  status: 'Open' | 'In Progress' | 'Closed';
  remarks: string;
}

const generateTicketNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `DT-${dayjs().format('YYYYMMDD')}-${timestamp.slice(-3)}${random}`;
};

const calculateDuration = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return '00:00:00';
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  if (!start.isValid() || !end.isValid()) return '00:00:00';
  
  const diff = end.diff(start);
  const dur = dayjs.duration(diff);
  const hours = Math.floor(dur.asHours());
  const mins = dur.minutes();
  const secs = dur.seconds();
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open':
      return 'orange';
    case 'In Progress':
      return 'blue';
    case 'Closed':
      return 'green';
    default:
      return 'default';
  }
};

const DownTimeEntry: React.FC = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { downtimeRecords, setDowntimeRecords, getActionsByTicket, deleteDowntimeRecord, machines: contextMachines } = useDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [actionHistoryRecord, setActionHistoryRecord] = useState<DownTimeRecord | null>(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DownTimeRecord | null>(null);
  const [form] = Form.useForm();
  const [loading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { notification } = App.useApp();
  const machines = contextMachines.length ? contextMachines : defaultMachines;

  const openActionHistory = (record: DownTimeRecord) => {
    setActionHistoryRecord(record);
    setIsHistoryVisible(true);
  };

  const closeActionHistory = () => {
    setActionHistoryRecord(null);
    setIsHistoryVisible(false);
  };

  const isViewer = role === 'viewer';
  const isMaintenanceEngineer = role === 'manager';
  const isAdmin = role === 'admin';
  const canEdit = isMaintenanceEngineer || isAdmin;
  const canDelete = isAdmin;

  const openDrawer = useCallback((record?: DownTimeRecord) => {
    if (record) {
      setEditingRecord(record);
      form.setFieldsValue({
        machine: record.machineId,
        department: record.department,
        downTimeReason: record.downTimeReason,
        startDateTime: dayjs(record.startDateTime),
        endDateTime: record.endDateTime ? dayjs(record.endDateTime) : null,
        status: record.status,
        remarks: record.remarks,
      });
    } else {
      setEditingRecord(null);
      form.resetFields();
    }
    setIsDrawerVisible(true);
  }, [form]);

  const closeDrawer = () => {
    setIsDrawerVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleMachineChange = (machineId: number) => {
    const selectedMachine = machines.find(m => m.id === machineId);
    form.setFieldsValue({ department: selectedMachine?.department || '' });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      setSubmitting(true);
      await new Promise(res => setTimeout(res, 400));
      
      const selectedMachine = machines.find(m => m.id === values.machine);
      const startDateTime = values.startDateTime.format('YYYY-MM-DD HH:mm:ss');
      const endDateTime = values.endDateTime ? values.endDateTime.format('YYYY-MM-DD HH:mm:ss') : '';
      const calculatedDuration = calculateDuration(startDateTime, endDateTime);

      if (values.endDateTime && values.startDateTime.isAfter(values.endDateTime)) {
        notification.error({ message: 'Validation Error', description: 'End date and time cannot be earlier than start date and time' });
        setSubmitting(false);
        return;
      }

      if (values.status === 'Closed' && !values.endDateTime) {
        notification.error({ message: 'Validation Error', description: 'Please set an end date and time before closing the ticket' });
        setSubmitting(false);
        return;
      }

      if (editingRecord) {
        setDowntimeRecords(prev =>
          prev.map(rec =>
            rec.id === editingRecord.id
              ? {
                  ...rec,
                  machine: selectedMachine?.name || '',
                  machineId: values.machine,
                  department: selectedMachine?.department || values.department,
                  downTimeReason: values.downTimeReason,
                  startDateTime,
                  endDateTime,
                  duration: calculatedDuration,
                  status: values.status,
                  remarks: values.remarks,
                }
              : rec
          )
        );
        notification.success({ message: 'Update Successful', description: `Downtime ticket updated and marked as ${values.status}` });
      } else {
        const newRecord: DownTimeRecord = {
          id: Date.now(),
          ticketNumber: generateTicketNumber(),
          machine: selectedMachine?.name || '',
          machineId: values.machine,
          department: selectedMachine?.department || values.department,
          downTimeReason: values.downTimeReason,
          startDateTime,
          endDateTime,
          duration: calculatedDuration,
          status: values.status || 'Open',
          remarks: values.remarks,
        };
        setDowntimeRecords(prev => [newRecord, ...prev]);
        notification.success({ message: 'Create Successful', description: `Downtime ticket created and marked as ${values.status || 'Open'}` });
      }
      setSubmitting(false);
      closeDrawer();
    } catch (error) {
      notification.error({ message: 'Validation Error', description: 'Please check all required fields' });
      setSubmitting(false);
    }
  };

  const handleDelete = async (record: DownTimeRecord) => {
    setDeletingId(record.id);
    await new Promise(res => setTimeout(res, 400));
    deleteDowntimeRecord(record.id);
    setDeletingId(null);
    notification.success({ message: 'Delete Successful', description: 'Record deleted successfully' });
  };

  const filteredRecords = downtimeRecords.filter(record => {
    const matchesSearch =
      !searchTerm ||
      record.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.machine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.downTimeReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.remarks.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = !filterStatus || record.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const columns: TableColumnType<DownTimeRecord>[] = [
    {
      title: 'Ticket Number',
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      width: 140,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Machine',
      dataIndex: 'machine',
      key: 'machine',
      width: 150,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 130,
    },
    {
      title: 'Reason',
      dataIndex: 'downTimeReason',
      key: 'downTimeReason',
      width: 160,
    },
    {
      title: 'Start Date & Time',
      dataIndex: 'startDateTime',
      key: 'startDateTime',
      width: 170,
      render: (text: string) => dayjs(text).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'End Date & Time',
      dataIndex: 'endDateTime',
      key: 'endDateTime',
      width: 170,
      render: (text: string) => (text ? dayjs(text).format('DD/MM/YYYY HH:mm') : '-'),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => <Badge color={getStatusColor(status)} text={status} />,
    },
    {
      title: 'Linked Actions',
      key: 'linkedActions',
      width: 120,
      render: (_: unknown, record: DownTimeRecord) => {
        const actionCount = getActionsByTicket(record.id).length;
        return <Tag color={actionCount ? 'blue' : 'default'}>{actionCount}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_: unknown, record: DownTimeRecord) => (
        <Space wrap>
          <Button type="link" size="small" onClick={() => openActionHistory(record)}>
            View Actions
          </Button>
          {canEdit && (
            <Button type="link" size="small" onClick={() => openDrawer(record)}>
              Edit
            </Button>
          )}
          {canEdit && (
            <Button
              type="link"
              size="small"
              onClick={() => navigate('/actiontaken-entry', { state: { ticketId: record.id } })}
            >
              Add Action
            </Button>
          )}
          {canDelete && (
            <Popconfirm
              title="Delete this record?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button type="link" danger size="small" loading={deletingId === record.id} disabled={deletingId === record.id}>
                Delete
              </Button>
            </Popconfirm>
          )}
          {isViewer && <Text type="secondary">View only</Text>}
        </Space>
      ),
    },
  ];

  const openCount = downtimeRecords.filter(r => r.status === 'Open').length;
  const inProgressCount = downtimeRecords.filter(r => r.status === 'In Progress').length;
  const closedCount = downtimeRecords.filter(r => r.status === 'Closed').length;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          Down Time Entry
        </Title>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>Open Downtime</Text>
              <Badge status="warning" />
            </div>
            <Title level={4} style={{ margin: '8px 0 0', fontWeight: 700 }}>{openCount}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #2563eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>In Progress</Text>
              <Badge status="processing" />
            </div>
            <Title level={4} style={{ margin: '8px 0 0', fontWeight: 700 }}>{inProgressCount}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>Closed Downtime</Text>
              <Badge status="success" />
            </div>
            <Title level={4} style={{ margin: '8px 0 0', fontWeight: 700 }}>{closedCount}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #64748b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>Total Records</Text>
              <Badge status="default" />
            </div>
            <Title level={4} style={{ margin: '8px 0 0', fontWeight: 700 }}>{downtimeRecords.length}</Title>
          </Card>
        </Col>
      </Row>

      <Card bordered={false}>
        <div style={{ marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Search
            placeholder="Search by ticket, machine, reason..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            allowClear
            style={{ flex: 1, minWidth: 200 }}
          />
          <Select
            placeholder="Filter by status"
            value={filterStatus}
            onChange={setFilterStatus}
            allowClear
            style={{ minWidth: 150 }}
            options={[
              { label: 'Open', value: 'Open' },
              { label: 'In Progress', value: 'In Progress' },
              { label: 'Closed', value: 'Closed' },
            ]}
          />
          <Space wrap>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                const exportData = filteredRecords.map(r => ({
                  Ticket_Number: r.ticketNumber,
                  Machine: r.machine,
                  Breakdown_Reason: r.downTimeReason,
                  Status: r.status,
                  Start_Time: r.startDateTime,
                  End_Time: r.endDateTime || '',
                  Duration: r.endDateTime ? dayjs(r.endDateTime).diff(dayjs(r.startDateTime), 'minute') + ' mins' : '',
                }));
                exportToCSV(exportData, 'downtime_report.csv');
              }}
            >
              Export CSV
            </Button>
            {canEdit && (
              <Button type="primary" onClick={() => openDrawer()}>
                + New Down Time
              </Button>
            )}
          </Space>
        </div>

        <Table
          loading={loading}
          dataSource={filteredRecords}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          size="middle"
          rowClassName={(_, index) => index % 2 === 0 ? '' : 'table-row-zebra'}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Drawer
        title={editingRecord ? 'Edit Down Time Record' : 'New Down Time Record'}
        placement="right"
        onClose={closeDrawer}
        open={isDrawerVisible}
        width={500}
        destroyOnClose
        extra={
          <Space>
            <Button onClick={closeDrawer} disabled={submitting}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()} loading={submitting}>
              {editingRecord ? 'Update' : 'Create'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }} onFinish={handleSave}>
          <Form.Item
            name="machine"
            label="Machine"
            rules={[{ required: true, message: 'Please select a machine' }]}
          >
            <Select
              autoFocus
              disabled={submitting}
              placeholder="Select machine"
              onChange={handleMachineChange}
              options={machines.map(m => ({
                label: m.name,
                value: m.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please select department' }]}
          >
            <Select
              placeholder="Select department"
              options={departments.map(d => ({
                label: d.name,
                value: d.name,
              }))}
              disabled
            />
          </Form.Item>

          <Form.Item
            name="downTimeReason"
            label="Down Time Reason"
            rules={[{ required: true, message: 'Please select a reason' }]}
          >
            <Select
              placeholder="Select reason"
              options={downTimeReasons.map(r => ({
                label: r.reason,
                value: r.reason,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="startDateTime"
            label="Start Date & Time"
            rules={[{ required: true, message: 'Please select start date and time' }]}
          >
            <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="endDateTime"
            label="End Date & Time"
          >
            <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select
              placeholder="Select status"
              options={[
                { label: 'Open', value: 'Open' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Closed', value: 'Closed' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="remarks"
            label="Remarks"
            rules={[{ required: true, message: 'Please enter remarks' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter additional remarks..." />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title={actionHistoryRecord ? `Action History - ${actionHistoryRecord.ticketNumber}` : 'Action History'}
        placement="right"
        onClose={closeActionHistory}
        open={isHistoryVisible}
        width={520}
      >
        {actionHistoryRecord ? (
          <div style={{ display: 'grid', gap: 16 }}>
            <Text strong>Machine</Text>
            <Text>{actionHistoryRecord.machine}</Text>
            <Text strong>Status</Text>
            <Badge color={getStatusColor(actionHistoryRecord.status)} text={actionHistoryRecord.status} />

            <Text strong>Linked actions</Text>
            <div>
              {getActionsByTicket(actionHistoryRecord.id).map(action => (
                <Card key={action.id} size="small" style={{ marginBottom: 12 }}>
                  <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                    <Text strong>{action.actionNumber}</Text>
                    <Badge
                      color={action.status === 'Closed' ? 'green' : action.status === 'Open' ? 'orange' : 'cyan'}
                      text={action.status}
                    />
                  </Row>
                  <Text strong>When</Text>
                  <p>{dayjs(action.actionDateTime).format('DD/MM/YYYY HH:mm')}</p>
                  <Text strong>Action Taken</Text>
                  <p>{action.actionTaken}</p>
                  <Text strong>Root Cause</Text>
                  <p>{action.rootCause}</p>
                  <Text strong>Corrective Action</Text>
                  <p>{action.correctiveAction}</p>
                  <Text strong>Preventive Action</Text>
                  <p>{action.preventiveAction}</p>
                </Card>
              ))}
              {!getActionsByTicket(actionHistoryRecord.id).length && (
                <Text type="secondary">No actions have been logged against this ticket yet.</Text>
              )}
            </div>
          </div>
        ) : (
          <Text type="secondary">Select a ticket to view its action history.</Text>
        )}
      </Drawer>
    </div>
  );
};

export default DownTimeEntry;
