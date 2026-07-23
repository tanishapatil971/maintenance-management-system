import React from 'react';
import { Card, Typography } from 'antd';
import type { TableColumnType } from 'antd';
import { CrudTable } from './CrudTable';

const { Title } = Typography;

interface MasterPageProps<T extends { id: number }> {
  title: string;
  description?: string;
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  columns: TableColumnType<T>[];
  entityName: string;
}

export function MasterPage<T extends { id: number }>(props: MasterPageProps<T>) {
  const { title, items, setItems, columns, entityName } = props;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>{title}</Title>
      </div>
      <Card bordered={false}>
        <CrudTable<T> items={items} setItems={setItems} columns={columns} entityName={entityName} />
      </Card>
    </div>
  );
}
