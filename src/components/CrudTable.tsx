import React from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, App, Space } from 'antd';
import type { TableColumnType } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useAuth } from '../context/useAuth';
import { exportToCSV } from '../utils/export';

const { Search } = Input;

interface CrudTableProps<T extends { id: number }> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  columns: TableColumnType<T>[];
  entityName: string;
}

export function CrudTable<T extends { id: number }>(props: CrudTableProps<T>) {
  const { items, setItems, columns, entityName } = props;
  const { role } = useAuth();
  const isViewer = role === 'viewer';
  const isAdmin = role === 'admin';
  const isMaintenance = role === 'manager';
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<T | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [form] = Form.useForm();
  const { notification } = App.useApp();

  const showAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEdit = (record: T) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => setIsModalVisible(false);

  const handleOk = async (values: any) => {
    setSubmitting(true);
    // Simulate API delay
    await new Promise(res => setTimeout(res, 400));
    
    if (editingItem) {
      setItems(prev => prev.map(it => (it.id === editingItem.id ? { ...editingItem, ...values } : it)));
      notification.success({ message: 'Update Successful', description: `${entityName} has been updated successfully.` });
    } else {
      const newItem = { id: Date.now(), ...values } as T;
      setItems(prev => [...prev, newItem]);
      notification.success({ message: 'Create Successful', description: `${entityName} has been created successfully.` });
    }
    setSubmitting(false);
    setIsModalVisible(false);
  };

  const handleDelete = async (record: T) => {
    setDeletingId((record as any).id);
    // Simulate API delay
    await new Promise(res => setTimeout(res, 400));
    setItems(prev => prev.filter(it => it.id !== (record as any).id));
    setDeletingId(null);
    notification.success({ message: 'Delete Successful', description: `${entityName} has been deleted successfully.` });
  };

  const actionColumn: TableColumnType<T> = {
    title: 'Actions',
    key: 'actions',
    width: 160,
    render: (_: unknown, record: T) => (
      <div style={{ display: 'flex', gap: 8 }}>
        {(isAdmin || isMaintenance) && (
          <Button type="link" onClick={() => showEdit(record)}>
            Edit
          </Button>
        )}
        {isAdmin && (
          <Popconfirm title={`Delete this ${entityName}?`} onConfirm={() => handleDelete(record)} okText="Delete" cancelText="Cancel">
            <Button type="link" danger loading={deletingId === (record as any).id} disabled={deletingId === (record as any).id}>
              Delete
            </Button>
          </Popconfirm>
        )}
      </div>
    ),
  };

  const filteredItems = items.filter(item => {
    const filterText = searchTerm.trim().toLowerCase();
    if (!filterText) return true;
    return columns.some(col => {
      const dataIndex = col.dataIndex as keyof T;
      const value = item[dataIndex];
      return value !== undefined && value !== null && String(value).toLowerCase().includes(filterText);
    });
  });

  const tableColumns: TableColumnType<T>[] = isViewer ? columns : [...columns, actionColumn];

  const formItems = columns
    .filter(col => col.dataIndex && col.dataIndex !== 'id')
    .map((col, index) => {
      const name = col.dataIndex as string;
      const label = (col.title as string) ?? name;
      const rules: any[] = [
        { required: true, message: `${label} is required` },
      ];

      // Add uniqueness validator for common identifier fields
      if (name.toLowerCase() === 'code' || name.toLowerCase() === 'name' || name.toLowerCase() === 'email') {
        rules.push({
          validator: async (_: any, value: any) => {
            if (!value) return Promise.resolve();
            const duplicate = items.some(it => {
              if (editingItem && (it as any).id === (editingItem as any).id) return false;
              const field = (it as any)[name];
              return field !== undefined && String(field).toLowerCase() === String(value).toLowerCase();
            });
            if (duplicate) return Promise.reject(new Error(`${label} already exists`));
            return Promise.resolve();
          },
        });
      }

      return (
        <Form.Item key={col.key as string} name={name} label={label} rules={rules}>
          <Input autoFocus={index === 0} disabled={submitting} />
        </Form.Item>
      );
    });

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
        <Search
          placeholder={`Search ${entityName}`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          allowClear
          style={{ minWidth: 280, flex: 1 }}
        />
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => {
              const exportData = filteredItems.map(item => {
                const row: Record<string, unknown> = {};
                columns.forEach(col => {
                  const dataIndex = col.dataIndex as string;
                  if (dataIndex) {
                    row[String(col.title ?? dataIndex)] = (item as any)[dataIndex];
                  }
                });
                return row;
              });
              exportToCSV(exportData, `${entityName.toLowerCase().replace(/\s+/g, '_')}_master.csv`);
            }}
          >
            Export CSV
          </Button>
          {(isAdmin || isMaintenance) && (
            <Button type="primary" onClick={showAdd}>
              Add {entityName}
            </Button>
          )}
        </Space>
      </div>
      <Table
        loading={loading}
        dataSource={filteredItems}
        columns={tableColumns}
        rowKey="id"
        pagination={{ pageSize: 8, showSizeChanger: true }}
        size="middle"
        rowClassName={(_, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-zebra'}
        scroll={{ x: 'max-content' }}
        sticky
      />
      <Modal
        title={editingItem ? `Edit ${entityName}` : `Add ${entityName}`}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        cancelButtonProps={{ disabled: submitting }}
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          {formItems}
        </Form>
      </Modal>
    </div>
  );
}
