import React from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';
import { usePersistentState } from '../utils/persistence';

interface SubElement {
  id: number;
  name: string;
  element: string;
  criticality: string;
}

const columns: TableColumnType<SubElement>[] = [
  { title: 'Sub Element', dataIndex: 'name', key: 'name' },
  { title: 'Element', dataIndex: 'element', key: 'element' },
  { title: 'Criticality', dataIndex: 'criticality', key: 'criticality' },
];

const initialSubElements: SubElement[] = [
  { id: 1, name: 'Hydraulic Pump', element: 'Hydraulic System', criticality: 'High' },
  { id: 2, name: 'Power Relay', element: 'Control Panel', criticality: 'Medium' },
  { id: 3, name: 'Conveyor Belt', element: 'Conveyor Drive', criticality: 'High' },
  { id: 4, name: 'Coolant Filter', element: 'Cooling Circuit', criticality: 'Low' },
];

const SubElementMaster: React.FC = () => {
  const [items, setItems] = usePersistentState<SubElement[]>('maintenance-subelement-master', initialSubElements);
  return (
    <MasterPage<SubElement>
      title="Sub Element Master"
      description="Track detailed sub-components of plant elements for targeted maintenance actions."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="Sub Element"
    />
  );
};

export default SubElementMaster;
