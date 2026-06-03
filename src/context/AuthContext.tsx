import React, { createContext, useContext, useState, ReactNode } from 'react';

// Simple role based auth context
export type Role = 'admin' | 'manager' | 'operator' | 'viewer';

interface AuthContextProps {
  role: Role;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>('viewer');
  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
