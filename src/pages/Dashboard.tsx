import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="Active Machines" value={124} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Pending Work Orders" value={27} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="MTTR (hrs)" value={4.2} precision={1} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Scheduled Maintenance" value={15} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
