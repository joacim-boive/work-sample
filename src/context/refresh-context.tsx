'use client';
import React, { createContext, useContext, useState } from 'react';

type RefreshContextType = {
  triggerRefresh: () => void;
  refreshKey: number;
};

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
};

type RefreshProviderProps = {
  children: React.ReactNode;
};

export const RefreshProvider: React.FC<RefreshProviderProps> = ({
  children,
}) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((refreshKey) => refreshKey + 1);
  };

  return (
    <RefreshContext.Provider value={{ triggerRefresh, refreshKey }}>
      {children}
    </RefreshContext.Provider>
  );
};
