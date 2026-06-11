import React from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';
import { useDataContext } from '../context/DataContext';

interface TBMScheduleCompletionEntryRecord {
  id: number;
  machine: string;
  completedDate: string;
  inspectionResult: 'Pass' | 'Fail';
  performedBy: string;
}

const columns: TableColumnType<TBMScheduleCompletionEntryRecord>[] = [
  { title: 'Machine', dataIndex: 'machine', key: 'machine' },
  { title: 'Completed Date', dataIndex: 'completedDate', key: 'completedDate' },
  { title: 'Inspection Result', dataIndex: 'inspectionResult', key: 'inspectionResult' },
  { title: 'Performed By', dataIndex: 'performedBy', key: 'performedBy' },
];

const TBMScheduleCompletionEntry: React.FC = () => {
  const { tbmCompletions, setTbmCompletions } = useDataContext();

  return (
    <MasterPage<TBMScheduleCompletionEntryRecord>
      title="TBM Schedule Completion Entry"
      description="Capture completion results for TBM (Time-Based Maintenance) schedules."
      items={tbmCompletions}
      setItems={setTbmCompletions}
      columns={columns}
      entityName="TBM Completion"
    />
  );
};

export default TBMScheduleCompletionEntry;
