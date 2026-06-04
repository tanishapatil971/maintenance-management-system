import { createContext, useContext } from 'react';

export type Role = 'admin' | 'manager' | 'operator' | 'viewer';

export interface AuthContextProps {
  role: Role;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
