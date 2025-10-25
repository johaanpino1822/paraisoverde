// hooks/useAuthCheck.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, clearCredentials, setLoading } from '../features/Auth/authSlice';
import api from '../Api/config';

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      // Si no hay token o usuario en localStorage, marcar como no cargando
      if (!token || !user) {
        dispatch(setLoading(false));
        return;
      }

      try {
        // Verificar si el token es válido
        const response = await api.get('/users/me');
        
        // Si es válido, establecer credenciales
        dispatch(setCredentials({
          user: response.data,
          token: token
        }));
        
      } catch (error) {
        console.warn('Token inválido o expirado:', error);
        
        // Limpiar credenciales inválidas
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(clearCredentials());
      } finally {
        dispatch(setLoading(false));
      }
    };

    // Verificar autenticación solo si no está autenticado pero hay token
    if (!isAuthenticated && localStorage.getItem('token')) {
      checkAuthStatus();
    } else {
      // Si ya está autenticado o no hay token, marcar como no cargando
      dispatch(setLoading(false));
    }
  }, [dispatch, isAuthenticated]);

  return {};
};