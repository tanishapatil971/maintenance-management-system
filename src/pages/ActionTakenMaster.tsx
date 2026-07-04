import React from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';
import { usePersistentState } from '../utils/persistence';

interface ActionTaken {
  id: number;
  action: string;
  technician: string;
  effectiveness: string;
}

const columns: TableColumnType<ActionTaken>[] = [
  { title: 'Action', dataIndex: 'action', key: 'action' },
  { title: 'Technician', dataIndex: 'technician', key: 'technician' },
  { title: 'Effectiveness', dataIndex: 'effectiveness', key: 'effectiveness' },
];

const initialActions: ActionTaken[] = [
  { id: 1, action: 'Replaced hydraulic seal', technician: 'Sanjay Kumar', effectiveness: 'High' },
  { id: 2, action: 'Rewired control panel', technician: 'Anita Desai', effectiveness: 'Medium' },
  { id: 3, action: 'Adjusted conveyor tension', technician: 'Neha Sharma', effectiveness: 'High' },
  { id: 4, action: 'Performed filter change', technician: 'Rohan Verma', effectiveness: 'High' },
];

const ActionTakenMaster: React.FC = () => {
  const [items, setItems] = usePersistentState<ActionTaken[]>('maintenance-actiontaken-master', initialActions);
  return (
    <MasterPage<ActionTaken>
      title="Action Taken Master"
      description="Track corrective and preventive actions recorded by the maintenance team."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="Action Taken"
    />
  );
};

export default ActionTakenMaster;
