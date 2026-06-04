import React, { useState } from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';

interface PMScheduleEntryRecord {
  id: number;
  machine: string;
  scheduledDate: string;
  category: string;
  assignedTo: string;
}

const columns: TableColumnType<PMScheduleEntryRecord>[] = [
  { title: 'Machine', dataIndex: 'machine', key: 'machine' },
  { title: 'Scheduled Date', dataIndex: 'scheduledDate', key: 'scheduledDate' },
  { title: 'Category', dataIndex: 'category', key: 'category' },
  { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo' },
];

const initialRecords: PMScheduleEntryRecord[] = [
  { id: 1, machine: 'Cooling Tower', scheduledDate: '2026-06-10', category: 'Preventive', assignedTo: 'Arjun Singh' },
  { id: 2, machine: 'Conveyor A', scheduledDate: '2026-06-12', category: 'Inspection', assignedTo: 'Priya Rao' },
  { id: 3, machine: 'Pump Station 3', scheduledDate: '2026-06-14', category: 'Lubrication', assignedTo: 'Sahil Mehta' },
];

const PMScheduleEntry: React.FC = () => {
  const [items, setItems] = useState<PMScheduleEntryRecord[]>(initialRecords);
  return (
    <MasterPage<PMScheduleEntryRecord>
      title="PM Schedule Entry"
      description="Plan upcoming preventive maintenance from the centralized schedule."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="PM Schedule"
    />
  );
};

export default PMScheduleEntry;
