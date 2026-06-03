import React, { useState } from 'react';
import { CrudTable } from '../components/CrudTable';
import type { TableColumnType } from 'antd';

interface Checklist {
  id: number;
  name: string;
  description: string;
}

const columns: TableColumnType<Checklist>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
];

const ChecklistMaster: React.FC = () => {
  const [items, setItems] = useState<Checklist[]>([]);
  return <CrudTable<Checklist> items={items} setItems={setItems} columns={columns} entityName="Checklist" />;
};

export default ChecklistMaster;
