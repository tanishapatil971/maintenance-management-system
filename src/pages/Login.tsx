import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Select, Button, message, Typography, Space, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
import { useAuth } from '../context/useAuth';
import type { Role } from '../context/useAuth';

const { Title, Text } = Typography;
const { Option } = Select;

const Login: React.FC = () => {
  const [role, setRole] = useState<Role>('viewer');
  const navigate = useNavigate();
  const { setRole: setAuthRole, setIsAuthenticated, setUsername } = useAuth();

  const handleSubmit = (values: { username: string }) => {
    setAuthRole(role);
    setUsername(values.username || role);
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
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      <Card
        styles={{ body: { padding: 0 } }}
        style={{
          width: '100%',
          maxWidth: 960,
          borderRadius: 16,
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <Row style={{ minHeight: 560 }}>
          <Col xs={24} md={12} style={{
            padding: '56px 40px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 32,
          }}>
            <div>
              <Text style={{ display: 'inline-block', marginBottom: 16, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', letterSpacing: 0.8, textTransform: 'uppercase', fontSize: 10, fontWeight: 700, color: '#38bdf8' }}>
                Probity Technologies Pvt. Ltd.
              </Text>
              <Title level={2} style={{ color: '#fff', margin: 0, lineHeight: 1.15, fontWeight: 700, fontSize: 28 }}>
                Enterprise Maintenance Management
              </Title>
              <Text style={{ display: 'block', marginTop: 16, color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>
                Securely manage maintenance workflows, asset performance, and operational visibility from one centralized enterprise platform.
              </Text>
            </div>

            <div style={{ display: 'grid', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <TeamOutlined style={{ color: '#38bdf8', fontSize: 18 }} />
                </div>
                <div>
                  <Text strong style={{ color: '#f8fafc', fontSize: 14, display: 'block' }}>
                    Role-aware access
                  </Text>
                  <Text style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginTop: 2 }}>
                    Admin, manager, operator and viewer access controls built-in.
                  </Text>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <UserOutlined style={{ color: '#38bdf8', fontSize: 18 }} />
                </div>
                <div>
                  <Text strong style={{ color: '#f8fafc', fontSize: 14, display: 'block' }}>
                    Professional enterprise UI
                  </Text>
                  <Text style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginTop: 2 }}>
                    Clean typography, polished spacing and a focused login experience.
                  </Text>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} md={12} style={{ padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#fff' }}>
            <div style={{ marginBottom: 28 }}>
              <Title level={3} style={{ margin: 0, fontWeight: 700, fontSize: 24, color: '#0f172a' }}>
                Welcome back
              </Title>
              <Text type="secondary" style={{ marginTop: 4, display: 'block', fontSize: 14 }}>
                Sign in with your enterprise credentials to continue.
              </Text>
            </div>

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
                <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="john.doe@probitytech.com" size="large" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="Enter your password" size="large" />
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

              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" size="large" block style={{ height: 40, fontWeight: 600 }}>
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <Space direction="vertical" size="small" style={{ marginTop: 24 }}>
              <Text type="secondary" style={{ fontSize: 11, color: '#64748b' }}>Need access to the system? Contact your system administrator.</Text>
              <Text type="secondary" style={{ fontSize: 11, color: '#64748b' }}>Probity Technologies Pvt. Ltd.</Text>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Login;
