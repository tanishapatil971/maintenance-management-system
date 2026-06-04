import React, { useState } from 'react';
import { MasterPage } from '../components/MasterPage';
import type { TableColumnType } from 'antd';

interface Spare {
  id: number;
  partNumber: string;
  description: string;
  location: string;
}

const columns: TableColumnType<Spare>[] = [
  { title: 'Part Number', dataIndex: 'partNumber', key: 'partNumber' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
  { title: 'Location', dataIndex: 'location', key: 'location' },
];

const initialSpares: Spare[] = [
  { id: 1, partNumber: 'SP-4582', description: 'Hydraulic seal set', location: 'Warehouse A' },
  { id: 2, partNumber: 'SP-2374', description: 'V-belt assembly', location: 'Warehouse B' },
  { id: 3, partNumber: 'SP-1109', description: 'Pressure gauge', location: 'Warehouse C' },
  { id: 4, partNumber: 'SP-9021', description: 'Valve actuator', location: 'Warehouse A' },
];

const SpareMaster: React.FC = () => {
  const [items, setItems] = useState<Spare[]>(initialSpares);
  return (
    <MasterPage<Spare>
      title="Spare Master"
      description="Manage critical spare parts inventory and storage locations."
      items={items}
      setItems={setItems}
      columns={columns}
      entityName="Spare"
    />
  );
};

export default SpareMaster;
