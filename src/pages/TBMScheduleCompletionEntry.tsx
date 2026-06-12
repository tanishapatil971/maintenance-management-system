import React from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';
import { useDataContext, TBMScheduleCompletionRecord } from '../context/DataContext';

const columns: TableColumnType<TBMScheduleCompletionRecord>[] = [
  { title: 'Machine', dataIndex: 'machine', key: 'machine' },
  { title: 'Completed Date', dataIndex: 'completedDate', key: 'completedDate' },
  { title: 'Inspection Result', dataIndex: 'inspectionResult', key: 'inspectionResult' },
  { title: 'Performed By', dataIndex: 'performedBy', key: 'performedBy' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

const TBMScheduleCompletionEntry: React.FC = () => {
  const { tbmCompletions, setTbmCompletions } = useDataContext();

  return (
    <MasterPage<TBMScheduleCompletionRecord>
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
