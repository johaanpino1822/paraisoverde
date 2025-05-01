import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('userAdmin'));

  if (!user) {
    // Si no hay usuario logueado, redirigimos al login de admins
    return <Navigate to="/admin/login" replace />;
  }

  // Si existe usuario, renderizamos el componente hijo
  return children;
};

export default ProtectedRoute;
