import axios from 'axios';

// 1. Configuración base de Axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// 2. Interceptor para autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Interceptor de respuestas mejorado
api.interceptors.response.use(
  (response) => {
    // Guardar nuevo token si se recibe
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const requestedUrl = error.config?.url || '';
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      switch (error.response.status) {
        case 401:
          // 🔧 Modo desarrollo: no redirigir automáticamente
          console.warn('⚠️ Token inválido o expirado. Evitando redirección automática (modo desarrollo).');
          // localStorage.removeItem('token');
          // localStorage.removeItem('user');
          // if (!window.location.pathname.includes('/login')) {
          //   window.location.href = '/login?sessionExpired=true';
          // }
          break;

        case 403:
          if (requestedUrl.includes('/admin/') && error.response.data?.code === 'ADMIN_ACCESS_REQUIRED') {
            return Promise.reject({
              ...error,
              isAdminPermissionError: true
            });
          } else {
            window.location.href = '/unauthorized';
          }
          break;

        case 404:
          console.error('Recurso no encontrado:', requestedUrl);
          break;

        case 500:
          console.error('Error interno del servidor:', error.response.data?.message);
          break;

        default:
          console.error('Error HTTP no manejado:', error.response.status);
      }
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor');
    } else {
      console.error('Error al configurar la petición:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
