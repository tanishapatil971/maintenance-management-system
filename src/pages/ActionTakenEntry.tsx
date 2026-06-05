import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Card,
  Typography,
  Table,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  Badge,
  Popconfirm,
  message,
  Row,
  Col,
  Space,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useAuth } from '../context/useAuth';
import { useDataContext, type ActionTakenRecord } from '../context/DataContext';

const { Title, Text } = Typography;
const { Search } = Input;

const formatActionDate = (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm');

const ActionTakenEntry: React.FC = () => {
  const { role } = useAuth();
  const { downtimeRecords, actionRecords, addAction, updateAction, deleteAction, getTicketById } = useDataContext();
  const location = useLocation();
  const state = location.state as { ticketId?: number } | null;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(state?.ticketId ?? null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ActionTakenRecord | null>(null);
  const [form] = Form.useForm();

  const isViewer = role === 'viewer';
  const canEdit = role === 'manager' || role === 'admin';
  const canDelete = role === 'admin';

  useEffect(() => {
    if (state?.ticketId) {
      const ticket = getTicketById(state.ticketId);
      if (ticket) {
        setSelectedTicketId(state.ticketId);
        form.setFieldsValue({ ticketId: ticket.id, machine: ticket.machine });
      }
    }
  }, [state, getTicketById, form]);

  const actionStatusOptions = [
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Closed', value: 'Closed' },
  ];

  const openDrawer = (record?: ActionTakenRecord) => {
    if (record) {
      setEditingRecord(record);
      setSelectedTicketId(record.ticketId);
      form.setFieldsValue({
        ticketId: record.ticketId,
        machine: record.machine,
        actionTaken: record.actionTaken,
        maintenanceEngineer: record.maintenanceEngineer,
        actionDateTime: dayjs(record.actionDateTime),
        rootCause: record.rootCause,
        correctiveAction: record.correctiveAction,
        preventiveAction: record.preventiveAction,
        remarks: record.remarks,
        status: record.status,
      });
    } else {
      setEditingRecord(null);
      setSelectedTicketId(state?.ticketId ?? null);
      form.resetFields();
      if (state?.ticketId) {
        const ticket = getTicketById(state.ticketId);
        if (ticket) {
          form.setFieldsValue({ ticketId: ticket.id, machine: ticket.machine });
        }
      }
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleTicketChange = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    const ticket = getTicketById(ticketId);
    form.setFieldsValue({ machine: ticket?.machine || '' });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const ticket = getTicketById(values.ticketId);
      if (!ticket) {
        message.error('Please select a valid downtime ticket.');
        return;
      }

      const payload = {
        ticketId: ticket.id,
        actionTaken: values.actionTaken,
        maintenanceEngineer: values.maintenanceEngineer,
        actionDateTime: values.actionDateTime.format('YYYY-MM-DD HH:mm:ss'),
        rootCause: values.rootCause,
        correctiveAction: values.correctiveAction,
        preventiveAction: values.preventiveAction,
        remarks: values.remarks,
        status: values.status,
      };

      if (editingRecord) {
        updateAction({
          ...editingRecord,
          ...payload,
          ticketNumber: ticket.ticketNumber,
          machine: ticket.machine,
        });
        message.success('Action updated successfully');
      } else {
        addAction(payload);
        message.success('Action recorded successfully');
      }
      closeDrawer();
    } catch (err) {
      message.error('Please complete all required fields.');
    }
  };

  const handleDelete = (record: ActionTakenRecord) => {
    deleteAction(record.id);
    message.success('Action deleted successfully');
  };

  const filteredActions = useMemo(
    () =>
      actionRecords.filter(record => {
        const textMatch =
          !searchTerm ||
          record.actionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.machine.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.actionTaken.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.maintenanceEngineer.toLowerCase().includes(searchTerm.toLowerCase());

        const statusMatch = !filterStatus || record.status === filterStatus;
        const ticketMatch = !selectedTicketId || record.ticketId === selectedTicketId;
        return textMatch && statusMatch && ticketMatch;
      }),
    [actionRecords, filterStatus, searchTerm, selectedTicketId]
  );

  const openCount = actionRecords.filter(record => record.status === 'Open').length;
  const resolvedCount = actionRecords.filter(record => record.status === 'Resolved' || record.status === 'Closed').length;
  const inProgressCount = actionRecords.filter(record => record.status === 'In Progress').length;

  const recentMaintenanceActions = actionRecords
    .slice()
    .sort((a, b) => dayjs(b.actionDateTime).diff(dayjs(a.actionDateTime)))
    .slice(0, 5);

  const columns: ColumnsType<ActionTakenRecord> = [
    {
      title: 'Action #',
      dataIndex: 'actionNumber',
      key: 'actionNumber',
      width: 160,
      render: actionNumber => <Text strong>{actionNumber}</Text>,
    },
    {
      title: 'Ticket Number',
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      width: 180,
    },
    {
      title: 'Machine',
      dataIndex: 'machine',
      key: 'machine',
      width: 160,
    },
    {
      title: 'Maintenance Engineer',
      dataIndex: 'maintenanceEngineer',
      key: 'maintenanceEngineer',
      width: 180,
    },
    {
      title: 'Action Date & Time',
      dataIndex: 'actionDateTime',
      key: 'actionDateTime',
      width: 180,
      render: date => formatActionDate(date),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: status => {
        const color = status === 'Closed' ? 'green' : status === 'Open' ? 'orange' : 'cyan';
        return <Badge color={color} text={status} />;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_text, record) => (
        <Space>
          {canEdit && (
            <Button type="link" onClick={() => openDrawer(record)}>
              Edit
            </Button>
          )}
          {canDelete && (
            <Popconfirm
              title="Delete this action?"
              onConfirm={() => handleDelete(record)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
          )}
          {isViewer && <Text type="secondary">View only</Text>}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          Action Taken Entry
        </Title>
        <Text type="secondary">
          Capture maintenance actions linked to existing downtime tickets and preserve a complete resolution history.
        </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Badge color="orange" text="Open Actions" />
            <Title level={3} style={{ margin: '12px 0 0' }}>
              {openCount}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Badge color="blue" text="In Progress" />
            <Title level={3} style={{ margin: '12px 0 0' }}>
              {inProgressCount}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Badge color="green" text="Resolved / Closed" />
            <Title level={3} style={{ margin: '12px 0 0' }}>
              {resolvedCount}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Title level={3} style={{ margin: '12px 0 0' }}>
              {actionRecords.length}
            </Title>
            <Text type="secondary">Total maintenance actions</Text>
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 24, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}>
        <div style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <Search
            placeholder="Search action number, ticket, engineer..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            allowClear
            style={{ minWidth: 280, flex: 1 }}
          />
          <Select
            placeholder="Filter by status"
            allowClear
            value={filterStatus}
            onChange={value => setFilterStatus(value)}
            style={{ minWidth: 160 }}
            options={actionStatusOptions}
          />
          <Select
            placeholder="Filter by ticket"
            allowClear
            value={selectedTicketId ?? undefined}
            onChange={value => setSelectedTicketId(value ?? null)}
            style={{ minWidth: 240 }}
            options={downtimeRecords.map(ticket => ({
              label: `${ticket.ticketNumber} - ${ticket.machine}`,
              value: ticket.id,
            }))}
          />
          {canEdit && (
            <Button type="primary" onClick={() => openDrawer()}>
              + New Action
            </Button>
          )}
        </div>

        <Table
          dataSource={filteredActions}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true }}
          expandable={{
            expandedRowRender: record => (
              <div style={{ display: 'grid', gap: 12 }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Text strong>Root Cause</Text>
                    <p>{record.rootCause}</p>
                  </Col>
                  <Col xs={24} md={12}>
                    <Text strong>Corrective Action</Text>
                    <p>{record.correctiveAction}</p>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Text strong>Preventive Action</Text>
                    <p>{record.preventiveAction}</p>
                  </Col>
                  <Col xs={24} md={12}>
                    <Text strong>Remarks</Text>
                    <p>{record.remarks}</p>
                  </Col>
                </Row>
              </div>
            ),
          }}
        />
      </Card>

      <Drawer
        title={editingRecord ? 'Edit Maintenance Action' : 'New Maintenance Action'}
        placement="right"
        onClose={closeDrawer}
        open={isDrawerOpen}
        width={560}
        extra={
          <Space>
            <Button onClick={closeDrawer}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>
              {editingRecord ? 'Update action' : 'Record action'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            label="Down Time Ticket"
            name="ticketId"
            rules={[{ required: true, message: 'Please select a downtime ticket' }]}
          >
            <Select
              placeholder="Select downtime ticket"
              options={downtimeRecords.map(ticket => ({
                label: `${ticket.ticketNumber} — ${ticket.machine}`,
                value: ticket.id,
              }))}
              onChange={handleTicketChange}
            />
          </Form.Item>

          <Form.Item label="Machine" name="machine">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Action Taken"
            name="actionTaken"
            rules={[{ required: true, message: 'Please describe the action taken' }]}
          >
            <Input.TextArea rows={3} placeholder="Describe the maintenance action" />
          </Form.Item>

          <Form.Item
            label="Maintenance Engineer"
            name="maintenanceEngineer"
            rules={[{ required: true, message: 'Please enter the engineer name' }]}
          >
            <Input placeholder="Enter maintenance engineer" />
          </Form.Item>

          <Form.Item
            label="Action Date & Time"
            name="actionDateTime"
            rules={[{ required: true, message: 'Please select the action date' }]}
          >
            <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select options={actionStatusOptions} placeholder="Action status" />
          </Form.Item>

          <Form.Item
            label="Root Cause"
            name="rootCause"
            rules={[{ required: true, message: 'Please record the root cause' }]}
          >
            <Input.TextArea rows={2} placeholder="Root cause analysis" />
          </Form.Item>

          <Form.Item
            label="Corrective Action"
            name="correctiveAction"
            rules={[{ required: true, message: 'Please provide corrective action' }]}
          >
            <Input.TextArea rows={2} placeholder="Corrective action taken" />
          </Form.Item>

          <Form.Item
            label="Preventive Action"
            name="preventiveAction"
            rules={[{ required: true, message: 'Please provide preventive action' }]}
          >
            <Input.TextArea rows={2} placeholder="Preventive action planned" />
          </Form.Item>

          <Form.Item
            label="Remarks"
            name="remarks"
            rules={[{ required: true, message: 'Add remarks for this action' }]}
          >
            <Input.TextArea rows={2} placeholder="Additional remarks" />
          </Form.Item>
        </Form>
      </Drawer>

      <Card bordered={false} style={{ marginTop: 24, borderRadius: 24, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}>
        <Title level={4}>Recent Maintenance Actions</Title>
        <Table
          dataSource={recentMaintenanceActions}
          columns={[
            { title: 'Action #', dataIndex: 'actionNumber', key: 'actionNumber' },
            { title: 'Ticket', dataIndex: 'ticketNumber', key: 'ticketNumber' },
            { title: 'Engineer', dataIndex: 'maintenanceEngineer', key: 'maintenanceEngineer' },
            {
              title: 'When',
              dataIndex: 'actionDateTime',
              key: 'actionDateTime',
              render: date => formatActionDate(date),
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: status => {
                const color = status === 'Closed' ? 'green' : status === 'Open' ? 'orange' : 'cyan';
                return <Badge color={color} text={status} />;
              },
            },
          ]}
          pagination={false}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default ActionTakenEntry;
