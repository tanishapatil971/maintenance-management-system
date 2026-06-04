import React, { useState } from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';

interface DownTimeItem {
  id: number;
  machine: string;
  category: string;
  status: string;
  reason: string;
}

const columns: TableColumnType<DownTimeItem>[] = [
  { title: 'Machine', dataIndex: 'machine', key: 'machine' },
  { title: 'Category', dataIndex: 'category', key: 'category' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Reason', dataIndex: 'reason', key: 'reason' },
];

const initialDownTimes: DownTimeItem[] = [
  { id: 1, machine: 'Pump Station 3', category: 'Mechanical', status: 'Open', reason: 'Seal failure detected' },
  { id: 2, machine: 'Press Unit 14', category: 'Electrical', status: 'Closed', reason: 'Control panel fault repaired' },
  { id: 3, machine: 'Conveyor A', category: 'Operational', status: 'Open', reason: 'Belt misalignment' },
  { id: 4, machine: 'Cooling Tower', category: 'Planned', status: 'Closed', reason: 'Seasonal coolant service' },
];

const DownTimeMaster: React.FC = () => {
  const [items, setItems] = useState<DownTimeItem[]>(initialDownTimes);
  return (
    <MasterPage<DownTimeItem>
      title="Down Time Master"
      description="Review downtime records, reasons and current resolution status."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="Down Time"
    />
  );
};

export default DownTimeMaster;
