import React, { useState } from 'react';
import CrudTable from '../components/CrudTable';
import { TableColumnType } from 'antd';

interface User {
  id: number;
  name: string;
  email: string;
}

const columns: TableColumnType<User>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
];

const UserMaster: React.FC = () => {
  const [items, setItems] = useState<User[]>([]);
  return <CrudTable<User> items={items} setItems={setItems} columns={columns} entityName="User" />;
};

export default UserMaster;
