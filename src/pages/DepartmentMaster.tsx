import React, { useState } from 'react';
import { CrudTable } from '../components/CrudTable';
import type { TableColumnType } from 'antd';

interface Department {
  id: number;
  name: string;
  description: string;
}

const columns: TableColumnType<Department>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
];

const DepartmentMaster: React.FC = () => {
  const [items, setItems] = useState<Department[]>([]);
  return <CrudTable<Department> items={items} setItems={setItems} columns={columns} entityName="Department" />;
};

export default DepartmentMaster;
