import React from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import type { TableColumnType } from 'antd';

interface CrudTableProps<T extends { id: number }> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  columns: TableColumnType<T>[];
  entityName: string;
}

export function CrudTable<T extends { id: number }>(props: CrudTableProps<T>) {
  const { items, setItems, columns, entityName } = props;
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<T | null>(null);
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
      // update existing
      setItems(prev => prev.map(it => (it.id === editingItem.id ? { ...editingItem, ...values } : it)));
    } else {
      // add new
      const newItem = { id: Date.now(), ...values } as T;
      setItems(prev => [...prev, newItem]);
    }
    setIsModalVisible(false);
  };

  const mergedColumns: TableColumnType<T>[] = [
    ...columns,
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: T) => (
        <Button type="link" onClick={() => showEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  // Dynamically generate form items based on column dataIndex (excluding id)
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
      <Button type="primary" onClick={showAdd} style={{ marginBottom: 16 }}>
        Add {entityName}
      </Button>
      <Table dataSource={items} columns={mergedColumns} rowKey="id" />
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
