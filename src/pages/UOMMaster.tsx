import React from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';
import { usePersistentState } from '../utils/persistence';

interface UOM {
  id: number;
  unit: string;
  description: string;
}

const columns: TableColumnType<UOM>[] = [
  { title: 'Unit', dataIndex: 'unit', key: 'unit' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
];

const initialUOM: UOM[] = [
  { id: 1, unit: 'kg', description: 'Kilogram' },
  { id: 2, unit: 'm', description: 'Meter' },
  { id: 3, unit: 'pcs', description: 'Pieces' },
  { id: 4, unit: 'hr', description: 'Hours' },
];

const UOMMaster: React.FC = () => {
  const [items, setItems] = usePersistentState<UOM[]>('maintenance-uom-master', initialUOM);
  return (
    <MasterPage<UOM>
      title="UOM Master"
      description="Manage units of measure used in maintenance records and asset inventories."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="UOM"
    />
  );
};

export default UOMMaster;
