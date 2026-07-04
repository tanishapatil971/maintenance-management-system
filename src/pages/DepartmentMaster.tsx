import React from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';
import { usePersistentState } from '../utils/persistence';

interface Department {
  id: number;
  name: string;
  description: string;
}

const columns: TableColumnType<Department>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
];

const initialDepartments: Department[] = [
  { id: 1, name: 'Mechanical', description: 'Maintenance and repair of mechanical assets.' },
  { id: 2, name: 'Electrical', description: 'Electrical systems and instrumentation support.' },
  { id: 3, name: 'Quality', description: 'Process quality assurance and compliance checks.' },
  { id: 4, name: 'Production', description: 'Supervision of plant operations and throughput.' },
];

const DepartmentMaster: React.FC = () => {
  const [items, setItems] = usePersistentState<Department[]>('maintenance-department-master', initialDepartments);
  return (
    <MasterPage<Department>
      title="Department Master"
      description="Maintain department definitions used for asset ownership and process planning."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="Department"
    />
  );
};

export default DepartmentMaster;
