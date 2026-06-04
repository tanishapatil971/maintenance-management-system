import React from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import type { TableColumnType } from 'antd';
import { useAuth } from '../context/useAuth';

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
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<T | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [form] = Form.useForm();

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

  const handleOk = async () => {
    const values = await form.validateFields();
    if (editingItem) {
      setItems(prev => prev.map(it => (it.id === editingItem.id ? { ...editingItem, ...values } : it)));
    } else {
      const newItem = { id: Date.now(), ...values } as T;
      setItems(prev => [...prev, newItem]);
    }
    setIsModalVisible(false);
  };

  const actionColumn: TableColumnType<T> = {
    title: 'Actions',
    key: 'actions',
    width: 120,
    render: (_: unknown, record: T) => (
      <Button type="link" onClick={() => showEdit(record)}>
        Edit
      </Button>
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
    .map(col => (
      <Form.Item
        key={col.key as string}
        name={col.dataIndex as string}
        label={(col.title as string) ?? String(col.dataIndex)}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    ));

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
        {!isViewer && (
          <Button type="primary" onClick={showAdd}>
            Add {entityName}
          </Button>
        )}
      </div>
      <Table
        dataSource={filteredItems}
        columns={tableColumns}
        rowKey="id"
        pagination={{ pageSize: 8 }}
        bordered
      />
      <Modal
        title={editingItem ? `Edit ${entityName}` : `Add ${entityName}`}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          {formItems}
        </Form>
      </Modal>
    </div>
  );
}
