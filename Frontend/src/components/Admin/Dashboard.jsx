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
  Button,
  alpha,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  Hotel as HotelIcon,
  Place as PlaceIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../../Api/config';

// Paleta de colores verde idéntica a la navbar
const greenTheme = {
  primary: '#00791a',
  secondary: '#064273',
  accent: '#27ae60',
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c',
  dark: '#1a3c27',
  light: '#e8f5e9',
  gradient: 'linear-gradient(135deg, #00791a 0%, #064273 100%)',
  gradientLight: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)'
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      // Simular datos de ejemplo
      const mockStats = {
        totalUsers: 1247,
        totalHotels: 89,
        totalSites: 156,
        totalRevenue: 45200
      };

      setStats(mockStats);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  const StatCard = ({ title, value, icon, color = 'primary', trend }) => {
    const IconComponent = icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card
          sx={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,121,26,0.08)',
            border: `1px solid ${alpha(greenTheme.primary, 0.1)}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(0,121,26,0.12)',
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box flex={1}>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary" 
                  fontWeight="600" 
                  sx={{ mb: 1 }}
                >
                  {title}
                </Typography>
                
                {loading ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={20} />
                    <Typography variant="caption">Cargando...</Typography>
                  </Box>
                ) : (
                  <Typography 
                    variant="h4" 
                    component="div" 
                    fontWeight="700"
                    color={greenTheme[color]}
                    sx={{ mb: 1 }}
                  >
                    {value}
                  </Typography>
                )}
                
                {trend && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <TrendingUpIcon 
                      sx={{ 
                        fontSize: 16, 
                        color: trend.value > 0 ? greenTheme.success : greenTheme.error 
                      }} 
                    />
                    <Typography 
                      variant="caption" 
                      fontWeight="600"
                      color={trend.value > 0 ? greenTheme.success : greenTheme.error}
                    >
                      {trend.value > 0 ? '+' : ''}{trend.value}%
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Box
                sx={{
                  background: alpha(greenTheme[color], 0.1),
                  p: 2,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconComponent sx={{ fontSize: 24, color: greenTheme[color] }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: isMobile ? 2 : 3, 
      background: greenTheme.gradientLight, 
      minHeight: '100vh'
    }}>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight="700" 
              sx={{
                background: greenTheme.gradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Panel de Control
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Resumen general del sistema
            </Typography>
          </Box>
          
          <Tooltip title="Actualizar datos">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton 
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  background: greenTheme.gradient,
                  color: 'white',
                  '&:hover': {
                    background: greenTheme.primary,
                  }
                }}
              >
                <motion.div
                  animate={{ rotate: refreshing ? 360 : 0 }}
                  transition={{ duration: 1, repeat: refreshing ? Infinity : 0 }}
                >
                  <RefreshIcon />
                </motion.div>
              </IconButton>
            </motion.div>
          </Tooltip>
        </Box>
      </motion.div>

      {/* Main Stats Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Total Usuarios" 
            value={formatNumber(stats?.totalUsers)} 
            icon={PeopleIcon} 
            color="primary"
            trend={{ value: 12.5 }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Hoteles" 
            value={formatNumber(stats?.totalHotels)} 
            icon={HotelIcon} 
            color="success"
            trend={{ value: 8.3 }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Sitios" 
            value={formatNumber(stats?.totalSites)} 
            icon={PlaceIcon} 
            color="accent"
            trend={{ value: 15.7 }}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Ingresos" 
            value={`$${formatNumber(stats?.totalRevenue)}`} 
            icon={AttachMoneyIcon} 
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card
              sx={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,121,26,0.08)',
                border: `1px solid ${alpha(greenTheme.primary, 0.1)}`,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" mb={3}>
                  Acciones Rápidas
                </Typography>
                <Box display="flex" flexDirection="column" gap={1.5}>
                  <Button
                    variant="outlined"
                    startIcon={<HotelIcon />}
                    fullWidth
                    sx={{ 
                      justifyContent: 'flex-start',
                      py: 1.5,
                      borderRadius: '8px',
                      borderColor: alpha(greenTheme.primary, 0.3),
                      color: greenTheme.primary,
                      '&:hover': {
                        borderColor: greenTheme.primary,
                        backgroundColor: alpha(greenTheme.primary, 0.05)
                      }
                    }}
                  >
                    Gestionar Hoteles
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PeopleIcon />}
                    fullWidth
                    sx={{ 
                      justifyContent: 'flex-start',
                      py: 1.5,
                      borderRadius: '8px',
                      borderColor: alpha(greenTheme.success, 0.3),
                      color: greenTheme.success,
                      '&:hover': {
                        borderColor: greenTheme.success,
                        backgroundColor: alpha(greenTheme.success, 0.05)
                      }
                    }}
                  >
                    Gestionar Usuarios
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PlaceIcon />}
                    fullWidth
                    sx={{ 
                      justifyContent: 'flex-start',
                      py: 1.5,
                      borderRadius: '8px',
                      borderColor: alpha(greenTheme.accent, 0.3),
                      color: greenTheme.accent,
                      '&:hover': {
                        borderColor: greenTheme.accent,
                        backgroundColor: alpha(greenTheme.accent, 0.05)
                      }
                    }}
                  >
                    Ver Sitios
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card
              sx={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,121,26,0.08)',
                border: `1px solid ${alpha(greenTheme.primary, 0.1)}`,
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    background: alpha(greenTheme.primary, 0.1),
                    p: 3,
                    borderRadius: '12px',
                    mb: 2
                  }}
                >
                  <CheckCircleIcon sx={{ color: greenTheme.success, fontSize: 48, mb: 1 }} />
                  <Typography variant="h6" fontWeight="600" color={greenTheme.success}>
                    Sistema Estable
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Todos los servicios funcionando correctamente
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;