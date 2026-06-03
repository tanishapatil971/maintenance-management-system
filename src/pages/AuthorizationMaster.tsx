import React, { useState } from 'react';
import { CrudTable } from '../components/CrudTable';
import type { TableColumnType } from 'antd';

interface Authorization {
  id: number;
  role: string;
  description: string;
}

const columns: TableColumnType<Authorization>[] = [
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
];

const AuthorizationMaster: React.FC = () => {
  const [items, setItems] = useState<Authorization[]>([]);
  return <CrudTable<Authorization> items={items} setItems={setItems} columns={columns} entityName="Authorization" />;
};

export default AuthorizationMaster;
