import React, { useState } from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';

interface DownTimeEntryRecord {
  id: number;
  machine: string;
  startedAt: string;
  duration: string;
  status: string;
}

const columns: TableColumnType<DownTimeEntryRecord>[] = [
  { title: 'Machine', dataIndex: 'machine', key: 'machine' },
  { title: 'Started At', dataIndex: 'startedAt', key: 'startedAt' },
  { title: 'Duration', dataIndex: 'duration', key: 'duration' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

const initialRecords: DownTimeEntryRecord[] = [
  { id: 1, machine: 'Pump Station 3', startedAt: '2026-06-02 10:20', duration: '2h 45m', status: 'Open' },
  { id: 2, machine: 'Press Unit 14', startedAt: '2026-06-01 16:10', duration: '1h 05m', status: 'Closed' },
  { id: 3, machine: 'Conveyor A', startedAt: '2026-06-03 09:30', duration: '30m', status: 'Open' },
  { id: 4, machine: 'Cooling Tower', startedAt: '2026-05-31 14:00', duration: '3h 20m', status: 'Closed' },
];

const DownTimeEntry: React.FC = () => {
  const [items, setItems] = useState<DownTimeEntryRecord[]>(initialRecords);
  return (
    <MasterPage<DownTimeEntryRecord>
      title="Down Time Entry"
      description="Record downtime events and track resolution status for critical assets."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="Downtime Entry"
    />
  );
};

export default DownTimeEntry;
