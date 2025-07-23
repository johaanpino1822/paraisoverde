import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress,
  useTheme,
  useMediaQuery,
  Paper,
  styled,
  ListItemButton // Componente corregido para solucionar la advertencia
} from '@mui/material';
import {
  People as PeopleIcon,
  Hotel as HotelIcon,
  Place as PlaceIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../../Api/config';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  }
}));

const StatCard = ({ title, value, icon, color }) => {
  const IconComponent = icon;
  
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle1" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={color}>
              {value}
            </Typography>
          </Box>
          <Box
            bgcolor={`${color}.light`}
            color={`${color}.contrastText`}
            p={2}
            borderRadius="50%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <IconComponent fontSize="large" />
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener token de localStorage
      const token = localStorage.getItem('token');
      
      // Verificar si el token existe
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      // Verificar el formato del token
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Formato de token inválido');
      }

      // Decodificar el payload del token para verificar expiración
      const payload = JSON.parse(atob(tokenParts[1]));
      const expirationTime = payload.exp * 1000;
      
      if (Date.now() > expirationTime) {
        throw new Error('El token ha expirado');
      }

      const { data } = await api.get('/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        validateStatus: (status) => {
          // Manejar específicamente el error 403
          if (status === 403) {
            return false; // Forzar que Axios lo trate como error
          }
          return status >= 200 && status < 300;
        }
      });
      
      setStats(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching stats:', error);
      
      // Mensajes más específicos según el tipo de error
      let errorMessage = 'Error al cargar los datos';
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'No autenticado - Por favor inicie sesión';
            break;
          case 403:
            errorMessage = 'Acceso prohibido - No tiene permisos de administrador';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado';
            break;
          case 500:
            errorMessage = 'Error del servidor';
            break;
          default:
            errorMessage = `Error ${error.response.status}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Agregar listener para eventos de autenticación
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        fetchStats();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading && !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: isMobile ? 2 : 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Panel de Administración
        </Typography>
        <Box display="flex" alignItems="center">
          {lastUpdated && (
            <Typography variant="caption" color="textSecondary" mr={2}>
              Actualizado: {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
          <RefreshIcon 
            color="primary" 
            onClick={fetchStats} 
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'rotate(180deg)'
              }
            }} 
          />
        </Box>
      </Box>
      
      {error && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, bgcolor: 'error.light' }}>
          <Typography color="error" variant="subtitle1" fontWeight="bold">
            {error}
          </Typography>
          <Typography variant="body2" mt={1}>
            <strong>Solución:</strong> 
            {error.includes('403') ? 
              ' Verifique que su cuenta tenga permisos de administrador' : 
              ' Recargue la página o inicie sesión nuevamente'
            }
          </Typography>
          <Typography variant="body2" mt={1}>
            Si el problema persiste, contacte al soporte técnico.
          </Typography>
        </Paper>
      )}

      {/* Grid actualizado para MUI v6 sin advertencias */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Usuarios Registrados" 
            value={stats?.users || 0} 
            icon={PeopleIcon} 
            color="primary" 
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Hoteles" 
            value={stats?.hotels || 0} 
            icon={HotelIcon} 
            color="secondary" 
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Sitios Turísticos" 
            value={stats?.sites || 0} 
            icon={PlaceIcon} 
            color="success" 
          />
        </Grid>

        {/* Sección adicional para gráficos o más estadísticas */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, minHeight: 300 }}>
            <Typography variant="h6" gutterBottom>
              Resumen de Actividad
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" height={200}>
              <Typography color="textSecondary">
                (Aquí podrías incluir un gráfico de actividad reciente)
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;