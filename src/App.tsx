import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, type ReactElement } from 'react';
import { Layout } from 'antd';
import './App.css';
import { Sidebar } from './components/Sidebar';
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
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
    <AuthProvider>
      <DataProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <Layout className="app-layout">
                      <Sider width={280} className="app-sider">
                        <Sidebar />
                      </Sider>
                      <Layout className="app-main">
                        <Header className="app-header">
                          <div className="app-header-content">
                            <div>
                              <div className="brand-label">Probity Technologies Pvt. Ltd.</div>
                              <div className="brand-title">Maintenance Intelligence Suite</div>
                            </div>
                            <div className="header-actions">
                              <span className="header-chip">Enterprise Access</span>
                            </div>
                          </div>
                        </Header>
                        <Content className="app-content">
                          <div className="page-shell">
                            <Routes>
                              <Route index element={<Navigate to="/dashboard" replace />} />
                              <Route path="dashboard" element={<Dashboard />} />
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
        </Suspense>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
