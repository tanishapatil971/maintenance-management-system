import React from 'react';
import { Button, Tag, Modal, Space, Typography, App } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const { Text } = Typography;

const roleColors: Record<string, string> = {
  admin: 'red',
  manager: 'blue',
  operator: 'green',
  viewer: 'default',
};

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  manager: 'Manager',
  operator: 'Operator',
  viewer: 'Viewer',
};

const AppHeader: React.FC = () => {
  const { role, username, setIsAuthenticated, setRole, setUsername } = useAuth();
  const navigate = useNavigate();
  const { notification } = App.useApp();

  const handleLogout = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to logout?',
      okText: 'Logout',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: () => {
        setIsAuthenticated(false);
        setRole('viewer');
        setUsername('');
        notification.success({ message: 'Logged Out', description: 'Logged out successfully.' });
        navigate('/login', { replace: true });
      },
    });
  };

  const displayName = username || roleLabels[role] || 'User';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px', width: '100%' }}>
      <Text style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>Probity Technologies</Text>
      <Space size="middle" align="center">
        <Space size={8} align="center">
          <UserOutlined style={{ color: '#475569', fontSize: 15 }} />
          <Text strong style={{ fontSize: 13, color: '#334155' }}>{displayName}</Text>
          <Tag color={roleColors[role]} style={{ margin: 0, textTransform: 'capitalize', fontWeight: 600, fontSize: 11 }}>
            {roleLabels[role]}
          </Tag>
        </Space>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ color: '#64748b', fontWeight: 500 }}
        >
          Logout
        </Button>
      </Space>
    </div>
  );
};

export default AppHeader;
