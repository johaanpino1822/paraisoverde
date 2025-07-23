import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RequireAdmin = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem('token');

  if (!token || !user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAdmin;
