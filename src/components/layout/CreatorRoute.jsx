import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isCreator } from '../../utils/roleAccess';

export const CreatorRoute = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!isCreator(currentUser)) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};
