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
  message,
  Space,
  Drawer,
  Row,
  Col,
  Tag,
} from 'antd';
import type { TableColumnType } from 'antd';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';

dayjs.extend(duration);

const { Title, Text } = Typography;
const { Search } = Input;

// Mock data from masters
const machines = [
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
  const { downtimeRecords, setDowntimeRecords, getActionsByTicket, deleteDowntimeRecord } = useDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [actionHistoryRecord, setActionHistoryRecord] = useState<DownTimeRecord | null>(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DownTimeRecord | null>(null);
  const [form] = Form.useForm();

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

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      const selectedMachine = machines.find(m => m.id === values.machine);
      const startDateTime = values.startDateTime.format('YYYY-MM-DD HH:mm:ss');
      const endDateTime = values.endDateTime ? values.endDateTime.format('YYYY-MM-DD HH:mm:ss') : '';
      const calculatedDuration = calculateDuration(startDateTime, endDateTime);

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
        message.success('Down Time record updated successfully');
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
        message.success('Down Time record created successfully');
      }
      closeDrawer();
    } catch (error) {
      message.error('Please check all required fields');
    }
  };

  const handleDelete = (record: DownTimeRecord) => {
    deleteDowntimeRecord(record.id);
    message.success('Record deleted successfully');
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
              <Button type="link" danger size="small">
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
        <Text type="secondary">
          Record and track machinery downtime incidents with automated ticket generation and status workflow management.
        </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Badge color="orange" text="" style={{ marginRight: 8 }} />
            <Title level={3} style={{ margin: '8px 0 0' }}>
              {openCount}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Open Downtime
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Badge color="blue" text="" style={{ marginRight: 8 }} />
            <Title level={3} style={{ margin: '8px 0 0' }}>
              {inProgressCount}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              In Progress
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Badge color="green" text="" style={{ marginRight: 8 }} />
            <Title level={3} style={{ margin: '8px 0 0' }}>
              {closedCount}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Closed Downtime
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Title level={3} style={{ margin: '0' }}>
              {downtimeRecords.length}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Total Records
            </Text>
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 24, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}>
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
          {canEdit && (
            <Button type="primary" onClick={() => openDrawer()}>
              + New Down Time
            </Button>
          )}
        </div>

        <Table
          dataSource={filteredRecords}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          bordered
          scroll={{ x: 1400 }}
        />
      </Card>

      <Drawer
        title={editingRecord ? 'Edit Down Time Record' : 'New Down Time Record'}
        placement="right"
        onClose={closeDrawer}
        open={isDrawerVisible}
        width={500}
        extra={
          <Space>
            <Button onClick={closeDrawer}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>
              {editingRecord ? 'Update' : 'Create'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            name="machine"
            label="Machine"
            rules={[{ required: true, message: 'Please select a machine' }]}
          >
            <Select
              placeholder="Select machine"
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
            <DatePicker showTime format="DD/MM/YYYY HH:mm" />
          </Form.Item>

          <Form.Item
            name="endDateTime"
            label="End Date & Time"
          >
            <DatePicker showTime format="DD/MM/YYYY HH:mm" />
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
