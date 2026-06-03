import React, { useState } from 'react';
import { CrudTable } from '../components/CrudTable';
import type { TableColumnType } from 'antd';

interface Spare {
  id: number;
  partNumber: string;
  description: string;
}

const columns: TableColumnType<Spare>[] = [
  { title: 'Part Number', dataIndex: 'partNumber', key: 'partNumber' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
];

const SpareMaster: React.FC = () => {
  const [items, setItems] = useState<Spare[]>([]);
  return <CrudTable<Spare> items={items} setItems={setItems} columns={columns} entityName="Spare" />;
};

export default SpareMaster;
