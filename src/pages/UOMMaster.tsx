import React, { useState } from 'react';
import { CrudTable } from '../components/CrudTable';
import type { TableColumnType } from 'antd';

interface UOM {
  id: number;
  unit: string;
  description: string;
}

const columns: TableColumnType<UOM>[] = [
  { title: 'Unit', dataIndex: 'unit', key: 'unit' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
];

const UOMMaster: React.FC = () => {
  const [items, setItems] = useState<UOM[]>([]);
  return <CrudTable<UOM> items={items} setItems={setItems} columns={columns} entityName="UOM" />;
};

export default UOMMaster;
