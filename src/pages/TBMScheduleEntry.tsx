import React, { useState } from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';

interface TBMScheduleEntryRecord {
  id: number;
  machine: string;
  plannedDate: string;
  cycle: string;
  owner: string;
}

const columns: TableColumnType<TBMScheduleEntryRecord>[] = [
  { title: 'Machine', dataIndex: 'machine', key: 'machine' },
  { title: 'Planned Date', dataIndex: 'plannedDate', key: 'plannedDate' },
  { title: 'Cycle', dataIndex: 'cycle', key: 'cycle' },
  { title: 'Owner', dataIndex: 'owner', key: 'owner' },
];

const initialRecords: TBMScheduleEntryRecord[] = [
  { id: 1, machine: 'Pump Station 3', plannedDate: '2026-06-08', cycle: '12 months', owner: 'Priya Rao' },
  { id: 2, machine: 'Press Unit 14', plannedDate: '2026-06-15', cycle: '6 months', owner: 'Rohan Verma' },
  { id: 3, machine: 'Cooling Tower', plannedDate: '2026-06-22', cycle: '12 months', owner: 'Sahil Mehta' },
];

const TBMScheduleEntry: React.FC = () => {
  const [items, setItems] = useState<TBMScheduleEntryRecord[]>(initialRecords);
  return (
    <MasterPage<TBMScheduleEntryRecord>
      title="TBM Schedule Entry"
      description="Plan time-based maintenance tasks and keep track of scheduled cycles."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="TBM Schedule"
    />
  );
};

export default TBMScheduleEntry;
