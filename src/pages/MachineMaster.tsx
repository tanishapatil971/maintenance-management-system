import React from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';
import { usePersistentState } from '../utils/persistence';

interface Machine {
  id: number;
  name: string;
  model: string;
  serialNumber: string;
  department: string;
  status: string;
}

const columns: TableColumnType<Machine>[] = [
  { title: 'Machine', dataIndex: 'name', key: 'name' },
  { title: 'Model', dataIndex: 'model', key: 'model' },
  { title: 'Serial Number', dataIndex: 'serialNumber', key: 'serialNumber' },
  { title: 'Department', dataIndex: 'department', key: 'department' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

const initialMachines: Machine[] = [
  { id: 1, name: 'Press Unit 14', model: 'PR-450', serialNumber: 'MCH-0014', department: 'Production', status: 'Active' },
  { id: 2, name: 'Conveyor A', model: 'CV-220', serialNumber: 'MCH-0021', department: 'Material Handling', status: 'Active' },
  { id: 3, name: 'Pump Station 3', model: 'HP-102', serialNumber: 'MCH-0035', department: 'Fluid Systems', status: 'Maintenance' },
  { id: 4, name: 'Cooling Tower', model: 'CT-85', serialNumber: 'MCH-0042', department: 'Utilities', status: 'Idle' },
];

const MachineMaster: React.FC = () => {
  const [items, setItems] = usePersistentState<Machine[]>('maintenance-machine-master', initialMachines);
  return (
    <MasterPage<Machine>
      title="Machine Master"
      description="Manage machines, models and operational status for the plant."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="Machine"
    />
  );
};

export default MachineMaster;
