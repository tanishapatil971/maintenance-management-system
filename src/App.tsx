import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
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
import { AuthProvider, useAuth } from './context/AuthContext';

const { Header, Content, Sider } = Layout;

// Private route component
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { role } = useAuth();
  // treat 'viewer' as unauthenticated
  return role === 'viewer' ? <Navigate to="/login" replace /> : children;
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
                <Layout style={{ minHeight: '100vh' }}>
                  <Sider width={240} className="site-layout-background">
                    <Sidebar />
                  </Sider>
                  <Layout>
                    <Header style={{ background: '#fff', padding: 0 }} />
                    <Content style={{ margin: '24px' }}>
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
