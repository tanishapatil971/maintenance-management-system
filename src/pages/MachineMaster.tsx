import React, { useState } from 'react';
import { CrudTable } from '../components/CrudTable';
import type { TableColumnType } from 'antd';

interface Machine {
  id: number;
  name: string;
  model: string;
  serialNumber: string;
}

const columns: TableColumnType<Machine>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Model', dataIndex: 'model', key: 'model' },
  { title: 'Serial Number', dataIndex: 'serialNumber', key: 'serialNumber' },
];

const MachineMaster: React.FC = () => {
  const [items, setItems] = useState<Machine[]>([]);
  return <CrudTable<Machine> items={items} setItems={setItems} columns={columns} entityName="Machine" />;
};

export default MachineMaster;
