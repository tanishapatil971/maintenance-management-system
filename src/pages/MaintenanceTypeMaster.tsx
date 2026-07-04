import React from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';
import { usePersistentState } from '../utils/persistence';

interface MaintenanceType {
  id: number;
  type: string;
  interval: string;
  description: string;
}

const columns: TableColumnType<MaintenanceType>[] = [
  { title: 'Maintenance Type', dataIndex: 'type', key: 'type' },
  { title: 'Interval', dataIndex: 'interval', key: 'interval' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
];

const initialTypes: MaintenanceType[] = [
  { id: 1, type: 'Preventive', interval: 'Monthly', description: 'Scheduled inspections and lubrication.' },
  { id: 2, type: 'Corrective', interval: 'As needed', description: 'Repair after failure or defect is identified.' },
  { id: 3, type: 'Predictive', interval: 'Condition-based', description: 'Maintenance based on asset health monitoring.' },
  { id: 4, type: 'Shutdown', interval: 'Annual', description: 'Planned comprehensive maintenance during shutdown.' },
];

const MaintenanceTypeMaster: React.FC = () => {
  const [items, setItems] = usePersistentState<MaintenanceType[]>('maintenance-type-master', initialTypes);
  return (
    <MasterPage<MaintenanceType>
      title="Maintenance Type Master"
      description="Define maintenance categories and review required work cycles."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="Maintenance Type"
    />
  );
};

export default MaintenanceTypeMaster;
