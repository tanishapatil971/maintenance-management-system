import { type ReactNode } from 'react';
import { AuthContext, type Role } from './useAuth';
import { usePersistentState } from '../utils/persistence';

// Simple role based auth context

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = usePersistentState<Role>('maintenance-auth-role', 'viewer');
  const [isAuthenticated, setIsAuthenticated] = usePersistentState<boolean>('maintenance-auth-state', false);
  const [username, setUsername] = usePersistentState<string>('maintenance-auth-username', '');
  return (
    <AuthContext.Provider value={{ role, setRole, isAuthenticated, setIsAuthenticated, username, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};
