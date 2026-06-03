import React, { useState } from 'react';
import { CrudTable } from '../components/CrudTable';
import type { TableColumnType } from 'antd';

interface Element {
  id: number;
  name: string;
  description: string;
}

const columns: TableColumnType<Element>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
];

const ElementMaster: React.FC = () => {
  const [items, setItems] = useState<Element[]>([]);
  return <CrudTable<Element> items={items} setItems={setItems} columns={columns} entityName="Element" />;
};

export default ElementMaster;
