import React, { useState } from 'react';
import { CrudTable } from '../components/CrudTable';
import type { TableColumnType } from 'antd';

interface SubElement {
  id: number;
  name: string;
  description: string;
}

const columns: TableColumnType<SubElement>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
];

const SubElementMaster: React.FC = () => {
  const [items, setItems] = useState<SubElement[]>([]);
  return <CrudTable<SubElement> items={items} setItems={setItems} columns={columns} entityName="Sub Element" />;
};

export default SubElementMaster;
