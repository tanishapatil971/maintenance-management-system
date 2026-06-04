import React, { useState } from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
}

const columns: TableColumnType<User>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Department', dataIndex: 'department', key: 'department' },
];

const initialUsers: User[] = [
  { id: 1, name: 'Riya Patel', email: 'riya.patel@probitytech.com', role: 'Manager', department: 'Maintenance' },
  { id: 2, name: 'Arjun Singh', email: 'arjun.singh@probitytech.com', role: 'Operator', department: 'Production' },
  { id: 3, name: 'Priya Rao', email: 'priya.rao@probitytech.com', role: 'Admin', department: 'Quality' },
  { id: 4, name: 'Sahil Mehta', email: 'sahil.mehta@probitytech.com', role: 'Viewer', department: 'Logistics' },
];

const UserMaster: React.FC = () => {
  const [items, setItems] = useState<User[]>(initialUsers);
  return (
    <MasterPage<User>
      title="User Master"
      description="Manage user accounts and access assignments for maintenance and production teams."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="User"
    />
  );
};

export default UserMaster;
