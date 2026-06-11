import React from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';
import { useDataContext } from '../context/DataContext';

interface PMScheduleCompletionEntryRecord {
  id: number;
  machine: string;
  completedDate: string;
  result: string;
  technician: string;
}

const columns: TableColumnType<PMScheduleCompletionEntryRecord>[] = [
  { title: 'Machine', dataIndex: 'machine', key: 'machine' },
  { title: 'Completed Date', dataIndex: 'completedDate', key: 'completedDate' },
  { title: 'Result', dataIndex: 'result', key: 'result' },
  { title: 'Technician', dataIndex: 'technician', key: 'technician' },
];

// Fallback initial data if context is empty (useful for first load)
const fallbackRecords: PMScheduleCompletionEntryRecord[] = [
  { id: 1, machine: 'Press Unit 14', completedDate: '2026-06-01', result: 'Completed', technician: 'Sanjay Kumar' },
  { id: 2, machine: 'Conveyor A', completedDate: '2026-06-02', result: 'Pending', technician: 'Arjun Singh' },
  { id: 3, machine: 'Cooling Tower', completedDate: '2026-05-29', result: 'Completed', technician: 'Neha Sharma' },
];

const PMScheduleCompletionEntry: React.FC = () => {
  const { pmCompletions, setPmCompletions } = useDataContext();
  const items = pmCompletions.length ? pmCompletions : fallbackRecords;
  const setItems = setPmCompletions;

  return (
    <MasterPage<PMScheduleCompletionEntryRecord>
      title="PM Schedule Completion Entry"
      description="Capture completion results for scheduled preventive maintenance tasks."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="PM Completion"
    />
  );
};

export default PMScheduleCompletionEntry;
