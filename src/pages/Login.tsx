import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Select, Button, message } from 'antd';
import { useAuth } from '../context/AuthContext';

const { Option } = Select;

const Login: React.FC = () => {
  const [role, setRole] = useState<string>('viewer');
  const navigate = useNavigate();
  const { setRole: setAuthRole } = useAuth();

  const handleSubmit = () => {
    setAuthRole(role as any);
    message.success(`Logged in as ${role}`);
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="Probity Technologies Login" style={{ width: 300 }}>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Select Role" name="role" initialValue="viewer">
            <Select value={role} onChange={value => setRole(value)}>
              <Option value="admin">Admin</Option>
              <Option value="manager">Manager</Option>
              <Option value="operator">Operator</Option>
              <Option value="viewer">Viewer</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
