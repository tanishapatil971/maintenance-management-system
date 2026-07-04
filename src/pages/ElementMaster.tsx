import React from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';
import { usePersistentState } from '../utils/persistence';

interface Element {
  id: number;
  name: string;
  description: string;
  department: string;
}

const columns: TableColumnType<Element>[] = [
  { title: 'Element', dataIndex: 'name', key: 'name' },
  { title: 'Department', dataIndex: 'department', key: 'department' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
];

const initialElements: Element[] = [
  { id: 1, name: 'Hydraulic System', department: 'Mechanical', description: 'High-pressure hydraulic actuator assembly.' },
  { id: 2, name: 'Control Panel', department: 'Electrical', description: 'Main PLC and operator HMI panel.' },
  { id: 3, name: 'Conveyor Drive', department: 'Production', description: 'Motor and gearbox for conveyor system.' },
  { id: 4, name: 'Cooling Circuit', department: 'Maintenance', description: 'Chiller and coolant circulation assembly.' },
];

const ElementMaster: React.FC = () => {
  const [items, setItems] = usePersistentState<Element[]>('maintenance-element-master', initialElements);
  return (
    <MasterPage<Element>
      title="Element Master"
      description="Catalog key plant elements for maintenance planning and asset tracking."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="Element"
    />
  );
};

export default ElementMaster;
