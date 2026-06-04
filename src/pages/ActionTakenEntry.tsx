import React, { useState } from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';

interface ActionTakenEntryRecord {
  id: number;
  machine: string;
  action: string;
  completedBy: string;
  date: string;
}

const columns: TableColumnType<ActionTakenEntryRecord>[] = [
  { title: 'Machine', dataIndex: 'machine', key: 'machine' },
  { title: 'Action', dataIndex: 'action', key: 'action' },
  { title: 'Completed By', dataIndex: 'completedBy', key: 'completedBy' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
];

const initialRecords: ActionTakenEntryRecord[] = [
  { id: 1, machine: 'Press Unit 14', action: 'Replaced hydraulic seals', completedBy: 'Sanjay Kumar', date: '2026-06-01' },
  { id: 2, machine: 'Pump Station 3', action: 'Adjusted pressure sensor', completedBy: 'Neha Sharma', date: '2026-06-02' },
  { id: 3, machine: 'Conveyor A', action: 'Realigned belt', completedBy: 'Rohan Verma', date: '2026-06-03' },
];

const ActionTakenEntry: React.FC = () => {
  const [items, setItems] = useState<ActionTakenEntryRecord[]>(initialRecords);
  return (
    <MasterPage<ActionTakenEntryRecord>
      title="Action Taken Entry"
      description="Capture completed maintenance actions and assign accountability to technicians."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="Action Taken Entry"
    />
  );
};

export default ActionTakenEntry;
