import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  DatabaseOutlined,
  SettingOutlined,
  FileAddOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

const menuItems: MenuProps['items'] = [
  {
    key: 'dashboard-group',
    type: 'group',
    label: 'Dashboard',
    children: [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />, 
        label: <NavLink to="/dashboard">Dashboard</NavLink>,
      },
      {
        key: '/analytics',
        icon: <BarChartOutlined />, 
        label: <NavLink to="/analytics">Analytics</NavLink>,
      },
    ],
  },
  {
    key: 'masters-group',
    type: 'group',
    label: 'Masters',
    children: [
      { key: '/user-master', icon: <UserOutlined />, label: <NavLink to="/user-master">User Master</NavLink> },
      { key: '/department-master', icon: <DatabaseOutlined />, label: <NavLink to="/department-master">Department Master</NavLink> },
      { key: '/authorization-master', icon: <SettingOutlined />, label: <NavLink to="/authorization-master">Authorization Master</NavLink> },
      { key: '/element-master', icon: <DatabaseOutlined />, label: <NavLink to="/element-master">Element Master</NavLink> },
      { key: '/sub-element-master', icon: <DatabaseOutlined />, label: <NavLink to="/sub-element-master">Sub Element Master</NavLink> },
      { key: '/machine-master', icon: <DatabaseOutlined />, label: <NavLink to="/machine-master">Machine Master</NavLink> },
      { key: '/checklist-master', icon: <DatabaseOutlined />, label: <NavLink to="/checklist-master">Checklist Master</NavLink> },
      { key: '/uom-master', icon: <DatabaseOutlined />, label: <NavLink to="/uom-master">UOM Master</NavLink> },
      { key: '/spare-master', icon: <DatabaseOutlined />, label: <NavLink to="/spare-master">Spare Master</NavLink> },
      { key: '/downtime-master', icon: <DatabaseOutlined />, label: <NavLink to="/downtime-master">Down Time Master</NavLink> },
      { key: '/actiontaken-master', icon: <DatabaseOutlined />, label: <NavLink to="/actiontaken-master">Action Taken Master</NavLink> },
      { key: '/maintenancetype-master', icon: <DatabaseOutlined />, label: <NavLink to="/maintenancetype-master">Maintenance Type Master</NavLink> },
    ],
  },
  {
    key: 'transactions-group',
    type: 'group',
    label: 'Transactions',
    children: [
      { key: '/downtime-entry', icon: <FileAddOutlined />, label: <NavLink to="/downtime-entry">Down Time Entry</NavLink> },
      { key: '/actiontaken-entry', icon: <FileAddOutlined />, label: <NavLink to="/actiontaken-entry">Action Taken Entry</NavLink> },
      { key: '/pmschedule-entry', icon: <FileAddOutlined />, label: <NavLink to="/pmschedule-entry">PM Schedule Entry</NavLink> },
      { key: '/pmschedule-completion-entry', icon: <FileAddOutlined />, label: <NavLink to="/pmschedule-completion-entry">PM Schedule Completion Entry</NavLink> },
      { key: '/tbmschedule-entry', icon: <FileAddOutlined />, label: <NavLink to="/tbmschedule-entry">TBM Schedule Entry</NavLink> },
    ],
  },
];

export const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="sidebar-container">
      <div className="sidebar-brand">
        <div className="sidebar-logo">PT</div>
        <div>
          <div className="sidebar-title">Probity Technologies</div>
          <div className="sidebar-subtitle">Maintenance Suite</div>
        </div>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="sidebar-menu"
      />
    </div>
  );
};
