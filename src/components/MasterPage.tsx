import React from 'react';
import { Card, Typography } from 'antd';
import type { TableColumnType } from 'antd';
import { CrudTable } from './CrudTable';

const { Title, Text } = Typography;

interface MasterPageProps<T extends { id: number }> {
  title: string;
  description?: string;
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  columns: TableColumnType<T>[];
  entityName: string;
}

export function MasterPage<T extends { id: number }>(props: MasterPageProps<T>) {
  const { title, description, items, setItems, columns, entityName } = props;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <Title level={2} style={{ marginBottom: 8 }}>{title}</Title>
        {description && <Text type="secondary">{description}</Text>}
      </div>
      <Card bordered={false} style={{ borderRadius: 24, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}>
        <div style={{ marginBottom: 20 }}>
          {description && <Text type="secondary">{description}</Text>}
        </div>
        <CrudTable<T> items={items} setItems={setItems} columns={columns} entityName={entityName} />
      </Card>
    </div>
  );
}
