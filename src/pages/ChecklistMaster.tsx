import React from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';
import { usePersistentState } from '../utils/persistence';

interface Checklist {
  id: number;
  name: string;
  frequency: string;
  owner: string;
}

const columns: TableColumnType<Checklist>[] = [
  { title: 'Checklist', dataIndex: 'name', key: 'name' },
  { title: 'Frequency', dataIndex: 'frequency', key: 'frequency' },
  { title: 'Owner', dataIndex: 'owner', key: 'owner' },
];

const initialChecklists: Checklist[] = [
  { id: 1, name: 'Daily equipment inspection', frequency: 'Daily', owner: 'Maintenance' },
  { id: 2, name: 'Lubrication review', frequency: 'Weekly', owner: 'Reliability' },
  { id: 3, name: 'Safety audit', frequency: 'Monthly', owner: 'Safety team' },
  { id: 4, name: 'Calibration review', frequency: 'Quarterly', owner: 'Calibration' },
];

const ChecklistMaster: React.FC = () => {
  const [items, setItems] = usePersistentState<Checklist[]>('maintenance-checklist-master', initialChecklists);
  return (
    <MasterPage<Checklist>
      title="Checklist Master"
      description="Manage standard checklists used by maintenance and inspection teams."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="Checklist"
    />
  );
};

export default ChecklistMaster;
