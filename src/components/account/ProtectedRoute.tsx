import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../account/AuthContext';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = UserAuth();

  if (!user) {
    return <Navigate to='/' />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
