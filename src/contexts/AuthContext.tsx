import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  showTokenExpiredDialog: boolean;
  setShowTokenExpiredDialog: (show: boolean) => void;
  handleTokenExpiration: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [showTokenExpiredDialog, setShowTokenExpiredDialog] = useState(false);

  const handleTokenExpiration = () => {
    localStorage.removeItem('token');
    setShowTokenExpiredDialog(true);
  };

  const value = {
    showTokenExpiredDialog,
    setShowTokenExpiredDialog,
    handleTokenExpiration,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 