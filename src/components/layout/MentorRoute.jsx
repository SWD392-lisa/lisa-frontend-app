import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isMentor } from '../../utils/roleAccess';

export const MentorRoute = () => {
  const { currentUser } = useAuth();

  if (!currentUser || !isMentor(currentUser)) return <Navigate to="/discover" replace />;

  return <Outlet />;
};
