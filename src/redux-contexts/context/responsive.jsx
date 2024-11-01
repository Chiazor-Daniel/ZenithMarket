/* eslint-disable */
import React, { createContext, useContext, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';

const ResponsiveContext = createContext();

export const ResponsiveProvider = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ isMobile, isTablet, isDesktop }), [isMobile, isTablet, isDesktop]);

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = () => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
};
