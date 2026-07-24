import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, type ReactElement } from 'react';
import { Layout, ConfigProvider, Empty, App as AntdApp } from 'antd';

import './App.css';
import { Sidebar } from './components/Sidebar';
import AppHeader from './components/AppHeader';
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
// Masters
const UserMaster = React.lazy(() => import('./pages/UserMaster'));
const DepartmentMaster = React.lazy(() => import('./pages/DepartmentMaster'));
const AuthorizationMaster = React.lazy(() => import('./pages/AuthorizationMaster'));
const ElementMaster = React.lazy(() => import('./pages/ElementMaster'));
const SubElementMaster = React.lazy(() => import('./pages/SubElementMaster'));
const MachineMaster = React.lazy(() => import('./pages/MachineMaster'));
const ChecklistMaster = React.lazy(() => import('./pages/ChecklistMaster'));
const UOMMaster = React.lazy(() => import('./pages/UOMMaster'));
const SpareMaster = React.lazy(() => import('./pages/SpareMaster'));
const DownTimeMaster = React.lazy(() => import('./pages/DownTimeMaster'));
const ActionTakenMaster = React.lazy(() => import('./pages/ActionTakenMaster'));
const MaintenanceTypeMaster = React.lazy(() => import('./pages/MaintenanceTypeMaster'));
// Transactions
const DownTimeEntry = React.lazy(() => import('./pages/DownTimeEntry'));
const ActionTakenEntry = React.lazy(() => import('./pages/ActionTakenEntry'));
const PMScheduleEntry = React.lazy(() => import('./pages/PMScheduleEntry'));
const PMScheduleCompletionEntry = React.lazy(() => import('./pages/PMScheduleCompletionEntry'));
const TBMScheduleEntry = React.lazy(() => import('./pages/TBMScheduleEntry'));
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { DataProvider } from './context/DataContext';

const { Header, Content, Sider } = Layout;

// Private route component
const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ConfigProvider
      renderEmpty={() => <Empty description="No data found" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      theme={{
        token: {
          colorPrimary: '#2563eb', // Enterprise blue primary
          colorSuccess: '#10b981', // Emerald green success
          colorWarning: '#f59e0b', // Amber warning
          colorError: '#ef4444', // Red error
          colorInfo: '#2563eb',
          borderRadius: 6, // Modern standard curvature
          fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
          colorTextBase: '#334155', // Slate 700 text color
          colorTextHeading: '#0f172a', // Slate 900 headings
          colorBgLayout: '#f8fafc', // Layout bg
          colorBgContainer: '#ffffff', // Card/Table container bg
          colorBorder: '#cbd5e1', // Borders slate 300
          colorBorderSecondary: '#f1f5f9', // Light dividing lines slate 100
        },
        components: {
          Layout: {
            headerBg: '#ffffff',
            headerPadding: '0 24px',
            siderBg: '#0f172a', // Premium dark sidebar
          },
          Menu: {
            darkItemBg: '#0f172a',
            darkItemSelectedBg: '#1e293b',
            darkItemSelectedColor: '#60a5fa', // Blue light tint for selected text
            darkItemHoverBg: 'rgba(255, 255, 255, 0.04)',
            darkItemColor: '#94a3b8',
          },
          Table: {
            headerBg: '#f8fafc', // Sleek off-white header
            headerColor: '#475569',
            headerSplitColor: 'transparent',
            cellPaddingBlock: 12,
            cellPaddingInline: 16,
            borderColor: '#e2e8f0',
            rowHoverBg: '#f8fafc',
          },
          Card: {
            colorBorderBg: '#e2e8f0',
            paddingLG: 20,
            borderRadiusLG: 8,
          },
          Form: {
            itemMarginBottom: 20,
            verticalLabelPadding: '0 0 6px',
            labelColor: '#475569',
            labelFontSize: 14,
          },
          Button: {
            controlHeight: 36,
            borderRadius: 6,
          },
          Input: {
            controlHeight: 36,
            borderRadius: 6,
          },
          Select: {
            controlHeight: 36,
            borderRadius: 6,
          },
          DatePicker: {
            controlHeight: 36,
            borderRadius: 6,
          },
        }
      }}
    >
      <AuthProvider>
        <DataProvider>
          <Suspense fallback={<div style={{ padding: 48, textAlign: 'center', fontSize: 18, color: '#64748b' }}>Loading Maintenance Suite...</div>}>
            <AntdApp>
              <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/*"
                  element={
                    <PrivateRoute>
                      <Layout className="app-layout">
                        <Sider width={240} className="app-sider" breakpoint="lg" collapsedWidth="0">
                          <Sidebar />
                        </Sider>
                        <Layout className="app-main">
                          <Header className="app-header">
                            <AppHeader />
                          </Header>
                          <Content className="app-content">
                            <div className="page-shell">
                              <Routes>
                                <Route index element={<Navigate to="/dashboard" replace />} />
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="analytics" element={<Analytics />} />
                                {/* Masters */}
                                <Route path="user-master" element={<UserMaster />} />
                                <Route path="department-master" element={<DepartmentMaster />} />
                                <Route path="authorization-master" element={<AuthorizationMaster />} />
                                <Route path="element-master" element={<ElementMaster />} />
                                <Route path="sub-element-master" element={<SubElementMaster />} />
                                <Route path="machine-master" element={<MachineMaster />} />
                                <Route path="checklist-master" element={<ChecklistMaster />} />
                                <Route path="uom-master" element={<UOMMaster />} />
                                <Route path="spare-master" element={<SpareMaster />} />
                                <Route path="downtime-master" element={<DownTimeMaster />} />
                                <Route path="actiontaken-master" element={<ActionTakenMaster />} />
                                <Route path="maintenancetype-master" element={<MaintenanceTypeMaster />} />
                                {/* Transactions */}
                                <Route path="downtime-entry" element={<DownTimeEntry />} />
                                <Route path="actiontaken-entry" element={<ActionTakenEntry />} />
                                <Route path="pmschedule-entry" element={<PMScheduleEntry />} />
                                <Route path="pmschedule-completion-entry" element={<PMScheduleCompletionEntry />} />
                                <Route path="tbmschedule-entry" element={<TBMScheduleEntry />} />
                              </Routes>
                            </div>
                          </Content>
                        </Layout>
                      </Layout>
                    </PrivateRoute>
                  }
                />
              </Routes>
              </Router>
            </AntdApp>
          </Suspense>
        </DataProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
