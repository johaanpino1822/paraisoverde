// App/Store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/Auth/authSlice';

// Función para cargar el estado inicial desde localStorage
const loadPreloadedState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      return {
        auth: {
          user: JSON.parse(user),
          token: token,
          isAuthenticated: true,
          isLoading: false
        }
      };
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    // Limpiar localStorage corrupto
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  return undefined;
};

// Middleware personalizado para guardar el estado de auth en localStorage
const authPersistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Guardar en localStorage después de acciones específicas
  if (action.type === 'auth/setCredentials' || 
      action.type === 'auth/clearCredentials' || 
      action.type === 'auth/updateUser') {
    
    const authState = store.getState().auth;
    
    if (authState.isAuthenticated && authState.token && authState.user) {
      localStorage.setItem('token', authState.token);
      localStorage.setItem('user', JSON.stringify(authState.user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: loadPreloadedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar acciones no serializables (como funciones en payload)
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE'
        ],
        ignoredPaths: ['register'],
      },
    }).concat(authPersistMiddleware),
});

// Suscribirse a cambios del store para debug (opcional)
store.subscribe(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Estado actual:', store.getState());
  }
});

export default store;