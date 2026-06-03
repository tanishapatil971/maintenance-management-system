import React from 'react';
import { Layout, Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  DatabaseOutlined,
  SettingOutlined,
  FileAddOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const menuItems = [
  // Masters
  { key: '/user-master', label: 'User Master', icon: <UserOutlined /> },
  { key: '/department-master', label: 'Department Master', icon: <DatabaseOutlined /> },
  { key: '/authorization-master', label: 'Authorization Master', icon: <SettingOutlined /> },
  { key: '/element-master', label: 'Element Master', icon: <DatabaseOutlined /> },
  { key: '/sub-element-master', label: 'Sub Element Master', icon: <DatabaseOutlined /> },
  { key: '/machine-master', label: 'Machine Master', icon: <DatabaseOutlined /> },
  { key: '/checklist-master', label: 'Checklist Master', icon: <DatabaseOutlined /> },
  { key: '/uom-master', label: 'UOM Master', icon: <DatabaseOutlined /> },
  { key: '/spare-master', label: 'Spare Master', icon: <DatabaseOutlined /> },
  { key: '/downtime-master', label: 'Down Time Master', icon: <DatabaseOutlined /> },
  { key: '/actiontaken-master', label: 'Action Taken Master', icon: <DatabaseOutlined /> },
  { key: '/maintenancetype-master', label: 'Maintenance Type Master', icon: <DatabaseOutlined /> },
  // Transactions
  { key: '/downtime-entry', label: 'Down Time Entry', icon: <FileAddOutlined /> },
  { key: '/actiontaken-entry', label: 'Action Taken Entry', icon: <FileAddOutlined /> },
  { key: '/pmschedule-entry', label: 'PM Schedule Entry', icon: <FileAddOutlined /> },
  { key: '/pmschedule-completion-entry', label: 'PM Schedule Completion', icon: <FileAddOutlined /> },
  { key: '/tbmschedule-entry', label: 'TBM Schedule Entry', icon: <FileAddOutlined /> },
];

export const Sidebar = () => {
  const location = useLocation();
  return (
    <Sider width={240} className="site-layout-background" style={{ minHeight: '100vh' }}>
      <div style={{ height: 32, margin: 16, color: 'white', fontSize: 18, fontWeight: 'bold' }}>
        Probity Tech
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: <NavLink to={item.key}>{item.label}</NavLink>,
        }))}
      />
    </Sider>
  );
};
