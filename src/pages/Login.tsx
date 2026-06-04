import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Select, Button, message, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
import { useAuth } from '../context/useAuth';
import type { Role } from '../context/useAuth';

const { Title, Text } = Typography;
const { Option } = Select;

const Login: React.FC = () => {
  const [role, setRole] = useState<Role>('viewer');
  const navigate = useNavigate();
  const { setRole: setAuthRole, setIsAuthenticated } = useAuth();

  const handleSubmit = () => {
    setAuthRole(role);
    setIsAuthenticated(true);
    message.success(`Logged in as ${role}`);
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(180deg, #f5f7fb 0%, #e9eef8 100%)',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 960,
          borderRadius: 24,
          boxShadow: '0 30px 80px rgba(20, 40, 80, 0.12)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            minHeight: 520,
          }}
        >
          <div
            style={{
              padding: '48px 40px',
              background: 'linear-gradient(180deg, #1f2a5d 0%, #2f3f7d 100%)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 24,
            }}
          >
            <div>
              <Text style={{ display: 'inline-block', marginBottom: 16, padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', letterSpacing: 0.6, textTransform: 'uppercase', fontSize: 12, fontWeight: 700 }}>
                Probity Technologies Pvt. Ltd.
              </Text>
              <Title level={2} style={{ color: '#fff', margin: 0, lineHeight: 1.1 }}>
                Enterprise Maintenance Management
              </Title>
              <Text style={{ display: 'block', marginTop: 16, color: 'rgba(255,255,255,0.82)', fontSize: 16, lineHeight: 1.75 }}>
                Securely manage maintenance workflows, asset performance, and operational visibility from one centralized enterprise platform.
              </Text>
            </div>

            <div style={{ display: 'grid', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.12)', display: 'grid', placeItems: 'center' }}>
                  <TeamOutlined style={{ color: '#fff', fontSize: 20 }} />
                </div>
                <div>
                  <Text strong style={{ color: '#fff' }}>
                    Role-aware access
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.78)', display: 'block', marginTop: 6 }}>
                    Admin, manager, operator and viewer access controls built-in.
                  </Text>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.12)', display: 'grid', placeItems: 'center' }}>
                  <UserOutlined style={{ color: '#fff', fontSize: 20 }} />
                </div>
                <div>
                  <Text strong style={{ color: '#fff' }}>
                    Professional enterprise UI
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.78)', display: 'block', marginTop: 6 }}>
                    Clean typography, polished spacing and a focused login experience.
                  </Text>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Title level={3} style={{ marginBottom: 8 }}>
              Welcome back
            </Title>
            <Text type="secondary" style={{ marginBottom: 32, display: 'block' }}>
              Sign in with your enterprise credentials to continue.
            </Text>

            <Form
              layout="vertical"
              initialValues={{ username: '', password: '', role: 'viewer' }}
              onFinish={handleSubmit}
              style={{ width: '100%' }}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please enter your username' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="john.doe@probitytech.com" size="large" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" size="large" />
              </Form.Item>

              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please select your role' }]}
              >
                <Select size="large" value={role} onChange={value => setRole(value)}>
                  <Option value="admin">Admin</Option>
                  <Option value="manager">Manager</Option>
                  <Option value="operator">Operator</Option>
                  <Option value="viewer">Viewer</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <Space direction="vertical" size="small" style={{ marginTop: 10 }}>
              <Text type="secondary">Need access to the system? Contact your system administrator.</Text>
              <Text type="secondary">Probity Technologies Pvt. Ltd.</Text>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
