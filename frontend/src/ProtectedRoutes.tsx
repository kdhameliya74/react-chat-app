import React from 'react';
import { isAuthenticated } from './utils/auth';
import { Navigate, Outlet } from 'react-router-dom';
import { UserProvider } from './context/userContext';

const ProtectedRoutes: React.FC = (): React.JSX.Element => {
  const isAuthenticate = isAuthenticated();
  return isAuthenticate ? (
    <UserProvider>
      <Outlet />
    </UserProvider>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoutes;
