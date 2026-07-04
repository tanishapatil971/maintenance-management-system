import React from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';
import { usePersistentState } from '../utils/persistence';

interface Authorization {
  id: number;
  role: string;
  permission: string;
  notes: string;
}

const columns: TableColumnType<Authorization>[] = [
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Permission', dataIndex: 'permission', key: 'permission' },
  { title: 'Notes', dataIndex: 'notes', key: 'notes' },
];

const initialAuthorizations: Authorization[] = [
  { id: 1, role: 'Admin', permission: 'Full access', notes: 'Manage users, assets and settings.' },
  { id: 2, role: 'Manager', permission: 'Review and approve', notes: 'Approve downtime and PM schedules.' },
  { id: 3, role: 'Operator', permission: 'Execute tasks', notes: 'Complete assigned work orders and logs.' },
  { id: 4, role: 'Viewer', permission: 'Read only', notes: 'View dashboards and reports without editing.' },
];

const AuthorizationMaster: React.FC = () => {
  const [items, setItems] = usePersistentState<Authorization[]>('maintenance-authorization-master', initialAuthorizations);
  return (
    <MasterPage<Authorization>
      title="Authorization Master"
      description="Configure authorization roles and permissions for plant operations."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="Authorization"
    />
  );
};

export default AuthorizationMaster;
