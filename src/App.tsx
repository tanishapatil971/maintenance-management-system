import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import { Layout } from 'antd';
import './App.css';
import { Sidebar } from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
// Masters
import UserMaster from './pages/UserMaster';
import DepartmentMaster from './pages/DepartmentMaster';
import AuthorizationMaster from './pages/AuthorizationMaster';
import ElementMaster from './pages/ElementMaster';
import SubElementMaster from './pages/SubElementMaster';
import MachineMaster from './pages/MachineMaster';
import ChecklistMaster from './pages/ChecklistMaster';
import UOMMaster from './pages/UOMMaster';
import SpareMaster from './pages/SpareMaster';
import DownTimeMaster from './pages/DownTimeMaster';
import ActionTakenMaster from './pages/ActionTakenMaster';
import MaintenanceTypeMaster from './pages/MaintenanceTypeMaster';
// Transactions
import DownTimeEntry from './pages/DownTimeEntry';
import ActionTakenEntry from './pages/ActionTakenEntry';
import PMScheduleEntry from './pages/PMScheduleEntry';
import PMScheduleCompletionEntry from './pages/PMScheduleCompletionEntry';
import TBMScheduleEntry from './pages/TBMScheduleEntry';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';

const { Header, Content, Sider } = Layout;

// Private route component
const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
