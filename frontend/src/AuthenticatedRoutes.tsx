import React from 'react';
import { isAuthenticated } from './utils/auth';
import { Navigate, Outlet } from 'react-router-dom';

const AuthenicatedRoutes: React.FC = (): React.JSX.Element => {
  const isAuthenticate = isAuthenticated();
  console.log('KD----->', <Outlet />);
  return isAuthenticate ? <Outlet /> : <Navigate to="/" />;
};

export default AuthenicatedRoutes;
