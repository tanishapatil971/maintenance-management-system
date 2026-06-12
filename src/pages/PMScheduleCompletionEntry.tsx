import React from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';
import { useDataContext } from '../context/DataContext';
import type { PMScheduleCompletionRecord } from '../context/DataContext';

const columns: TableColumnType<PMScheduleCompletionRecord>[] = [
  { title: 'Machine', dataIndex: 'machine', key: 'machine' },
  { title: 'Completed Date', dataIndex: 'completedDate', key: 'completedDate' },
  { title: 'Inspection Result', dataIndex: 'inspectionResult', key: 'inspectionResult' },
  { title: 'Performed By', dataIndex: 'performedBy', key: 'performedBy' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

// Fallback initial data
const fallbackRecords: PMScheduleCompletionRecord[] = [
  { 
    id: 1, 
    scheduleId: 1,
    machine: 'Press Unit 14', 
    completedDate: '2026-06-01', 
    inspectionResult: 'Pass', 
    performedBy: 'Sanjay Kumar',
    status: 'Completed'
  },
  { 
    id: 2, 
    scheduleId: 2,
    machine: 'Conveyor A', 
    completedDate: '2026-06-02', 
    inspectionResult: 'Pass', 
    performedBy: 'Arjun Singh',
    status: 'Completed'
  },
  { 
    id: 3, 
    scheduleId: 3,
    machine: 'Cooling Tower', 
    completedDate: '2026-05-29', 
    inspectionResult: 'Fail', 
    performedBy: 'Neha Sharma',
    status: 'Delayed'
  },
];

const PMScheduleCompletionEntry: React.FC = () => {
  const { pmCompletions, setPmCompletions } = useDataContext();
  const items = pmCompletions.length ? pmCompletions : fallbackRecords;
  const setItems = setPmCompletions;

  return (
    <MasterPage<PMScheduleCompletionRecord>
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
